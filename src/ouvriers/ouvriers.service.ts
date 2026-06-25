import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OuvriersService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshStatutsHabilitations() {
    const now = new Date();
    const result = await this.prisma.habilitation.updateMany({
      where: { dateExpiration: { lt: now }, statut: 'VALIDE' },
      data: { statut: 'EXPIRE' },
    });
    console.log(`[CRON] ${result.count} habilitation(s) marquée(s) EXPIRE`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendExpirationAlerts() {
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER) return;
    const expiring = await this.findExpiringHabilitations(30);
    for (const hab of expiring) {
      const email = hab.ouvrier.email;
      if (!email) continue;
      const daysLeft = Math.ceil((new Date(hab.dateExpiration).getTime() - Date.now()) / 86400000);
      try {
        await this.mail.sendExpirationAlert(
          email,
          `${hab.ouvrier.prenom} ${hab.ouvrier.nom}`,
          hab.nom,
          new Date(hab.dateExpiration),
          daysLeft,
        );
      } catch (e) {
        console.error(`[CRON] Echec envoi alerte a ${email}:`, e.message);
      }
    }
    console.log(`[CRON] ${expiring.length} alerte(s) d'expiration traitee(s)`);
  }

  async findAll(search?: string, statut?: string, page = 1, limit = 50) {
    const where: Prisma.OuvrierWhereInput = {};
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { prenom: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (statut && statut !== 'tous') where.statut = statut as any;

    const [data, total] = await Promise.all([
      this.prisma.ouvrier.findMany({
        where,
        include: { habilitations: { include: { typeHabilitation: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ouvrier.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const ouvrier = await this.prisma.ouvrier.findUnique({
      where: { id },
      include: { habilitations: { include: { typeHabilitation: true } }, appareils: true },
    });
    if (!ouvrier) throw new NotFoundException(`Ouvrier ${id} non trouve`);
    return ouvrier;
  }

  async create(data: {
    nom: string;
    prenom: string;
    email?: string;
    photo?: string;
    dateEmbauche?: any;
    habilitations?: Array<{ typeId: string; dateObtention: any; dateExpiration: any; entreprise?: string }>;
  }) {
    const { habilitations, ...ouvrierData } = data;
    const now = new Date();

    // Conversion des dates string en objets Date (AVANT le return)
    if (ouvrierData.dateEmbauche) {
      ouvrierData.dateEmbauche = new Date(ouvrierData.dateEmbauche);
    }

    const resolvedHabilitations = habilitations
      ? await Promise.all(
          habilitations.map(async (hab) => {
            const type = await this.prisma.typeHabilitation.findUnique({ where: { id: hab.typeId } });
            if (!type) throw new NotFoundException(`Type d'habilitation ${hab.typeId} introuvable`);
            return {
              nom: type.nom,
              typeHabilitation: { connect: { id: type.id } },
              dateObtention: new Date(hab.dateObtention),
              dateExpiration: new Date(hab.dateExpiration),
              entreprise: hab.entreprise,
              statut: new Date(hab.dateExpiration) > now ? ('VALIDE' as const) : ('EXPIRE' as const),
            };
          }),
        )
      : undefined;

    return this.prisma.ouvrier.create({
      data: {
        ...ouvrierData,
        habilitations: resolvedHabilitations ? { create: resolvedHabilitations } : undefined,
      },
      include: { habilitations: { include: { typeHabilitation: true } } },
    });
  }

  async update(id: string, data: { nom?: string; prenom?: string; email?: string; photo?: string; dateEmbauche?: any; statut?: any }) {
    await this.findOne(id);
    if (data.dateEmbauche) data.dateEmbauche = new Date(data.dateEmbauche);
    return this.prisma.ouvrier.update({
      where: { id },
      data,
      include: { habilitations: { include: { typeHabilitation: true } } },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.ouvrier.delete({ where: { id } });
  }

  async addHabilitation(ouvrierId: string, data: { typeId: string; dateObtention: any; dateExpiration: any; entreprise?: string }) {
    await this.findOne(ouvrierId);
    const type = await this.prisma.typeHabilitation.findUnique({ where: { id: data.typeId } });
    if (!type) throw new NotFoundException(`Type d'habilitation ${data.typeId} introuvable`);

    return this.prisma.habilitation.create({
      data: {
        nom: type.nom,
        typeId: type.id,
        dateObtention: new Date(data.dateObtention),
        dateExpiration: new Date(data.dateExpiration),
        entreprise: data.entreprise,
        ouvrierId,
        statut: new Date(data.dateExpiration) > new Date() ? 'VALIDE' : 'EXPIRE',
      },
      include: { typeHabilitation: true },
    });
  }

  async updateHabilitation(id: string, data: { typeId?: string; dateObtention?: any; dateExpiration?: any; statut?: any; entreprise?: string }) {
    const updateData: any = {};
    if (data.dateObtention) updateData.dateObtention = new Date(data.dateObtention);
    if (data.dateExpiration) {
      updateData.dateExpiration = new Date(data.dateExpiration);
      updateData.statut = new Date(data.dateExpiration) > new Date() ? 'VALIDE' : 'EXPIRE';
    }
    if (data.statut) updateData.statut = data.statut;
    if (data.entreprise !== undefined) updateData.entreprise = data.entreprise;

    if (data.typeId) {
      const type = await this.prisma.typeHabilitation.findUnique({ where: { id: data.typeId } });
      if (!type) throw new NotFoundException(`Type d'habilitation ${data.typeId} introuvable`);
      updateData.nom = type.nom;
      updateData.typeHabilitation = { connect: { id: type.id } };
    }

    return this.prisma.habilitation.update({
      where: { id },
      data: updateData,
      include: { typeHabilitation: true },
    });
  }

  async deleteHabilitation(id: string) {
    return this.prisma.habilitation.delete({ where: { id } });
  }

  async findAllHabilitations() {
    return this.prisma.habilitation.findMany({
      include: { ouvrier: true, typeHabilitation: true },
      orderBy: { dateExpiration: 'asc' },
    });
  }

  async findExpiringHabilitations(days = 30) {
    const now = new Date();
    const limit = new Date(now.getTime() + days * 86400000);
    return this.prisma.habilitation.findMany({
      where: { statut: 'VALIDE', dateExpiration: { gte: now, lte: limit } },
      include: { ouvrier: true, typeHabilitation: true },
      orderBy: { dateExpiration: 'asc' },
    });
  }
}