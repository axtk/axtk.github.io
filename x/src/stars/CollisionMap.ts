const { floor, max } = Math;

export class CollisionMap {
  grid: Record<string, number[]> = {};
  cellSizeX: number;
  cellSizeY: number;
  constructor(cellSizeX = 50, cellSizeY?: number) {
    this.cellSizeX = cellSizeX;
    this.cellSizeY = cellSizeY ?? cellSizeX;
  }
  push(index: number, x: number, y: number) {
    let cellIndex = `${floor(x / this.cellSizeX)},${floor(y / this.cellSizeY)}`;

    if (!this.grid[cellIndex]) this.grid[cellIndex] = [];

    this.grid[cellIndex].push(index);
  }
  _getNeightborCellIndices(cellIndex: string) {
    let [cellX, cellY] = cellIndex.split(",").map(Number);
    let indices: number[] = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let cellIndices = this.grid[`${cellX + i},${cellY + j}`];

        if (cellIndices) indices.push(...cellIndices);
      }
    }

    return indices;
  }
  resolve(elements: Element[]) {
    let conflictingIndices = new Set<number>();

    for (let cellIndex of Object.keys(this.grid)) {
      let indices = this._getNeightborCellIndices(cellIndex);

      if (indices.length < 2) continue;

      for (let i of indices) {
        for (let j of indices) {
          if (
            i === j ||
            conflictingIndices.has(i) ||
            conflictingIndices.has(j) ||
            !elements[i] ||
            !elements[j]
          )
            continue;

          let ei = elements[i].getBoundingClientRect();
          let ej = elements[j].getBoundingClientRect();

          if (
            ei.left < ej.right &&
            ei.right > ej.left &&
            ei.top < ej.bottom &&
            ei.bottom > ej.top
          )
            conflictingIndices.add(max(i, j));
        }
      }
    }

    return conflictingIndices;
  }
}
