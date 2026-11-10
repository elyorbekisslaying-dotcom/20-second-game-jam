import { useEffect, useRef, useState } from "react";
import { audio } from "@/game/audio";
import { palette } from "@/game/palette";
import { makeScan } from "@/game/puzzles";
import { PixelIcon } from "@/components/PixelIcon";
import { useGameStore } from "@/components/game-context";

type Props = {
  frozen: boolean;
  onComplete: () => void;
};

export function OddScan({ frozen, onComplete }: Props) {
  const store = useGameStore();
  const [puzzle] = useState(() => makeScan(Math.random));
  const cursorRef = useRef(0);
  const [cursor, setCursor] = useState(0);
  const [bad, setBad] = useState(-1);
  const [good, setGood] = useState(-1);
  const done = useRef(false);

  const choose = (index: number) => {
    if (frozen || done.current) return;
    if (index === puzzle.oddIndex) {
      done.current = true;
      setGood(index);
      audio.hit();
      window.setTimeout(onComplete, 240);
      return;
    }
    audio.bad();
    store.addImpulse(4);
    store.blip("bad");
    setBad(index);
    window.setTimeout(() => setBad((current) => (current === index ? -1 : current)), 220);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (frozen) return;
      const onButton = event.target instanceof HTMLElement && Boolean(event.target.closest("button"));
      const { cols, rows } = puzzle;
      const total = cols * rows;
      if (event.code === "ArrowLeft") {
        event.preventDefault();
        setCursor((c) => {
          const next = c % cols === 0 ? c : c - 1;
          cursorRef.current = next;
          return next;
        });
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        setCursor((c) => {
          const next = c % cols === cols - 1 ? c : c + 1;
          cursorRef.current = next;
          return next;
        });
      } else if (event.code === "ArrowUp") {
        event.preventDefault();
        setCursor((c) => {
          const next = c - cols < 0 ? c : c - cols;
          cursorRef.current = next;
          return next;
        });
      } else if (event.code === "ArrowDown") {
        event.preventDefault();
        setCursor((c) => {
          const next = c + cols >= total ? c : c + cols;
          cursorRef.current = next;
          return next;
        });
      } else if (!onButton && (event.code === "Enter" || event.code === "Space")) {
        event.preventDefault();
        choose(cursorRef.current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      className="scan-grid"
      data-testid="scan"
      style={{ gridTemplateColumns: `repeat(${puzzle.cols}, 1fr)` }}
    >
      {puzzle.cells.map((name, index) => (
        <button
          key={index}
          type="button"
          className={`glyph${cursor === index ? " sel" : ""}${bad === index ? " bad" : ""}${good === index ? " good" : ""}`}
          aria-label={`Glyph ${index + 1}`}
          onClick={() => {
            cursorRef.current = index;
            setCursor(index);
            choose(index);
          }}
        >
          <PixelIcon name={name} scale={4} color={good === index ? palette.ok : palette.cyan} />
        </button>
      ))}
    </div>
  );
}
