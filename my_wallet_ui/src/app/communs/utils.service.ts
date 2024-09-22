import { Injectable } from '@angular/core';

export type ORDRE_TRI = 'ASC' | 'DESC';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  genererCouleur(options?: any): string {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
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
  
}
