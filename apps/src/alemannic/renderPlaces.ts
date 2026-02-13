import type { Context } from "./Context.ts";

const nameMap: Record<string, string> = {
  Geneva: "Genève",
  Lucerne: "Luzern",
  Vienna: "Wien",
};

export function renderPlaces({ places }: Context) {
  let map = document.querySelector("#map")!;
  let fragment = document.createDocumentFragment();

  for (let { city: name, x, y } of places) {
    // let {x, y} = getCoords(Number(lat), Number(lng));
    let label = document.createElement("div");

    label.className = "place";
    label.textContent = nameMap[name] || name;
    label.style.left = `${x}%`;
    label.style.top = `${y}%`;

    fragment.appendChild(label);
  }

  map.appendChild(fragment);
}
