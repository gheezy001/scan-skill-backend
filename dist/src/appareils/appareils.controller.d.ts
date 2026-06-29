import { AppareilsService } from './appareils.service';
export declare class AppareilsController {
    private readonly appareilsService;
    constructor(appareilsService: AppareilsService);
    findAll(s?: string, st?: string, p?: string, l?: string): Promise<{
        data: ({
            ouvrierAssigne: {
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
            enginAssigne: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                statut: import(".prisma/client").$Enums.StatutEngin;
                photo: string | null;
                type: string;
                marque: string | null;
                modele: string | null;
                immatriculation: string;
                dateControle: Date | null;
                prochainControle: Date | null;
                dateExpirationAssurance: Date | null;
                vpgFournit: string | null;
                poste: string | null;
                controles: string[];
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        ouvrierAssigne: {
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
        enginAssigne: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutEngin;
            photo: string | null;
            type: string;
            marque: string | null;
            modele: string | null;
            immatriculation: string;
            dateControle: Date | null;
            prochainControle: Date | null;
            dateExpirationAssurance: Date | null;
            vpgFournit: string | null;
            poste: string | null;
            controles: string[];
        };
    } & {
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
    }>;
    create(data: any): Promise<{
        ouvrierAssigne: {
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
        enginAssigne: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutEngin;
            photo: string | null;
            type: string;
            marque: string | null;
            modele: string | null;
            immatriculation: string;
            dateControle: Date | null;
            prochainControle: Date | null;
            dateExpirationAssurance: Date | null;
            vpgFournit: string | null;
            poste: string | null;
            controles: string[];
        };
    } & {
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
    }>;
    update(id: string, data: any): Promise<{
        ouvrierAssigne: {
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
        enginAssigne: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            statut: import(".prisma/client").$Enums.StatutEngin;
            photo: string | null;
            type: string;
            marque: string | null;
            modele: string | null;
            immatriculation: string;
            dateControle: Date | null;
            prochainControle: Date | null;
            dateExpirationAssurance: Date | null;
            vpgFournit: string | null;
            poste: string | null;
            controles: string[];
        };
    } & {
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
    }>;
    delete(id: string): Promise<{
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
    }>;
}
