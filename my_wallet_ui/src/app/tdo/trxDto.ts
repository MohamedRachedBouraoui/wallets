import { COMPTE } from "./compte";

export default class TrxDto {

    date: string;
    description: string;
    montant: string;
    estDepense: boolean;
    compteBancaire: COMPTE;
    lieu: string;
    periode: string;
    ignorer: boolean;
    commentaire?: string;
}
