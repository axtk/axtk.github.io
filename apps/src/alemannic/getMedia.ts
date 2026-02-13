import type { Context } from "./Context.ts";
import { escapeHTML } from "./escapeHTML.ts";

export function getMedia(ctx: Context, markers: HTMLElement[]) {
  let fragment = document.createDocumentFragment();

  for (let marker of markers) {
    let k = Number(marker.dataset.index);
    let metadata = ctx.markers[k];

    if (!metadata) continue;

    if (metadata.title) {
      let title = document.createElement("div");

      title.className = "item-title";
      title.textContent = metadata.title;

      fragment.appendChild(title);
    }

    for (let { title, author, url, source } of metadata.resources) {
      let element = document.createElement("figure");

      element.innerHTML =
        `<figcaption class="title">` +
        `<span class="title-content">${escapeHTML(title)}</span> ` +
        `<span class="author">${escapeHTML(author)}</span></figcaption>` +
        `<audio controls src="${url}"></audio>` +
        `<figcaption class="source">Source: ${escapeHTML(source)}</figcaption>`;

      fragment.appendChild(element);
    }
  }

  return fragment;
}
