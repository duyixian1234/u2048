const candidates = [
  ...new Array(8).fill(2),
  ...new Array(4).fill(4),
  ...new Array(2).fill(8),
  ...new Array(1).fill(16),
];

export class Game {
  private _board: Board;
  private readonly handlers = {
    left: () => this.canMoveLeft() && this.moveLeft(),
    right: () => this.canMoveRight() && this.moveRight(),
    up: () => this.canMoveUp() && this.moveUp(),
    down: () => this.canMoveDown() && this.moveDown(),
  };

  constructor() {
    this._board = new Board();
  }

  get board() {
    return this._board;
  }

  get score() {
    return this._board.cells.reduce((acc, cur) => acc + cur, 0);
  }

  get max() {
    return Math.max(...this._board.cells);
  }

  get win() {
    return this.max >= 2048;
  }

  get canMove() {
    return (
      this.canMoveLeft() ||
      this.canMoveRight() ||
      this.canMoveUp() ||
      this.canMoveDown()
    );
  }

  get canGenerateNewCell() {
    return this._board.cells.some((cell) => cell === 0);
  }

  private canMoveLeft() {
    for (let i = 0; i < 4; i++) {
      const row = this._board.getRow(i);
      if (canMerge(row)) return true;
    }
    return false;
  }

  private canMoveRight() {
    for (let i = 0; i < 4; i++) {
      const row = this._board.getRow(i);
      if (canMerge(row.reverse())) return true;
    }
    return false;
  }

  private canMoveUp() {
    for (let i = 0; i < 4; i++) {
      const column = this._board.getColumn(i);
      if (canMerge(column)) return true;
    }
    return false;
  }

  private canMoveDown() {
    for (let i = 0; i < 4; i++) {
      const column = this._board.getColumn(i);
      if (canMerge(column.reverse())) return true;
    }
    return false;
  }

  private moveLeft() {
    for (let i = 0; i < 4; i++) {
      const row = this._board.getRow(i);
      const newRow = merge(row);
      this._board.setRow(i, newRow);
      //   console.log("row:", i, row, newRow);
    }
    return true;
  }

  private moveRight() {
    for (let i = 0; i < 4; i++) {
      const row = this._board.getRow(i);
      const newRow = merge(row.reverse()).reverse();
      this._board.setRow(i, newRow);
      //   console.log("row:", i, row, newRow);
    }
    return true;
  }

  private moveUp() {
    for (let i = 0; i < 4; i++) {
      const column = this._board.getColumn(i);
      const newColumn = merge(column);
      this._board.setColumn(i, newColumn);
      //   console.log("column:", i, column, newColumn);
    }
    return true;
  }

  private moveDown() {
    for (let i = 0; i < 4; i++) {
      const column = this._board.getColumn(i);
      const newColumn = merge(column.reverse()).reverse();
      this._board.setColumn(i, newColumn);
      //   console.log("column:", i, column, newColumn);
    }
    return true;
  }

  public move(direction: "left" | "right" | "up" | "down") {
    return this.handlers[direction]();
  }

  public restart() {
    this._board = new Board();
  }

  public generateNewCell() {
    const zeroIndexes = this.board.cells
      .map((cell, index) => [cell === 0, index])
      .filter(([isZero]) => isZero)
      .map(([, index]) => index);
    const randomIndex = Math.floor(Math.random() * zeroIndexes.length);
    const index = zeroIndexes[randomIndex] as number;
    const value = candidates[Math.floor(Math.random() * candidates.length)];
    this.board.cells[index] = value * Math.max(Math.floor(this.max) / 64, 1);
    console.log("generate new cell", index, value);
    return [index, value];
  }
}

export function merge(cells: number[]): number[] {
  const newCells = [];
  let i = 0;
  while (i < cells.length) {
    if (cells[i] === 0) {
      i++;
      continue;
    }
    if (cells[i] === cells[i + 1]) {
      newCells.push(cells[i] * 2);
      i += 2;
    } else {
      newCells.push(cells[i]);
      i++;
    }
  }
  return [...newCells, ...new Array(4 - newCells.length).fill(0)];
}

function canMerge(cells: number[]) {
  return merge(cells).join("") !== cells.join("");
}

export class Board {
  private _cells: number[];
  constructor() {
    this._cells = new Array(16).fill(0);
  }

  get cells() {
    return this._cells;
  }

  public setColumn(index: number, column: number[]) {
    const newCells = [...this._cells];
    column.forEach((value, i) => {
      newCells[index + i * 4] = value;
    });
    this._cells = newCells;
  }

  public setRow(index: number, row: number[]) {
    const newCells = [...this._cells];
    row.forEach((value, i) => {
      newCells[index * 4 + i] = value;
    });
    this._cells = newCells;
  }

  public getColumn(index: number) {
    return this._cells.filter((_, i) => i % 4 === index);
  }

  public getRow(index: number) {
    return this._cells.filter((_, i) => Math.floor(i / 4) === index);
  }
}
