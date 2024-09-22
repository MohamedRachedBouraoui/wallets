import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import TrxDto from 'src/app/tdo/trxDto';
import { CommunicationsService } from '../../communs/communications.service';
import { HttpService } from '../../communs/http.service';
import Trx from '../../tdo/trx';

@Component({
  selector: 'app-ajout-trxs',
  templateUrl: './ajout-trxs.component.html',
  styleUrls: ['./ajout-trxs.component.scss']
})
export class AjoutTrxsComponent {

  listeTrxs: string;
  estCredit: boolean = false;

  
  dicNomNumeroMois: any = {
    'JAN': 0, 'FÉV': 1, 'MAR': 2, 'AVR': 3,
    'MAI': 4, 'JUN': 5, 'JUL': 6, 'AOÛ': 7,
    'SEP': 8, 'OCT': 9, 'NOV': 10, 'DÉC': 11,
  };

  dicIndexElementsDebit = {
    date: 0,    des: 1,   lieu: 2,    credit: 3,    debit: 4
  };

  dicIndexElementsCredit = {
    date_jour: 0,date_mois:1,date_annee:2,    description: 3,   lieu: 4,    credit: 5,    debit: 6
  };

  constructor(public modal: NgbActiveModal, private readonly httpService: HttpService,
    private readonly communicationsService: CommunicationsService,) { }


  passBack() {

    if (this.listeTrxs.length === 0) {
      console.log("🚀 ~ file: ajout-trxs.component.ts:22 ~ AjoutTrxsComponent ~ passBack ~ this.listeTrxs", this.listeTrxs)
      this.modal.close();
    }
    else {

      console.log(this.listeTrxs);

      let nouvellesTrxs = this.estCredit === false ? this.convertirCvsEnTrxsDebit(this.listeTrxs) : this.convertirCvsEnTrxsCredit(this.listeTrxs);

      this.httpService.post("ajouter-trxs-csv", nouvellesTrxs).subscribe(() => {
        this.modal.close();
        this.communicationsService.afficherNouveauBilan();
      });
    }
  }

  convertirCvsEnTrxsCredit(trxs: string) {
    console.log("🚀 ~ convertirCvsEnTrxsCredit");
    
    
    let lignesTrxs = trxs.split('\n');
    let nouvellesTrxs: TrxDto[] = [];

    lignesTrxs.forEach(ligne => {

      let partiesLigne = ligne.split(';');
      
     
      let description = partiesLigne[this.dicIndexElementsCredit["description"]];
      let montantCredit = partiesLigne[this.dicIndexElementsCredit["credit"]];
      let montantDebit = partiesLigne[this.dicIndexElementsCredit["debit"]];
      let lieu = partiesLigne[this.dicIndexElementsCredit["lieu"]];

      let date = new Date(parseInt(partiesLigne[this.dicIndexElementsCredit['date_annee']]),
      parseInt(partiesLigne[this.dicIndexElementsCredit['date_mois']])-1,
      parseInt(partiesLigne[this.dicIndexElementsCredit['date_jour']]));


      let trxDto: TrxDto = new TrxDto();

      trxDto.date = date.toLocaleDateString();
      trxDto.description =description;
      trxDto.montant = montantCredit.length > 0 ? montantCredit : montantDebit;
      trxDto.estDepense = montantCredit.length > 0;
      trxDto.lieu = lieu;
      trxDto.ignorer = false;
      trxDto.compteBancaire = 'CARTE_CREDIT';

      nouvellesTrxs.push(trxDto);
      console.log("🚀 ~  convertirCvsEnTrxsCredit ~ trxDto", trxDto);
    });

    return nouvellesTrxs;
  }


  convertirCvsEnTrxsDebit(trxs: string) {
    console.log("🚀 ~ file: ajout-trxs.component.ts:52 ~ AjoutTrxsComponent ~ convertirCvsEnTrxsDebit ~ convertirCvsEnTrxsDebit");


    let lignesTrxs = trxs.split('\n');
    let nouvellesTrxs: TrxDto[] = [];

    lignesTrxs.forEach(ligne => {

      let partiesLigne = ligne.split(';');
      
      let partiesDate = partiesLigne[this.dicIndexElementsDebit["date"]].split(' ');
      let montantCredit = partiesLigne[this.dicIndexElementsDebit["credit"]];
      let montantDebit = partiesLigne[this.dicIndexElementsDebit["debit"]];
      let lieu = partiesLigne[this.dicIndexElementsDebit["lieu"]];

      let date = new Date(parseInt(partiesDate[2]), parseInt(this.dicNomNumeroMois[partiesDate[1]]), parseInt(partiesDate[0]));


      let trxDto: TrxDto = new TrxDto();

      trxDto.date = date.toLocaleDateString();
      trxDto.description = partiesLigne[1];
      trxDto.montant = montantCredit.length > 0 ? montantCredit : montantDebit;
      trxDto.estDepense = montantCredit.length > 0;
      trxDto.lieu = lieu;
      trxDto.ignorer = false;
      trxDto.compteBancaire = 'COMPTE_COURANT';

      nouvellesTrxs.push(trxDto);
      console.log("🚀 ~  convertirCvsEnTrxsDebit ~ trxDto", trxDto);
    });

    return nouvellesTrxs;
  }
}