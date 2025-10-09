import type { Context } from "./Context";
import { ns } from "./const";
import { getScreenPosition } from "./getScreenPosition";
import { getStarOpacity } from "./getStarOpacity";
import { getStarRadius } from "./getStarRadius";
import type { Star } from "./Star";

export function renderStars(ctx: Context) {
  let container = ctx.element.querySelector("g.stars")!;
  let starElements = Array.from(container.querySelectorAll("circle"));
  let fragment: DocumentFragment | null = null;

  let star: Star;
  let element: SVGCircleElement;
  let pos: [number, number, number] | null;
  let k = 0;

  for (let i = 0; i < ctx.stars.length; i++) {
    star = ctx.stars[i];
    pos = getScreenPosition(star.ra, star.dec, ctx);

    if (pos === null) continue;

    element = starElements[k++];

    if (!element) {
      if (!fragment) fragment = document.createDocumentFragment();

      element = document.createElementNS(ns, "circle");
      fragment.appendChild(element);
    }

    element.setAttribute("cx", pos[0].toFixed(3));
    element.setAttribute("cy", pos[1].toFixed(3));
    element.setAttribute("r", getStarRadius(star, ctx).toFixed(2));
    element.setAttribute("fill-opacity", getStarOpacity(star, ctx).toFixed(2));
    element.setAttribute("data-spcl", star.spectralClass ?? "");
  }

  if (fragment) container.appendChild(fragment);

  for (let i = k; i < starElements.length; i++) starElements[i].remove();
}
