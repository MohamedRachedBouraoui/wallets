import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export default class Transfert {

    
    //id: number;
    
    compteSource: string;
    
    compteDestination: string;

    
    pourcentageTransfert: number;//pourcentage par rapport au debit du compte Banque

    dateEffective: Date;
    date: NgbDateStruct;
   
}
