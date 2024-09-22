import EtatDeCompte from "./etatDeCompte";

export default class Bilan {
    debut: Date;
    fin: Date;
    revenue: number;
    depenses: number;
    solde: number;

    etatComptes: EtatDeCompte[];

    constructor(debut: Date, fin: Date, revenue: number, depenses: number, etatComptes: EtatDeCompte[]) {
        this.debut = debut;
        this.fin = fin;
        this.revenue = revenue;
        this.depenses = depenses;
        this.etatComptes = etatComptes;
    }
}