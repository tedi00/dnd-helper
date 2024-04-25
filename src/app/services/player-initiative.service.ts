import { Injectable } from '@angular/core';
import {PlayerInitiativeModel} from "../core/models/player-initiative.model";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerInitiativeService {

  players = new BehaviorSubject<PlayerInitiativeModel[]>([]);

  constructor() {}

  get playerInitiatives(): PlayerInitiativeModel[] { return this.players.getValue(); }
  set playerInitiatives(list) { this.players.next(list); }
  get playerInitiativesObservable(): Observable<PlayerInitiativeModel[]> { return this.players.asObservable(); }

  getIndex(name: string) {
    return this.playerInitiatives.findIndex((x) => x.name.toLowerCase() === name.toLowerCase());
  }
}
