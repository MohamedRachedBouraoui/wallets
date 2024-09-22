import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Transfert {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    compteSource: string;
    @Column()
    compteDestination: string;

    @Column()
    pourcentageTransfert: number;//pourcentage par rapport au debit du compte Banque
    
    @Column()
    dateEffective: Date;

    constructor(compteSource: string, compteDestination: string, pourcentageTransfert: number,dateEffective:Date) {
        this.compteSource = compteSource;
        this.compteDestination = compteDestination;
        this.pourcentageTransfert = pourcentageTransfert;
        this.dateEffective = dateEffective;
    }

    static listeParDefaut: Transfert[] = [
        new Transfert("Banque", "Don", 5,new Date()),
        new Transfert("Banque", "Loisir", 10,new Date()),
        new Transfert("Banque", "Investissement", 20,new Date()),
        new Transfert("Banque", "Quotidien", 65,new Date()),
    ];
}
