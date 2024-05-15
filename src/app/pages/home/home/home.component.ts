import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {CanvasCircle} from "../../../helpers/canvas-circle";
import {pos} from "../../../services/canvas-helper"
import {CanvasCircleSection} from "../../../helpers/canvas-circle-section";

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
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  expansionPanelStep = -1;
  constructor(
    private _api: ApiService,
    private _playerIService: PlayerInitiativeService,
    private _canvas: CanvasService
  ) {}

  ngOnInit() {
    this.initPlayerInitiatives();
    this._playerIService.playerInitiativesObservable.subscribe((players: PlayerInitiativeModel[]) => {
      let colors = this.generateGradient(players.length);
      this._canvas.setElements(players.map((player, index) => new CanvasCircle({
        x: pos(index * 2 + 1),
        y: pos(1),
        r: 12.5,
        fill: colors[index],
        stroke: "black",
        key: index
      })));

      this._canvas.setElements([...this._canvas.elements ?? [], new CanvasCircleSection({
        x: pos(3),
        y: pos(1),
        r: pos(3),
        fill: "#ec872f",
        stroke: "black",
        angle: 60,
        key: 100,
        rotation: 60
      })])
    });
  }

  ngAfterViewInit() {
    this._canvas.init(this.canvas.nativeElement);
  }

  generateGradient(n: number): string[] {
    let gradientColors = [];
    for (let i = 0; i < n; i++) {
      // Calculate the hue value
      let hue = (360 * i) / n;
      // Create the HSL color and push it to the array
      // Saturation is 100%, lightness is 50%
      gradientColors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return gradientColors;
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
