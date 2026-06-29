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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExportService = class ExportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toCSV(headers, rows) {
        return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    }
    async exportOuvriers() {
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
    async exportHabilitations() {
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
    async exportEngins() {
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
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map