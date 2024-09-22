import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AjoutTrxsComponent } from './ajout-trxs/ajout-trxs.component';
import { CommunicationsService } from '../communs/communications.service';
import { HttpService } from '../communs/http.service';
import { ListeTrxsComponent } from '../liste-trxs/liste-trxs.component';
import Trx from '../tdo/trx';
import Categorie from '../tdo/categorie';
import Compte from '../tdo/compte';
import { AjouterTransfertComponent } from './ajouter-transfert/ajouter-transfert.component';
import { AjouterCompteComponent } from './ajouter-compte/ajouter-compte.component';
import { ParserHtmlComponent } from './parser-html/parser-html.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {


  categories: Categorie[];
  comptes: Compte[];


  constructor(
    private readonly httpService: HttpService,
    private readonly communicationsService: CommunicationsService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.httpService.get<Categorie[]>('categories').subscribe((cats: Categorie[]) => {
      this.categories = cats;
    });
    this.httpService.get<Compte[]>('comptes').subscribe((cpts: Compte[]) => {
      this.comptes = cpts;
    });
  }

  recupererTransactionsLocal() {

    this.httpService.get('').subscribe(() => {

      console.log("🚀 ~ recupererTransactionsLocal");
      this.communicationsService.afficherNouveauBilan();

    });
  }

  recupererTransactionsWeb() {

    this.httpService.get('web').subscribe(() => {

      console.log("🚀 ~ recupererTransactionsWeb");
      this.communicationsService.afficherNouveauBilan();
    });
  }


  ajouterTrxs() {
    const modalRef = this.modalService.open(AjoutTrxsComponent, { size: 'xl', centered: true, backdrop: false, scrollable: true });
  }

  recupererTrxsIgnorees() {

    this.httpService.get<Trx[]>('trxs-ignorees').subscribe((trxs) => {

      console.log("🚀 ~ recupererTrxsIgnorees");
      const modalRef = this.modalService.open(ListeTrxsComponent, { size: 'lg', centered: true, backdrop: true, scrollable: true });
      modalRef.componentInstance.trxs = trxs;
    });
  }

  ajouterTransferts() {

    const modalRef = this.modalService.open(AjouterTransfertComponent, { size: 'lg', centered: true, backdrop: false, scrollable: true });

      
      modalRef.componentInstance.categories = this.categories;
      modalRef.componentInstance.comptes = this.comptes;
  }
  ajouterComptes() {

    const modalRef = this.modalService.open(AjouterCompteComponent, { size: 'sm', centered: true, backdrop: false, scrollable: true });
    
    modalRef.componentInstance.comptesExistants = this.comptes;
  }
  
  
  
  parserHtmlCredit() {
    
    const modalRef = this.modalService.open(ParserHtmlComponent, { size: 'lg', centered: true, backdrop: false, scrollable: true });
    modalRef.componentInstance.estCredit = true;
  }

  parserHtmlDedit() {
    
    const modalRef = this.modalService.open(ParserHtmlComponent, { size: 'lg', centered: true, backdrop: false, scrollable: true });
    modalRef.componentInstance.estCredit = false;
  }



}
