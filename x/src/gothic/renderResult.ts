import { escapeHTML } from "stfm";
import type { Context } from "./Context";
import { search } from "./search";

export async function renderResult(ctx: Context) {
  let { q } = ctx;
  let baseDocumentTitle = document.title.split("/").at(-1)?.trim() ?? "";

  let container = document.querySelector<HTMLDivElement>(".output")!;
  let h1 = document.querySelector("h1")!;

  container.toggleAttribute("hidden", !q);

  if (!q) {
    document.title = baseDocumentTitle;
    h1.innerHTML = h1.textContent!;

    return;
  }

  document.title = `${escapeHTML(q)} / ${baseDocumentTitle}`;
  h1.innerHTML = `<a href="?">${h1.textContent}</a>`;

  let contentContainer = container.querySelector(".content")!;

  contentContainer.textContent = "Loading...";
  container.dataset.status = "loading";

  let entries = (await search(ctx))?.entries;

  if (!entries?.length) {
    let content = "No relevant entries found.";

    if (q.includes(" "))
      // 2024-08-19
      content += "<br> Try to search one word at a time.";
    else if (!ctx.eg && !ctx.ge)
      content += "<br> Try to search with at least one dictionary enabled.";
    else if (!ctx.eg || !ctx.ge)
      content += "<br> Try to search with both dictionaries enabled.";

    contentContainer.innerHTML = content;
    container.dataset.status = "warning";

    return;
  }

  let content = "";

  for (let { htmlTerm, htmlDef } of entries)
    content += `<dt>${htmlTerm}</dt>\n<dd>${htmlDef}</dd>\n`;

  contentContainer.innerHTML = `<dl>${content}</dl>`;
  container.dataset.status = "loaded";
}
