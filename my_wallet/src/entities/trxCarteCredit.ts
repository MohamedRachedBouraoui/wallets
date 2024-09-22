import Categorie from "./categorie";
import Trx from "./trx";

export default class TrxCarteCredit extends Trx {

   private static numMois = {
        'janvier': 1, 'février': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6, 'juillet': 7,
        'août': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12
    }

    static extraireTransactionsDansUnReleveAsync(contenuReleve: string, categories: {}) {
        console.log("🚀 ~ extraireTransactionsDansUnReleveAsync ...");

        let lignesContenuReleve = contenuReleve.split('\n');

        let ligneDateReleve = lignesContenuReleve.find(l => l.startsWith('DATE DU RELEVÉ')).replace('DATE DU RELEVÉ', '');

        let dateReleve: { mois: number, annee: number } = { mois: parseInt(ligneDateReleve.substring(2, 4), 10), annee: parseInt(ligneDateReleve.substring(4), 10) };

        let lignesEssentielles = contenuReleve
            .split('\n')
            .map(l => l.trim().replace(/\t/g, '##__##'))
            .filter(l => l.length > 60 && l.match(/^\d{8}.+/));

        let listeTransactions: Trx[] = [];

        for (let index = lignesEssentielles.length - 1; index >= 0; index--) {

            const ligne = lignesEssentielles[index];
            let trx = this.initTrx(ligne, categories, dateReleve);
            listeTransactions.push(trx);

        }
        console.log("🚀 ~ extraireTransactionsDansUnReleveAsync OK");

        return listeTransactions;
    }

    static initTrxDuHtml(trx: { date: string, desc: string, montant: string }, categories:Categorie[]): Trx {

        let categorie = this.chercherCategorie(categories, trx.desc);

        return Trx.init(
            this.construireDateDuHtml(trx.date, {mois:new Date().getMonth()+1,annee:new Date().getFullYear()})
            , trx.desc
            , categorie
            , 'Québec(~)'
            , trx.montant.replace('+', '').replace('$', '').replace(/\\s+/, '')
            , trx.montant.indexOf('+')>-1 ? false : true
            , 'CARTE_CREDIT'
            , this.estAIgnorer(categories, categorie)
            , this.recuprerCompte(categories, categorie)
            )
    }

    static initTrx(ligneTrx: string, categories, dateReleve?: { mois: number, annee: number }): Trx {

        let dateTrasaction = ligneTrx.substring(0, 4).trim();
        let descriptionTrasaction = ligneTrx.substring(8, 33).replace(/ {2}/g, '').trim();
        let lieuTrasaction = ligneTrx.substring(33, 48).replace(/ {2}/g, '').trim();
        let montantTrasaction = ligneTrx.substring(55).trim();
        let categorie = this.chercherCategorie(categories, descriptionTrasaction); 
        return Trx.init(
            this.construireDate(dateTrasaction, dateReleve)
            , descriptionTrasaction
            , categorie
            , lieuTrasaction
            , montantTrasaction
            , true
            , 'CARTE_CREDIT'
            , this.estAIgnorer(categories, categorie)
            , this.recuprerCompte(categories, categorie)
            )
            
    }

    static construireDate(dateTrasaction: string, dateReleve: { mois: number, annee: number }): Date {
        dateTrasaction = dateTrasaction.replace(/"/g, '');

        let jourTrx = parseInt(dateTrasaction.substring(0, 2), 10);
        let moisTrx = parseInt(dateTrasaction.substring(2), 10);
        let anneeTrx = moisTrx <= dateReleve.mois ? dateReleve.annee : dateReleve.annee - 1;

        //const dt = `${anneeTrx}-${moisTrx}-${jourTrx}`;

        return this.formaterDate({ annee: anneeTrx, mois: moisTrx, jour: jourTrx });
    }

    static construireDateDuHtml(dateTrasaction: string, dateReleve: { mois: number, annee: number }): Date {

        let dateTrasactionParts = dateTrasaction.split(' ');

        let jourTrx = parseInt(dateTrasactionParts[0], 10);
        let moisTrx = parseInt(this.numMois[dateTrasactionParts[1].toLowerCase()], 10);
        let anneeTrx = moisTrx <= dateReleve.mois ? dateReleve.annee : dateReleve.annee - 1;
        

        return this.formaterDate({ annee: anneeTrx, mois: moisTrx, jour: jourTrx });
    }



}