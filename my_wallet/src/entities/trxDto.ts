import { COMPTE } from "src/typePersonnalises/types";

export default class TrxDto {

    date: string;
    description: string;
    montant: string;
    estDepense: boolean;
    compteBancaire: COMPTE;
    lieu: string;
    periode: string;
    ignorer: boolean;
}
