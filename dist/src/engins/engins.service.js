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
exports.EnginsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let EnginsService = class EnginsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async refreshStatutsEngins() {
        const now = new Date();
        const thirtyDays = new Date(now.getTime() + 30 * 86400000);
        const engins = await this.prisma.engin.findMany();
        for (const engin of engins) {
            const assuranceExpire = engin.dateExpirationAssurance && new Date(engin.dateExpirationAssurance) < now;
            const controleExpire = engin.prochainControle && new Date(engin.prochainControle) < now;
            const expireBientot = !assuranceExpire && !controleExpire &&
                ((engin.dateExpirationAssurance && new Date(engin.dateExpirationAssurance) < thirtyDays) ||
                    (engin.prochainControle && new Date(engin.prochainControle) < thirtyDays));
            const newStatut = assuranceExpire || controleExpire ? 'NON_CONFORME' : expireBientot ? 'EXPIRE_BIENTOT' : 'CONFORME';
            if (newStatut !== engin.statut) {
                await this.prisma.engin.update({ where: { id: engin.id }, data: { statut: newStatut } });
            }
        }
        console.log(`[CRON] Statuts engins mis à jour`);
    }
    calculateStatut(dateExpirationAssurance, prochainControle) {
        const now = new Date();
        const thirtyDays = new Date(now.getTime() + 30 * 86400000);
        if ((dateExpirationAssurance && new Date(dateExpirationAssurance) < now) ||
            (prochainControle && new Date(prochainControle) < now))
            return 'NON_CONFORME';
        if ((dateExpirationAssurance && new Date(dateExpirationAssurance) < thirtyDays) ||
            (prochainControle && new Date(prochainControle) < thirtyDays))
            return 'EXPIRE_BIENTOT';
        return 'CONFORME';
    }
    async findAll(search, statut, page = 1, limit = 50) {
        const where = {};
        if (search) {
            where.OR = [
                { type: { contains: search, mode: 'insensitive' } },
                { marque: { contains: search, mode: 'insensitive' } },
                { modele: { contains: search, mode: 'insensitive' } },
                { immatriculation: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (statut && statut !== 'tous')
            where.statut = statut;
        const [data, total] = await Promise.all([
            this.prisma.engin.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
            this.prisma.engin.count({ where }),
        ]);
        return { data, total, page, limit };
    }
    async findOne(id) {
        const engin = await this.prisma.engin.findUnique({ where: { id }, include: { appareils: true } });
        if (!engin)
            throw new common_1.NotFoundException(`Engin ${id} non trouvé`);
        return engin;
    }
    async create(data) {
        const statut = this.calculateStatut(data.dateExpirationAssurance, data.prochainControle);
        return this.prisma.engin.create({ data: { ...data, statut: statut } });
    }
    async update(id, data) {
        await this.findOne(id);
        const statut = this.calculateStatut(data.dateExpirationAssurance, data.prochainControle);
        return this.prisma.engin.update({ where: { id }, data: { ...data, statut: statut } });
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.engin.delete({ where: { id } });
    }
};
exports.EnginsService = EnginsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnginsService.prototype, "refreshStatutsEngins", null);
exports.EnginsService = EnginsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EnginsService);
//# sourceMappingURL=engins.service.js.map