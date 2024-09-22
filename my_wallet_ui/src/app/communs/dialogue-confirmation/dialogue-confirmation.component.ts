
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialogue-confirmation',
  templateUrl: './dialogue-confirmation.component.html',
  styleUrls: ['./dialogue-confirmation.component.scss']
})
export class DialogueConfirmationComponent implements OnInit {

  @Input() title: string='na';
  @Input() message: string='na';
  @Input() btnOkText: string='na';
  @Input() btnCancelText: string='na';


  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}
