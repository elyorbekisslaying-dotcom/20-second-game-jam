import { useEffect, useRef, useState } from "react";
import { audio } from "@/game/audio";
import { palette } from "@/game/palette";
import { makeDiscs, type Disc } from "@/game/puzzles";
import { PixelIcon } from "@/components/PixelIcon";
import { PixelText } from "@/components/PixelText";

type Props = {
  frozen: boolean;
  onComplete: () => void;
};

export function DiscLocks({ frozen, onComplete }: Props) {
  const [discs, setDiscs] = useState<Disc[]>(() => makeDiscs(Math.random));
  const [spin, setSpin] = useState<number[]>([0, 0, 0]);
  const [anim, setAnim] = useState<boolean[]>([false, false, false]);
  const busy = useRef(false);
  const done = useRef(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const turn = (index: number) => {
    if (frozen || busy.current || done.current) return;
    busy.current = true;
    audio.rotate();
    setAnim([false, false, false].map((_, i) => i === index));
    setSpin((current) => current.map((value, i) => (i === index ? 90 : value)));
    timer.current = window.setTimeout(() => {
      setDiscs((current) => {
        const next = current.map((disc, i) =>
          i === index ? { ...disc, current: (disc.current + 1) % disc.symbols.length } : disc,
        );
        if (!done.current && next.every((disc) => disc.current === disc.target)) {
          done.current = true;
          window.setTimeout(onComplete, 260);
        }
        return next;
      });
      setAnim([false, false, false]);
      setSpin([0, 0, 0]);
      busy.current = false;
    }, 150);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (frozen) return;
      const map: Record<string, number> = {
        Digit1: 0,
        Digit2: 1,
        Digit3: 2,
        KeyA: 0,
        KeyS: 1,
        KeyD: 2,
      };
      const index = map[event.code];
      if (index === undefined) return;
      event.preventDefault();
      turn(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="discs" data-testid="discs">
      {discs.map((disc, index) => {
        const symbol = disc.symbols[disc.current] ?? "bolt";
        const target = disc.symbols[disc.target] ?? "bolt";
        const matched = disc.current === disc.target;
        return (
          <div className="disc-col" key={index}>
            <PixelText text="LOCK" scale={2} color={palette.mute} />
            <PixelIcon name={target} scale={3} color={palette.amber} />
            <button
              type="button"
              className={`disc${matched ? " matched" : ""}`}
              aria-label={`Disc ${index + 1}. Showing ${symbol}. Lock wants ${target}.`}
              onClick={() => turn(index)}
            >
              <span
                className="disc-face"
                style={{
                  transform: `rotate(${spin[index] ?? 0}deg)`,
                  transition: anim[index] ? "transform 140ms linear" : "none",
                }}
              >
                <PixelIcon name={symbol} scale={5} color={matched ? palette.ok : palette.cyan} />
              </span>
            </button>
            <PixelText text={String(index + 1)} scale={2} color={matched ? palette.ok : palette.paper} />
          </div>
        );
      })}
    </div>
  );
}
