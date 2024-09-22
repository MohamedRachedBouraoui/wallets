import { Injectable } from '@nestjs/common';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import util from 'util';
import { exec } from 'child_process';
import moment from 'moment';
// import { renderFile } from 'ejs';

import pdfParser from 'pdf-parse';
import { ORDRE_TRI } from 'src/typePersonnalises/types';


@Injectable()
export class UtilsService {




  trierListeParDate<T>(liste: any[], propriete: string, ordre: ORDRE_TRI = 'ASC'): T[] {
    let listeTriee = liste.sort((a, b) => {
      let dataA = new Date(a[propriete]);
      let dataB = new Date(b[propriete]);

      if (dataA > dataB) {
        return 1;
      } else if (dataA < dataB) {
        return -1;
      }
      return 0;
    });

    if (ordre == 'DESC')
      listeTriee = listeTriee.reverse();

    return listeTriee
  }

  trierListeParProp<T>(liste: any[], propriete: string, ordre: ORDRE_TRI = 'ASC'): T[] {
    let listeTriee = liste.sort((a, b) => {
      let valA = a[propriete];
      let valB = b[propriete];

      if (valA > valB) {
        return 1;
      } else if (valA < valB) {
        return -1;
      }
      return 0;
    });

    if (ordre == 'DESC')
      listeTriee = listeTriee.reverse();

    return listeTriee
  }



  construireChemin(...chemins) {
    return join(...chemins);
  }

  recupererFichiersDansRepertoire(repertoire: string, extention?: string): string[] {

    let liste_fichiers: string[] = [];

    readdirSync(repertoire).forEach((fichier) => {

      const chemin_fichier = resolve(repertoire, fichier);
      if (lstatSync(chemin_fichier).isFile()) {
        liste_fichiers.push(chemin_fichier);
      }
    });

    if (extention)
      liste_fichiers = liste_fichiers.filter(f => f.endsWith('.' + extention));

    console.log(`Fichiers récuperés: ${liste_fichiers.length}`);

    return liste_fichiers;
  }

  verifierSiCheminExiste(chemin_dossier) {
    return existsSync(chemin_dossier);
  }

  recurper_nom_dossier(chemin_dossier) {
    return dirname(chemin_dossier);
  }

  async ecrireDansDichierAsync(chemin_fichier_dest: string, contenu: string | Buffer) {
    await writeFile(chemin_fichier_dest, contenu);
  }

  async lireContenuFicherAsync(cheminFichier: string, encoding: BufferEncoding = 'utf-8'): Promise<string> {

    if (this.verifierExtensionFichier(cheminFichier, 'pdf')) {
      return this.lireContenuFicherPdfAsync(cheminFichier)
    }
    return readFile(cheminFichier, { encoding });
  }

  verifierExtensionFichier(cheminFichier: string, extension: string): boolean {
    return cheminFichier.endsWith(`.${extension}`);
  }

  async lireContenuFicherPdfAsync(cheminFichier: string): Promise<string> {
    let dataBuffer = await readFile(cheminFichier);
    let content = await pdfParser(dataBuffer);
    return content.text as string;

  }




  async creerFichierAsync(cheminFichier: string) {
    console.log("🚀 ~ creerFichierAsync ...");

    if (await this.verifierSiCheminExiste(cheminFichier)) {
      return;
    }

    await open(cheminFichier, 'a');

    console.log("🚀 ~ creerFichierAsync OK");
  }

  dateNow(): string {
    return moment().format('YYYY/MM/DD, HH:mm:ss');
  }

  formaterDate(dt: string): Date {
    return new Date(moment(dt).locale("fr").utc().format('YYYY/MM/DD'));

  }
  async executerCommandeAsync(cmd: string): Promise<{ stdout: any; stderr: any; }> {
    const proc = util.promisify(exec);
    return await proc(cmd);
  }

  // async genererFichierSelonTemplateAsync(chemin_template, donnes): Promise<string> {
  //   console.log(`genererFichierSelonTemplateAsync  ...`);

  //   let html = renderFile(chemin_template, donnes);


  //   console.log(`genererFichierSelonTemplateAsync OK`);
  //   return html as string;
  // }

  sleepAsync(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  estNullOuUndefined(obj: any) {
    return obj === undefined || obj === null;
  }

  recupererMaxDate(dates: Date[]) {
    return dates.reduce(function (a, b) {
      return a > b ? a : b;
    });
  }

}
