import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationsService } from '../communs/communications.service';
import { DialogueConfirmationService } from '../communs/dialogue-confirmation/dialogue-confirmation.service';
import { HttpService } from '../communs/http.service';
import { UtilsService } from '../communs/utils.service';
import Bilan from '../tdo/bilan';
import Compte from '../tdo/compte';
import EtatDeCompte from '../tdo/etatDeCompte';
import InfosBilans from '../tdo/infosBilans';
import { BilansService } from './bilans.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit{
  
  bilans: Bilan[];
  
  etatDeCompteSelectionne: EtatDeCompte;


  constructor(private readonly httpService: HttpService,
    private utils: UtilsService,
    private readonly communicationsService: CommunicationsService,
    private readonly dialogueConfirmationService: DialogueConfirmationService,
    private modalService: NgbModal,
    private bilansService:BilansService
  ) { }


  ngOnInit(): void {

    this.communicationsService.recupererNouveauBilan_sbjct$.subscribe(()=>{
      console.log("🚀 ~ recupererInfosBilans apres recupererNouveauBilan_sbjct");
      this.recupererInfosBilans();  
    });

    this.communicationsService.trxMaj_sbjct$.subscribe(()=>{
      console.log("🚀 ~ recupererInfosBilans apres trxMaj_sbjct");
      this.recupererInfosBilans();  
    });

    this.recupererInfosBilans();
  }
  

  recupererInfosBilans() {

    this.httpService.get<InfosBilans>('infos-bilans').subscribe(infosBilans => {

      console.log("🚀 ~ file: app.component.ts:44 ~ AppComponent ~ recupererInfosBilans ~ infosBilans", infosBilans);

     let bilans= this.bilansService.construireBilansEtEtatDesComptes(infosBilans);
     this.bilans=bilans.bilans;

    });
  }

  selectionnerEtatCompte(etat:EtatDeCompte){
    console.log("🚀 ~ file: principal.component.ts:52 ~ PrincipalComponent ~ selectionnerEtatCompte ~ etat", etat)
    
    this.etatDeCompteSelectionne = etat;
  }



}
