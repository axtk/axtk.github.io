import type { Context } from "./Context.ts";
import { renderConstellationLabels } from "./renderConstellationLabels.ts";
import { renderGrid } from "./renderGrid.ts";
import { renderHintLines } from "./renderHintLines.ts";
import { renderStarColors } from "./renderStarColors.ts";
import { renderStarLabels } from "./renderStarLabels.ts";
import { renderStarPatterns } from "./renderStarPatterns.ts";
import { renderStars } from "./renderStars.ts";

export function render(ctx: Context) {
  ctx.element.dataset.moving = String(ctx.moving ?? "");

  renderGrid(ctx);
  renderStarColors(ctx);
  renderStars(ctx);
  renderStarLabels(ctx);
  renderStarPatterns(ctx);
  renderConstellationLabels(ctx);
  renderHintLines(ctx);
}
