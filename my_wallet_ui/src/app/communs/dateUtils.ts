import { map, tap, filter } from 'rxjs/operators';
import { pipe } from 'rxjs';
import * as moment from 'moment';

export function TransformDate(target:any, key:any, descriptor:any) {
  const originalMethod = descriptor.value;
  descriptor.value  = function () {
    return originalMethod.apply(this).pipe(
      map((obj)=>Object.assign({}, obj, stringToDate(obj)))
    );
  }
  return descriptor;
}

const isDate = (s:any)=> moment(s, moment.ISO_8601, true).isValid();

function stringToDate(obj:any){
  if (!obj) {
    return;
  }
  return Object.keys(obj)
  .filter((key) => obj[key] && isDate(obj[key]))
  .map((key) => { obj[key] = moment(obj[key]).toDate()});
}
