import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ItApplication } from '../models/it-application';
import { GuiCtrlComponent } from '../../gui-ctrl-component';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AppDataService {

  //private dataUrl = 'http://localhost:8000/api/data';  // URL to web api

  private dataServiceRoot: string = 'http://192.168.0.16:8080/api';
  private appsUrl: string = this.dataServiceRoot + '/applications';  // URL to web api
  private saveAppUrl: string = this.dataServiceRoot + '/applications';  // URL to web api
  private deleteAppUrl: string = this.dataServiceRoot + '/application';  // URL to web api
  guiCtrl: GuiCtrlComponent;
  
  constructor(private http: HttpClient) {}

  //TODO: find a way to use authHttp

  GetApplications(): Observable<ItApplication[]> {
    return this.http.get<ItApplication[]>(this.appsUrl)
      .pipe(
      tap(data => {

        // this.log(`fetched applications`);
        // console.log('data => '+JSON.stringify(data));

      }),
      catchError(this.handleError<ItApplication[]>('GetApplications', []))
      );
  }
  /** POST: add or update a new data to the server 
  }*/
  SaveApplication(application: ItApplication): Observable<ItApplication> {
    return this.http.post<ItApplication>(this.saveAppUrl, application, httpOptions)
      .pipe(
      tap((application: ItApplication) => this.log(`added application w/ id=${application.GetId()}`)),
      catchError(this.handleError<ItApplication>('SaveApplication'))
      );
  }


  DeleteApplication(app: ItApplication | number): Observable<ItApplication> {
    const id = typeof app === 'number' ? app : app.GetId();
    const url = `${this.deleteAppUrl}/id=${id}`;

    return this.http.delete<ItApplication>(url, httpOptions)
      .pipe(
      tap(_ => this.log(`deleted application id=${id}`)),
      catchError(this.handleError<ItApplication>('DeleteApplication'))
      );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(msg) {
    console.log("ERROR: " + msg);
    this.guiCtrl.ShowMessage(msg);
  }
}