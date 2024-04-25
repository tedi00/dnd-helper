import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {EnemyInitiativeService} from "../../../services/enemy-initiative.service";
import {EnemyInitiativeModel} from "../../../core/models/enemy-initiative.model";
import {MatButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-enemy-initiative-list',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './enemy-initiative-list.component.html',
  styleUrl: './enemy-initiative-list.component.scss'
})
export class EnemyInitiativeListComponent implements OnInit {
  enemyList!: EnemyInitiativeModel[];
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private enemyIService: EnemyInitiativeService
  ) {}

  ngOnInit() {
    this.enemyList = this.enemyIService.enemyInitiatives;
    this.form = this.formBuilder.group({
      enemies: this.formBuilder.array([])
    });
    this.subToEnemyList();
  }

  getEnemiesFormArray(): FormArray {
    return <FormArray>this.form.get('enemies');
  }

  subToEnemyList() {
    this.enemyIService.enemyInitiativesObservable.subscribe((enemies: EnemyInitiativeModel[]) => {
      this.enemyList = enemies;

      const enemyFormGroups = enemies.map(enemy => this.createEnemyGroup(enemy));
      const enemiesFormArray = this.getEnemiesFormArray();
      enemiesFormArray.clear();
      enemyFormGroups.forEach(group => enemiesFormArray.push(group));
    });
  }

  createEnemyGroup(enemy: EnemyInitiativeModel): FormGroup {
    return this.formBuilder.group({
      name: [enemy.name, Validators.required],
      initiative: [enemy.initiative, Validators.required],
      advantage: [enemy.advantage],
      disadvantage: [enemy.disadvantage],
    });
  }

  removeEnemy(index: number) {
    const enemies = this.getEnemiesFormArray();
    enemies.removeAt(index);
    this.onFormChange();
  }

  addEnemy(name: string, initiative = 0) {
    const enemies = this.getEnemiesFormArray();
    enemies.push(this.createEnemyGroup({name: name, initiative: initiative}));
  }

  onFormChange() {
    console.log(this.getEnemiesFormArray().value);
    this.enemyIService.enemyInitiatives = this.getEnemiesFormArray().value;
  }

}
