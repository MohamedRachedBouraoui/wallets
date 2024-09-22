import { COMPTE } from "src/typePersonnalises/types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Categorie from "./categorie";
import { findBestMatch } from "string-similarity";
import TrxDto from "./trxDto";


@Entity()
export default class Trx {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    description: string;

    @Column()
    montant: number;

    @Column()
    categorie: string;

    @Column()
    compte: string;

    @Column()
    estDepense: boolean;

    @Column()
    compteBancaire: COMPTE;

    @Column()
    lieu: string;

    @Column()
    periode: string;
    
    @Column()
    ignorer: boolean;
    
    @Column({
        nullable: true,
    })
    commentaire?: string;

    // @Column()
    // typeCarte: string;


    periodeTrx(): string {
        return `${(this.date.getMonth() + 1)}_${this.date.getFullYear()}`;
    }

    toString(): string {
        return `${this.date.toISOString().split('T')[0]} : ${(new Intl.NumberFormat('en-US', { style: 'decimal' }).format(this.montant) + ' $').padStart(6)}    ${this.lieu}`;
    }

    static extraireTransactionsDansUnReleveAsync(contenuReleve: string, categories: {}): Trx[] {
        console.log("🚀 ~ extraireTransactionsUnReleveCompteCourantAsync ...");

        console.log("🚀 ~ extraireTransactionsUnReleveCompteCourantAsync OK");

        return [];
    }

    //cette méthode permet de exple: balancer les depenses de type investissement avec un revenu du meme type
    static balancerDepense(trx: Trx): Trx {

        return Trx.init(
            trx.date,
            trx.description,
            trx.categorie,
            trx.lieu,
            trx.montant.toString(),
            !trx.estDepense,
            trx.compteBancaire,
        );
    }

    protected static construireDate(dateTrasaction: string, dateReleve?: { mois: number, annee: number }): Date {
        return new Date();
    }

    protected static formaterDate(dt: { annee: number, mois: number, jour: number }): Date {

        //TODO: la bonne == -1 jour !
        return new Date(dt.annee, dt.mois - 1, dt.jour);
        // return new Date(moment.utc(dt).format("YYYY-MM-DD"));
    }

    protected static init(date: Date, description: string, categorie: string, lieu: string, montant: string, estDepense: boolean, compteBancaire: COMPTE, ignorer: boolean = false,compte:string='Banque'): Trx {

        let trx = new Trx();
        trx.date = date;
        trx.estDepense = estDepense;
        trx.compteBancaire = compteBancaire;

        trx.description = description.replace(/"/g, '');
        trx.lieu = lieu.replace(/"/g, '');

        trx.montant = parseFloat(montant.replace(/ /g, ''));
        trx.periode = trx.periodeTrx();
        trx.categorie = categorie;
        trx.ignorer = ignorer;
        trx.compte = compte;
        return trx;

    }

    protected static chercherCategorie(categories: Categorie[], description: string): string {

        let result = findBestMatch(description.toLocaleLowerCase(), categories.map(c => c.description.toLocaleLowerCase()));

        return result.bestMatch ? categories[result.bestMatchIndex].libelle : 'NON CATÉGORISÉ';
    }
    protected static estAIgnorer(categories: Categorie[], trxCategorie: string): boolean {

        if (trxCategorie === 'NON CATÉGORISÉ') {
            return false;
        }

        let resutl = categories.find(c => c.libelle === trxCategorie).ignorer;
        return resutl;
    }
    protected static recuprerCompte(categories: Categorie[], trxCategorie: string): string {

        if (trxCategorie === 'NON CATÉGORISÉ') {
            return 'Quotidien';
        }

        let resutl = categories.find(c => c.libelle === trxCategorie).compte;
        return resutl;
    }

    static initTrxDuCsv(trx: TrxDto, categories: Categorie[]): Trx {

        let categorie = this.chercherCategorie(categories, trx.description);

        return Trx.init(
            new Date(trx.date)
            , trx.description
            , categorie
            , trx.lieu??'Québec(~)'
            , trx.montant.toString()
            , trx.estDepense
            , trx.compteBancaire
            , trx.ignorer
            , this.recuprerCompte(categories, categorie)
        );

    }
}
