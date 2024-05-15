
export class CanvasRectangle {
  width: number;
  height: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  fill: string;
  stroke: string;
  key: number;
  rect: Path2D;

  constructor({x, y, width, height, fill, stroke, key}: {
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string,
    stroke: string,
    key: number
  }) {
    this.width = width;
    this.height = height;
    // Center point
    this.x = x;
    this.y = y;
    // Draw coordinates
    this.startX = x - width / 2;
    this.startY = y - height / 2;
    this.endX = x + width / 2;
    this.endY = y + height / 2;

    this.fill = fill;
    this.stroke = stroke;
    this.key = key;
    this.rect = new Path2D();
  }

  updateCoordinates() {
    this.startX = this.x - this.width / 2;
    this.startY = this.y - this.height / 2;
    this.endX = this.x + this.width / 2;
    this.endY = this.y + this.height / 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.updateCoordinates();
    this.rect = new Path2D();
    this.rect.rect(this.startX, this.startY, this.width, this.height);
    ctx.fillStyle = this.fill;
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.stroke;
    ctx.fill(this.rect);
    ctx.stroke(this.rect);
  }

  intersected(mousePosition: { x: number, y: number }, ctx: CanvasRenderingContext2D) {
    // let x = mousePosition.x;
    // let y = mousePosition.y;
    // return (
    //   x >= this.startX && x <= this.endX && y >= this.startY && y <= this.endY
    // );
    return ctx.isPointInPath(this.rect, mousePosition.x, mousePosition.y);
  }
}
