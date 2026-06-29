import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class OuvriersService {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
    refreshStatutsHabilitations(): Promise<void>;
    sendExpirationAlerts(): Promise<void>;
    findAll(search?: string, statut?: string, page?: number, limit?: number): Promise<{
        data: ({
            habilitations: ({
                typeHabilitation: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    nom: string;
                    description: string | null;
                    entreprise: string | null;
                    dureeValidite: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nom: string;
                entreprise: string | null;
                dateObtention: Date;
                dateExpiration: Date;
                statut: import(".prisma/client").$Enums.StatutHabilitation;
                typeId: string;
                ouvrierId: string;
            })[];
        } & {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            statut: import(".prisma/client").$Enums.StatutOuvrier;
            prenom: string;
            photo: string | null;
            dateEmbauche: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            dateObtention: Date;
            dateExpiration: Date;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            typeId: string;
            ouvrierId: string;
        })[];
        appareils: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            statut: import(".prisma/client").$Enums.StatutAppareil;
            reference: string;
            type: string;
            localisation: string | null;
            dateAcquisition: Date | null;
            dateDerniereRevision: Date | null;
            ouvrierAssigneId: string | null;
            enginAssigneId: string | null;
        }[];
    } & {
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        statut: import(".prisma/client").$Enums.StatutOuvrier;
        prenom: string;
        photo: string | null;
        dateEmbauche: Date | null;
    }>;
    create(data: {
        nom: string;
        prenom: string;
        email?: string;
        photo?: string;
        dateEmbauche?: any;
        habilitations?: Array<{
            typeId: string;
            dateObtention: any;
            dateExpiration: any;
            entreprise?: string;
        }>;
    }): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            dateObtention: Date;
            dateExpiration: Date;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            typeId: string;
            ouvrierId: string;
        })[];
    } & {
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        statut: import(".prisma/client").$Enums.StatutOuvrier;
        prenom: string;
        photo: string | null;
        dateEmbauche: Date | null;
    }>;
    update(id: string, data: {
        nom?: string;
        prenom?: string;
        email?: string;
        photo?: string;
        dateEmbauche?: any;
        statut?: any;
    }): Promise<{
        habilitations: ({
            typeHabilitation: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                nom: string;
                description: string | null;
                entreprise: string | null;
                dureeValidite: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            entreprise: string | null;
            dateObtention: Date;
            dateExpiration: Date;
            statut: import(".prisma/client").$Enums.StatutHabilitation;
            typeId: string;
            ouvrierId: string;
        })[];
    } & {
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        statut: import(".prisma/client").$Enums.StatutOuvrier;
        prenom: string;
        photo: string | null;
        dateEmbauche: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        statut: import(".prisma/client").$Enums.StatutOuvrier;
        prenom: string;
        photo: string | null;
        dateEmbauche: Date | null;
    }>;
    addHabilitation(ouvrierId: string, data: {
        typeId: string;
        dateObtention: any;
        dateExpiration: any;
        entreprise?: string;
    }): Promise<{
        typeHabilitation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        ouvrierId: string;
    }>;
    updateHabilitation(id: string, data: {
        typeId?: string;
        dateObtention?: any;
        dateExpiration?: any;
        statut?: any;
        entreprise?: string;
    }): Promise<{
        typeHabilitation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        ouvrierId: string;
    }>;
    deleteHabilitation(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        ouvrierId: string;
    }>;
    findAllHabilitations(): Promise<({
        typeHabilitation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
        };
        ouvrier: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            statut: import(".prisma/client").$Enums.StatutOuvrier;
            prenom: string;
            photo: string | null;
            dateEmbauche: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        ouvrierId: string;
    })[]>;
    findExpiringHabilitations(days?: number): Promise<({
        typeHabilitation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            description: string | null;
            entreprise: string | null;
            dureeValidite: string | null;
        };
        ouvrier: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            nom: string;
            statut: import(".prisma/client").$Enums.StatutOuvrier;
            prenom: string;
            photo: string | null;
            dateEmbauche: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nom: string;
        entreprise: string | null;
        dateObtention: Date;
        dateExpiration: Date;
        statut: import(".prisma/client").$Enums.StatutHabilitation;
        typeId: string;
        ouvrierId: string;
    })[]>;
}
