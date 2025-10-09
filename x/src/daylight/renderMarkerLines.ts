import type { Context } from "./Context";
import { markerSize, ns } from "./const";
import { getDimensions } from "./getDimensions";
import { getScreenPosition } from "./getScreenPosition";

function setMarkerLines(position: [number, number], id: string, ctx: Context) {
  let { width, height } = getDimensions(ctx);
  let container = ctx.element.querySelector("g.marker-lines")!;
  let lines = Array.from(container.querySelectorAll(`line[data-id="${id}"]`));

  while (lines.length < 4) {
    let line = document.createElementNS(ns, "line");
    line.setAttribute("data-id", id);
    container.appendChild(line);
    lines.push(line);
  }

  let [x, y] = getScreenPosition(position, ctx);
  let r = (markerSize[id] ?? markerSize.default) / 2;

  let coords = [
    [
      [0, y],
      [x - r, y],
    ],
    [
      [x + r, y],
      [width, y],
    ],
    [
      [x, id === "sun" ? 0 : height / 2],
      [x, y - r],
    ],
    [
      [x, y + r],
      [x, id === "sun" ? height / 2 : height],
    ],
  ];

  for (let i = 0; i < lines.length; i++) {
    let dx = coords[i][1][0] - coords[i][0][0];
    let dy = coords[i][1][1] - coords[i][0][1];

    if (dx < 1 && dy < 1) lines[i].setAttribute("class", "hidden");
    else if (lines[i].hasAttribute("class")) lines[i].removeAttribute("class");

    lines[i].setAttribute("x1", String(coords[i][0][0]));
    lines[i].setAttribute("y1", String(coords[i][0][1]));
    lines[i].setAttribute("x2", String(coords[i][1][0]));
    lines[i].setAttribute("y2", String(coords[i][1][1]));
  }
}

export function renderMarkerLines(ctx: Context) {
  let {
    tracks: { sun, moon },
  } = ctx;

  setMarkerLines(sun.position, "sun", ctx);
  setMarkerLines(moon.position, "moon", ctx);
}
