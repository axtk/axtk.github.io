import type { Context } from "./Context.ts";
import { getDimensions } from "./getDimensions.ts";
import { getScreenPosition } from "./getScreenPosition.ts";

const phaseName: Record<string, string> = {
  "0": "New",
  "50": "Full",
};

function renderLabel(id: "sun" | "moon", ctx: Context) {
  let { width } = getDimensions(ctx);
  let label = document.querySelector<HTMLElement>(`.pos[data-id="${id}"]`)!;
  let { position } = ctx.tracks[id];

  label.querySelector(".az .value")!.textContent = `${position[0].toFixed(1)}°`;
  label.querySelector(".alt .value")!.textContent =
    `${position[1].toFixed(1)}°`;

  if (id === "moon") {
    let phase = String(Math.round(ctx.tracks.moon.phase * 100) % 100);

    label.querySelector(".ph .value")!.textContent =
      `${phase}%${phaseName[phase] ? ` · ${phaseName[phase]}` : ""}`;
  } else if (id === "sun") {
    let events = ctx.tracks.sun.events.slice(0, 2);
    let content = "";

    for (let { time, type } of events) {
      let d = new Date(time);
      let t = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

      content +=
        `${content ? " " : ""}<span class="event">` +
        `<span class="type">${type === "rise" ? "Rise" : "Set"}</span> ` +
        `<span class="value">${t}</span></span>`;
    }

    label.querySelector(".events")!.innerHTML = content;
  }

  let [x] = getScreenPosition(position, ctx);
  let { width: labelWidth } = label
    .querySelector("span")!
    .getBoundingClientRect();

  label.style.setProperty("--x", `${Math.min(x - 6, width - labelWidth)}px`);
}

export function renderPositionLabels(ctx: Context) {
  renderLabel("sun", ctx);
  renderLabel("moon", ctx);
}
