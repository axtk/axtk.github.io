import { ARCS, MJD_J2000 } from "../const.ts";
import { frac } from "../frac.ts";
import { PolarVector } from "../PolarVector.ts";
import { toMJD } from "../toMJD.ts";

const { sin } = Math;
const pi2 = 2 * Math.PI;

export function getEclipticalCoordinates(date: Date | number | string) {
  let T = (toMJD(date) - MJD_J2000) / 36525;

  let L0 = frac(0.606433 + 1336.855225 * T);
  let l = pi2 * frac(0.374897 + 1325.55241 * T);
  let ls = pi2 * frac(0.993133 + 99.997361 * T);
  let D = pi2 * frac(0.827361 + 1236.853086 * T);
  let F = pi2 * frac(0.259086 + 1342.227825 * T);

  let dL =
    22640 * sin(l) -
    4586 * sin(l - 2 * D) +
    2370 * sin(2 * D) +
    769 * sin(2 * l) -
    668 * sin(ls) -
    412 * sin(2 * F) -
    212 * sin(2 * l - 2 * D) -
    206 * sin(l + ls - 2 * D) +
    192 * sin(l + 2 * D) -
    165 * sin(ls - 2 * D) -
    125 * sin(D) -
    110 * sin(l + ls) +
    148 * sin(l - ls) -
    55 * sin(2 * F - 2 * D);

  let S = F + (dL + 412 * sin(2 * F) + 541 * sin(ls)) / ARCS;
  let h = F - 2 * D;
  let N =
    -526 * sin(h) +
    44 * sin(l + h) -
    31 * sin(-l + h) -
    23 * sin(ls + h) +
    11 * sin(-ls + h) -
    25 * sin(-2 * l + F) +
    21 * sin(-l + F);

  let ecl = new PolarVector(
    pi2 * frac(L0 + dL / 1296e3),
    (18520 * sin(S) + N) / ARCS,
  );

  return ecl;
}
