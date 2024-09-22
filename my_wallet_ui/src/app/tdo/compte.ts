export type COMPTE = 'COMPTE_COURANT' | 'CARTE_CREDIT';

export default class Compte {
    

    nom: string;


    estLePrincipal: boolean;

    soldeDepart: number;
    
    constructor( nom: string,estLePrincipal: boolean, soldeDepart: number) {
        this.nom=nom;
        this.estLePrincipal=estLePrincipal;
        this.soldeDepart=soldeDepart;
    }
    public majSoldeDepart(totalDebit: number, totalCredit: number) {
      this.soldeDepart=this.soldeDepart+totalDebit-totalCredit;
      }
}