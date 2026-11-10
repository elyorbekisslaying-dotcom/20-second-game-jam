import { useEffect, useRef, useState } from "react";
import { audio } from "@/game/audio";
import { palette } from "@/game/palette";
import { GameStore } from "@/game/store";
import { formatTime, KIND_HINT, KIND_LABEL, type Snap } from "@/game/types";
import { Bomb } from "@/components/Bomb";
import { CircuitBoard } from "@/components/challenges/CircuitBoard";
import { DiscLocks } from "@/components/challenges/DiscLocks";
import { OddScan } from "@/components/challenges/OddScan";
import { SignalMeter } from "@/components/challenges/SignalMeter";
import { FxLayer } from "@/components/FxLayer";
import { GameProvider, useGameStore, useSnap } from "@/components/game-context";
import { PixButton } from "@/components/PixButton";
import { PixelText } from "@/components/PixelText";

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const apply = () => setWide(window.innerWidth >= 900);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  return wide;
}

function Leds() {
  return (
    <div className="leds" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i key={i} style={{ animationDelay: `${i * 0.11}s` }} />
      ))}
    </div>
  );
}

function Screws() {
  return (
    <>
      <i className="screw a" />
      <i className="screw b" />
      <i className="screw c" />
      <i className="screw d" />
    </>
  );
}

function Menu({ snap }: { snap: Snap }) {
  const store = useGameStore();
  const wide = useWide();
  const sub = wide ? 3 : 2;
  return (
    <div className="menu">
      <PixelText text="ORDNANCE BAY 04" scale={2} color={palette.amber} />
      <h1 className="sr-only">20 Seconds</h1>
      <PixelText text="20" scale={wide ? 12 : 8} color={palette.cyan} glow="cyan" />
      <PixelText text="SECONDS" scale={wide ? 5 : 4} color={palette.paper} />
      <div className="menu-copy">
        <PixelText text="COMPLETE 3 TASKS" scale={sub} color={palette.amber} />
        <PixelText text="BEFORE TIME RUNS OUT" scale={sub} color={palette.amber} />
      </div>
      <div className="panel bomb-panel menu-bomb">
        <Screws />
        <Bomb timeText="20.0" mode="idle" urgent={false} />
        <PixelText text="CHARGE ARMED" scale={2} color={palette.danger} />
      </div>
      <Leds />
      <div className="btn-row">
        <PixButton label="START" onClick={store.start} testId="start" />
        <PixButton label="HOW TO" variant="ghost" onClick={store.help} testId="howto" />
      </div>
      {snap.hydrated && snap.stats.best > 0 ? (
        <PixelText text={`BEST ${formatTime(snap.stats.best)} LEFT`} scale={2} color={palette.mute} />
      ) : (
        <PixelText text="ENTER OR SPACE TO ARM" scale={2} color={palette.mute} />
      )}
    </div>
  );
}

const HELP = [
  "YOU GET TWENTY SECONDS",
  "THREE RANDOM MECHANISMS",
  "CIRCUIT LINKS SRC TO DST",
  "SIGNAL STOPS TWICE IN ZONE",
  "DISCS MATCH EACH LOCK",
  "SCAN TAPS THE ODD SYMBOL",
  "SPACE STOPS THE NEEDLE",
  "KEYS 1 2 3 TURN DISCS",
  "ARROWS MOVE ENTER TURNS",
  "ESC PAUSES THE CLOCK",
];

function Help() {
  const store = useGameStore();
  return (
    <div className="help">
      <PixelText text="PROTOCOL" scale={5} color={palette.cyan} glow="cyan" />
      <div className="panel help-card">
        <Screws />
        <div className="help-list">
          {HELP.map((line) => (
            <PixelText key={line} text={line} scale={2} color={palette.paper} />
          ))}
        </div>
      </div>
      <PixButton label="BACK" onClick={store.menu} testId="back" />
    </div>
  );
}

function Tasks({ snap }: { snap: Snap }) {
  return (
    <div className="tasks" data-testid="tasks">
      {snap.order.map((kind, index) => {
        const state = index < snap.step ? "done" : index === snap.step ? "now" : "wait";
        const mark = state === "done" ? "OK" : state === "now" ? ">>" : "--";
        const color = state === "done" ? palette.ok : state === "now" ? palette.cyan : palette.mute;
        return (
          <div key={`${kind}-${index}`} className={`task ${state}`}>
            <PixelText text={`${mark} ${KIND_LABEL[kind]}`} scale={2} color={color} />
          </div>
        );
      })}
    </div>
  );
}

function Play({ snap }: { snap: Snap }) {
  const store = useGameStore();
  const wide = useWide();
  const kind = snap.order[snap.step];
  const frozen = snap.paused || snap.locking || snap.phase === "boom";
  if (!kind) return null;
  const hint = KIND_HINT[kind];
  return (
    <div className={`play${snap.paused ? " dimmed" : ""}`}>
      <header className="topbar panel">
        <Screws />
        <div className="top-row">
          <PixelText text="BAY-04" scale={2} color={palette.mute} />
          <PixelText
            text={snap.urgent ? "CRITICAL" : "ARMED"}
            scale={2}
            color={snap.urgent ? palette.danger : palette.amber}
          />
        </div>
        <div className="timer-block" data-testid="timer" aria-label={`${formatTime(snap.time)} seconds left`}>
          <PixelText
            text={formatTime(snap.time)}
            scale={wide ? 10 : 7}
            color={snap.urgent ? palette.danger : palette.cyan}
            glow={snap.urgent ? "danger" : "cyan"}
          />
          <PixelText text="SECONDS" scale={2} color={snap.urgent ? palette.danger : palette.mute} />
        </div>
      </header>
      <Leds />
      <Tasks snap={snap} />
      <div className="play-grid">
        <section className="panel challenge" data-testid="challenge" data-challenge={kind}>
          <Screws />
          <div className="ch-head">
            <PixelText text={KIND_LABEL[kind]} scale={wide ? 4 : 3} color={palette.amber} />
            <PixelText text={`TASK ${snap.step + 1} OF 3`} scale={2} color={palette.mute} />
          </div>
          <div className={`ch-body${frozen ? " frozen" : ""}`}>
            {kind === "circuit" ? (
              <CircuitBoard key={`${snap.round}-c`} frozen={frozen} onComplete={store.complete} />
            ) : null}
            {kind === "signal" ? (
              <SignalMeter key={`${snap.round}-s`} frozen={frozen} onComplete={store.complete} />
            ) : null}
            {kind === "discs" ? (
              <DiscLocks key={`${snap.round}-d`} frozen={frozen} onComplete={store.complete} />
            ) : null}
            {kind === "scan" ? (
              <OddScan key={`${snap.round}-n`} frozen={frozen} onComplete={store.complete} />
            ) : null}
          </div>
          {snap.banner ? (
            <div className="banner" data-testid="banner">
              <PixelText text={snap.banner} scale={wide ? 5 : 4} color={palette.ok} glow="ok" />
            </div>
          ) : null}
          <div className="hint">
            <PixelText text={hint[0]} scale={2} color={palette.paper} />
            <PixelText text={hint[1]} scale={2} color={palette.paper} />
            <PixelText text="ESC PAUSES" scale={2} color={palette.mute} />
          </div>
        </section>
        <aside className="panel bomb-panel">
          <Screws />
          <Bomb
            timeText={formatTime(snap.time)}
            mode={snap.phase === "boom" ? "dead" : "armed"}
            urgent={snap.urgent || snap.phase === "boom"}
          />
          <PixelText
            text={snap.phase === "boom" ? "DETONATION" : snap.urgent ? "CRITICAL" : "LIVE CHARGE"}
            scale={2}
            color={snap.urgent || snap.phase === "boom" ? palette.danger : palette.amber}
          />
        </aside>
      </div>
      {snap.phase === "play" && !snap.locking ? (
        <div className="btn-row">
          <PixButton label="PAUSE" variant="ghost" onClick={store.togglePause} testId="pause" />
        </div>
      ) : null}
    </div>
  );
}

function Pause() {
  const store = useGameStore();
  return (
    <div className="modal" data-testid="pause">
      <div className="panel modal-card">
        <Screws />
        <PixelText text="PAUSED" scale={6} color={palette.amber} glow="amber" />
        <PixelText text="TIME FROZEN" scale={2} color={palette.paper} />
        <div className="btn-row">
          <PixButton label="RESUME" onClick={store.togglePause} testId="resume" />
          <PixButton label="MENU" variant="ghost" onClick={store.menu} testId="pause-menu" />
        </div>
      </div>
    </div>
  );
}

function End({ snap, kind }: { snap: Snap; kind: "win" | "lose" }) {
  const store = useGameStore();
  const wide = useWide();
  const win = kind === "win";
  return (
    <div className="end" data-testid={win ? "win" : "lose"}>
      <PixelText
        text={win ? "DEFUSED" : "DETONATED"}
        scale={wide ? 7 : 4}
        color={win ? palette.ok : palette.danger}
        glow={win ? "ok" : "danger"}
      />
      <PixelText
        text={win ? "ALL CIRCUITS SAFE" : "THE CHARGE FIRED"}
        scale={2}
        color={palette.paper}
      />
      <div className="panel bomb-panel">
        <Screws />
        <Bomb timeText={formatTime(snap.time)} mode={win ? "safe" : "dead"} urgent={!win} />
      </div>
      {win ? (
        <>
          <PixelText text={`TIME LEFT ${formatTime(snap.time)}`} scale={wide ? 4 : 3} color={palette.cyan} />
          {snap.freshBest ? <PixelText text="NEW BEST" scale={3} color={palette.amber} /> : null}
        </>
      ) : (
        <PixelText text={`FAILURES ${snap.stats.losses}`} scale={2} color={palette.mute} />
      )}
      <div className="btn-row">
        <PixButton label="AGAIN" onClick={store.start} testId="again" />
        <PixButton label="MENU" variant="ghost" onClick={store.menu} testId="menu" />
      </div>
      <PixelText text="ENTER AGAIN   ESC MENU" scale={2} color={palette.mute} />
    </div>
  );
}

function Stage() {
  const store = useGameStore();
  const snap = useSnap();
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    store.hydrate();
    return store.startLoop();
  }, [store]);

  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const onButton = event.target instanceof HTMLElement && Boolean(event.target.closest("button"));
      if (event.code === "Escape") {
        event.preventDefault();
        const now = store.get();
        if (now.phase === "help" || now.phase === "win" || now.phase === "lose") store.menu();
        else if (now.phase === "play") store.togglePause();
        return;
      }
      if (onButton) return;
      if (event.code === "KeyP" && store.get().phase === "play") {
        event.preventDefault();
        store.togglePause();
        return;
      }
      if (event.code === "Enter" || event.code === "Space") {
        const now = store.get();
        if (now.phase === "menu" && !event.repeat) {
          event.preventDefault();
          store.start();
        } else if (now.phase === "help" && event.code === "Enter") {
          event.preventDefault();
          store.menu();
        } else if (now.paused && now.phase === "play" && event.code === "Enter") {
          event.preventDefault();
          store.togglePause();
        } else if ((now.phase === "win" || now.phase === "lose") && event.code === "Enter" && !event.repeat) {
          event.preventDefault();
          store.start();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [store]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const node = stageRef.current;
      const mag = store.getShake();
      if (node) {
        if (mag < 0.25) node.style.transform = "";
        else {
          const x = (Math.random() - 0.5) * 2 * mag;
          const y = (Math.random() - 0.5) * 2 * mag;
          node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [store]);

  const live =
    snap.banner ||
    (snap.phase === "win" ? "Defused" : snap.phase === "lose" ? "Detonated" : snap.paused ? "Paused" : "");

  return (
    <div
      ref={stageRef}
      className={`terminal${snap.urgent ? " urgent" : ""}`}
      data-phase={snap.phase}
      data-testid="terminal"
    >
      <FxLayer />
      <div className="veil" />
      <div className={`flash flash-${snap.flash}`} />
      <div className="hazard" />
      <div className="mute-dock">
        <PixButton
          tiny
          variant="ghost"
          label={snap.muted ? "SOUND" : "MUTE"}
          onClick={store.toggleMute}
          testId="mute"
        />
      </div>
      <div className="sr-only" aria-live="polite">
        {live}
      </div>
      <div className="shell">
        {snap.phase === "menu" ? <Menu snap={snap} /> : null}
        {snap.phase === "help" ? <Help /> : null}
        {snap.phase === "play" || snap.phase === "boom" ? <Play snap={snap} /> : null}
        {snap.phase === "win" ? <End snap={snap} kind="win" /> : null}
        {snap.phase === "lose" ? <End snap={snap} kind="lose" /> : null}
      </div>
      {snap.paused && snap.phase === "play" ? <Pause /> : null}
    </div>
  );
}

export function Game() {
  const storeRef = useRef<GameStore | null>(null);
  if (!storeRef.current) storeRef.current = new GameStore();
  return (
    <GameProvider store={storeRef.current}>
      <Stage />
    </GameProvider>
  );
}
