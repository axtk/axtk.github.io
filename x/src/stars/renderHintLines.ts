import type { Context } from "./Context.ts";
import { ns } from "./const.ts";
import { getScreenPosition } from "./getScreenPosition.ts";

export function renderHintLines(ctx: Context) {
  let container = ctx.element.querySelector("g.hint-lines")!;
  let paths = Array.from(container.querySelectorAll("path"));
  let fragment: DocumentFragment | null = null;

  let line: [number, number][];
  let d: string;
  let element: SVGPathElement;
  let pos: [number, number, number] | null;
  let k = 0;

  for (let i = 0; i < ctx.hintLines.length; i++) {
    line = ctx.hintLines[i];
    d = "";

    for (let point of line) {
      pos = getScreenPosition(point[0], point[1], ctx, 1);

      if (pos !== null) d += `${d ? " L" : "M"}${pos[0]},${pos[1]}`;
    }

    if (!d) continue;

    element = paths[k++];

    if (!element) {
      if (!fragment) fragment = document.createDocumentFragment();

      element = document.createElementNS(ns, "path");
      fragment.appendChild(element);
    }

    element.setAttribute("d", d);
  }

  if (fragment) container.appendChild(fragment);

  for (let i = k; i < paths.length; i++) paths[i].remove();
}
