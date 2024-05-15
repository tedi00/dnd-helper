import {CanvasCircleSection} from "./canvas-circle-section";

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

export function genCone(x: number, y: number, r: number, key: number) {
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

export function generateGradient(n: number): string[] {
  let gradientColors = [];
  for (let i = 0; i < n; i++) {
    // Calculate the hue value
    let hue = (360 * i) / n;
    // Create the HSL color and push it to the array
    // Saturation is 100%, lightness is 50%
    gradientColors.push(`hsl(${hue}, 100%, 50%)`);
  }
  return gradientColors;
}
