export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
export const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
export const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
export const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
