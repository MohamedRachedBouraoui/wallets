export default class BilanFinal {
    totalRevenues: number;
    totalDepenses: number;
    totalEpargnes: number;
    totalInvestissements: number;
    totalResteDons: number;
    totalResteLoisirs: number;
    totalResteDepensesQuotidiennes: number;
    balance: number;

    constructor(totalRevenues: number, totalDepenses: number, totalEpargnes: number, totalInvestissements: number, totalResteDons: number, totalResteLoisirs: number, totalResteDepensesQuotidiennes: number) {
        this.totalRevenues = totalRevenues;
        this.totalDepenses = totalDepenses;
        this.totalEpargnes = totalEpargnes;
        this.totalInvestissements = totalInvestissements;
        this.totalResteDons = totalResteDons;
        this.totalResteLoisirs = totalResteLoisirs;
        this.totalResteDepensesQuotidiennes = totalResteDepensesQuotidiennes;
        this.balance = totalRevenues - totalDepenses;
    }

    toString(): string {
        return `
        ----------------------------------------------------------------
        | Totaux:                                                       |
        -----------------------------------------------------------------
        | Restes Dons      |  ${(this.totalResteDons.toFixed(2) + '$').padStart(10).padEnd(41)} |
        -----------------------------------------------------------------
        | Restes Loisirs   |  ${(this.totalResteLoisirs.toFixed(2) + '$').padStart(10).padEnd(41)} |
        -----------------------------------------------------------------
        | Epargnes         |  ${(this.totalEpargnes.toFixed(2) + '$').padStart(10).padEnd(41)} |
        -----------------------------------------------------------------
        | Investissements  |  ${(this.totalInvestissements.toFixed(2) + '$').padStart(10).padEnd(41)} |
        -----------------------------------------------------------------
        | Revenu           |  ${(this.totalRevenues.toFixed(2) + '$').padStart(10).padEnd(41)} |
        -----------------------------------------------------------------
        | Dépenses         |  ${(this.totalDepenses.toFixed(2) + '$').padStart(10).padEnd(41)} |
        -----------------------------------------------------------------
        | Balance          |  ${(this.balance.toFixed(2) + '$').padStart(10).padEnd(41)} |
        -----------------------------------------------------------------
            `;
    }
}
