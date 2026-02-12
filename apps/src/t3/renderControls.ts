import type { Context } from "./Context.ts";

let inited = false;

export function renderControls(ctx: Context) {
  if (inited) return;

  let bar = ctx.container.querySelector(".game-controls")!;

  bar.querySelector(".undo")!.addEventListener("click", () => {
    ctx.store.setState((state) => ({
      ...state,
      lastMoveIndex: state.lastMoveIndex - 1,
    }));
  });

  bar.querySelector(".clear")!.addEventListener("click", () => {
    ctx.store.setState((state) => ({
      ...state,
      moves: [],
      lastMoveIndex: -1,
    }));
  });

  inited = true;
}
