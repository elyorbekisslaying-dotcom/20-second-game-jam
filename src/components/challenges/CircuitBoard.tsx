import { useEffect, useMemo, useState } from "react";
import { audio } from "@/game/audio";
import { generateCircuit, rotateMask, trace, W, type CircuitPuzzle } from "@/game/circuit";
import { palette } from "@/game/palette";
import { PixelText } from "@/components/PixelText";
import { useGameStore } from "@/components/game-context";

type Props = {
  frozen: boolean;
  onComplete: () => void;
};

function WireFace({ mask, hot }: { mask: number; hot: boolean }) {
  const cells: boolean[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      let lit = false;
      if (r === 2 && c === 2) lit = mask !== 0;
      if (c === 2 && r < 2) lit = (mask & 1) !== 0;
      if (c === 2 && r > 2) lit = (mask & 4) !== 0;
      if (r === 2 && c > 2) lit = (mask & 2) !== 0;
      if (r === 2 && c < 2) lit = (mask & 8) !== 0;
      cells.push(lit);
    }
  }
  return (
    <span className="face" aria-hidden="true">
      {cells.map((lit, i) => (
        <i key={i} className={lit ? (hot ? "px on" : "px off") : "px"} />
      ))}
    </span>
  );
}

export function CircuitBoard({ frozen, onComplete }: Props) {
  const store = useGameStore();
  const [puzzle] = useState<CircuitPuzzle>(() => generateCircuit(Math.random));
  const [tiles, setTiles] = useState<number[]>(() => puzzle.tiles.slice());
  const [cursor, setCursor] = useState(0);
  const result = useMemo(
    () => trace(tiles, puzzle.cols, puzzle.rows, puzzle.start, puzzle.end),
    [tiles, puzzle],
  );

  useEffect(() => {
    if (!result.solved || frozen) return;
    const id = window.setTimeout(onComplete, 380);
    return () => window.clearTimeout(id);
  }, [result.solved, frozen, onComplete]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (frozen || result.solved) return;
      const onButton = event.target instanceof HTMLElement && Boolean(event.target.closest("button"));
      const { cols, rows } = puzzle;
      if (event.code === "ArrowLeft") {
        event.preventDefault();
        setCursor((c) => (c % cols === 0 ? c : c - 1));
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        setCursor((c) => (c % cols === cols - 1 ? c : c + 1));
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        setCursor((c) => (c - cols < 0 ? c : c - cols));
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        setCursor((c) => (c + cols >= cols * rows ? c : c + cols));
      } else if (!onButton && (event.code === "Enter" || event.code === "Space")) {
        event.preventDefault();
        rotateAt(cursor);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const rotateAt = (index: number) => {
    if (frozen || result.solved) return;
    audio.rotate();
    store.addImpulse(1.2);
    setTiles((current) => {
      const next = current.slice();
      next[index] = rotateMask(next[index] ?? 0, 1);
      return next;
    });
  };

  const startI = puzzle.start.y * puzzle.cols + puzzle.start.x;
  const sourceHot = ((tiles[startI] ?? 0) & W) !== 0 && result.powered.has(startI);

  return (
    <div className="circuit-board" data-testid="circuit">
      {Array.from({ length: puzzle.rows }, (_, y) => (
        <div className="circuit-row" key={y}>
          <div className={`port${y === puzzle.start.y ? " show" : ""}${sourceHot && y === puzzle.start.y ? " hot" : ""}`}>
            {y === puzzle.start.y ? (
              <PixelText text="SRC" scale={2} color={sourceHot ? palette.cyan : palette.danger} />
            ) : null}
          </div>
          {Array.from({ length: puzzle.cols }, (_, x) => {
            const index = y * puzzle.cols + x;
            const hot = result.powered.has(index);
            const dist = result.dist.get(index) ?? 0;
            return (
              <button
                key={index}
                type="button"
                className={`wire${hot ? " hot" : ""}${cursor === index ? " sel" : ""}`}
                style={{ animationDelay: `${dist * 90}ms` }}
                aria-label={`Rotate connector row ${y + 1} column ${x + 1}`}
                onClick={() => {
                  setCursor(index);
                  rotateAt(index);
                }}
              >
                <WireFace mask={tiles[index] ?? 0} hot={hot} />
              </button>
            );
          })}
          <div className={`port${y === puzzle.end.y ? " show" : ""}${result.solved && y === puzzle.end.y ? " hot" : ""}`}>
            {y === puzzle.end.y ? (
              <PixelText
                text="DST"
                scale={2}
                color={result.solved ? palette.ok : palette.mute}
              />
            ) : null}
          </div>
        </div>
      ))}
      <span className="sr-only">{result.solved ? "Circuit linked" : "Circuit open"}</span>
    </div>
  );
}
