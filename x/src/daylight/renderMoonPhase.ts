import type { Context } from "./Context";
import { markerSize, ns } from "./const";
import { getScreenPosition } from "./getScreenPosition";

const d = markerSize.moon ?? markerSize.default;
const r = d / 2;

/* axtk 2020, 2025-06 (ts, gh pages) */
export function renderMoonPhase(ctx: Context) {
  let container = ctx.element.querySelector("g.markers")!;
  let element = container.querySelector('[data-id="moon-phase"]');

  if (!element) {
    element = document.createElementNS(ns, "svg");
    element.setAttribute("data-id", "moon-phase");
    element.setAttribute("viewBox", `0 0 ${d} ${d}`);
    element.setAttribute("width", String(d));
    element.setAttribute("height", String(d));
    container.appendChild(element);
  }

  let arcs = element.querySelector("path");

  if (!arcs) {
    arcs = document.createElementNS(ns, "path");
    arcs.setAttribute("class", "phase-shadow");
    element.appendChild(arcs);
  }

  let { position, phase } = ctx.tracks.moon;

  if (phase >= 1) phase -= 1;

  let quarter = Math.floor(phase / 0.25);
  let dr = r * ((phase % 0.25) / 0.25);
  let rx1: number, rx2: number, dir1: number, dir2: number;

  switch (quarter) {
    case 0:
      rx1 = r;
      dir1 = 1;
      rx2 = r - dr;
      dir2 = 1;
      break;
    case 1:
      rx1 = r;
      dir1 = 1;
      rx2 = dr;
      dir2 = 0;
      break;
    case 2:
      rx1 = r - dr;
      dir1 = 0;
      rx2 = r;
      dir2 = 1;
      break;
    default:
      rx1 = dr;
      dir1 = 1;
      rx2 = r;
      dir2 = 1;
  }

  arcs.setAttribute(
    "d",
    `M ${r},${d} ` +
      `A ${rx1} ${r} 180 0 ${dir1} ${r},0 ` +
      `A ${rx2} ${r} 180 0 ${dir2} ${r},${d}`,
  );

  let [x, y] = getScreenPosition(position, ctx);

  element.setAttribute("x", String(x - r));
  element.setAttribute("y", String(y - r));
}
