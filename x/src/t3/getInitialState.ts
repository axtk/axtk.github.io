import { State } from "./State";

function charAt(s: string | null, index = 0) {
  return s ? [...s][index] : "";
}

export function getInitialState(): State {
  let searchParams = new URLSearchParams(window.location.search);

  return {
    moves: [],
    lastMoveIndex: -1,
    cellValues: [
      charAt(searchParams.get("x"), 0) || "❌",
      charAt(searchParams.get("o"), 0) || "⭕",
    ],
    rows: Number(searchParams.get("rows")) || 3,
    columns: Number(searchParams.get("columns")) || 3,
    winLength: Number(searchParams.get("win")) || 3,
  };
}
