import type { Context } from "./Context.ts";
import { renderForm } from "./renderForm.ts";
import { renderResult } from "./renderResult.ts";

async function init() {
  let urlParams = new URLSearchParams(window.location.search);
  let params = {
    eg: urlParams.get("eg"),
    ge: urlParams.get("ge"),
  };

  let ctx: Context = {
    q: urlParams.get("q")?.trim() ?? "",
    eg: params.eg === "1" || (params.eg === null && params.ge === null),
    ge: params.ge === "1" || (params.eg === null && params.ge === null),
    data: {},
  };

  if (window.history) {
    let nextLocation = "";

    if (window.location.href.endsWith("?"))
      nextLocation = window.location.pathname;
    else if (ctx.q && params.eg === "1" && params.ge === "1") {
      urlParams.delete("eg");
      urlParams.delete("ge");

      nextLocation = `?${urlParams.toString()}`;
    }

    if (nextLocation) window.history.pushState(null, "", nextLocation);
  }

  renderForm(ctx);
  await renderResult(ctx);
}

init();
