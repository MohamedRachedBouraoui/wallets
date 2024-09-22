import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './http.service';
import { UtilsService } from './utils.service';
import { ToastService } from './toast/toast.service';
import { ToastComponent } from './toast/toast.component';
import { DialogueConfirmationComponent } from './dialogue-confirmation/dialogue-confirmation.component';
import { CommunicationsService } from './communications.service';



@NgModule({
  declarations: [ToastComponent,DialogueConfirmationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    NgbToastModule
  ],
  providers: [HttpService,UtilsService,ToastService,CommunicationsService],  
  exports:[ ToastComponent ]
})
export class CommunsModule { }
