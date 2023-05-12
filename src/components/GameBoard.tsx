import { createEffect } from "solid-js";
import { cells, score, setAction } from "../vm";
import "./GameBoard.css";

export function GameBoard() {
  createEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      switch (event.key) {
        case "ArrowUp":
          setAction("up");
          break;
        case "ArrowDown":
          setAction("down");
          break;
        case "ArrowLeft":
          setAction("left");
          break;
        case "ArrowRight":
          setAction("right");
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div class="game">
      <div class="state">
        <div class="score">{score()}</div>
      </div>
      <div class="game-board">
        {cells().map((value, index) => (
          <div class="game-cell">{value > 0 ? value : ""}</div>
        ))}
      </div>
    </div>
  );
}
