import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/communs/http.service';
import Categorie from 'src/app/tdo/categorie';
import Compte from 'src/app/tdo/compte';
import Trx from 'src/app/tdo/trx';

@Component({
  selector: 'app-details-trx',
  templateUrl: './details-trx.component.html',
  styleUrls: ['./details-trx.component.scss']
})
export class DetailsTrxComponent {

  @Input() trx: Trx;
  @Input() categories: Categorie[];
  @Input() comptes: Compte[];

  constructor(public modal: NgbActiveModal) { }

  passBack() {
    this.modal.close(
      {
        trx: this.trx
      });
  }

  majCategorieTrx(catLibelle: string) {
    this.trx.categorie = catLibelle;
  }
  majCompteTrx(compte: string) {
    this.trx.compte = compte;
  }

}
