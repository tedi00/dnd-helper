import {Injectable} from '@angular/core';
import {GridCanvas} from "../helpers/grid-canvas";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  canvas: GridCanvas | undefined;
  shapeOption: '' | 'circle' | 'circleSection' | 'rectangle';
  remove = new BehaviorSubject(false);
  constructor() {
    this.shapeOption = '';
  }

  init(canvasEl: HTMLCanvasElement, clickFn: Function = () => {}) {
    this.canvas = new GridCanvas(canvasEl, 25, clickFn);
    this.setFn('');
    this.remove.next(false);
  }

  setElements(elements: any[]) {
    this.canvas?.setElements(elements);
  }

  getContext() {
    return this.canvas?.getContext();
  }

  get elements(): any[] {
    return this.canvas?.getElements() ?? [];
  }

  setFn(option: string) {
    this.canvas?.setClickFn(this.addNewObjectAtPoint)
  }

  addNewObjectAtPoint(e: MouseEvent, x: GridCanvas) {
    // TODO: add remove and shapeOption to GridCanvas
  }

}
