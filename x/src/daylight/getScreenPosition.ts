import type { Context } from "./Context.ts";
import { latThreshold, yOffset } from "./const.ts";
import { getDimensions } from "./getDimensions.ts";

export function getScreenPosition([az, h]: [number, number], ctx: Context) {
  let { width, height } = getDimensions(ctx);

  let x = (ctx.location.lat < latThreshold ? az / 360 - 0.5 : az / 360) * width;
  let y = yOffset + (0.5 - h / 180) * (height - 2 * yOffset);

  while (x < 0) x += width;

  while (x >= width) x -= width;

  return [x, y];
}
