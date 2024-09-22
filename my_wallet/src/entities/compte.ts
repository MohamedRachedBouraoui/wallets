import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class Compte {

    @PrimaryColumn()
    nom: string;

    @Column()
    estLePrincipal: boolean = false;

    @Column()
    soldeDepart: number = 0;


    constructor(nom: string, estLePrincipal: boolean = false,soldeDepart: number = 0) {
        this.nom = nom;
        this.estLePrincipal = estLePrincipal;
        this.soldeDepart = soldeDepart;
    }

    static listeParDefaut: Compte[] = [
        new Compte("Banque", true),
        new Compte("Cash"),
        new Compte("Don"),
        new Compte("Loisir"),
        new Compte("Investissement"),
        new Compte("Quotidien")
    ];
}
