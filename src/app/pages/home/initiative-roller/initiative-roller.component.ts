import {Component, OnInit} from '@angular/core';
import {PlayerInitiativeService} from "../../../services/player-initiative.service";
import {EnemyInitiativeService} from "../../../services/enemy-initiative.service";
import {PlayerInitiativeModel} from "../../../core/models/player-initiative.model";
import {EnemyInitiativeModel} from "../../../core/models/enemy-initiative.model";
import {JsonPipe} from "@angular/common";
import {combineLatest} from "rxjs";
import {MatButton} from "@angular/material/button";
import {InitiativesService} from "../../../services/initiatives.service";

@Component({
  selector: 'app-initiative-roller',
  standalone: true,
  imports: [
    JsonPipe,
    MatButton
  ],
  templateUrl: './initiative-roller.component.html',
  styleUrl: './initiative-roller.component.scss'
})
export class InitiativeRollerComponent implements OnInit {
  players!: PlayerInitiativeModel[];
  enemies!: EnemyInitiativeModel[];
  fullList: {name: string, initiative: number, hp: number}[] = [];
  rolledInitiatives: {name: string, initiative: number, hp?: number, advantage?: boolean, disadvantage?: boolean}[] = []
  constructor(
    private playerIService: PlayerInitiativeService,
    private enemyIService: EnemyInitiativeService,
    private initService: InitiativesService
  ) {}

  ngOnInit() {
      this.observePlayersAndEnemies();
  }

  observePlayersAndEnemies() {
    combineLatest([
      this.playerIService.playerInitiativesObservable,
      this.enemyIService.enemyInitiativesObservable
    ]).subscribe(([p, e]) => {
      this.players = p;
      this.enemies = e;
      this.fullList = [
        ...p.map(x => {return {name: x.name, initiative: x.initiative, hp: x.hp ?? -1}}),
        ...e.map(x => {return {name: x.name, initiative: x.initiative, hp: -1}})
      ];
    })
  }

  rollInitiatives() {
    let initiativeList: PlayerInitiativeModel[] = this.fullList.map(item => ({
      name: item.name,
      initiative: this.initService.getInitiative(item),
      hp: item.hp ?? -1,
      advantage: false,
      disadvantage: false
    }));
    initiativeList = this.initService.sortByInitiative(initiativeList);
    this.rolledInitiatives = initiativeList;
  }

}
