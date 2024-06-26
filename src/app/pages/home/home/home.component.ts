import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../core/services/api.service";
import {MatButton} from "@angular/material/button";
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
import {CanvasService} from "../../../services/canvas.service";
import {CanvasComponent} from "../canvas/canvas.component";

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
    InitiativeRollerComponent,
    CanvasComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  expansionPanelStep = -1;
  constructor(
    private _api: ApiService,
    private _playerIService: PlayerInitiativeService,
    private _canvas: CanvasService
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
