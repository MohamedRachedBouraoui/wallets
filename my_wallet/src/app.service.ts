import { Injectable } from '@nestjs/common';

import { UtilsService } from './commons/utils.service';
import Trx from './entities/trx';
import TrxCompteCourant from './entities/trxCompteCourant';
import TrxCarteCredit from './entities/trxCarteCredit';


import { ParseurWebService } from './parseur-web.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Categorie from './entities/categorie';
import moment from 'moment';
import Params from './entities/params';
import Compte from './entities/compte';
import Transfert from './entities/transfert';
import TrxDto from './entities/trxDto';

@Injectable()
export class AppService {



  categories: Categorie[];
  params: Params;
  comptes: Compte[];
  transferts: Transfert[];

  constructor(private utilsService: UtilsService
    , private parseurWeb: ParseurWebService
    , @InjectRepository(Trx) private readonly trxRepo: Repository<Trx>
    , @InjectRepository(Categorie) private readonly categorieRepo: Repository<Categorie>
    , @InjectRepository(Params) private readonly paramsRepo: Repository<Params>
    , @InjectRepository(Compte) private readonly compteRepo: Repository<Compte>
    , @InjectRepository(Transfert) private readonly transfertRepo: Repository<Transfert>
  ) {
  }


  async extraireTransactionsLocalAsync() {

    await this.initDonnees();
    let toutesTrxs = await this.recupererTrxsEnLocal();
    await this.enregistrerTrxsDansDate(toutesTrxs);

  }


  async extraireTransactionsWebAsync() {

    await this.initDonnees();
    let toutesTrxs = await this.recupererTrxsDansWeb();
    await this.enregistrerTrxsDansDate(toutesTrxs);

  }

  async enregistrerTrxsDansDate(trxs: Trx[]) {

    const trxsExistantes = await this.trxRepo.find();

    let derniereDateTrxDebitEnregistreeDansBd =
      trxsExistantes.length === 0 ? this.params.premiereDate :
        moment(this.utilsService.recupererMaxDate(
          trxsExistantes.filter(t => t.compteBancaire === 'COMPTE_COURANT')
            .map(t => t.date)))
          .add(1, 'days').toDate();

    let trxDebits = trxs.filter(trx =>
      trx.compteBancaire === 'COMPTE_COURANT' &&
      moment(trx.date).isSameOrAfter(derniereDateTrxDebitEnregistreeDansBd));

    let derniereDateTrxCreditEnregistreeDansBd =
      trxsExistantes.length === 0 ? this.params.premiereDate :
        moment(this.utilsService.recupererMaxDate(
          trxsExistantes.filter(t => t.compteBancaire === 'CARTE_CREDIT')
            .map(t => t.date)))
          .add(1, 'days').toDate();

    let trxCredits = trxs.filter(trx =>
      trx.compteBancaire === 'CARTE_CREDIT' &&
      moment(trx.date).isSameOrAfter(derniereDateTrxCreditEnregistreeDansBd));

    let trxsAEnregisterer = [...trxDebits, ...trxCredits];

    if (trxsAEnregisterer.length > 0) {
      console.log("🚀 ~  trxsAEnregisterer.length", trxsAEnregisterer.length);
      await this.trxRepo.save(trxsAEnregisterer);
    }
    else {

      console.log("❗ ~ Pas de nouvelles trxs à enregistrer");
    }


    return;

    // await (await this.recupererTrxsDansBd()).filter(t=>t.periode==='9_2022');



    // let trxTrieesParDate = this.utilsService.trierListeParDate<Trx>(toutesTrxs, nameof<Trx>('date'), 'ASC');

    // this.utilsService.ecrireDansDichierAsync(this.utilsService.construireChemin('rapports', 'trxs.json'), JSON.stringify(trxTrieesParDate));


    // trxTrieesParDate = await this.nettoyerListeTransactions(trxTrieesParDate);

    // let bilansDesMois: BilanDuMois[] = await this.calculerBilansParMois(trxTrieesParDate);

    // let bilanFinal = this.calculerTotauxFinaux(bilansDesMois);

    // bilansDesMois = this.utilsService.trierListeParProp<BilanDuMois>(bilansDesMois, nameof<BilanDuMois>('periode'), 'DESC');

    // await this.genererRapportFinal(bilansDesMois, bilanFinal);



    // let grpsBilans = bilansDesMois.reduce((grp, trx) => {

    //   grp[trx.periode] = [...trx.trxsQuotidiennes, ...trx.trxsLoisirs, ...trx.trxsDons];
    //   return grp;

    // }, {});



    // const grpParPeriode = nameof<Trx>('periode');

    // this.utilsService.ecrireDansDichierAsync(this.utilsService.construireChemin('rapports', `groupes_${grpParPeriode}.json`), JSON.stringify(grpsBilans));


    // this.trxRepo.save(trxTrieesParDate);
  }

  private async initDonnees() {

    await this.initParams();
    await this.initComptes();
    await this.initTransferts();

    await this.construireListeCategories();
  }

  async initTransferts() {
    let transfertsExistants = await this.transfertRepo.find();
    if (transfertsExistants.length === 0) {

      transfertsExistants = Transfert.listeParDefaut;
      await this.transfertRepo.save(transfertsExistants);
    }
  }

  async initComptes(): Promise<void> {
    let comptesExistants = await this.compteRepo.find();
    if (comptesExistants.length === 0) {
      comptesExistants = Compte.listeParDefaut;

      await this.compteRepo.save(comptesExistants);
    }
  }

  async initParams(): Promise<void> {


    let paramsExistants = await this.paramsRepo.find();

    if (paramsExistants.length === 0) {

      this.params = new Params(new Date(2022, 11, 22));
      await this.paramsRepo.save(this.params);

    } else {
      this.params = paramsExistants[0]
    }
  }


  private async construireListeCategories() {
    console.log("🚀 ~ construireListeCategories ...");

    this.categories = await this.categorieRepo.find();

    if (this.categories.length > 0) {
      console.log("🚀 ~ construireListeCategories déjà fait");
      return;
    } else {

      this.categories = Categorie.listeParDefaut;


      await this.categorieRepo.save(this.categories);
    }

    console.log("🚀 ~ construireListeCategories OK");
  }
  async recupererTrxsEnLocal(): Promise<Trx[]> {

    try {
      let trxsDansSiteWeb: { trxsDebit: TrxCompteCourant[]; trxsCredit: TrxCarteCredit[]; } = { trxsDebit: [], trxsCredit: [] };

      let credit = await this.utilsService.lireContenuFicherAsync(this.utilsService.construireChemin('assets', `2023_1_carteCredit.html`));
      let debit = await this.utilsService.lireContenuFicherAsync(this.utilsService.construireChemin('assets', `2023_1_carteDebit.html`));

      let trxsCredit = this.parseurWeb.parseHtmlCarteCredit(credit, this.categories);
      let trxsDebit = this.parseurWeb.parseHtmlCarteDebit(debit, this.categories);


      trxsDansSiteWeb = { trxsDebit, trxsCredit };

      let transactionsCarteCredit: Trx[] = trxsDansSiteWeb.trxsCredit;
      let transactionsCompteCourant: Trx[] = trxsDansSiteWeb.trxsDebit;

      console.log(`🚀 ~ ${transactionsCarteCredit.length}-Trx >> Carte-Credit à traiter ...`);
      console.log(`🚀 ~ ${transactionsCompteCourant.length}-Trx >> Compte-Courant à traiter ...`);


      return [...transactionsCarteCredit, ...transactionsCompteCourant];
    } catch (error) {

      console.log("🚀 ~Erreur durant la récupération des trx dans le site-web", error);
      return [];

    }

  }

  private async recupererTrxsDansWeb() {

    try {
      let trxsDansSiteWeb: { trxsDebit: TrxCompteCourant[]; trxsCredit: TrxCarteCredit[]; } = { trxsDebit: [], trxsCredit: [] };

      trxsDansSiteWeb = await this.recupererTrxsDansSiteWeb();


      let transactionsCarteCredit: Trx[] = trxsDansSiteWeb.trxsCredit;
      let transactionsCompteCourant: Trx[] = trxsDansSiteWeb.trxsDebit;

      console.log(`🚀 ~ ${transactionsCarteCredit.length}-Trx >> Carte-Credit à traiter ...`);
      console.log(`🚀 ~ ${transactionsCompteCourant.length}-Trx >> Compte-Courant à traiter ...`);


      return [...transactionsCarteCredit, ...transactionsCompteCourant];

    } catch (error) {

      console.log("🚀 ~Erreur durant la récupération des trx dans le site-web", error);
      return [];

    }
  }

  async recupererTrxsDansSiteWeb(ouvrirChrome: boolean = true): Promise<{ trxsDebit: TrxCompteCourant[]; trxsCredit: TrxCarteCredit[]; }> {

    let ws = await this.parseurWeb.lancerChromeAsync(ouvrirChrome);

    if (ws.length === 0) {
      return;
    }

    let htmlCartes: { credit: string, debit: string } = await this.parseurWeb.recuprerHtmlCartesAsync(ws);

    if (htmlCartes == null) {
      return;
    }

    let now = new Date();
    let prefixNomFichier = now.getFullYear() + '_' + (now.getMonth() + 1);

    this.utilsService.ecrireDansDichierAsync(this.utilsService.construireChemin('assets', `${prefixNomFichier}_carteCredit.html`), htmlCartes.credit);
    this.utilsService.ecrireDansDichierAsync(this.utilsService.construireChemin('assets', `${prefixNomFichier}_carteDebit.html`), htmlCartes.debit);

    let trxsCredit = this.parseurWeb.parseHtmlCarteCredit(htmlCartes.credit, this.categories);
    let trxsDebit = this.parseurWeb.parseHtmlCarteDebit(htmlCartes.debit, this.categories);


    return { trxsDebit, trxsCredit };
  }



  async extraireTransactionsCompteCourantAsync(releves: string[]): Promise<Trx[]> {

    let toutesTransactions: Trx[] = [];

    for (let _index = 0; _index < releves.length; _index++) {

      let contenuReleve = releves[_index];
      let transactions = TrxCompteCourant.extraireTransactionsDansUnReleveAsync(contenuReleve, this.categories);
      toutesTransactions = [...toutesTransactions, ...transactions];
    }

    return toutesTransactions;
  }

  async extraireTransactionsCarteCreditAsync(releves: string[]): Promise<Trx[]> {
    console.log("🚀 ~ extraireTransactionsCarteCreditAsync ...");

    let transactionTotales: Trx[] = [];

    for (let _index = 0; _index < releves.length; _index++) {

      let contenuReleve = releves[_index];
      let transactions = TrxCarteCredit.extraireTransactionsDansUnReleveAsync(contenuReleve, this.categories);
      transactionTotales = [...transactionTotales, ...transactions];
    }

    return transactionTotales;
  }


  async recupererInfosBilansAsync() {
    console.log("🚀 ~ recupererInfosBilansAsync");
    await this.initDonnees();

    const result = {
      trxs: await this.trxRepo.find(),
      comptes: await this.compteRepo.find(),
      transferts: await this.transfertRepo.find(),
      params: (await this.paramsRepo.find())[0]
    };

    console.log("🚀 ~ file: app.service.ts:580 ~ AppService ~ recupererInfosBilansAsync ~ result", result)

    return result
  }

  async majTrx(trx: Trx) {
    await this.trxRepo.save(trx);
  }

  dicNomNumeroMois = {
    'JAN': 0, 'FÉV': 1, 'MAR': 2, 'AVR': 3,
    'MAI': 4, 'JUN': 5, 'JUL': 6, 'AOÛ': 7,
    'SEP': 8, 'OCT': 9, 'NOV': 10, 'DÉC': 11,
  };

  async ajouterTrxs(trxs: TrxDto[]) {
    console.log("🚀 ~  ajouterTrxs")
    console.log("🚀 ~ file: app.service.ts:592 ~ AppService ~ ajouterTrxs ~ trxs", trxs)

    await this.initDonnees();




    let categories = await this.categorieRepo.find();
    let nouvellesTrxs: Trx[] = [];


    trxs.forEach(trx => {

      const resutlTrx = Trx.initTrxDuCsv(trx, categories);
      nouvellesTrxs.push(resutlTrx);
    });

    console.log("🚀 ~  nouvellesTrxs", nouvellesTrxs)
    await this.trxRepo.save(nouvellesTrxs);
  }

  async recuprererCategoriesAsync() {
    const cats = await this.categorieRepo.find();
    return [
      ...new Map(cats.map((item) => [item['libelle'], item])).values(),
    ];
  }

  async recuprererComptesAsync() {
    return await this.compteRepo.find();
  }

  async recuprererTrxsIgnoreesAsync() {
    return (await this.trxRepo.find({ where: { ignorer: true }})).sort();

  }

  async ajouterTransfers(trfs: Transfert[]) {
    await this.transfertRepo.save(trfs);
  }

  async ajouterComptes(comptes: Compte[]) {
    return await this.compteRepo.save(comptes);
  }

  async parserHtmlCredit(htmlCredit: string) {
    try {

      await this.initDonnees();
      let transactionsCarteCredit: Trx[] = this.parseurWeb.parseHtmlCarteCredit(htmlCredit, this.categories);

      console.log(`🚀 ~ ${transactionsCarteCredit.length}-Trx >> Carte-Credit à traiter ...`);
      
      await this.enregistrerTrxsDansDate(transactionsCarteCredit);
      
    } catch (error) {

      console.log("🚀 ~Erreur parserHtmlCredit", error);
    }
  }
  async parserHtmlDebit(htmlDebit: string) {
    try {

      await this.initDonnees();
      let transactionsCarteDebit: Trx[] = this.parseurWeb.parseHtmlCarteDebit(htmlDebit, this.categories);

      console.log(`🚀 ~ ${transactionsCarteDebit.length}-Trx >> Carte-Debit à traiter ...`);
      
      await this.enregistrerTrxsDansDate(transactionsCarteDebit);

    } catch (error) {

      console.log("🚀 ~Erreur parserHtmlDebit", error);
    }
  }


}