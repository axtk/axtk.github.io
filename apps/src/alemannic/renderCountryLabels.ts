import type { Context } from "./Context.ts";
import { getCoords } from "./getCoords.ts";

const countryLabels: [number, number, string, number?][] = [
  [46.76, 8.36, "ch", 5],
  [47.115, 9.565, "li", 0.5],
  [47.12, 10.08, "at"],
  [46.05, 9.75, "it"],
  [45.94, 8.28, "it"],
  [46.07, 6.57, "fr"],
  [47.6, 6.65, "fr"],
  [47.75, 8, "de"],
  [47.75, 9.9, "de"],
];

export function renderCountryLabels(ctx: Context) {
  let fragment = document.createDocumentFragment();

  for (let [lat, lon, code, fontSize = 2] of countryLabels) {
    let { x, y } = getCoords(ctx, lat, lon);
    let label = document.createElement("div");

    label.className = "country";
    label.dataset.code = code;
    label.textContent = code;
    label.style.fontSize = `${fontSize}rem`;
    label.style.left = `${x}%`;
    label.style.top = `${y}%`;

    fragment.appendChild(label);
  }

  document.querySelector("#map")!.appendChild(fragment);
}
