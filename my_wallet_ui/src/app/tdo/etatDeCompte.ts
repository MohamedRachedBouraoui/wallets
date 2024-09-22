import ItemRevenuDepense from "./itemRevenuDepense";

export default class EtatDeCompte {

    nom: string;
    estLePrincipal: boolean;
    totalDebit: number;
    totalCredit: number;
    soldeDepart: number = 0;
    //solde: number;
    bilanDateDebut: Date;
    bilanDateFin: Date;

    itemsRevenue: ItemRevenuDepense[];
    itemsDepenses: ItemRevenuDepense[];

    public get soldePeriode(): number {
        const result = this.totalDebit - this.totalCredit;
        console.log("🚀 ~ EtatDeCompte: ", JSON.stringify(this))
        return result;
    }
    
    public get solde(): number {
        const result = this.soldeDepart + this.soldePeriode;
        return result;
    }
    

    constructor(nom: string, estLePrincipal: boolean,soldeDepart:number, bilanDateDebut: Date, bilanDateFin: Date) {
        this.nom = nom;
        this.estLePrincipal = estLePrincipal;
        this.soldeDepart = soldeDepart;
        this.bilanDateDebut = bilanDateDebut;
        this.bilanDateFin = bilanDateFin;
        this.totalDebit = 0;
        this.totalCredit = 0;
        this.itemsRevenue = [];
        this.itemsDepenses = [];

    }
}

