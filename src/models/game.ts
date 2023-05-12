const candidates = [
  ...new Array(8).fill(2),
  ...new Array(4).fill(4),
  ...new Array(2).fill(8),
  ...new Array(1).fill(16),
];

export class Game {
  private _board: Board;
  private readonly handlers = {
    left: () => this.moveLeft(),
    right: () => this.moveRight(),
    up: () => this.moveUp(),
    down: () => this.moveDown(),
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

  get win() {
    return Math.max(...this._board.cells) >= 2048;
  }

  get canMove() {
    if (this._board.cells.some((cell) => cell === 0)) return true;
    for (let i = 0; i < 4; i++) {
      const row = this._board.getRow(i);
      const column = this._board.getColumn(i);
      if (canMerge(row) || canMerge(column)) return true;
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
  }

  private moveRight() {
    for (let i = 0; i < 4; i++) {
      const row = this._board.getRow(i);
      const newRow = merge(row.reverse()).reverse();
      this._board.setRow(i, newRow);
      //   console.log("row:", i, row, newRow);
    }
  }

  private moveUp() {
    for (let i = 0; i < 4; i++) {
      const column = this._board.getColumn(i);
      const newColumn = merge(column);
      this._board.setColumn(i, newColumn);
      //   console.log("column:", i, column, newColumn);
    }
  }

  private moveDown() {
    for (let i = 0; i < 4; i++) {
      const column = this._board.getColumn(i);
      const newColumn = merge(column.reverse()).reverse();
      this._board.setColumn(i, newColumn);
      //   console.log("column:", i, column, newColumn);
    }
  }

  public move(direction: "left" | "right" | "up" | "down") {
    this.handlers[direction]();
    return true;
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

  public generateNewCell() {
    const zeroIndexes = this._cells
      .map((cell, index) => [cell === 0, index])
      .filter(([isZero]) => isZero)
      .map(([, index]) => index);
    const randomIndex = Math.floor(Math.random() * zeroIndexes.length);
    const index = zeroIndexes[randomIndex] as number;
    const value = candidates[Math.floor(Math.random() * candidates.length)];
    this._cells[index] = value;
    console.log("generate new cell", index, value);
    return [index, value];
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
