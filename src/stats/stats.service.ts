import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 86400000);

    const [totalOuvriers, totalEngins, totalAppareils, ouvriers, engins, appareils] = await Promise.all([
      this.prisma.ouvrier.count(),
      this.prisma.engin.count(),
      this.prisma.appareil.count(),
      this.prisma.ouvrier.findMany({ include: { habilitations: true } }),
      this.prisma.engin.findMany(),
      this.prisma.appareil.findMany(),
    ]);

    let ouvriersConformes = 0, ouvriersNonConformes = 0;
    ouvriers.forEach((o) => {
      if (o.habilitations.some((h) => h.statut === 'EXPIRE')) ouvriersNonConformes++;
      else ouvriersConformes++;
    });

    const habExpirantBientot = await this.prisma.habilitation.count({
      where: { statut: 'VALIDE', dateExpiration: { gte: now, lte: thirtyDays } },
    });

    const enginsConformes = engins.filter((e) => e.statut === 'CONFORME').length;
    const enginsNonConformes = engins.filter((e) => e.statut === 'NON_CONFORME').length;
    const enginsExpireBientot = engins.filter((e) => e.statut === 'EXPIRE_BIENTOT').length;

    const appareilsDisponibles = appareils.filter((a) => a.statut === 'DISPONIBLE' || a.statut === 'EN_SERVICE').length;

    return {
      totalOuvriers, totalEngins, totalAppareils,
      ouvriersConformes, ouvriersNonConformes,
      enginsConformes, enginsNonConformes, enginsExpireBientot,
      appareilsDisponibles, appareilsIndisponibles: totalAppareils - appareilsDisponibles,
      habExpirantBientot,
      tauxConformiteOuvriers: totalOuvriers > 0 ? Math.round((ouvriersConformes / totalOuvriers) * 100) : 0,
      tauxConformiteEngins: totalEngins > 0 ? Math.round((enginsConformes / totalEngins) * 100) : 0,
      tauxDisponibiliteAppareils: totalAppareils > 0 ? Math.round((appareilsDisponibles / totalAppareils) * 100) : 0,
      alertesTotal: ouvriersNonConformes + enginsNonConformes + habExpirantBientot,
    };
  }
}
