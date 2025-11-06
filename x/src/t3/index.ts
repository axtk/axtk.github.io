import { Store } from "@t8/store";
import type { Context } from "./Context";
import { getInitialState } from "./getInitialState";
import { renderBoard } from "./renderBoard";
import { renderForm } from "./renderForm";
import { renderGameControls } from "./renderGameControls";
import { renderStatus } from "./renderStatus";
import type { State } from "./State";

function render(ctx: Context) {
  renderBoard(ctx);
  renderStatus(ctx);
  renderGameControls(ctx);
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
