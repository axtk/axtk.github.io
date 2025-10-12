import type { Context } from "./Context";
import { getDimensions } from "./getDimensions";

const { ceil, floor, max } = Math;

export class CollisionMap {
  grid: Record<string, number[]> = {};
  cellSize: number;
  rowLength: number;
  constructor(ctx: Context, cellSize = 50) {
    let { width } = getDimensions(ctx);

    this.cellSize = cellSize;
    this.rowLength = ceil(width/cellSize);
  }
  push(index: number, x: number, y: number) {
    let cellIndex = floor(y/this.cellSize)*this.rowLength + floor(x/this.cellSize);

    if (!this.grid[cellIndex])
      this.grid[cellIndex] = [];

    this.grid[cellIndex].push(index);
  }
  _getNeightborCellIndices(cellIndex: string) {
    let indices: number[] = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let cellIndices = this.grid[String(Number(cellIndex) + i*this.rowLength + j)];

        if (cellIndices) indices.push(...cellIndices);
      }
    }

    return indices;
  }
  resolve(labels: Element[]) {
    let conflictingIndices = new Set<number>();

    for (let cellIndex of Object.keys(this.grid)) {
      let indices = this._getNeightborCellIndices(cellIndex);

      if (indices.length < 2) continue;

      for (let i of indices) {
        for (let j of indices) {
          if (
            i === j || conflictingIndices.has(i) || conflictingIndices.has(j) ||
            !labels[i] || !labels[j]
          )
            continue;
  
          let li = labels[i].getBoundingClientRect();
          let lj = labels[j].getBoundingClientRect();
  
          if (
            li.left < lj.right && li.right > lj.left &&
            li.top < lj.bottom && li.bottom > lj.top
          )
            conflictingIndices.add(max(i, j));
        }
      }
    }

    return conflictingIndices;
  }
}
