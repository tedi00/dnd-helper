import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {EnemyInitiativeModel} from "../core/models/enemy-initiative.model";

@Injectable({
  providedIn: 'root'
})
export class EnemyInitiativeService {
  enemies = new BehaviorSubject<EnemyInitiativeModel[]>([])
  constructor() { }

  get enemyInitiatives(): EnemyInitiativeModel[] { return this.enemies.getValue(); }
  set enemyInitiatives(list) { this.enemies.next(list); }
  get enemyInitiativesObservable(): Observable<EnemyInitiativeModel[]> { return this.enemies.asObservable(); }

  getIndex(name: string) {
    return this.enemyInitiatives.findIndex((x) => x.name.toLowerCase() === name.toLowerCase());
  }

}
