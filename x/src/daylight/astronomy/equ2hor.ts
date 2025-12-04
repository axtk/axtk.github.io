import type { GeoLocation } from "./GeoLocation.ts";
import { PolarVector } from "./PolarVector.ts";
import { Ry } from "./RotationMatrix.ts";
import { toGMST } from "./toGMST.ts";

/** Az: phi, h: theta */
export function equ2hor(
  { phi, theta }: PolarVector,
  date: Date | number | string,
  { lat, lon }: GeoLocation,
) {
  let tau = toGMST(date) + lon - phi;
  let equ = new PolarVector(tau, theta);

  return new Ry(Math.PI / 2 - lat).multiplyByVec(equ).toPolar();
}
