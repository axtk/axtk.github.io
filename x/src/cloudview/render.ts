import type { Sort } from "yd-sdk";
import type { Context, InputContext } from "./Context";
import { getDescription } from "./defaults/getDescription";
import { getDisplayedDate } from "./defaults/getDisplayedDate";
import { renderItems } from "./defaults/renderItems";
import { renderNav } from "./defaults/renderNav";
import { events } from "./events";
import { fetchIndex } from "./fetchIndex";
import { fetchItems } from "./fetchItems";
import { fetchMetadata } from "./fetchMetadata";
import { i18n, lang } from "./i18n";
import { setHotkeys } from "./setHotkeys";
import { updateURL } from "./updateURL";

export async function render(options: InputContext) {
  updateURL();
  setHotkeys();

  let searchParams = new URLSearchParams(window.location.search);

  let startIndex = searchParams.get("start")?.trim();
  let k = searchParams.get("k")?.trim();
  let name = searchParams.get("name")?.trim();

  let { url, path, index, pageSize, ...otherOptions } = options;

  let urlParam = searchParams.get("url") || undefined;
  let pathParam =
    searchParams.get("path") || searchParams.get("tag") || undefined;

  let ctx: Context = {
    url: urlParam || url,
    path: urlParam ? pathParam : pathParam || path,
    index:
      searchParams
        .get("index")
        ?.split(",")
        .map((s) => {
          return s.startsWith("https://") ? { url: s } : { path: s };
        }) || index,
    sort: "-exif.date_time" as Sort,
    pageSize: pageSize ?? 60,
    startIndex: (startIndex && parseInt(startIndex, 10)) || 0,
    fileIndex: k ? parseInt(k, 10) : undefined,
    fileName: name || undefined,
    mode: document.documentElement.classList.contains("standalone")
      ? "standalone"
      : "list",
    getDisplayedDate,
    getDescription,
    renderItems,
    renderNav,
    ...otherOptions,
  };

  document.documentElement.setAttribute("lang", lang());
  document.title = i18n("title");

  if (typeof ctx.fileIndex === "number" && Number.isNaN(ctx.fileIndex))
    ctx.fileIndex = undefined;

  // some settings (like `cropPreview`) should be fetched
  // before fetching items
  await fetchMetadata(ctx);

  if (ctx.title) document.title = ctx.title;

  let [{ items, total }] = await Promise.all([
    fetchItems(ctx),
    fetchIndex(ctx),
  ]);

  document.documentElement.classList.remove("loading");

  ctx.items = items;
  ctx.total = total;

  ctx.renderItems?.(ctx);
  ctx.renderNav?.(ctx);

  events.emit("render");
}
