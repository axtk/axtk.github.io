import { CollisionMap } from "./CollisionMap";
import type { Context } from "./Context";
import { ns } from "./const";
import { getDimensions } from "./getDimensions";
import { getScreenPosition } from "./getScreenPosition";
import { getStarRadius } from "./getStarRadius";
import type { Star } from "./Star";

export function renderStarLabels(ctx: Context) {
  let { r } = getDimensions(ctx);
  let maxMagnitude = r < 640 ? 3 : 4;

  let container = ctx.element.querySelector("g.star-labels")!;
  let labels = Array.from(container.querySelectorAll("text"));
  let fragment: DocumentFragment | null = null;

  let star: Star;
  let element: SVGTextElement;
  let pos: [number, number, number] | null;
  let k = 0;

  let collisionMap = new CollisionMap();

  for (let i = 0; i < ctx.stars.length; i++) {
    star = ctx.stars[i];

    if (!star.bayerKey) continue;
    if (star.magnitude > maxMagnitude) break;

    pos = getScreenPosition(star.ra, star.dec, ctx);

    if (pos === null) continue;

    element = labels[k];

    if (!element) {
      if (!fragment) fragment = document.createDocumentFragment();

      element = document.createElementNS(ns, "text");
      fragment.appendChild(element);
      labels.push(element);
    }

    let r = getStarRadius(star, ctx);
    let x = pos[0] + r + 2;
    let y = pos[1] + 2;

    collisionMap.push(k, x, y);

    element.setAttribute("x", x.toFixed(3));
    element.setAttribute("y", y.toFixed(3));
    element.textContent = star.bayerKey;
    k++;
  }

  if (fragment) container.appendChild(fragment);

  let conflictingIndices = collisionMap.resolve(labels);

  for (let i = k; i < labels.length; i++) labels[i].remove();

  for (let i of conflictingIndices) labels[i]?.remove();
}
