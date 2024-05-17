interface IGridSize {
  width: number;
  height: number;
}

interface IMousePosition {
  x: number;
  y: number;
}

interface IFocusedElement {
  key: number;
  state: boolean;
}

export class GridCanvas {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mousePosition: IMousePosition;
  isMouseDown: boolean;
  isDragged: boolean;
  gridSpacing: number;
  gridSize: IGridSize;
  clickFn: Function;
  elements: any[];
  focused: IFocusedElement;

  constructor(canvas: HTMLCanvasElement, gridSpacing = 25, clickFn: Function = () => {}) {
    this.canvasElement = canvas;
    this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    this.mousePosition = {x: 0, y: 0};
    this.isMouseDown = false;
    this.isDragged = false;
    this.gridSpacing = gridSpacing;
    this.gridSize = {
      width: canvas.parentElement!.offsetWidth,
      height: canvas.parentElement!.offsetHeight
    }
    this.clickFn = clickFn;
    // Elements added should have a unique key
    // and draw(ctx) and intersected(mousePos: {x, y}) methods
    this.elements = [];
    this.focused = {key: 0, state: false};
    this.#prepareCanvas();
    this.#setDefaultValues();
    this.#addEventListeners();
    this.redrawCanvas();
  }

  #prepareCanvas() {
    // Canvas size depends on maximum number of squares it can display
    // +1 for the last black line to be drawn
    this.canvasElement.width = this.gridSpacing * Math.floor(this.gridSize.width / this.gridSpacing) + 1;
    this.canvasElement.height = this.gridSpacing * Math.floor(this.gridSize.height / this.gridSpacing) + 1;
  }

  #setDefaultValues() {
    // Canvas grid line values
    this.ctx.fillStyle = "black";
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "round";
  }

  #addEventListeners() {
    this.canvasElement.addEventListener('mousedown', () => {
      this.isMouseDown = true;
      this.isDragged = true;
      setTimeout(() => {this.isDragged = false}, 250)
    });
    this.canvasElement.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.#releaseFocus();
    });
    this.canvasElement.addEventListener('mousemove', (e) => {
      this.#dragElement(e);
    });
    this.canvasElement.addEventListener('click', (e) => {
      this.getIntersected(e);
      if(this.isDragged) {
        this.clickFn(e, this);
      }
      this.#releaseFocus();
    });
    this.canvasElement.addEventListener('wheel', (e) => {
      this.#rotateElement(e);
    })
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.gridSize.width, this.gridSize.height);
  }

  setClickFn(f: Function) {
    this.clickFn = f;
  }

  #drawGrid() {
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= this.gridSize.width; x += this.gridSpacing) {
      this.ctx.moveTo(0.5 + x, 0);
      this.ctx.lineTo(0.5 + x, this.gridSize.height);
    }

    for (let x = 0; x <= this.gridSize.height; x += this.gridSpacing) {
      this.ctx.moveTo(0, 0.5 + x);
      this.ctx.lineTo(this.gridSize.width, 0.5 + x);
    }
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
  }

  #drawElements() {
    this.elements.sort((a, b) => {
      if (a.circle && !b.circle) return -1;
      if (!a.circle && b.circle) return 1;
      if (a.rect && !b.rect) return -1;
      if (!a.rect && b.rect) return 1;
      if (a.circleSection && !b.circleSection) return -1;
      if (!a.circleSection && b.circleSection) return 1;
      return 0;
    });
    for (let i = this.elements.length - 1; i >= 0; i--) {
      if (typeof this.elements[i]['draw'] === 'function') {
        this.elements[i]['draw'](this.ctx);
      }
    }
  }

  #getClosestAnchorPoint(x: number, y: number) {
    const xSplit = (x / this.gridSpacing).toString().split(".");
    const ySplit = (y / this.gridSpacing).toString().split(".");
    let anchorPoint = {
      x: 0,
      y: 0
    }
    if (xSplit[1] && parseInt(xSplit[1].charAt(0)) >= 5) {
      anchorPoint.x = (parseInt(xSplit[0]) + 1) * this.gridSpacing - 12.5;
    } else {
      anchorPoint.x = parseInt(xSplit[0]) * this.gridSpacing + 12.5;
    }
    if (ySplit[1] && parseInt(ySplit[1].charAt(0)) >= 5) {
      anchorPoint.y = (parseInt(ySplit[0]) + 1) * this.gridSpacing - 12.5;
    } else {
      anchorPoint.y = parseInt(ySplit[0]) * this.gridSpacing + 12.5;
    }
    return anchorPoint;
  }

  getIntersected(e: MouseEvent) {
    this.#getMousePosition(e);
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i]['intersected'](this.mousePosition, this.ctx)) {
        this.focused.key = this.elements[i]['key'];// circles.move(i, 0);
        this.focused.state = true;
        break;
      }
    }
  }

  deleteElement(e: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }
    this.#getMousePosition(e);
    //if any circle is focused
    if (this.focused.state) {
      const focusedElement = this.elements.findIndex(el => el['key'] === this.focused.key);
      if(focusedElement >= 0) {
        this.elements.splice(focusedElement, 1);
      }
      this.redrawCanvas();
      return;
    }
  }

  #dragElement(e: MouseEvent) {
    if (!this.isMouseDown) {
      return;
    }
    this.#getMousePosition(e);
    const anchorPos = this.#getClosestAnchorPoint(this.mousePosition.x, this.mousePosition.y);
    //if any circle is focused
    if (this.focused.state) {
      const focusedElement = this.elements.find(el => el['key'] === this.focused.key);
      focusedElement.x = anchorPos.x;
      focusedElement.y = anchorPos.y;
      this.redrawCanvas();
      return;
    }
    //no circle currently focused check if circle is hovered
    this.getIntersected(e);
    this.redrawCanvas();
  }
  #rotateElement(e: WheelEvent) {
    e.preventDefault();
    this.#getMousePosition(e);
    const dir = (e.deltaY > 0) ? 1 : -1;
    const focusedElement = this.elements.find(el => el['key'] === this.focused.key);
    if(focusedElement.intersected(this.mousePosition, this.ctx) && focusedElement['rotation'] != null) {
      focusedElement['rotation'] = focusedElement['rotation'] + (22.5 * dir);
      if(focusedElement['rotation'] > 360) {
        focusedElement['rotation'] -= 360;
      }
      if(focusedElement['rotation'] === -180) {
        focusedElement['rotation'] = 180;
      }
      this.redrawCanvas();
    }
  }

  #releaseFocus() {
    this.focused.state = false;
  }

  #getMousePosition(e: {x: number, y: number}) {
    let rect = this.canvasElement.getBoundingClientRect();
    this.mousePosition = {
      x: Math.round(e.x - rect.left),
      y: Math.round(e.y - rect.top)
    }
  }

  getContext() {
    return this.ctx;
  }

  getElements() {
    return this.elements;
  }
  setElements(elements: any[]) {
    this.elements = elements;
    this.redrawCanvas();
  }

  redrawCanvas() {
    this.clearCanvas();
    this.#drawElements();
    this.#drawGrid();
  }
}
