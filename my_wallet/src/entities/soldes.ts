export default class Soldes {

    soldeDepensesQuotidiennes: number;
    soldeDepensesLoisirs: number;
    soldeDepensesDons: number;
    soldeEpargnesInvestissements: number;

    constructor(soldeDepensesQuotidiennes: number,
        soldeDepensesLoisirs: number,
        soldeDepensesDons: number,
        soldeEpargnesInvestissements: number) {

        this.soldeDepensesQuotidiennes = soldeDepensesQuotidiennes;
        this.soldeDepensesLoisirs = soldeDepensesLoisirs;
        this.soldeDepensesDons = soldeDepensesDons;
        this.soldeEpargnesInvestissements = soldeEpargnesInvestissements;
    }
}
