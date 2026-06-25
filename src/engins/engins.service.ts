import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EnginsService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshStatutsEngins() {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 86400000);

    // Marquer EXPIRE si contrôle ou assurance dépassé
    const engins = await this.prisma.engin.findMany();
    for (const engin of engins) {
      const assuranceExpire = engin.dateExpirationAssurance && new Date(engin.dateExpirationAssurance) < now;
      const controleExpire = engin.prochainControle && new Date(engin.prochainControle) < now;
      const expireBientot =
        !assuranceExpire && !controleExpire &&
        ((engin.dateExpirationAssurance && new Date(engin.dateExpirationAssurance) < thirtyDays) ||
          (engin.prochainControle && new Date(engin.prochainControle) < thirtyDays));

      const newStatut = assuranceExpire || controleExpire ? 'NON_CONFORME' : expireBientot ? 'EXPIRE_BIENTOT' : 'CONFORME';
      if (newStatut !== engin.statut) {
        await this.prisma.engin.update({ where: { id: engin.id }, data: { statut: newStatut as any } });
      }
    }
    console.log(`[CRON] Statuts engins mis à jour`);
  }

  private calculateStatut(dateExpirationAssurance?: Date, prochainControle?: Date): string {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 86400000);
    if (
      (dateExpirationAssurance && new Date(dateExpirationAssurance) < now) ||
      (prochainControle && new Date(prochainControle) < now)
    ) return 'NON_CONFORME';
    if (
      (dateExpirationAssurance && new Date(dateExpirationAssurance) < thirtyDays) ||
      (prochainControle && new Date(prochainControle) < thirtyDays)
    ) return 'EXPIRE_BIENTOT';
    return 'CONFORME';
  }

  async findAll(search?: string, statut?: string, page = 1, limit = 50) {
    const where: Prisma.EnginWhereInput = {};
    if (search) {
      where.OR = [
        { type: { contains: search, mode: 'insensitive' } },
        { marque: { contains: search, mode: 'insensitive' } },
        { modele: { contains: search, mode: 'insensitive' } },
        { immatriculation: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (statut && statut !== 'tous') where.statut = statut as any;

    const [data, total] = await Promise.all([
      this.prisma.engin.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.engin.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const engin = await this.prisma.engin.findUnique({ where: { id }, include: { appareils: true } });
    if (!engin) throw new NotFoundException(`Engin ${id} non trouvé`);
    return engin;
  }

  async create(data: any) {
    const statut = this.calculateStatut(data.dateExpirationAssurance, data.prochainControle);
    return this.prisma.engin.create({ data: { ...data, statut: statut as any } });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const statut = this.calculateStatut(data.dateExpirationAssurance, data.prochainControle);
    return this.prisma.engin.update({ where: { id }, data: { ...data, statut: statut as any } });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.engin.delete({ where: { id } });
  }
}
