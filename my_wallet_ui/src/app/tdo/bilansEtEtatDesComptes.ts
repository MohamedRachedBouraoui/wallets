import Bilan from "./bilan";
import EtatDeCompte from "./etatDeCompte";

export default class BilansEtEtatDesComptes {

    bilans: Bilan[];
    etatDesComptes: EtatDeCompte[];

    constructor(bilans: Bilan[], etatDesComptes: EtatDeCompte[]) {
        this.bilans = bilans;
        this.etatDesComptes = etatDesComptes;
    }
}