import {CanvasCircleSection} from "../helpers/canvas-circle-section";

export function pos(num: number) {
  return num * 25 + 12.5;
}

let generatedColors = new Set();

export function generateUniquePastelColor(): string {
  let color;
  do {
    color = generatePastelColor();
  } while (generatedColors.has(color));

  generatedColors.add(color);
  return color;
}

function generatePastelColor(): string {
  const r = (Math.round(Math.random() * 127) + 127).toString(16);
  const g = (Math.round(Math.random() * 127) + 127).toString(16);
  const b = (Math.round(Math.random() * 127) + 127).toString(16);

  return '#' + r.padStart(2, '0') + g.padStart(2, '0') + b.padStart(2, '0');
}

function genCone(x: number, y: number, r: number, key: number) {
  return new CanvasCircleSection({
    x: x,
    y: y,
    r: r,
    fill: '#ec872f',
    stroke: 'black',
    angle: 60,
    key: key,
    rotation: 60
  });
}
