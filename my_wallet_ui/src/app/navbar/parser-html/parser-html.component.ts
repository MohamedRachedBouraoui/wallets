import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationsService } from 'src/app/communs/communications.service';
import { HttpService } from 'src/app/communs/http.service';
import Compte from 'src/app/tdo/compte';

@Component({
  selector: 'app-ajouter-compte',
  templateUrl: './parser-html.component.html',
  styleUrls: ['./parser-html.component.scss']
})
export class ParserHtmlComponent implements OnInit {

  @Input() estCredit: boolean = true;

  htmlTrxs:string="";
  

  constructor(public modal: NgbActiveModal,
    private readonly httpService: HttpService,
    private readonly communicationsService: CommunicationsService) { }

  ngOnInit(): void {
  }

  passBack() {
    console.log("🚀 ~ this.htmlTrxs", this.htmlTrxs);
    this.modal.close(
      {
        htmlTrxs: this.htmlTrxs
      });


      const html = {html:this.htmlTrxs};
      console.log("🚀 ~ htmlTrxs:"+html);
      this.httpService.post(`parser-html-${this.estCredit===true?"credit":"debit"}`, html).subscribe(() => {
        
        console.log("🚀 ~ done");
    });
  }


}
