import type { Context } from "./Context.ts";
import { getDimensions } from "./getDimensions.ts";
import { toBounds } from "./toBounds.ts";

const { sin, cos, asin, atan2, sqrt, PI } = Math;

export function fromScreenPosition(
  x: number,
  y: number,
  ctx: Context,
): [number, number] | null {
  let {
    tilt: [phi, theta],
  } = ctx;
  let { r, x0, y0 } = getDimensions(ctx);

  let x1 = x - x0;
  let y1 = y0 - y;
  let z1Sq = r * r - x1 * x1 - y1 * y1;

  if (z1Sq < 0) return null;

  let z1 = sqrt(z1Sq);

  // Rx(-theta)
  let x2 = x1;
  let y2 = y1 * cos(-theta) - z1 * sin(-theta);
  let z2 = y1 * sin(-theta) + z1 * cos(-theta);

  // Ry(-phi)
  let x3 = x2 * cos(-phi) + z2 * sin(-phi);
  let y3 = y2;
  let z3 = -x2 * sin(-phi) + z2 * cos(-phi);

  let alpha = toBounds(atan2(z3, x3));
  let delta = toBounds(asin(y3 / r), -PI / 2, PI / 2, true);

  return [alpha, delta];
}
