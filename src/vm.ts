import { createEffect, createSignal } from "solid-js";
import { Game } from "./models/game";

export const game = new Game();

export type Action = "left" | "right" | "up" | "down";

export const [cells, setCells] = createSignal<number[]>(game.board.cells);
export const [action, setAction] = createSignal<Action>();
export const [step, setStep] = createSignal(0);
export const [score, setScore] = createSignal(0);

createEffect(() => {
  if (!action()) {
    if (step() === 0) {
      for (let i = 0; i < 4; i++) {
        game.board.generateNewCell();
      }
      setCells(game.board.cells.slice());
      setScore(game.score);
    }
    return;
  }
  console.log("step:", step());
  game.move(action()!);
  game.board.generateNewCell();
  setCells(game.board.cells.slice());
  setScore(game.score);
  setAction(undefined);
  setStep(step() + 1);
});

createEffect(() => {});
