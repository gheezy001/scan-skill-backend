import { PrismaService } from '../prisma/prisma.service';
export declare class VerifyController {
    private prisma;
    constructor(prisma: PrismaService);
    verify(code: string): Promise<{
        type: string;
        conforme: boolean;
        entity: {
            id: string;
            nom: string;
            habilitations: {
                id: string;
                nom: string;
                dateExpiration: Date;
                statut: import(".prisma/client").$Enums.StatutHabilitation;
            }[];
            statut: import(".prisma/client").$Enums.StatutOuvrier;
            prenom: string;
        };
    } | {
        type: string;
        conforme: boolean;
        entity: {
            id: string;
            statut: import(".prisma/client").$Enums.StatutEngin;
            type: string;
            marque: string;
            modele: string;
            immatriculation: string;
            prochainControle: Date;
            dateExpirationAssurance: Date;
            vpgFournit: string;
        };
    } | {
        type: string;
        conforme: boolean;
        entity: {
            id: string;
            nom: string;
            statut: import(".prisma/client").$Enums.StatutAppareil;
            reference: string;
            type: string;
            localisation: string;
        };
    }>;
}
