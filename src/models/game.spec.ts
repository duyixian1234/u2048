import { describe, expect, test } from "vitest";
import { Game, Board, merge } from "./game";

describe("Board", () => {
  test("should have 16 cells", () => {
    const board = new Board();
    expect(board.cells.length).toBe(16);
  });

  test("get and set column", () => {
    const board = new Board();
    board.setColumn(0, [1, 2, 3, 4]);
    expect(board.getColumn(0)).toEqual([1, 2, 3, 4]);
  });

  test("get and set row", () => {
    const board = new Board();
    board.setRow(0, [1, 2, 3, 4]);
    expect(board.getRow(0)).toEqual([1, 2, 3, 4]);
  });
});

describe("merge", () => {
  test("should merge cells", () => {
    const cells = [2, 2, 4, 4];
    expect(merge(cells)).toEqual([4, 8, 0, 0]);
    expect(merge([2, 4, 4, 2])).toEqual([2, 8, 2, 0]);
  });
});

describe("Game", () => {
  test("should have a board", () => {
    const game = new Game();
    expect(game.board).toBeDefined();
  });

  test("should generate a new cell", () => {
    const game = new Game();
    const [index, value] = game.generateNewCell();
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThanOrEqual(15);
    expect(value).toBeGreaterThanOrEqual(2);
    expect(value).toBeLessThanOrEqual(16);
    expect(game.board.cells[index]).toBe(value);
  });

  test("should have a score", () => {
    const game = new Game();
    expect(game.score).toBeDefined();
  });

  test("should judge canMove", () => {
    const game = new Game();
    game.board.setColumn(0, [2, 2, 4, 4]);
    expect(game.canMove).toBe(true);
    for (let i = 0; i < 4; i++) {
      game.board.setColumn(i, i % 2 === 0 ? [2, 4, 8, 16] : [4, 8, 16, 32]);
    }
    expect(game.canMove).toBe(false);
  });

  test("should judge win", () => {
    const game = new Game();
    game.board.setColumn(0, [2, 4, 8, 16]);
    expect(game.win).toBe(false);
    game.board.setColumn(0, [2, 4, 8, 2048]);
    expect(game.win).toBe(true);
  });

  test("should move", () => {
    const game = new Game();
    game.board.setRow(0, [2, 2, 4, 4]);
    game.move("left");
    expect(game.board.getRow(0)).toEqual([4, 8, 0, 0]);
    game.move("right");
    expect(game.board.getRow(0)).toEqual([0, 0, 4, 8]);
    game.move("down");
    expect(game.board.getRow(3)).toEqual([0, 0, 4, 8]);
    game.move("up");
    expect(game.board.getRow(0)).toEqual([0, 0, 4, 8]);
  });
});
