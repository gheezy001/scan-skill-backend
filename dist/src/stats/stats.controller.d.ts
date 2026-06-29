import { StatsService } from './stats.service';
export declare class StatsController {
    private svc;
    constructor(svc: StatsService);
    getDashboard(): Promise<{
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
