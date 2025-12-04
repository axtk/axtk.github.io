import type { Context } from "./Context.ts";
import { fetchData } from "./fetchData.ts";
import { hideMenu } from "./hideMenu.ts";
import { initClicks } from "./initClicks.ts";
import { initNavigation } from "./initNavigation.ts";
import { render } from "./render.ts";
import { renderForm } from "./renderForm.ts";
import { setDimensions } from "./setDimensions.ts";
import { state } from "./state.ts";

const defaultTilt: [number, number] = [
  // -.12, 0 // r .52 Ori
  // 1.2, 1.25 // r .52 UMa Umi
  1.7,
  1.05, // r .65 UMa
];

async function init() {
  let element = document.querySelector<SVGElement>("#screen svg")!;
  let data = await fetchData();
  let mode =
    (document.documentElement.dataset.mode as Context["mode"]) ||
    state.read<Context["mode"]>("mode");

  let ctx: Context = {
    ...data,
    element,
    tilt: state.read("tilt") ?? defaultTilt,
    mode,
  };

  if (document.documentElement.dataset.mode !== mode)
    document.documentElement.dataset.mode = mode;

  let resizeRaf: number | null = null;

  window.addEventListener("resize", () => {
    if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);

    resizeRaf = requestAnimationFrame(() => {
      hideMenu();
      setDimensions(ctx);
      render(ctx);
    });
  });

  setDimensions(ctx);
  renderForm(ctx);
  render(ctx);
  initNavigation(ctx);
  initClicks(ctx);

  window.sendEvent?.(["load mode", mode]);
}

init();
