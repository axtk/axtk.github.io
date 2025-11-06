import type { Context } from "./Context";
import type { Status } from "./Status";

export function getStatus({ store }: Context): Status {
  let { moves, lastMoveIndex, winLength, rows, columns } = store.getState();

  // Too few moves from both players for a game to end
  if (lastMoveIndex <= winLength) return { value: "playing" };

  let effectiveMoves = moves.slice(0, lastMoveIndex + 1);
  let playerMoves = effectiveMoves.filter(
    (_, i) => i % 2 === lastMoveIndex % 2,
  );

  let boardSize = rows * columns;
  let win: number[] | undefined;

  for (let index of playerMoves) {
    // axes: - 0, / 1, | 2, \ 3
    for (let axis = 0; axis < 4; axis++) {
      let dIndex = axis === 0 ? 1 : columns + axis - 2;
      let count = 0;
      let i = index - (winLength - 1) * dIndex;
      let endIndex = Math.min(boardSize, index + (winLength - 1) * dIndex);

      while (i < endIndex && count < winLength) {
        if (i >= 0) {
          if (playerMoves.includes(i)) count++;
          else count = 0;
        }

        let row = Math.floor(i / columns);
        let column = i - row * columns;

        i += dIndex;

        let nextRow = Math.floor(i / columns);
        let nextColumn = i - nextRow * columns;

        if (axis === 0 && nextRow !== row) break;

        if (axis === 1 && (nextRow !== row + 1 || nextColumn !== column - 1))
          break;

        if (axis === 2 && nextColumn !== column) break;

        if (axis === 3 && (nextRow !== row + 1 || nextColumn !== column + 1))
          break;
      }

      if (count === winLength) {
        win = [];

        for (let k = 0; k < winLength; k++) win.push(i - (k + 1) * dIndex);

        return { value: "win", win };
      }
    }
  }

  // No win, no more moves
  if (effectiveMoves.length === boardSize) return { value: "draw" };

  return { value: "playing" };
}
