import { NgModule,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbAccordionModule, NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PrincipalComponent } from './principal/principal.component';
import { CommonModule } from '@angular/common';
import { CommunsModule } from './communs/communs.module';
import { ResumesBilansComponent } from './principal/resumes-bilans/resumes-bilans.component';
import { DetailsBilanComponent } from './principal/details-bilan/details-bilan.component';
import { DetailsTrxComponent } from './principal/details-trx/details-trx.component';
import { AjoutTrxsComponent } from './navbar/ajout-trxs/ajout-trxs.component';

import { GraphBilanComponent } from './principal/graph-bilan/graph-bilan.component';
import { NgChartsModule } from 'ng2-charts';
import { ListeTrxsComponent } from './liste-trxs/liste-trxs.component';
import { AjouterTransfertComponent } from './navbar/ajouter-transfert/ajouter-transfert.component';
import { AjouterCompteComponent } from './navbar/ajouter-compte/ajouter-compte.component';
import { ParserHtmlComponent } from './navbar/parser-html/parser-html.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PrincipalComponent,
    ResumesBilansComponent,
    DetailsBilanComponent,
    DetailsTrxComponent,
    AjoutTrxsComponent,
    GraphBilanComponent,
    ListeTrxsComponent,
    AjouterTransfertComponent,
    AjouterCompteComponent,
    ParserHtmlComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbAccordionModule ,
    CommunsModule,
    NgChartsModule,
    NgbTooltipModule

  ],
  //providers: [{ provide: NgChartsConfiguration, useValue: { generateColors: true }}],
  bootstrap: [AppComponent]
})
export class AppModule { }
