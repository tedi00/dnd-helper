export class CanvasCircle {
  startingAngle: number;
  endAngle: number;
  x: number;
  y: number;
  r: number;
  fill: string;
  stroke: string;
  key: number;
  circle: Path2D;

  constructor({x, y, r, fill, stroke, key}: {
    x: number,
    y: number,
    r: number,
    fill: any,
    stroke: any,
    key: number
  }) {
    this.startingAngle = 0;
    this.endAngle = 2 * Math.PI;
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = fill;
    this.stroke = stroke;
    this.key = key;
    this.circle = new Path2D();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.circle = new Path2D(); // Reset the path
    this.circle.arc(this.x, this.y, this.r, this.startingAngle, this.endAngle);
    ctx.fillStyle = this.fill;
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.stroke;
    ctx.fill(this.circle);
    ctx.stroke(this.circle);
  }

  intersected(mousePosition: { x: number, y: number }, ctx: CanvasRenderingContext2D) {
    return ctx.isPointInPath(this.circle, mousePosition.x, mousePosition.y);
  }
}
