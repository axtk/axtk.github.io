import type { Context } from "./Context.ts";
import { getStatus } from "./getStatus.ts";

let clickHandler: ((event: Event) => void) | null = null;

export function renderBoard(ctx: Context) {
  let { container, store } = ctx;
  let board = container.querySelector(".board")!;
  let cells = Array.from(board.querySelectorAll("button"));

  let status = getStatus(ctx);
  let state = store.getState();

  board.toggleAttribute("disabled", status.value !== "playing");
  board.setAttribute(
    "style",
    `--rows: ${state.rows}; --columns: ${state.columns};`,
  );

  let boardSize = state.rows * state.columns;

  if (cells.length === 0) board.innerHTML = "";

  while (cells.length < boardSize) {
    let cell = document.createElement("button");

    board.append(cell);
    cells.push(cell);
  }

  while (cells.length > boardSize) cells.pop()!.remove();

  if (clickHandler === null) {
    clickHandler = (event: Event) => {
      let target = event.target;
      let index =
        target instanceof HTMLButtonElement ? cells.indexOf(target) : -1;

      if (index === -1) return;

      store.setState((state) => ({
        ...state,
        moves: [...state.moves.slice(0, state.lastMoveIndex + 1), index],
        lastMoveIndex: state.lastMoveIndex + 1,
      }));
    };

    board.addEventListener("click", clickHandler);
  }

  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    let moveIndex = state.moves.lastIndexOf(i, state.lastMoveIndex);

    cell.toggleAttribute("disabled", moveIndex !== -1);
    cell.classList.toggle("selected", Boolean(status.win?.includes(i)));
    cell.textContent = moveIndex === -1 ? "" : state.cellValues[moveIndex % 2];
  }
}
