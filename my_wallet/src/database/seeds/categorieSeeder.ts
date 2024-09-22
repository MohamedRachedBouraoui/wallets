

import Categorie from 'src/entities/categorie';
import { Connection, DataSource } from 'typeorm';
import { Factory, Seeder } from "typeorm-seeding";

export default class CategorieSeeder implements Seeder {

    public async run(factory: Factory, connection: Connection): Promise<any> {
    console.log("🚀 ~ file: categorieSeeder.ts:10 ~ CategorieSeeder ~ run ~ run")
    

        //const categorieRepo = dataSource.getRepository(Categorie);
        
        //     let cats= [{ description: "retrait au ga /cpd littoral gaspesien 4", libelle: "LOISIRS" },
        // { description: "zoo de granby", libelle: "LOISIRS" },
        // { description: "gamestop", libelle: "LOISIRS" },
        // { description: "sepaq", libelle: "LOISIRS" },
        // { description: "percebo", libelle: "LOISIRS" },
        // { description: "glissades tewkesbury", libelle: "LOISIRS" },
        // { description: "sq homarus quebec", libelle: "LOISIRS" },
        // { description: "recreofun", libelle: "LOISIRS" },
        // { description: "nbx*camps", libelle: "LOISIRS" },
        // { description: "sou'wester gift & rest", libelle: "LOISIRS" },
        // { description: "oxford-itf mega parc", libelle: "LOISIRS" },
        // { description: "canadahelps *donation", libelle: "DONS" },
        // { description: "canadahelps donation", libelle: "DONS" },
        // { description: "centre cultu*donation", libelle: "DONS" },
        // { description: "paypal *canadahelps", libelle: "DONS" },
        // { description: "sq *centre culturel is", libelle: "DONS" },
        // { description: "retrait direct", libelle: "RETRAITS - AUTRES" },
        // { description: "retrait direct", libelle: "RETRAITS - AUTRES" },
        // { description: "qurtuba housing [money-in]", libelle: "INVESTISSEMENT" },
        // { description: "econofitness", libelle: "ACTIVITÉS PHYSIQUES/SPORTIVES" },
        // { description: "assurance", libelle: "ASSURANCES - AUTRES" },
        // { description: "costco essence", libelle: "CARBURANT" },
        // { description: "retrait au ga", libelle: "CHÈQUE/ARGENT COMPTANT" },
        // { description: "paiement facture - accèsd internet /facture", libelle: "ÉLECTRICITÉ/CHAUFFAGE" },
        // { description: "canac", libelle: "ENTRETIEN ET RÉNOVATIONS" },
        // { description: "magasin cdn tire", libelle: "ENTRETIEN ET RÉNOVATIONS" },
        // { description: "super c", libelle: "ÉPICERIE" },
        // { description: "boulangerie", libelle: "ÉPICERIE" },
        // { description: "epicerie", libelle: "ÉPICERIE" },
        // { description: "iga extra", libelle: "ÉPICERIE" },
        // { description: "la gourmandise", libelle: "ÉPICERIE" },
        // { description: "patisserie", libelle: "ÉPICERIE" },
        // { description: "wal-mart", libelle: "ÉPICERIE" },
        // { description: "bureau en gros", libelle: "FOURNITURES SCOLAIRES" },
        // { description: "crédit remises", libelle: "FRAIS DE CARTE DE CRÉDIT" },
        // { description: "costco wholesale", libelle: "MAGASINS DE DÉTAIL - AUTRES" },
        // { description: "dollarama", libelle: "MAGASINS DE DÉTAIL - AUTRES" },
        // { description: "dollarama", libelle: "MAGASINS DE DÉTAIL - AUTRES" },
        // { description: "jean coutu", libelle: "PHARMACIE" },
        // { description: "remboursement", libelle: "REMBOURSEMENT IMPÔT" },
        // { description: "second cup", libelle: "RESTAURANTS" },
        // { description: "dominos pizza", libelle: "RESTAURANTS" },
        // { description: "saveurs des continents", libelle: "RESTAURANTS" },
        // { description: "second cup", libelle: "RESTAURANTS" },
        // { description: "starbucks coffee", libelle: "RESTAURANTS" },
        // { description: "ristourne", libelle: "RISTOURNE" },
        // { description: "paie /levio conseils", libelle: "SALAIRE" },
        // { description: "paie /wal-mart", libelle: "SALAIRE" },
        // { description: "rogers", libelle: "TÉLÉPHONE" },
        // { description: "virgin plus", libelle: "TÉLÉPHONE" },
        // { description: "google*youtubepremium", libelle: "TÉLÉVISION" },
        // { description: "spaq/place des canotie", libelle: "TRANSPORT - AUTRES" },
        // { description: "rtc", libelle: "TRANSPORT EN COMMUN" },
        // { description: "paiement caisse", libelle: "VIREMENTS" },
        // { description: "paiement facture - accèsd internet /desjardins cash back mastercar", libelle: "VIREMENTS" },
        // { description: "retrait - virement interac", libelle: "VIREMENTS" },
        // { description: "retrait - virement interac", libelle: "VIREMENTS" }];
        // //);

        // factory(Categorie)(cats).createMany(cats.length);
    }
}