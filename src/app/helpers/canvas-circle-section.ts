
export class CanvasCircleSection {
  rotation: number;
  angle: number;
  startingAngle: number;
  endAngle: number;
  x: number;
  y: number;
  r: number;
  fill: string;
  stroke: string;
  key: number;
  circleSection: Path2D;
  constructor({x, y, r, fill, stroke, angle, key, rotation = 0}: {
    x: number,
    y: number,
    r: number,
    fill: string,
    stroke: string,
    angle: number,
    key: number,
    rotation: number}) {
    this.rotation = rotation;
    this.angle = angle;
    this.startingAngle = this.toRad(rotation);
    this.endAngle = this.toRad(angle) + this.toRad(rotation);

    this.x = x;
    this.y = y;
    this.r = r;

    this.fill = fill;
    this.stroke = stroke;
    this.key = key;

    this.circleSection = new Path2D();
  }

  updateCoordinates() {
    this.startingAngle = this.toRad(this.rotation);
    while (this.startingAngle > 2 * Math.PI) {
      this.startingAngle = this.startingAngle - 2 * Math.PI;
    }
    this.endAngle = this.toRad(this.angle) + this.toRad(this.rotation);
    while (this.endAngle > 2 * Math.PI) {
      this.endAngle = this.endAngle - 2 * Math.PI;
    }
    while (this.endAngle < this.startingAngle) {
      this.startingAngle = this.startingAngle - 2 * Math.PI;
    }
  }

  toRad(deg: number) {
    return deg * (Math.PI / 180);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.updateCoordinates();
    this.circleSection = new Path2D();
    this.circleSection.moveTo(this.x, this.y);
    this.circleSection.arc(this.x, this.y, this.r, this.startingAngle, this.endAngle);
    this.circleSection.lineTo(this.x, this.y);
    ctx.fillStyle = this.fill;
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.stroke;
    ctx.fill(this.circleSection);
    ctx.stroke(this.circleSection);
  }

  intersected(mousePosition: { x: number, y: number }, ctx: CanvasRenderingContext2D) {
    return ctx.isPointInPath(this.circleSection, mousePosition.x, mousePosition.y);
  }

}
