import type { Context } from "./Context.ts";
import type { Star } from "./Star.ts";

export function getStarOpacity(star: Star, ctx: Context) {
  if (ctx.mode === "fantasy")
    return Math.min(0.5 + 0.2 * (6.75 - star.magnitude), 1);

  return Math.min(0.2 + 0.15 * (6.75 - star.magnitude), 1);
}
