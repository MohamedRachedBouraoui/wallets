import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Budgets {


    @PrimaryColumn()
    libelle: string;

    @Column()
    pourcentage: number;
    @Column()
    base: number;

    static init(obj: any) {
        let _this = new Budgets();
        Object.assign(_this, obj);
        return _this;
    }


    calculer(budget: { base: number; pourcentage: number; }): number {
        return budget.base * budget.pourcentage
    }

    budgetEpargnesInvestissements: { base: number, pourcentage: number } = { base: 0, pourcentage: 0 };
    budgetDepensesQuotidiennes: { base: number, pourcentage: number } = { base: 0, pourcentage: 0 };
    budgetDons: { base: number, pourcentage: number } = { base: 0, pourcentage: 0 };
    budgetLoisirs: { base: number, pourcentage: number } = { base: 0, pourcentage: 0 };
}