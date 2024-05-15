import {Injectable} from '@angular/core';
import {GridCanvas} from "../helpers/grid-canvas";

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  canvas: GridCanvas | undefined;
  constructor() {}

  init(canvasEl: HTMLCanvasElement) {
    this.canvas = new GridCanvas(canvasEl);
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


}
