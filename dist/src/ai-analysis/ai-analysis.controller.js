"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAnalysisController = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@anthropic-ai/sdk");
const client = new sdk_1.default({ apiKey: process.env.ANTHROPIC_API_KEY });
let AiAnalysisController = class AiAnalysisController {
    async analyze(body) {
        const { type, entity } = body;
        const now = new Date();
        const daysLeft = (d) => Math.ceil((new Date(d).getTime() - now.getTime()) / 86400000);
        let prompt = '';
        if (type === 'ouvrier') {
            const habs = entity.habilitations ?? [];
            const expirees = habs.filter((h) => h.statut === 'EXPIRE').map((h) => h.nom);
            const bientot = habs
                .filter((h) => h.statut === 'VALIDE' && daysLeft(h.dateExpiration) <= 30 && daysLeft(h.dateExpiration) > 0)
                .map((h) => `${h.nom} (J-${daysLeft(h.dateExpiration)})`);
            const valides = habs.filter((h) => h.statut === 'VALIDE').length;
            prompt = `Tu es un assistant HSE expert sur chantier électrique. Analyse la conformité de cet ouvrier.
Réponds en français, de manière directe et claire, en 2-4 phrases maximum.
Commence TOUJOURS par "✅ Conforme —", "🚨 Non conforme —" ou "⚠️ Attention requise —".

Ouvrier : ${entity.prenom} ${entity.nom}
Habilitations expirées (${expirees.length}) : ${expirees.join(', ') || 'aucune'}
Expirant dans 30 jours : ${bientot.join(', ') || 'aucune'}
Habilitations valides : ${valides}/${habs.length}

Donne un verdict immédiatement actionnable sur le terrain.`;
        }
        else if (type === 'engin') {
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
        }
        else if (type === 'appareil') {
            prompt = `Tu es un assistant HSE. Analyse la disponibilité de cet appareil.
Réponds en français, en 1-2 phrases. Commence par "✅ Opérationnel —", "🚨 Indisponible —" ou "⚠️ En maintenance —".

Appareil : ${entity.nom} (réf. ${entity.reference})
Statut : ${entity.statut}
Localisation : ${entity.localisation ?? 'non renseignée'}`;
        }
        if (!prompt)
            return { analyse: null };
        try {
            const message = await client.messages.create({
                model: 'claude-sonnet-4-6',
                max_tokens: 250,
                messages: [{ role: 'user', content: prompt }],
            });
            return { analyse: message.content[0].text };
        }
        catch (err) {
            console.error('[AI Analysis Error]', err);
            return { analyse: null };
        }
    }
};
exports.AiAnalysisController = AiAnalysisController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiAnalysisController.prototype, "analyze", null);
exports.AiAnalysisController = AiAnalysisController = __decorate([
    (0, common_1.Controller)('ai-analysis')
], AiAnalysisController);
//# sourceMappingURL=ai-analysis.controller.js.map