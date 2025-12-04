import type { Context } from "./Context.ts";
import { type FormInput, getFormInput } from "./getFormInput.ts";
import { getTracks } from "./getTracks.ts";
import { isValidFormInput } from "./isValidFormInput.ts";
import { renderDirections } from "./renderDirections.ts";
import { renderForm } from "./renderForm.ts";
import { renderGrid } from "./renderGrid.ts";
import { renderHorizon } from "./renderHorizon.ts";
import { renderMarkerLines } from "./renderMarkerLines.ts";
import { renderMarkers } from "./renderMarkers.ts";
import { renderMoonPhase } from "./renderMoonPhase.ts";
import { renderPositionLabels } from "./renderPositionLabels.ts";
import { renderTracks } from "./renderTracks.ts";
import { setDimensions } from "./setDimensions.ts";

type Timeout = ReturnType<typeof setTimeout>;

let renderTimeout: Timeout | null = null;
let formInput: FormInput | null = null;

function render(repeat?: boolean) {
  if (!formInput) {
    renderForm();
    formInput = getFormInput();

    if (!isValidFormInput(formInput)) {
      document.documentElement.classList.add("error");
      return;
    }
  }

  let ctx: Context = {
    ...formInput,
    element: document.querySelector<SVGElement>("#screen svg")!,
    tracks: getTracks(formInput.location, formInput.time),
  };

  setDimensions(ctx);
  renderHorizon(ctx);
  renderGrid(ctx);
  renderDirections(ctx);
  renderTracks(ctx);
  renderMarkers(ctx);
  renderMarkerLines(ctx);
  renderPositionLabels(ctx);
  renderMoonPhase(ctx);

  if (repeat && !formInput.time) {
    if (renderTimeout !== null) clearTimeout(renderTimeout);

    renderTimeout = setTimeout(() => render(true), 15000);
  }
}

function init() {
  let resizeTimeout: Timeout | null = null;

  window.addEventListener("resize", () => {
    if (resizeTimeout !== null) clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => render(), 200);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") render(true);
    else if (renderTimeout !== null) clearTimeout(renderTimeout);
  });

  render(true);
  document.documentElement.classList.remove("loading");
}

init();
