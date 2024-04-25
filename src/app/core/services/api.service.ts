import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {constants} from "../constants";
import {PlayerInitiativeModel} from "../models/player-initiative.model";
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private _http: HttpClient) {}
  url = constants.apiUrl;

  private getData<T>(path: string, params: HttpParams): Observable<T> {
    return this._http.get<T>(`${this.url + path}`, {params: params});
  }

  private postData<T>(path: string, body: any): Observable<T> {
    return this._http.post<T>(`${this.url + path}`, body);
  }

  private putData<T>(path: string, body: any): Observable<T> {
    return this._http.put<T>(`${this.url + path}`, body);
  }

  getPlayerInitiatives(): Observable<PlayerInitiativeModel[]> {
    return <Observable<PlayerInitiativeModel[]>>this._http.get('assets/players-initiatives.json');
  }
}
