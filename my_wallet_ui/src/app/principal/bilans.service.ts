import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { UtilsService } from '../communs/utils.service';

import Bilan from '../tdo/bilan';
import Compte from '../tdo/compte';
import EtatDeCompte from '../tdo/etatDeCompte';
import InfosBilans from '../tdo/infosBilans';
import ItemRevenuDepense from '../tdo/itemRevenuDepense';
import Transfert from '../tdo/transfert';
import Trx from '../tdo/trx';

@Injectable({
  providedIn: 'root'
})
export class BilansService {

  constructor(private readonly utils: UtilsService) { }


  construireBilansEtEtatDesComptes(infosBilans: InfosBilans) {
    let params = infosBilans.params;
    let debut = new Date(params.premiereDate);
    debut.setHours(0, 0, 0, 0);

    let trxs = infosBilans.trxs.filter(t => new Date(t.date) >= debut);
    let comptes = infosBilans.comptes.map(c=>(new Compte(c.nom,c.estLePrincipal,c.soldeDepart)));
    let transferts = infosBilans.transferts;

    let index = 0;
    const avancerDatePar = 27;//nbre de jours = incrément
    let fin = moment(debut).add(avancerDatePar, 'days').toDate();
    fin.setHours(0, 0, 0, 0);

    let listeBilans = [];

    do {

      let trxsDansDates = trxs.filter(t => new Date(t.date) >= debut && new Date(t.date) <= fin);

      let trxsDepenses = trxsDansDates.filter(t => t.estDepense === true && t.ignorer === false);
      let totalDepensesDansDates = trxsDepenses.map(t => t.montant).reduce((t1, t2) => { return t1 + t2; }, 0);

      let trxsRevenues = trxsDansDates.filter(t => t.estDepense === false && t.ignorer === false);
      let totalRevenuesDansDates = trxsRevenues.map(t => t.montant).reduce((t1, t2) => { return t1 + t2; }, 0);

      let trxsDeTransferts = this.effectuerTransfertsEntreComptes(trxsRevenues,trxsDepenses, comptes, transferts, debut, fin);

      trxsRevenues = trxsRevenues.concat(trxsDeTransferts.filter(t => t.estDepense === false));
      trxsDepenses = trxsDepenses.concat(trxsDeTransferts.filter(t => t.estDepense === true));

      // this.majComptesApresDepensesDansDates(trxsDepenses,trxsRevenues, comptes)


      listeBilans.push(
        new Bilan(debut, fin, totalRevenuesDansDates, totalDepensesDansDates
          , this.calculerEtatsComptesDansDates(trxsRevenues, trxsDepenses, comptes, transferts, debut, fin)));

      debut = moment(fin).add(1, 'days').toDate();
      fin = moment(debut).add(avancerDatePar, 'days').toDate();
      index = index + trxsDansDates.length;

    } while (index != trxs.length);

    return {
      bilans: this.utils.trierListeParProp<Bilan>(listeBilans, 'debut', 'DESC')
      // etatsComptes: this.calculerEtatFinalComptes(listeBilans, comptes),
    }
  }

  calculerEtatsComptesDansDates(trxsRevenues: Trx[], trxsDepenses: Trx[], comptes: Compte[], transferts: Transfert[], debutBilan: Date, finBilan: Date): EtatDeCompte[] {

    const totalDebit = trxsRevenues.map(t => t.montant).reduce((t1, t2) => { return t1 + t2; }, 0);

    let comptesDansDates: EtatDeCompte[] = comptes.map(c => (
      new EtatDeCompte(c.nom, c.estLePrincipal,c.soldeDepart, debutBilan, finBilan)
    ));


    comptesDansDates.forEach(compte => {

      const trxsRevenuesParCompte = trxsRevenues.filter(t => t.compte.toLocaleLowerCase() === compte.nom.toLocaleLowerCase());

      const trxsDepensesParCompte = trxsDepenses.filter(t => t.compte.toLocaleLowerCase() === compte.nom.toLocaleLowerCase());

      compte.totalDebit = trxsRevenuesParCompte.map(t => t.montant).reduce((t1, t2) => { return t1 + t2; }, 0);
      compte.totalCredit = trxsDepensesParCompte.map(t => t.montant).reduce((t1, t2) => { return t1 + t2; }, 0);
      //compte.solde = compte.totalDebit - compte.totalCredit;

      compte.itemsRevenue = this.regrouperTrxsParCategories(trxsRevenuesParCompte);

      compte.itemsDepenses = this.regrouperTrxsParCategories(trxsDepensesParCompte);

      comptes.find(cp=>cp.nom.toLocaleLowerCase() ==compte.nom.toLocaleLowerCase() )!.majSoldeDepart( compte.totalDebit, compte.totalCredit );
    });

    return comptesDansDates;
  }


  regrouperTrxsParCategories(trxs: Trx[]): ItemRevenuDepense[] {

    let listeItemsRevenuDepense: ItemRevenuDepense[] = [];

    trxs.forEach(trx => {

      let itemParCategorie = listeItemsRevenuDepense.find(i => i.categorie.toLocaleLowerCase() === trx.categorie.toLocaleLowerCase());

      if (itemParCategorie === undefined) {
        itemParCategorie = new ItemRevenuDepense(trx.categorie);
        listeItemsRevenuDepense.push(itemParCategorie);

      }

      itemParCategorie.trxs.push(trx);
      itemParCategorie.trxs = this.utils.trierListeParProp<Trx>(itemParCategorie.trxs, 'date', 'DESC');

    });

    listeItemsRevenuDepense = this.utils.trierListeParProp<ItemRevenuDepense>(listeItemsRevenuDepense, 'leTotal', 'DESC');

    return listeItemsRevenuDepense;

  }

  calculerEtatFinalComptes(bilans: Bilan[], comptes: Compte[]) {

    let comptesFinaux: EtatDeCompte[] = comptes.map(c => (
      new EtatDeCompte(c.nom, c.estLePrincipal,0, new Date(), new Date())
    ));

    comptesFinaux.forEach(c => {
      let sousComptes =
        bilans.flatMap(b => b.etatComptes)
          .filter(e => e.nom === c.nom);

      c.totalDebit = sousComptes.map(sc => sc.totalDebit)
        .reduce((t1, t2) => { return t1 + t2; }, 0);
      c.itemsRevenue = this.regrouperTrxsParCategories([...c.itemsRevenue.flatMap(i => i.trxs), ...sousComptes.flatMap(sc => sc.itemsRevenue).flatMap(i => i.trxs)]);

      c.totalCredit = sousComptes.map(sc => sc.totalCredit)
        .reduce((t1, t2) => { return t1 + t2; }, 0);

      c.itemsDepenses = this.regrouperTrxsParCategories([...c.itemsDepenses.flatMap(i => i.trxs), ...sousComptes.flatMap(sc => sc.itemsDepenses).flatMap(i => i.trxs)]);

      //TODO: a calculer
     // c.soldeDepart = c.totalDebit - c.totalCredit;
    });

    return comptesFinaux;
  }

  effectuerTransfertsEntreComptes(trxsRevenues: Trx[],trxsDepenses: Trx[], comptes: Compte[], transferts: Transfert[], bilanDateDebut: Date, bilanDateFin: Date): Trx[] {

    let leComptePrincipal = comptes.find(c => c.estLePrincipal === true)!;

    const totalDebit = trxsRevenues.filter(t => t.compte.toLocaleLowerCase() === leComptePrincipal.nom.toLocaleLowerCase()
    ).map(t => t.montant)
      .reduce((t1, t2) => { return t1 + t2; }, 0);

    const totalCreditAvantTransferts = trxsDepenses.filter(t => t.compte.toLocaleLowerCase() === leComptePrincipal.nom.toLocaleLowerCase()
    ).map(t => t.montant)
      .reduce((t1, t2) => { return t1 + t2; }, 0);

    let listeTrxsDeTransferts: Trx[] = [];

    // leComptePrincipal.totalDebit += totalDebit;
    // leComptePrincipal.totalCredit += totalDebit;

    let transfertsRealises: Transfert[] = [];

    for (let index = 0; index < transferts.length; index++) {
      const transfert = transferts[index];

      // si on a 2+ transferts dans la meme periode alors on effectue seulement le plus recents selon la dateEffective
      if (transfertsRealises.find(t =>
        t.compteSource.toLocaleLowerCase() === transfert.compteSource.toLocaleLowerCase()
        && t.compteDestination.toLocaleLowerCase() === transfert.compteDestination.toLocaleLowerCase()
      ) !== undefined) {
        console.log(`transfertsRealises: ${transfert} >> Debut: ${bilanDateDebut.toLocaleDateString()}, Fin: ${bilanDateFin.toLocaleDateString()}`)
        continue;
      }

      transfertsRealises.push(transfert);

      let transfertLePlusRecent = transferts
        .filter(t => t.compteSource.toLocaleLowerCase() === transfert.compteSource.toLocaleLowerCase()
          && t.compteDestination.toLocaleLowerCase() === transfert.compteDestination.toLocaleLowerCase()
          && new Date(t.dateEffective) <= bilanDateFin)
        .sort((t1, t2) => t1.dateEffective > t2.dateEffective ? -1 : 1)
        .shift();

      if (transfertLePlusRecent === undefined) {
        continue;
      }

      let montantATransferer = ((totalDebit - totalCreditAvantTransferts) * transfertLePlusRecent.pourcentageTransfert) / 100;
      const trxsDeTranserts = Trx.effectuerTransferts(bilanDateDebut, montantATransferer, transfert.compteSource, transfert.compteDestination, transfertLePlusRecent.pourcentageTransfert);
      listeTrxsDeTransferts = listeTrxsDeTransferts.concat(trxsDeTranserts);
    }

    return listeTrxsDeTransferts;
  }
}
