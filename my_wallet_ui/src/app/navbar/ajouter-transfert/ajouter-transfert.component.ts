import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationsService } from 'src/app/communs/communications.service';
import { HttpService } from 'src/app/communs/http.service';
import Categorie from 'src/app/tdo/categorie';
import Compte from 'src/app/tdo/compte';
import Transfert from 'src/app/tdo/transfert';

@Component({
  selector: 'app-ajouter-transfert',
  templateUrl: './ajouter-transfert.component.html',
  styleUrls: ['./ajouter-transfert.component.scss']
})
export class AjouterTransfertComponent implements OnInit {

  placeholderPourcentage = '%';

  @Input() categories: Categorie[];
  @Input() comptes: Compte[];

  transferts: Transfert[] = [];
  // transferts: { compteSrc: string, compteDest: string, pourcentage: number, date: NgbDateStruct }[] = [];

  constructor(public modal: NgbActiveModal, private calendar: NgbCalendar,
    private readonly httpService: HttpService,
    private readonly communicationsService: CommunicationsService) { }

  ngOnInit(): void {
    this.ajouterTransfert();
  }

  passBack() {
    console.log("🚀 ~ file: ajouter-transfert.component.ts:24 ~ AjouterTransfertComponent ~ passBack ~ this.transferts", this.transferts);
    this.modal.close(
      {
        transferts: this.transferts
      });

    this.transferts.forEach(t => t.dateEffective = new Date(t.date.year, t.date.month-1, t.date.day,0,0,0));

    this.httpService.post('ajouter-transferts', this.transferts).subscribe(() => {
      console.log("🚀 ~ done");

    });
  }

  majCompteDest(index: number, compte: string) {
    this.transferts[index].compteDestination = compte;
  }

  majCompteSrc(index: number, compte: string) {
    this.transferts[index].compteSource = compte;
  }

  ajouterTransfert() {
    this.transferts.push({ compteSource: 'Compte source', compteDestination: 'Compte destination', pourcentageTransfert: 0, dateEffective: new Date(), date: this.calendar.getToday() });
  }

  supprimerTransfert(indexTrsf: number) {
    this.transferts.splice(indexTrsf, 1);
  }

  desactiverBtn() {
    return this.transferts.length === 0
      || this.transferts.map(t => t.pourcentageTransfert).reduce((t1, t2) => { return t1 + t2; }, 0) > 100
      || this.transferts.find(t =>
        t.compteSource.toLocaleLowerCase() === 'compte source'
        || t.compteDestination.toLocaleLowerCase() === 'compte destination') !== undefined
  }
}
