import Compte from "./compte";
import Params from "./params";
import Transfert from "./transfert";
import Trx from "./trx";

export default class InfosBilans {
    trxs: Trx[];
    comptes:Compte[];
    transferts:Transfert[];
    params:Params;

}