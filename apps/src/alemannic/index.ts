import type { Context } from "./Context.ts";
import { loadMarkers } from "./loadMarkers.ts";
import { loadPlaces } from "./loadPlaces.ts";
import { renderMarkers } from "./renderMarkers.ts";
import { renderPlaces } from "./renderPlaces.ts";
// import { renderCountryLabels } from "./renderCountryLabels.ts";
import { transformPlaces } from "./transformPlaces.ts";

function init() {
  Promise.all([loadMarkers(), loadPlaces()]).then(([markers, rawPlaces]) => {
    let ctx: Context = {
      markers,
      places: transformPlaces({ markers }, rawPlaces),
    };

    // renderCountryLabels(ctx);
    renderPlaces(ctx);
    renderMarkers(ctx);
  });
}

init();
