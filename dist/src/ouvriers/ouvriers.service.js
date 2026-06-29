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
exports.OuvriersService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let OuvriersService = class OuvriersService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async refreshStatutsHabilitations() {
        const now = new Date();
        const result = await this.prisma.habilitation.updateMany({
            where: { dateExpiration: { lt: now }, statut: 'VALIDE' },
            data: { statut: 'EXPIRE' },
        });
        console.log(`[CRON] ${result.count} habilitation(s) marquée(s) EXPIRE`);
    }
    async sendExpirationAlerts() {
        if (!process.env.MAIL_HOST || !process.env.MAIL_USER)
            return;
        const expiring = await this.findExpiringHabilitations(30);
        for (const hab of expiring) {
            const email = hab.ouvrier.email;
            if (!email)
                continue;
            const daysLeft = Math.ceil((new Date(hab.dateExpiration).getTime() - Date.now()) / 86400000);
            try {
                await this.mail.sendExpirationAlert(email, `${hab.ouvrier.prenom} ${hab.ouvrier.nom}`, hab.nom, new Date(hab.dateExpiration), daysLeft);
            }
            catch (e) {
                console.error(`[CRON] Echec envoi alerte a ${email}:`, e.message);
            }
        }
        console.log(`[CRON] ${expiring.length} alerte(s) d'expiration traitee(s)`);
    }
    async findAll(search, statut, page = 1, limit = 50) {
        const where = {};
        if (search) {
            where.OR = [
                { nom: { contains: search, mode: 'insensitive' } },
                { prenom: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (statut && statut !== 'tous')
            where.statut = statut;
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
    async findOne(id) {
        const ouvrier = await this.prisma.ouvrier.findUnique({
            where: { id },
            include: { habilitations: { include: { typeHabilitation: true } }, appareils: true },
        });
        if (!ouvrier)
            throw new common_1.NotFoundException(`Ouvrier ${id} non trouve`);
        return ouvrier;
    }
    async create(data) {
        const { habilitations, ...ouvrierData } = data;
        const now = new Date();
        if (ouvrierData.dateEmbauche) {
            ouvrierData.dateEmbauche = new Date(ouvrierData.dateEmbauche);
        }
        const resolvedHabilitations = habilitations
            ? await Promise.all(habilitations.map(async (hab) => {
                const type = await this.prisma.typeHabilitation.findUnique({ where: { id: hab.typeId } });
                if (!type)
                    throw new common_1.NotFoundException(`Type d'habilitation ${hab.typeId} introuvable`);
                return {
                    nom: type.nom,
                    typeHabilitation: { connect: { id: type.id } },
                    dateObtention: new Date(hab.dateObtention),
                    dateExpiration: new Date(hab.dateExpiration),
                    entreprise: hab.entreprise,
                    statut: new Date(hab.dateExpiration) > now ? 'VALIDE' : 'EXPIRE',
                };
            }))
            : undefined;
        return this.prisma.ouvrier.create({
            data: {
                ...ouvrierData,
                habilitations: resolvedHabilitations ? { create: resolvedHabilitations } : undefined,
            },
            include: { habilitations: { include: { typeHabilitation: true } } },
        });
    }
    async update(id, data) {
        await this.findOne(id);
        if (data.dateEmbauche)
            data.dateEmbauche = new Date(data.dateEmbauche);
        return this.prisma.ouvrier.update({
            where: { id },
            data,
            include: { habilitations: { include: { typeHabilitation: true } } },
        });
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.ouvrier.delete({ where: { id } });
    }
    async addHabilitation(ouvrierId, data) {
        await this.findOne(ouvrierId);
        const type = await this.prisma.typeHabilitation.findUnique({ where: { id: data.typeId } });
        if (!type)
            throw new common_1.NotFoundException(`Type d'habilitation ${data.typeId} introuvable`);
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
    async updateHabilitation(id, data) {
        const updateData = {};
        if (data.dateObtention)
            updateData.dateObtention = new Date(data.dateObtention);
        if (data.dateExpiration) {
            updateData.dateExpiration = new Date(data.dateExpiration);
            updateData.statut = new Date(data.dateExpiration) > new Date() ? 'VALIDE' : 'EXPIRE';
        }
        if (data.statut)
            updateData.statut = data.statut;
        if (data.entreprise !== undefined)
            updateData.entreprise = data.entreprise;
        if (data.typeId) {
            const type = await this.prisma.typeHabilitation.findUnique({ where: { id: data.typeId } });
            if (!type)
                throw new common_1.NotFoundException(`Type d'habilitation ${data.typeId} introuvable`);
            updateData.nom = type.nom;
            updateData.typeHabilitation = { connect: { id: type.id } };
        }
        return this.prisma.habilitation.update({
            where: { id },
            data: updateData,
            include: { typeHabilitation: true },
        });
    }
    async deleteHabilitation(id) {
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
};
exports.OuvriersService = OuvriersService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OuvriersService.prototype, "refreshStatutsHabilitations", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_8AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OuvriersService.prototype, "sendExpirationAlerts", null);
exports.OuvriersService = OuvriersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], OuvriersService);
//# sourceMappingURL=ouvriers.service.js.map