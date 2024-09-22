import Trx from "./trx";

export default class ItemRevenuDepense {

    categorie: string;
    trxs: Trx[];
    
    pourcentage: number;

    public get leTotal(): number {
        return this.total();
    }


    constructor(categorie: string) {
        this.categorie = categorie;
        this.trxs = [];

    }

    public get trxsParDescription():{desc:string,total:number,trxs:Trx[]}[]{

       let result:{desc:string,total:number,trxs:Trx[]}[]=[];
       
        this.trxs.forEach(trx => {

            let itemParDescription = result.find(i => i.desc.toLocaleLowerCase() === trx.description.toLocaleLowerCase());
      
            if (itemParDescription === undefined) {
              itemParDescription = {desc:trx.description,total:0,trxs:[]};
              result.push(itemParDescription);
      
            }
      
            itemParDescription.trxs.push(trx);
            itemParDescription.total+=trx.montant;
      
          });

          return result;
    }
    
    total(): number {
        return this.trxs.map(t => t.montant).reduce((t1, t2) => { return t1 + t2; }, 0);
    }
}