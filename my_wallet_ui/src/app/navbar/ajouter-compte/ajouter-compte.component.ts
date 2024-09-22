import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationsService } from 'src/app/communs/communications.service';
import { HttpService } from 'src/app/communs/http.service';
import Compte from 'src/app/tdo/compte';

@Component({
  selector: 'app-ajouter-compte',
  templateUrl: './ajouter-compte.component.html',
  styleUrls: ['./ajouter-compte.component.scss']
})
export class AjouterCompteComponent implements OnInit {

  placeholderCompte = 'Saisir nom du compte';

  @Input() comptesExistants: Compte[];
  comptes: Compte[] = [];
  // transferts: { compteSrc: string, compteDest: string, pourcentage: number, date: NgbDateStruct }[] = [];

  constructor(public modal: NgbActiveModal,
    private readonly httpService: HttpService,
    private readonly communicationsService: CommunicationsService) { }

  ngOnInit(): void {
    this.ajouterCompte();
  }

  passBack() {
    console.log("🚀 ~ this.comptes", this.comptes);
    this.modal.close(
      {
        comptes: this.comptes
      });


    this.httpService.post('ajouter-comptes', this.comptes).subscribe(() => {
      console.log("🚀 ~ done");

    });
  }


  ajouterCompte() {
    this.comptes.push(new Compte( '', false,0));
  }

  supprimerCompte(indexCompte: number) {
    this.comptes.splice(indexCompte, 1);
  }

  desactiverBtn() {
    return this.comptes.length === 0
      || this.comptesExisteDeja()
      || this.comptes.find(t =>
        t.nom.length === 0) !== undefined
  }

  private comptesExisteDeja(): boolean {
    return this.comptesExistants
      .map(c => c.nom.toLocaleLowerCase())
      .filter(c =>
        this.comptes.map(cNouveau => cNouveau.nom.toLocaleLowerCase())
          .includes(c))
      .length > 0;
  }
}
