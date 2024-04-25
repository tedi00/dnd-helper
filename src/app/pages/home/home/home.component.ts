import {Component, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {ApiService} from "../../../core/services/api.service";
import {InitiativesService} from "../../../services/initiatives.service";
import {MatButton} from "@angular/material/button";
import {DiceService} from "../../../services/dice.service";
import {PlayerInitiativeModel} from "../../../core/models/player-initiative.model";
import {PlayerInitiativeListComponent} from "../player-initiative-list/player-initiative-list.component";
import {PlayerInitiativeService} from "../../../services/player-initiative.service";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {EnemyInitiativeListComponent} from "../enemy-initiative-list/enemy-initiative-list.component";
import {InitiativeRollerComponent} from "../initiative-roller/initiative-roller.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton,
    PlayerInitiativeListComponent,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    EnemyInitiativeListComponent,
    InitiativeRollerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  expansionPanelStep = 0;

  constructor(
    private _api: ApiService,
    private _playerIService: PlayerInitiativeService
  ) {}

  ngOnInit() {
    this.initPlayerInitiatives();
  }

  initPlayerInitiatives() {
    this._api.getPlayerInitiatives().subscribe((response: PlayerInitiativeModel[]) => {
      this._playerIService.playerInitiatives = response;
    });
  }

  setExpansionPanelStep(index: number) {
    this.expansionPanelStep = index;
  }

}
