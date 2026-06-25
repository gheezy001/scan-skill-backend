import { Controller, Post, Body } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Endpoint public : appelé depuis la page de scan terrain (sans login).
@Controller('ai-analysis')
export class AiAnalysisController {

  @Post()
  async analyze(@Body() body: { type: string; entity: any }) {
    const { type, entity } = body;
    const now = new Date();
    const daysLeft = (d: string) => Math.ceil((new Date(d).getTime() - now.getTime()) / 86400000);

    let prompt = '';

    if (type === 'ouvrier') {
      const habs = entity.habilitations ?? [];
      const expirees = habs.filter((h: any) => h.statut === 'EXPIRE').map((h: any) => h.nom);
      const bientot = habs
        .filter((h: any) => h.statut === 'VALIDE' && daysLeft(h.dateExpiration) <= 30 && daysLeft(h.dateExpiration) > 0)
        .map((h: any) => `${h.nom} (J-${daysLeft(h.dateExpiration)})`);
      const valides = habs.filter((h: any) => h.statut === 'VALIDE').length;

      prompt = `Tu es un assistant HSE expert sur chantier électrique. Analyse la conformité de cet ouvrier.
Réponds en français, de manière directe et claire, en 2-4 phrases maximum.
Commence TOUJOURS par "✅ Conforme —", "🚨 Non conforme —" ou "⚠️ Attention requise —".

Ouvrier : ${entity.prenom} ${entity.nom}
Habilitations expirées (${expirees.length}) : ${expirees.join(', ') || 'aucune'}
Expirant dans 30 jours : ${bientot.join(', ') || 'aucune'}
Habilitations valides : ${valides}/${habs.length}

Donne un verdict immédiatement actionnable sur le terrain.`;

    } else if (type === 'engin') {
      const jAssurance = entity.dateExpirationAssurance ? daysLeft(entity.dateExpirationAssurance) : null;
      const jControle = entity.prochainControle ? daysLeft(entity.prochainControle) : null;

      prompt = `Tu es un assistant HSE expert. Analyse la conformité de cet engin sur chantier.
Réponds en français, en 2-4 phrases. Commence par "✅ Conforme —", "🚨 Non conforme —" ou "⚠️ Attention requise —".

Engin : ${entity.type} ${entity.marque ?? ''} ${entity.modele ?? ''} — ${entity.immatriculation}
Statut actuel : ${entity.statut}
Jours avant expiration assurance : ${jAssurance !== null ? jAssurance : 'non renseigné'}
Jours avant prochain contrôle : ${jControle !== null ? jControle : 'non renseigné'}
VPG fourni : ${entity.vpgFournit ?? 'non renseigné'}

Verdict immédiatement actionnable.`;

    } else if (type === 'appareil') {
      prompt = `Tu es un assistant HSE. Analyse la disponibilité de cet appareil.
Réponds en français, en 1-2 phrases. Commence par "✅ Opérationnel —", "🚨 Indisponible —" ou "⚠️ En maintenance —".

Appareil : ${entity.nom} (réf. ${entity.reference})
Statut : ${entity.statut}
Localisation : ${entity.localisation ?? 'non renseignée'}`;
    }

    if (!prompt) return { analyse: null };

    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }],
      });
      return { analyse: (message.content[0] as any).text };
    } catch (err) {
      console.error('[AI Analysis Error]', err);
      return { analyse: null };
    }
  }
}
