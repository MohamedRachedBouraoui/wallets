import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommunicationsService } from 'src/app/communs/communications.service';
import Bilan from 'src/app/tdo/bilan';
import Compte from 'src/app/tdo/compte';
import EtatDeCompte from 'src/app/tdo/etatDeCompte';

@Component({
  selector: 'app-resumes-bilans',
  templateUrl: './resumes-bilans.component.html',
  styleUrls: ['./resumes-bilans.component.scss']
})
export class ResumesBilansComponent {

  @Input() bilans: Bilan[] = [];
  

  constructor(private readonly communicationsService: CommunicationsService) {

  }
  afficherRevenuesCompte(etat: EtatDeCompte) {

    this.communicationsService.afficherRevenuesCompte(etat);
  }
  afficherDepenseCompte(etat: EtatDeCompte) {

    this.communicationsService.afficherDepensesCompte(etat);
  }

  recupererClassBilanSolde(bilan: Bilan) {
    return `bilan-solde ${(bilan.revenue - bilan.depenses) >= 0 ? 'ok' : 'not-ok'}`;
  }

  recuprerClassEtatCompte(solde: number) {
    return `etat-solde ${solde>= 0 ? 'ok' : 'not-ok'}`;
  }

}
