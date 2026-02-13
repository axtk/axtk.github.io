import type { Context } from "./Context.ts";
import { getCoords } from "./getCoords.ts";
import { initMap } from "./initMap.ts";

export function renderMarkers(ctx: Context) {
  let map = document.querySelector("#map")!;
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < ctx.markers.length; i++) {
    let { position: pos, title } = ctx.markers[i];
    let { x, y } = getCoords(ctx, pos[0], pos[1]);

    let marker = document.createElement("button");

    marker.className = "marker";
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    marker.title = title;
    marker.dataset.index = String(i);

    fragment.appendChild(marker);
  }

  map.appendChild(fragment);
  initMap(ctx);
}
