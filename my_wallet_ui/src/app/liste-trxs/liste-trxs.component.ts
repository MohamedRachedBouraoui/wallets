import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationsService } from '../communs/communications.service';
import { HttpService } from '../communs/http.service';
import { DetailsTrxComponent } from '../principal/details-trx/details-trx.component';
import Categorie from '../tdo/categorie';
import Compte from '../tdo/compte';
import Trx from '../tdo/trx';

@Component({
  selector: 'app-liste-trxs',
  templateUrl: './liste-trxs.component.html',
  styleUrls: ['./liste-trxs.component.scss']
})
export class ListeTrxsComponent implements OnInit{

  @Input() trxs:Trx[];
  categories: Categorie[];
  comptes: Compte[];


  constructor(private readonly communicationsService: CommunicationsService
    , private httpService: HttpService
    , private modalService: NgbModal) {

  }
  
  ngOnInit(): void {
    

    this.httpService.get<Categorie[]>('categories').subscribe((cats: Categorie[]) => {
      this.categories = cats;
    });
    this.httpService.get<Compte[]>('comptes').subscribe((cpts: Compte[]) => {
      this.comptes = cpts;
    });

  }

  modifierTrx(trx: Trx) {

    const modalRef = this.modalService.open(DetailsTrxComponent, { size: 'sm', centered: true, backdrop: false, scrollable: true });
    modalRef.componentInstance.trx = trx;
    modalRef.componentInstance.categories = this.categories;
    modalRef.componentInstance.comptes = this.comptes;

    modalRef.result.then((result) => {
      console.log("🚀 ~ modifierTrx ~ result", result)

      if (result) {
        console.log(JSON.stringify(result.trx));
        this.httpService.put("maj-trx", result.trx).subscribe(() => {
          this.communicationsService.trxMaj(result.trx);
        });
      }
    });


  }

}
