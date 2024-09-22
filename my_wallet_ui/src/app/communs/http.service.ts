import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { TransformDate } from './dateUtils';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private urlApi: string = '';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {

    this.urlApi = "http://localhost:5000";

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(`💥 ${operation} failed: ${error.message}`); // log to console instead



      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

 // @TransformDate
  get<T>(url: string, data?: any): Observable<T> {
    const _url = `${this.urlApi}/${url}`;

    const result = this.http.get<T>(_url)
      .pipe(catchError(this.handleError<T>('get'))
      );
    return result;
  }
  
  post<T>(url: string, data?: any): Observable<T> {
    const _url = `${this.urlApi}/${url}`;
    return this.http.post<T>(_url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError('post', data))
      );
  }
  put<T>(url: string, data?: any): Observable<T> {
    const _url = `${this.urlApi}/${url}`;
    return this.http.put<T>(_url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError('put', data))
      );
  }
}
