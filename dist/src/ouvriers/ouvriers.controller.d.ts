import { OuvriersService } from './ouvriers.service';
export declare class OuvriersController {
    private readonly ouvriersService;
    constructor(ouvriersService: OuvriersService);
    findAll(search?: string, statut?: string, page?: string, limit?: string): Promise<{
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
    findExpiring(days?: string): Promise<({
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
    create(data: any): Promise<{
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
    update(id: string, data: any): Promise<{
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
    addHabilitation(id: string, data: any): Promise<{
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
    updateHabilitation(id: string, data: any): Promise<{
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
}
