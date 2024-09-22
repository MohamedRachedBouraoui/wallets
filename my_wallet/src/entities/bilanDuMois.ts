import { nameof, ORDRE_TRI } from "src/typePersonnalises/types";
import Budgets from "./budgets";
import Soldes from "./soldes";
import SoldesPrecedents from "./soldes";
import Trx from "./trx";

export default class BilanDuMois {

    periode: string;
    trxsParPeriode: Trx[];

    totalRevenues: number;
    trxsRevenues: Trx[];
    
    totalDepenses: number;
    totalBalance: number;
    
    budgetDepensesQuotidiennes: number;
    depensesQuotidiennes: number;
    balanceDepensesQuotidiennes: number;
    trxsQuotidiennes: Trx[];


    budgetLoisirs: number;
    depensesLoisirs: number;
    balanceDepensesLoisirs: number;
    trxsLoisirs: Trx[];

    budgetDons: number;
    depensesDons: number;
    balanceDepensesDons: number;
    trxsDons: Trx[];

    budgetDepensesInvestissements: number;
    depensesInvestissements: number;
    balanceDepensesInvestissements: number;

    budgetEpargnesInvestissements: number;
    totalEpargnesInvestissements: number;
    balanceEpargnesInvestissements: number;
    trxsInvestissements: Trx[];

    soldesPrecedents: Soldes;
    soldesActuelles: Soldes;
    budgets: Budgets;


    constructor(periode: string, trxsParPeriode: Trx[], soldesPrecedents: Soldes,budgets:Budgets) {

        this.periode = periode;
        this.trxsParPeriode = trxsParPeriode;
        this.soldesPrecedents = soldesPrecedents;
        this.budgets = budgets;

        this.calculerRevenus();
        this.calculerBudgets();
        this.calculerDepenses();

        this.calculerBalancesApresDepenses();

        this.soldesActuelles = new Soldes(
            this.soldesPrecedents.soldeDepensesQuotidiennes + this.balanceDepensesQuotidiennes,
            this.soldesPrecedents.soldeDepensesLoisirs + this.balanceDepensesLoisirs,
            this.soldesPrecedents.soldeDepensesDons + this.balanceDepensesDons,
            (this.soldesPrecedents.soldeEpargnesInvestissements + this.budgetEpargnesInvestissements) - this.depensesInvestissements
        );


    }

    trierListeParProp<T>(liste: any[], propriete: string, ordre: ORDRE_TRI = 'ASC'): T[] {
        let listeTriee = liste.sort((a, b) => {
            let valA = a[propriete];
            let valB = b[propriete];

            if (valA > valB) {
                return 1;
            } else if (valA < valB) {
                return -1;
            }
            return 0;
        });

        if (ordre == 'DESC')
            listeTriee = listeTriee.reverse();

        return listeTriee
    }

    afficherDetailsTrxs(trxs: Trx[]): string {

        let totalMontantTrxs = trxs.reduce((accumulator, value) => { return accumulator + value.montant; }, 0);

        let prop = nameof<Trx>('montant')
        trxs = this.trierListeParProp(trxs, prop, 'DESC');

        let grps = trxs.reduce((grp, trx) => {

            grp[trx.description] = grp[trx.description] ?? [];

            grp[trx.description].push(' '.padStart(20) + '--> ' + trx.toString());
            return grp;

        }, {});

        let strBuild = '';
        for (const grp in grps) {
            if (!Object.prototype.hasOwnProperty.call(grps, grp)) continue;

            let totalMontantParGrp = trxs
                .filter(trx => trx.description === grp)
                .reduce((accumulator, value) => { return accumulator + value.montant; }, 0);

            let pourcentageTotalMontantParGrp = ((totalMontantParGrp * 100) / totalMontantTrxs).toFixed(2);

            let totalMontantParGrpStr = (new Intl.NumberFormat('en-US', { style: 'decimal' })
                .format(totalMontantParGrp) + ' $').padStart(6);


            const detailsTrx = grps[grp] as string[];


            strBuild += `
${''.padStart(70, '-')}
* [${(detailsTrx.length).toString().padStart(2, '0')} trxs: ${totalMontantParGrpStr} (${pourcentageTotalMontantParGrp}%) ]   ${grp}

${detailsTrx.join('\n')}\n`
        }

        return strBuild;
    }

    private calculerRevenus() {
        this.extraireTrxsRevenues();
        this.totalRevenues = this.trxsRevenues
            .reduce((accumulator, value) => { return accumulator + value.montant; }, 0);
    }

    extraireTrxsRevenues() {
        this.trxsRevenues = this.trxsParPeriode.filter(element => element.estDepense === false);
    }

    private calculerDepenses() {

        this.calculerDepensesQuotidiennes();
        this.calculerDepensesLoisirs();
        this.calculerDepensesDons();
        this.calculerDepensesInvestissements();

        this.totalEpargnesInvestissements = this.budgetEpargnesInvestissements;


        this.totalDepenses = this.depensesQuotidiennes + this.depensesLoisirs + this.depensesDons + this.totalEpargnesInvestissements;
    }

    calculerBalancesApresDepenses() {
        this.balanceDepensesQuotidiennes = this.budgetDepensesQuotidiennes - this.depensesQuotidiennes;
        this.balanceDepensesLoisirs = this.budgetLoisirs - this.depensesLoisirs;
        this.balanceDepensesDons = this.budgetDons - this.depensesDons;
        this.balanceDepensesInvestissements = this.budgetDepensesInvestissements - this.depensesInvestissements;
        this.balanceEpargnesInvestissements = 0;

        this.totalBalance = this.totalRevenues - this.totalDepenses;
    }

    calculerBudgets() {

        this.budgetEpargnesInvestissements =this.budgets.calculer(this.budgets.budgetEpargnesInvestissements );
        this.budgetDepensesInvestissements = (this.soldesPrecedents.soldeEpargnesInvestissements + this.budgetEpargnesInvestissements);
        this.budgetDepensesQuotidiennes = this.budgets.calculer(this.budgets.budgetDepensesQuotidiennes );
        this.budgetDons = this.budgets.calculer(this.budgets.budgetDons );
        this.budgetLoisirs = this.budgets.calculer(this.budgets.budgetLoisirs );

    }

    private calculerDepensesInvestissements() {
        this.extraireTrxsInvestissements();

        this.depensesInvestissements = this.trxsInvestissements
            .filter(element => element.estDepense)
            .reduce((accumulator, value) => {
                return accumulator + value.montant;
            }, 0);
    }

    private calculerDepensesDons() {
        this.extraireTrxsDons();

        this.depensesDons = this.trxsDons
            .filter(element => element.estDepense)
            .reduce((accumulator, value) => {
                return accumulator + value.montant;
            }, 0);
    }
    private calculerDepensesLoisirs() {
        this.extraireTrxsLoisirs();

        this.depensesLoisirs = this.trxsLoisirs
            .filter(element => element.estDepense)
            .reduce((accumulator, value) => {
                return accumulator + value.montant;
            }, 0);
    }
    private calculerDepensesQuotidiennes() {

        this.extraireTrxsQuotidiennes();

        this.depensesQuotidiennes = this.trxsQuotidiennes
            .filter(element => element.estDepense)
            .reduce((accumulator, value) => {
                return accumulator + value.montant;
            }, 0);
    }

    private extraireTrxsInvestissements() {
        this.trxsInvestissements = this.trxsParPeriode.filter(trx => [
            'INVESTISSEMENT',
        ].includes(trx.categorie));
    }
    private extraireTrxsDons() {
        this.trxsDons = this.trxsParPeriode.filter(trx => [
            'DONS',
        ].includes(trx.categorie));
    }

    private extraireTrxsLoisirs() {
        this.trxsLoisirs = this.trxsParPeriode.filter(trx => [
            'RESTAURANTS',
            'LOISIRS',
        ].includes(trx.categorie));
    }

    private extraireTrxsQuotidiennes() {
        this.trxsQuotidiennes = this.trxsParPeriode.filter(trx => trx.estDepense && [
            'RESTAURANTS',
            'LOISIRS',
            'DONS',
            'INVESTISSEMENT',
        ].includes(trx.categorie) === false);
    }

    toString(): string {

        let balance = this.totalRevenues - this.totalDepenses;
        return `
        ----------------------------------------------------------------
        | Période: ${this.periode.padEnd(53)}|
        -----------------------------------------------------------------
        | Dépenses         |   Réalisées  |   Budgets    |      Diff    |
        -----------------------------------------------------------------
        | Quotidiennes     |  ${(this.depensesQuotidiennes.toFixed(2) + '$').padStart(10)}  |  ${(this.budgetDepensesQuotidiennes.toFixed(2) + '$').padStart(10)}  |  ${(this.balanceDepensesQuotidiennes.toFixed(2) + '$').padStart(10)}  |
        -----------------------------------------------------------------
        | Loisirs          |  ${(this.depensesLoisirs.toFixed(2) + '$').padStart(10)}  |  ${(this.budgetLoisirs.toFixed(2) + '$').padStart(10)}  |  ${(this.balanceDepensesLoisirs.toFixed(2) + '$').padStart(10)}  |
        -----------------------------------------------------------------
        | Dons             |  ${(this.depensesDons.toFixed(2) + '$').padStart(10)}  |  ${(this.budgetDons.toFixed(2) + '$').padStart(10)}  |  ${(this.balanceDepensesDons.toFixed(2) + '$').padStart(10)}  |
        -----------------------------------------------------------------
        |                                                               |
        -----------------------------------------------------------------
        | Épargnes         |  Accumulées  |   Budgets    |      Diff    |
        -----------------------------------------------------------------
        |                  |  ${(this.totalEpargnesInvestissements.toFixed(2) + '$').padStart(10)}  |  ${(this.budgetEpargnesInvestissements.toFixed(2) + '$').padStart(10)}  |  ${(this.balanceEpargnesInvestissements.toFixed(2) + '$').padStart(10)}  |
        -----------------------------------------------------------------
        |                                                               |
        -----------------------------------------------------------------
        | Investissements  |  ${(this.depensesInvestissements.toFixed(2) + '$').padStart(10).padEnd(42)}|
        -----------------------------------------------------------------
        | Revenu           |  ${(this.totalRevenues.toFixed(2) + '$').padStart(10).padEnd(42)}|
        -----------------------------------------------------------------
        | Dépenses         |  ${(this.totalDepenses.toFixed(2) + '$').padStart(10).padEnd(42)}|
        -----------------------------------------------------------------
        | Balance          |  ${(balance.toFixed(2) + '$').padStart(10).padEnd(42)}|
        -----------------------------------------------------------------
            `;
    }

    afficherTrxsParCategorie(): void {
        console.log(`${JSON.stringify(this.trxsQuotidiennes)}`);
        console.log(`${JSON.stringify(this.trxsLoisirs)}`);
        console.log(`${JSON.stringify(this.trxsDons)}`);
    }
}
