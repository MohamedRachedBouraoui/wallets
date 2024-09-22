import { COMPTE } from "./compte";

export default class Trx {

    id: number;

   
    date: Date;

   
    description: string;

   
    montant: number;

   
    categorie: string;

   
    compte: string;

   
    estDepense: boolean;

   
    compteBancaire: COMPTE;

   
    lieu: string;

   
    periode: string;

   
    ignorer: boolean;

    commentaire?: string;

    static effectuerTransferts(date: Date,    montant: number,compteSrc: string,compteDest: string,pourcentage:number){
        let trxEntrante=new Trx();
        trxEntrante.date = date;
        trxEntrante.description = `Transfert de ${compteSrc} vers ${compteDest}`;
        trxEntrante.montant = montant;
        trxEntrante.categorie = "TRANSFERT";
        trxEntrante.compte = compteDest;
        trxEntrante.estDepense = false;
        trxEntrante.compteBancaire="COMPTE_COURANT";
        trxEntrante.lieu = "NA";
        trxEntrante.ignorer = false;
        trxEntrante.commentaire = `${pourcentage} %`;
        
        let trxSortante=new Trx();
        trxSortante.date = date;
        trxSortante.description =  `Transfert de ${compteSrc} vers ${compteDest}`;;
        trxSortante.montant = montant;
        trxSortante.categorie = "TRANSFERT";
        trxSortante.compte = compteSrc;
        trxSortante.estDepense = true;
        trxSortante.compteBancaire="COMPTE_COURANT";
        trxSortante.lieu = "NA";
        trxSortante.ignorer = false;
        trxEntrante.commentaire = `${pourcentage} %`;

        return [trxEntrante,trxSortante];
    }
}