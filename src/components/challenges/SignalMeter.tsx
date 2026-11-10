import { useEffect, useRef, useState } from "react";
import { audio } from "@/game/audio";
import { palette } from "@/game/palette";
import { makeZone } from "@/game/puzzles";
import { PixelText } from "@/components/PixelText";
import { useGameStore } from "@/components/game-context";

type Props = {
  frozen: boolean;
  onComplete: () => void;
};

const SPEED = 0.55;

export function SignalMeter({ frozen, onComplete }: Props) {
  const store = useGameStore();
  const frozenRef = useRef(frozen);
  frozenRef.current = frozen;
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const hitsRef = useRef(0);
  const lockRef = useRef(false);
  const coolRef = useRef(0);
  const holdRef = useRef(false);
  const zoneRef = useRef(makeZone(Math.random));
  const needleRef = useRef<HTMLDivElement>(null);
  const [hits, setHits] = useState(0);
  const [zone, setZone] = useState(zoneRef.current);
  const [miss, setMiss] = useState(false);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      coolRef.current = Math.max(0, coolRef.current - dt);
      if (!frozenRef.current && !lockRef.current && !holdRef.current) {
        posRef.current += dirRef.current * SPEED * dt;
        if (posRef.current >= 1) {
          posRef.current = 1;
          dirRef.current = -1;
        } else if (posRef.current <= 0) {
          posRef.current = 0;
          dirRef.current = 1;
        }
      }
      if (needleRef.current) needleRef.current.style.left = `${posRef.current * 100}%`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const attempt = () => {
    if (frozenRef.current || lockRef.current || holdRef.current || coolRef.current > 0 || hitsRef.current >= 2) return;
    const p = posRef.current;
    const zoneNow = zoneRef.current;
    const inside = p >= zoneNow.start && p <= zoneNow.start + zoneNow.width;
    coolRef.current = 0.28;
    if (!inside) {
      audio.bad();
      store.addImpulse(4);
      store.blip("bad");
      setMiss(true);
      window.setTimeout(() => setMiss(false), 180);
      return;
    }
    const next = hitsRef.current + 1;
    hitsRef.current = next;
    setHits(next);
    audio.hit();
    store.addImpulse(3);
    if (next >= 2) {
      lockRef.current = true;
      window.setTimeout(onComplete, 320);
      return;
    }
    setHold(true);
    holdRef.current = true;
    window.setTimeout(() => {
      const nextZone = makeZone(Math.random);
      zoneRef.current = nextZone;
      setZone(nextZone);
      holdRef.current = false;
      setHold(false);
    }, 420);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "Enter") return;
      if (event.repeat) return;
      if (event.target instanceof HTMLElement && event.target.closest("button")) return;
      event.preventDefault();
      attempt();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="signal" data-testid="signal">
      <div className="signal-readout">
        <PixelText text={`HITS ${hits}/2`} scale={3} color={hits > 0 ? palette.ok : palette.amber} />
        <PixelText text={hold ? "LOCK" : "SWEEP"} scale={2} color={palette.mute} />
      </div>
      <div className={`meter${miss ? " miss" : ""}`}>
        <div className="ticks" aria-hidden="true">
          {Array.from({ length: 11 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div
          className="zone"
          style={{ left: `${zone.start * 100}%`, width: `${zone.width * 100}%` }}
        />
        <div className="needle" ref={needleRef} />
      </div>
      <button type="button" className="pix-btn solid stop-btn" data-testid="stop" onClick={attempt}>
        <PixelText text="STOP" scale={3} color={palette.void} />
      </button>
      <p className="sr-only">Press stop when the needle is inside the highlighted zone. Two hits required.</p>
    </div>
  );
}
