import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import EtatDeCompte from '../tdo/etatDeCompte';
import Trx from '../tdo/trx';

@Injectable({
  providedIn: 'root'
})
export class CommunicationsService {
  
  recupererNouveauBilan_sbjct$ = new Subject<boolean>();
  afficherRevenuesCompte_sbjct$ = new Subject<EtatDeCompte>();
  afficherDepensesCompte_sbjct$ = new Subject<EtatDeCompte>();
  trxMaj_sbjct$ = new Subject<Trx>();
  majGraphEtatCompte_sbjct$ = new Subject<{ name: string, value: number }[]>();
  
  constructor() { }
  
  afficherNouveauBilan() {
    
    this.recupererNouveauBilan_sbjct$.next(true);
  }

  afficherRevenuesCompte(etat:EtatDeCompte) {
    
    this.afficherRevenuesCompte_sbjct$.next(etat);
  }
  
  afficherDepensesCompte(etat:EtatDeCompte) {
    
    this.afficherDepensesCompte_sbjct$.next(etat);
  }

  trxMaj(trx:Trx) {
    
    this.trxMaj_sbjct$.next(trx);
  }

  majGraphEtatCompte(items:{ name: string, value: number }[]) {
    
    this.majGraphEtatCompte_sbjct$.next(items);
  }
}
