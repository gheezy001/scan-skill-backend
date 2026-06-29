import { PrismaService } from '../prisma/prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalOuvriers: number;
        totalEngins: number;
        totalAppareils: number;
        ouvriersConformes: number;
        ouvriersNonConformes: number;
        enginsConformes: number;
        enginsNonConformes: number;
        enginsExpireBientot: number;
        appareilsDisponibles: number;
        appareilsIndisponibles: number;
        habExpirantBientot: number;
        tauxConformiteOuvriers: number;
        tauxConformiteEngins: number;
        tauxDisponibiliteAppareils: number;
        alertesTotal: number;
    }>;
}
