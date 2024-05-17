import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PlayerInitiativeService} from "../../../services/player-initiative.service";
import {CanvasService} from "../../../services/canvas.service";
import {PlayerInitiativeModel} from "../../../core/models/player-initiative.model";
import {CanvasCircle} from "../../../helpers/canvas-circle";
import {generateGradient, pos, genCone} from "../../../helpers/canvas-helper";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormField,
    MatInput,
    MatCheckbox
  ],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  reactiveForm: FormGroup = this.formBuilder.group({
    // you can set your form controls here, for example:
    type: new FormControl(''),
    remove: new FormControl(false)
  });
  remove = false;
  constructor(
    private _playerIService: PlayerInitiativeService,
    private _canvas: CanvasService,
    private formBuilder: FormBuilder
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

    this.reactiveForm.controls['type'].valueChanges.subscribe(() => this.generateFormBasedOnType());
    this.reactiveForm.controls['remove'].valueChanges.subscribe(val => {
      this._canvas.remove.next(val);
      console.log(val);
      console.log(this._canvas.remove);
    })
  }

  generateFormBasedOnType() {
    Object.keys(this.reactiveForm.controls).forEach(key => {
      if(key !== 'type' && key !== 'remove') {
        this.reactiveForm.removeControl(key);
      }
    })
    console.log(this.reactiveForm.controls)
    switch (this.reactiveForm.controls["type"].value) {
      case 'circle':
        this.reactiveForm.addControl('radius', new FormControl(1, Validators.min(1)))
        break;
      case 'circleSection':
        this.reactiveForm.addControl('size', new FormControl(1, Validators.min(1)));
        break;
      case 'rectangle':
        this.reactiveForm.addControl('width', new FormControl(1, Validators.min(1)));
        this.reactiveForm.addControl('height', new FormControl(1, Validators.min(1)));
        break;
      default:
        // Default case or throw error
        break;
    }
    this._canvas.shapeOption = this.reactiveForm.controls["type"].value;
  }

  ngAfterViewInit() {
    this._canvas.init(this.canvas.nativeElement);
  }

}
