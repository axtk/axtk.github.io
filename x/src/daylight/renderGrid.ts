import type { Context } from "./Context";
import { ns } from "./const";
import { getDimensions } from "./getDimensions";
import { getScreenPosition } from "./getScreenPosition";

export function renderGrid(ctx: Context) {
  let { width, height } = getDimensions(ctx);
  let container = ctx.element.querySelector("g.grid")!;
  let lines = Array.from(container.querySelectorAll("line"));
  let k = 0;

  for (let h = -90; h <= 90; h += 30) {
    let line = lines[k++];
    let y = getScreenPosition([0, h], ctx)[1];

    if (!line) {
      line = document.createElementNS(ns, "line");
      container.appendChild(line);
    }

    line.setAttribute("x1", "0");
    line.setAttribute("y1", String(y));
    line.setAttribute("x2", String(width));
    line.setAttribute("y2", String(y));
    line.setAttribute("data-alt", String(h));
  }

  for (let az = 30; az < 360; az += 30) {
    let line = lines[k++];
    let x = getScreenPosition([az, 0], ctx)[0];

    if (!line) {
      line = document.createElementNS(ns, "line");
      container.appendChild(line);
    }

    line.setAttribute("x1", String(x));
    line.setAttribute("y1", "0");
    line.setAttribute("x2", String(x));
    line.setAttribute("y2", String(height));
  }

  for (let i = k; i < lines.length; i++) lines[i].remove();
}
