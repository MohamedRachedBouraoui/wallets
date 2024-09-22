import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
export default class Categorie {

    @PrimaryColumn()
    description: string;
    @PrimaryColumn()
    libelle: string;

    @Column()
    compte: string;

    @Column()
    ignorer: boolean

    static listeParDefaut: Categorie[]= [
        {
          "description": "econofitness",
          "libelle": "SPORT",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "pour enfants",
          "libelle": "ALLOCATION",
          "ignorer": true,
          "compte": "Banque"
        },
        {
          "description": "Assurance /DESJARDINS ASS. GENERALES",
          "libelle": "AUTO",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "Retrait direct /SAAQ",
          "libelle": "AUTO",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "costco essence",
          "libelle": "AUTO",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "cash back mastercar",
          "libelle": "CASH-BACK",
          "ignorer": false,
          "compte": "Banque"
        },
        {
          "description": "paiement facture - accèsd internet /remises mastercard desjardins",
          "libelle": "CASH-BACK",
          "ignorer": false,
          "compte": "Banque"
        },
        {
          "description": "retrait au ga",
          "libelle": "CHÈQUE/ARGENT COMPTANT",
          "ignorer": false,
          "compte": "Cash"
        },
        {
          "description": "prêt /versement pret",
          "libelle": "AUTO",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "canadahelps *donation",
          "libelle": "DONS",
          "ignorer": false,
          "compte": "Don"
        },
        {
          "description": "canadahelps donation",
          "libelle": "DONS",
          "ignorer": false,
          "compte": "Don"
        },
        {
          "description": "centre cultu*donation",
          "libelle": "DONS",
          "ignorer": false,
          "compte": "Don"
        },
        {
          "description": "paypal *canadahelps",
          "libelle": "DONS",
          "ignorer": false,
          "compte": "Don"
        },
        {
          "description": "sq *centre culturel is",
          "libelle": "DONS",
          "ignorer": false,
          "compte": "Don"
        },
        {
          "description": "dépôt - virement interac",
          "libelle": "DÉPOT-INTERACT",
          "ignorer": false,
          "compte": "Banque"
        },
        {
          "description": "canac",
          "libelle": "ENTRETIEN-MAISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "magasin cdn tire",
          "libelle": "ENTRETIEN-MAISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "village des valeurs",
          "libelle": "ENTRETIEN-MAISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "value village",
          "libelle": "ENTRETIEN-MAISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "home dépôt",
          "libelle": "ENTRETIEN-MAISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "ikea",
          "libelle": "ENTRETIEN-MAISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "acces electronique",
          "libelle": "ENTRETIEN-MAISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "bureau en gros",
          "libelle": "FOURNITURES SCOLAIRES",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "crédit remises",
          "libelle": "CASH-BACK",
          "ignorer": false,
          "compte": "Cash"
        },
        {
          "description": "retrait direct /qurtuba housing [money-in]",
          "libelle": "INVESTISSEMENT",
          "ignorer": true,
          "compte": "Investissement"
        },
        {
          "description": "retrait au ga /cpd littoral gaspesien 4",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "zoo de granby",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "gamestop",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "sepaq",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "percebo",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "glissades tewkesbury",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "sq homarus quebec",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "recreofun",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "nbx*camps",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "sou'wester gift & rest",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "oxford-itf mega parc",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "amazon",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "amzn",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "brunet",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "centre de glaces",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "cinéplex",
          "libelle": "LOISIRS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "costco wholesale",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "dollarama",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "jean coutu",
          "libelle": "SANTÉ",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "remboursement",
          "libelle": "REMBOURSEMENT IMPÔT",
          "ignorer": false,
          "compte": "Banque"
        },
        {
          "description": "paiement facture - accèsd internet /credit card",
          "libelle": "REMBOURSSEMENT-CARTE-CREDIT",
          "ignorer": true,
          "compte": "Quotidien"
        },
        {
          "description": "second cup",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "dominos pizza",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "saveurs des continents",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "starbucks coffee",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "chocolato",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "mcdonalds",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "mcdonald",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "pizza fina",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "grillades torino",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "mr puffs",
          "libelle": "RESTAURANTS",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "retrait - virement interac",
          "libelle": "RETRAIT-INTERACT",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "retrait direct",
          "libelle": "RETRAITS - AUTRES",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "ristourne",
          "libelle": "RISTOURNE",
          "ignorer": false,
          "compte": "Banque"
        },
        {
          "description": "paie /levio conseils",
          "libelle": "SALAIRE",
          "ignorer": false,
          "compte": "Banque"
        },
        {
          "description": "paie /wal-mart",
          "libelle": "SALAIRE",
          "ignorer": false,
          "compte": "Banque"
        },
        {
          "description": "centre dentaire",
          "libelle": "SANTÉ",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "esso",
          "libelle": "AUTO",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "spaq/place des canotie",
          "libelle": "TRANSPORT - AUTRES",
          "ignorer": false,
          "compte": "Loisir"
        },
        {
          "description": "rtc",
          "libelle": "TRANSPORT EN COMMUN",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "rogers",
          "libelle": "TÉLÉPHONE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "virgin plus",
          "libelle": "TÉLÉPHONE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "google*youtubepremium",
          "libelle": "TÉLÉVISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "google youtubepremium",
          "libelle": "TÉLÉVISION",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "paiement caisse",
          "libelle": "REMBOURSSEMENT-CARTE-CREDIT",
          "ignorer": true,
          "compte": "Quotidien"
        },
        {
          "description": "paiement",
          "libelle": "REMBOURSSEMENT-CARTE-CREDIT",
          "ignorer": true,
          "compte": "Quotidien"
        },
        {
          "description": "paiement facture - accèsd internet /desjardins cash back mastercar",
          "libelle": "CASH-BACK",
          "ignorer": false,
          "compte": "Banque"
        },
        {
          "description": "paiement facture - accèsd internet /facture",
          "libelle": "ÉLECTRICITÉ/CHAUFFAGE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "super c",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "boulangerie",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "epicerie",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "iga extra",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "la gourmandise",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "patisserie",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "wal-mart",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "iga",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "walmart",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "provigo",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        },
        {
          "description": "metro",
          "libelle": "ÉPICERIE",
          "ignorer": false,
          "compte": "Quotidien"
        }
      ];
}
