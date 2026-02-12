import { Store } from "@t8/store";
import type { Context } from "./Context.ts";
import { getInitialState } from "./getInitialState.ts";
import { renderBoard } from "./renderBoard.ts";
import { renderControls } from "./renderControls.ts";
import { renderForm } from "./renderForm.ts";
import { renderStatus } from "./renderStatus.ts";
import type { State } from "./State.ts";

function render(ctx: Context) {
  renderBoard(ctx);
  renderStatus(ctx);
  renderControls(ctx);
  renderForm(ctx);
}

function init() {
  let ctx: Context = {
    container: document.querySelector("#app")!,
    store: new Store<State>(getInitialState()),
  };

  render(ctx);

  ctx.store.onUpdate(() => {
    render(ctx);
  });
}

init();
