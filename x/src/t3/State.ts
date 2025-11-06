export type State = {
  moves: number[];
  lastMoveIndex: number;
  cellValues: [string, string];
  rows: number;
  columns: number;
  winLength: number;
};
