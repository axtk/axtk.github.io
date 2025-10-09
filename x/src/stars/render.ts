import type { Context } from "./Context";
import { renderConstellationLabels } from "./renderConstellationLabels";
import { renderGrid } from "./renderGrid";
import { renderHintLines } from "./renderHintLines";
import { renderStarColors } from "./renderStarColors";
import { renderStarLabels } from "./renderStarLabels";
import { renderStarPatterns } from "./renderStarPatterns";
import { renderStars } from "./renderStars";

export function render(ctx: Context) {
  renderGrid(ctx);
  renderStarColors(ctx);
  renderStars(ctx);
  renderStarLabels(ctx);
  renderStarPatterns(ctx);
  renderConstellationLabels(ctx);
  renderHintLines(ctx);
}
