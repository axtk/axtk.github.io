import type { Context } from "./Context.ts";
import { deselectMarkers } from "./deselectMarkers.ts";
import { renderPlaylist } from "./renderPlaylist.ts";
import { stopAudio } from "./stopAudio.ts";

// Click region
let dx = 0;
let dy = 0;

let inited = false;

export function initMap(ctx: Context) {
  if (inited) return;

  let map = document.querySelector<HTMLElement>("#map")!;

  map.addEventListener("click", ({ clientX: x0, clientY: y0 }) => {
    stopAudio();
    deselectMarkers();

    let markers = Array.from(map.querySelectorAll<HTMLElement>(".marker"));

    let selectedMarkers = markers.filter((marker) => {
      let { left, right, top, bottom } = marker.getBoundingClientRect();

      return (
        x0 > left - dx && x0 < right + dx && y0 > top - dy && y0 < bottom + dy
      );
    });

    for (let marker of selectedMarkers)
      window.sendEvent?.([
        "click_marker",
        String(marker.getAttribute("title")),
      ]);

    renderPlaylist(ctx, selectedMarkers);
  });

  document.addEventListener("click", (event) => {
    if (
      !(event.target instanceof HTMLElement) ||
      !event.target.closest("#map, button.close")
    )
      renderPlaylist(ctx, null);
  });

  inited = true;
}
