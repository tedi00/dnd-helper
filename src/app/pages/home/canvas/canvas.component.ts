import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlayerInitiativeService} from "../../../services/player-initiative.service";
import {CanvasService} from "../../../services/canvas.service";
import {PlayerInitiativeModel} from "../../../core/models/player-initiative.model";
import {CanvasCircle} from "../../../helpers/canvas-circle";
import {generateGradient, pos, genCone} from "../../../helpers/canvas-helper";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;

  constructor(
    private _playerIService: PlayerInitiativeService,
    private _canvas: CanvasService
  ) {}

  ngOnInit() {
    this._playerIService.playerInitiativesObservable.subscribe((players: PlayerInitiativeModel[]) => {
      let colors = generateGradient(players.length);
      this._canvas.setElements(players.map((player, index) => new CanvasCircle({
        x: pos(index * 2 + 1),
        y: pos(1),
        r: 12.5,
        fill: colors[index],
        stroke: "black",
        key: index
      })));
      this._canvas.setElements([...this._canvas.elements, (genCone(pos(3), pos(1), pos(3), 10))])
    });
  }

  ngAfterViewInit() {
    this._canvas.init(this.canvas.nativeElement);
  }

}
