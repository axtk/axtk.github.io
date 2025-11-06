import { Store } from "@t8/store";
import { Context } from "./Context";
import { renderBoard } from "./renderBoard";
import { State } from "./State";
import { renderStatus } from "./renderStatus";
import { renderGameControls } from "./renderGameControls";
import { getInitialState } from "./getInitialState";
import { renderForm } from "./renderForm";

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
