import type { Context } from "./Context.ts";
import { fetchData } from "./fetchData.ts";
import { renderForm } from "./renderForm.ts";
import { renderResult } from "./renderResult.ts";

async function init() {
  if (window.history) {
    if (window.location.href.endsWith("?"))
      window.history.pushState(null, "", window.location.pathname);
  }

  let data = await fetchData();

  let ctx: Context = {
    ...data,
    q: new URLSearchParams(window.location.search).get("q")?.trim() ?? "",
  };

  renderForm(ctx);
  renderResult(ctx);
}

init();
