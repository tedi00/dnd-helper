import {Component, OnInit} from '@angular/core';
import {PlayerInitiativeModel} from "../../../core/models/player-initiative.model";
import {FormGroup, Validators, FormBuilder, FormArray, ReactiveFormsModule} from '@angular/forms';
import {PlayerInitiativeService} from "../../../services/player-initiative.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-player-initiative-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatCheckbox,
    MatInput,
    MatLabel,
    MatButton
  ],
  templateUrl: './player-initiative-list.component.html',
  styleUrl: './player-initiative-list.component.scss'
})
export class PlayerInitiativeListComponent implements OnInit{
  playerList!: PlayerInitiativeModel[];
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private playerIService: PlayerInitiativeService
  ) {}

  ngOnInit() {
    this.playerList = this.playerIService.playerInitiatives;
    this.form = this.formBuilder.group({
      players: this.formBuilder.array([])
    });
    this.subToPlayerList();
  }
  getPlayersFormArray(): FormArray {
    return <FormArray>this.form.get('players');
  }

  subToPlayerList() {
    this.playerIService.playerInitiativesObservable.subscribe((players: PlayerInitiativeModel[]) => {
      this.playerList = players;

      const playerFormGroups = players.map(player => this.createPlayerGroup(player));
      const playersFormArray = this.form.get('players') as FormArray;
      playersFormArray.clear();
      playerFormGroups.forEach(group => playersFormArray.push(group));
    });
  }

  createPlayerGroup(player: PlayerInitiativeModel): FormGroup {
    return this.formBuilder.group({
      name: [player.name, Validators.required],
      initiative: [player.initiative, Validators.required],
      advantage: [player.advantage],
      disadvantage: [player.disadvantage],
    });
  }

  removePlayer(index: number) {
      const players = this.form.get('players') as FormArray;
      players.removeAt(index);
      this.onFormChange();
  }

  addPlayer(name: string, initiative = 0) {
      const players = this.form.get('players') as FormArray;
      players.push(this.createPlayerGroup({name: name, initiative: initiative}));
  }

  onFormChange() {
    this.playerIService.playerInitiatives = this.getPlayersFormArray().value;
  }


}
