
import {Injectable} from "@angular/core";
import {DiceService} from "./dice.service";
import {PlayerInitiativeModel} from "../core/models/player-initiative.model";

@Injectable({
  providedIn: 'root'
})
export class InitiativesService {
  constructor(
    private _dice: DiceService
  ) {}

  getInitiative(data: PlayerInitiativeModel) {
    let [roll1, roll2] = this._dice.rollDn(20, 2).map(x => x + data.initiative)
    if(data.advantage && !data.disadvantage) {
      return Math.max(roll1, roll2);
    }
    if(data.disadvantage && !data.advantage) {
      return Math.min(roll1, roll2);
    }
    return [roll1, roll2][Math.floor(Math.random() * 2)];
  }

  getBaseInitiative(data: PlayerInitiativeModel) {
    let [roll1, roll2] = this._dice.rollDn(20, 2).map(x => x + data.initiative);
    return [roll1, roll2][Math.floor(Math.random() * 2)]
  }


  sortByInitiative(arr: PlayerInitiativeModel[]) {
    return arr.sort((a, b) => b.initiative - a.initiative)
  }
}
