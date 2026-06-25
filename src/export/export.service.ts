import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  private toCSV(headers: string[], rows: string[][]): string {
    return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  }

  async exportOuvriers(): Promise<string> {
    const ouvriers = await this.prisma.ouvrier.findMany({
      include: { habilitations: { include: { typeHabilitation: true } } },
    });
    const headers = ['nom', 'prenom', 'email', 'statut', 'date_embauche', 'nb_habilitations', 'habilitations_expirees'];
    const rows = ouvriers.map((o) => [
      o.nom, o.prenom, o.email ?? '', o.statut,
      o.dateEmbauche ? new Date(o.dateEmbauche).toLocaleDateString('fr-FR') : '',
      String(o.habilitations.length),
      String(o.habilitations.filter((h) => h.statut === 'EXPIRE').length),
    ]);
    return this.toCSV(headers, rows);
  }

  async exportHabilitations(): Promise<string> {
    const habs = await this.prisma.habilitation.findMany({
      include: { ouvrier: true, typeHabilitation: true },
      orderBy: { dateExpiration: 'asc' },
    });
    const headers = ['ouvrier_nom', 'ouvrier_prenom', 'email', 'habilitation', 'type', 'date_obtention', 'date_expiration', 'statut', 'entreprise'];
    const rows = habs.map((h) => [
      h.ouvrier.nom, h.ouvrier.prenom, h.ouvrier.email ?? '',
      h.nom, h.typeHabilitation.nom,
      new Date(h.dateObtention).toLocaleDateString('fr-FR'),
      new Date(h.dateExpiration).toLocaleDateString('fr-FR'),
      h.statut, h.entreprise ?? '',
    ]);
    return this.toCSV(headers, rows);
  }

  async exportEngins(): Promise<string> {
    const engins = await this.prisma.engin.findMany();
    const headers = ['type', 'marque', 'modele', 'immatriculation', 'statut', 'prochain_controle', 'date_expiration_assurance', 'vpg_fournit'];
    const rows = engins.map((e) => [
      e.type, e.marque ?? '', e.modele ?? '', e.immatriculation, e.statut,
      e.prochainControle ? new Date(e.prochainControle).toLocaleDateString('fr-FR') : '',
      e.dateExpirationAssurance ? new Date(e.dateExpirationAssurance).toLocaleDateString('fr-FR') : '',
      e.vpgFournit ?? '',
    ]);
    return this.toCSV(headers, rows);
  }
}
