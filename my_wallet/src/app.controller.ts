import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import Compte from './entities/compte';
import Transfert from './entities/transfert';
import Trx from './entities/trx';
import TrxDto from './entities/trxDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async extraireRevenusEtDepenses() {
    await this.appService.extraireTransactionsLocalAsync();
  }

  
  @Get("web")
  async extraireRevenusEtDepensesWeb() {
    await this.appService.extraireTransactionsWebAsync();
  }


  @Get("infos-bilans")
  async recupererInfosBilans() {
   return  await this.appService.recupererInfosBilansAsync();
  }
  
  @Get("categories")
  async recuprererCategories() {
   return  await this.appService.recuprererCategoriesAsync();
  }
  @Get("comptes")
  async recuprererComptes() {
   return  await this.appService.recuprererComptesAsync();
  }

  
  @Get("trxs-ignorees")
  async recuprererTrxsIgnorees() {
   return  await this.appService.recuprererTrxsIgnoreesAsync();
  }

  
  @Put("maj-trx")
  async majTrx(@Body() trx:Trx) {
   console.log("🚀 ~ file: app.controller.ts:34 ~ AppController ~ majTrx ~ trx", trx)
   return  await this.appService.majTrx(trx);
  }

  @Post("ajouter-trxs-csv")
  async ajouterTrxs(@Body() trxs:TrxDto[]) {
    console.log("🚀 ~ file: app.controller.ts:51 ~ AppController ~ ajouterTrxs ~ ajouterTrxs");
    
   return  await this.appService.ajouterTrxs(trxs);
  }

  @Post("ajouter-transferts")
  async ajouterTransfers(@Body() trfs:Transfert[]) {
    console.log("🚀 ~ file: app.controller.ts:51 ~ AppController ~ ajouterTransfers");
    
   return  await this.appService.ajouterTransfers(trfs);
  }
  @Post("ajouter-comptes")
  async ajouterComptes(@Body() comptes:Compte[]) {
    console.log("🚀 ~ ajouterComptes");
    
   return  await this.appService.ajouterComptes(comptes);
  }

  @Post("parser-html-credit")
  async parserHtmlCredit(@Body() html:{html:string}) {
    console.log("🚀 ~ file: app.controller.ts:51 ~ AppController ~ parserHtmlCredit");
    
   await this.appService.parserHtmlCredit(html.html);
  }

  @Post("parser-html-debit")
  async parserHtmlDedit(@Body() html:{html:string}) {
    console.log("🚀 ~ file: app.controller.ts:51 ~ AppController ~ parserHtmlDedit");
    
   await this.appService.parserHtmlDebit(html.html);
  }
}
