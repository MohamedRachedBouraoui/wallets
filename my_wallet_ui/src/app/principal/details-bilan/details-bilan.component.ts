import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationsService } from 'src/app/communs/communications.service';
import { HttpService } from 'src/app/communs/http.service';
import Categorie from 'src/app/tdo/categorie';
import Compte from 'src/app/tdo/compte';
import EtatDeCompte from 'src/app/tdo/etatDeCompte';
import ItemRevenuDepense from 'src/app/tdo/itemRevenuDepense';
import Trx from 'src/app/tdo/trx';
import { DetailsTrxComponent } from '../details-trx/details-trx.component';
import { GraphBilanComponent } from '../graph-bilan/graph-bilan.component';

@Component({
  selector: 'app-details-bilan',
  templateUrl: './details-bilan.component.html',
  styleUrls: ['./details-bilan.component.scss']
})
export class DetailsBilanComponent implements OnInit {

  etatDeCompteSelectionne: EtatDeCompte;
  titre: string = "";
  itemsCompte: ItemRevenuDepense[];
  categories: Categorie[];
  comptes: Compte[];
  itemGraph: { name: string; value: number; }[];

  constructor(private readonly communicationsService: CommunicationsService
    , private httpService: HttpService
    , private modalService: NgbModal) {

  }

  ngOnInit(): void {

    this.communicationsService.afficherRevenuesCompte_sbjct$.subscribe((etat: EtatDeCompte) => {

      this.etatDeCompteSelectionne = etat;
      this.itemsCompte = etat.itemsRevenue;
      this.titre = `Revenues du compte "${etat.nom}"`

      this.calculerPourcentagesCategories(this.itemsCompte);
      this.itemGraph = this.itemsCompte.map(i => ({
        name: i.categorie,
        value: i.pourcentage
      }));

      this.communicationsService.majGraphEtatCompte(this.itemsCompte.map(i => ({
        name: i.categorie,
        value: i.pourcentage
      })));
    });

    this.communicationsService.afficherDepensesCompte_sbjct$.subscribe((etat: EtatDeCompte) => {

      this.etatDeCompteSelectionne = etat;
      this.itemsCompte = etat.itemsDepenses;

      this.titre = `Dépenses du compte "${etat.nom}"`

      this.calculerPourcentagesCategories(this.itemsCompte);

      this.itemGraph = this.itemsCompte.map(i => ({
        name: i.categorie,
        value: i.pourcentage
      }));
      
      this.communicationsService.majGraphEtatCompte(this.itemsCompte.map(i => ({
        name: i.categorie,
        value: i.pourcentage
      })));

    });

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
      console.log("🚀 ~ file: details-bilan.component.ts:61 ~ DetailsBilanComponent ~ modalRef.result.then ~ result", result)

      if (result) {
        console.log(JSON.stringify(result.trx));
        this.httpService.put("maj-trx", result.trx).subscribe(() => {
          this.communicationsService.trxMaj(result.trx);
        });
      }
    });


  }

  calculerPourcentagesCategories(itemsCompte: ItemRevenuDepense[]) {
    let totalMontanatItems = itemsCompte.flatMap(i => i.leTotal).reduce((t1, t2) => { return t1 + t2; }, 0);

    itemsCompte.forEach(i => {
      i.pourcentage = i.total() * 100 / totalMontanatItems;
    });
  }


  afficherGraph() {

    const modalRef = this.modalService.open(GraphBilanComponent, { size: 'lg', centered: true, backdrop: true });
    modalRef.componentInstance.items = this.itemsCompte.map(i => ({
      name: i.categorie,
      value: i.pourcentage
    }));
  }
}
