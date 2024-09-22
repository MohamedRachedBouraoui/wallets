import { COMPTE } from "src/typePersonnalises/types";
import Categorie from "./categorie";
import Trx from "./trx";
import TrxDto from "./trxDto";


export default class TrxCompteCourant extends Trx {

    private static compteCourant_IndexLieuTransaction = 0;
    private static compteCourant_IndexDateTransaction = 3;
    private static compteCourant_IndexDescriptionTransaction = 5;
    private static compteCourant_IndexTransactionNegative = 7;
    private static compteCourant_IndexTransactionPositive = 8;

    private static numMois = {
        'jan': 1, 'fév': 2, 'mar': 3, 'avr': 4, 'mai': 5, 'jun': 6, 'jul': 7,
        'aoû': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'déc': 12
    }

    static extraireTransactionsDansUnReleveAsync(contenuReleve: string, categories: {}): Trx[] {
        console.log("🚀 ~ extraireTransactionsDansUnReleveAsync ...");

        let lignes = contenuReleve.replace(/(\r)/g, '').split('\n').filter(ele => { return ele !== ''; });

        let listeTransactions: Trx[] = [];

        for (let index = 0; index < lignes.length; index++) {

            const element = lignes[index];
            const trx = this.initTrx(element, categories);
            listeTransactions.push(trx);
        }
        console.log("🚀 ~ extraireTransactionsDansUnReleveAsync OK");

        return listeTransactions;
    }




    static initTrxDuHtml(trx: { date: string, desc: string, montantDebit: string, montantCredit: string }, categories: Categorie[]): Trx {

        let categorie = this.chercherCategorie(categories, trx.desc);

        return Trx.init(
            this.construireDateDuHtml(trx.date)
            , trx.desc
            , categorie
            , 'Québec(~)'
            , trx.montantCredit!=="0"  ? trx.montantCredit : trx.montantDebit
            , trx.montantCredit!=="0"
            , 'COMPTE_COURANT'
            , this.estAIgnorer(categories, categorie)
            , this.recuprerCompte(categories, categorie)
        );

    }

    static construireDateDuHtml(dateTrasaction: string): Date {


        let dateTrasactionParts = dateTrasaction.replace(/\[WÀ-ÿ]/g, ' ').split(' ');

        let jourTrx = parseInt(dateTrasactionParts[0], 10);
        let moisTrx = parseInt(this.numMois[dateTrasactionParts[1].toLowerCase()], 10);
        let anneeTrx = new Date().getFullYear();

        let result = this.formaterDate({ annee: anneeTrx, mois: moisTrx, jour: jourTrx });
        return result;
    }

    static initTrx(element: string, categories, dateReleve?: { mois: number, annee: number }): Trx {

        let differentesParties = element.split(',');
        let dateTrasaction = differentesParties[this.compteCourant_IndexDateTransaction];
        let descriptionTrasaction = differentesParties[this.compteCourant_IndexDescriptionTransaction].replace(/ {3}/g, '');
        let lieuTrasaction = differentesParties[this.compteCourant_IndexLieuTransaction];
        let estDepense = /\d/.test(differentesParties[this.compteCourant_IndexTransactionNegative]);
        let montantTrasaction = estDepense ?
            differentesParties[this.compteCourant_IndexTransactionNegative]
            : differentesParties[this.compteCourant_IndexTransactionPositive];

        let categorie = this.chercherCategorie(categories, descriptionTrasaction);
        return Trx.init(
            this.construireDate(dateTrasaction)
            , descriptionTrasaction
            , categorie
            , lieuTrasaction
            , montantTrasaction
            , estDepense
            , 'COMPTE_COURANT'
            , this.estAIgnorer(categories, categorie)
            , this.recuprerCompte(categories, categorie)
        );
    }

    static construireDate(dateTrasaction: string, dateReleve?: { mois: number, annee: number }): Date {

        let parties = dateTrasaction.replace(/"/g, '').split('/');
        let anneeTrx = parseInt(parties[0], 10);
        let moisTrx = parseInt(parties[1], 10);
        let jourTrx = parseInt(parties[2], 10);


        return this.formaterDate({ annee: anneeTrx, mois: moisTrx, jour: jourTrx });
        // const dt = `${parseInt(parties[0], 10)}-${parseInt(parties[1], 10)}-${parseInt(parties[2], 10)}`;
        // return this.formaterDate(dt);
    }
}
