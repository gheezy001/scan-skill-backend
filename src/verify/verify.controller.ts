import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Endpoint PUBLIC (sans authentification) pour le scan terrain.
// Ne renvoie que les données nécessaires à la vérification de conformité,
// jamais d'informations sensibles (email, etc.).
@Controller('verify')
export class VerifyController {
  constructor(private prisma: PrismaService) {}

  @Get(':code')
  async verify(@Param('code') code: string) {
    let type = '';
    let id = code;

    if (code.startsWith('ouvrier-')) { type = 'ouvrier'; id = code.replace('ouvrier-', ''); }
    else if (code.startsWith('engin-')) { type = 'engin'; id = code.replace('engin-', ''); }
    else if (code.startsWith('appareil-')) { type = 'appareil'; id = code.replace('appareil-', ''); }
    else throw new NotFoundException('QR code non reconnu');

    if (type === 'ouvrier') {
      const o = await this.prisma.ouvrier.findUnique({
        where: { id },
        select: {
          id: true, nom: true, prenom: true, statut: true,
          habilitations: {
            select: { id: true, nom: true, statut: true, dateExpiration: true },
            orderBy: { dateExpiration: 'asc' },
          },
        },
      });
      if (!o) throw new NotFoundException('Ouvrier non trouvé');
      const conforme = !o.habilitations.some((h) => h.statut === 'EXPIRE');
      return { type, conforme, entity: o };
    }

    if (type === 'engin') {
      const e = await this.prisma.engin.findUnique({
        where: { id },
        select: {
          id: true, type: true, marque: true, modele: true, immatriculation: true,
          statut: true, prochainControle: true, dateExpirationAssurance: true, vpgFournit: true,
        },
      });
      if (!e) throw new NotFoundException('Engin non trouvé');
      return { type, conforme: e.statut === 'CONFORME', entity: e };
    }

    const a = await this.prisma.appareil.findUnique({
      where: { id },
      select: { id: true, nom: true, reference: true, type: true, statut: true, localisation: true },
    });
    if (!a) throw new NotFoundException('Appareil non trouvé');
    return { type, conforme: a.statut === 'DISPONIBLE' || a.statut === 'EN_SERVICE', entity: a };
  }
}
