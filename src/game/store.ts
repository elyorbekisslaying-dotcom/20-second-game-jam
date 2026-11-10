import { audio } from "./audio";
import { explodeFx, sealFx } from "./fxbus";
import { pickThree } from "./puzzles";
import type { Flash, Kind, Phase, Snap, Stats } from "./types";

const SAVE_KEY = "twenty-seconds-v1";

type Save = Stats & { v: number; muted: boolean };

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

export class GameStore {
  phase: Phase = "menu";
  time = 20;
  order: Kind[] = [];
  step = 0;
  paused = false;
  locking = false;
  banner = "";
  urgent = false;
  round = 0;
  muted = false;
  flash: Flash = "none";
  stats: Stats = { wins: 0, losses: 0, best: 0 };
  hydrated = false;
  freshBest = false;
  reduce = false;

  private tenth = 200;
  private impulse = 0;
  private listeners = new Set<() => void>();
  private snapshot: Snap;
  private raf = 0;
  private last = 0;
  private pending = 0;
  private flashTimer = 0;

  constructor() {
    this.snapshot = this.makeSnap();
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  get = () => this.snapshot;

  getShake() {
    return this.reduce ? 0 : this.impulse;
  }

  addImpulse(amount: number) {
    if (this.reduce) return;
    this.impulse = Math.max(this.impulse, amount);
  }

  startLoop() {
    this.stopLoop();
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
    return () => this.stopLoop();
  }

  stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  hydrate() {
    if (typeof window === "undefined") return;
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Save>;
        this.stats = {
          wins: num(parsed.wins),
          losses: num(parsed.losses),
          best: num(parsed.best),
        };
        this.muted = Boolean(parsed.muted);
        audio.setMuted(this.muted);
      }
    } catch {
      /* ignore broken saves */
    }
    this.hydrated = true;
    this.publish();
  }

  start = () => {
    audio.unlock();
    this.clearPending();
    this.phase = "play";
    this.time = 20;
    this.tenth = 200;
    this.order = pickThree(Math.random);
    this.step = 0;
    this.paused = false;
    this.locking = false;
    this.banner = "";
    this.urgent = false;
    this.flash = "none";
    this.freshBest = false;
    this.round += 1;
    this.addImpulse(2);
    audio.arm();
    if (!this.muted) audio.setDrone(true);
    this.publish();
  };

  help = () => {
    audio.unlock();
    this.phase = "help";
    this.publish();
  };

  menu = () => {
    this.clearPending();
    this.phase = "menu";
    this.paused = false;
    this.locking = false;
    this.banner = "";
    this.urgent = false;
    this.flash = "none";
    audio.setDrone(false);
    this.publish();
  };

  togglePause = () => {
    if (this.phase !== "play" || this.locking) return;
    this.paused = !this.paused;
    if (this.paused || this.muted) audio.setDrone(false);
    else audio.setDrone(true);
    this.publish();
  };

  toggleMute = () => {
    audio.unlock();
    this.muted = !this.muted;
    audio.setMuted(this.muted);
    if (this.muted) audio.setDrone(false);
    else if (this.phase === "play" && !this.paused) audio.setDrone(true);
    this.persist();
    this.publish();
  };

  blip = (kind: Flash) => {
    if (this.phase === "boom" || this.phase === "lose") return;
    this.flash = kind;
    this.publish();
    if (this.flashTimer) window.clearTimeout(this.flashTimer);
    this.flashTimer = window.setTimeout(() => {
      if (this.flash === kind) {
        this.flash = "none";
        this.publish();
      }
    }, 140);
  };

  complete = () => {
    if (this.phase !== "play" || this.locking || this.time <= 0) return;
    this.locking = true;
    const last = this.step >= this.order.length - 1;
    this.banner = last ? "DEFUSED" : "SEALED";
    audio.seal();
    sealFx();
    this.addImpulse(5);
    this.blip("good");
    this.publish();
    this.pending = window.setTimeout(() => {
      this.pending = 0;
      if (this.phase !== "play") return;
      this.locking = false;
      this.banner = "";
      if (last) this.victory();
      else {
        this.step += 1;
        this.publish();
      }
    }, 680);
  };

  private victory() {
    const remain = Math.max(0, Math.floor(this.time * 10 + 1e-4) / 10);
    this.freshBest = remain > this.stats.best;
    this.stats = {
      wins: this.stats.wins + 1,
      losses: this.stats.losses,
      best: Math.max(this.stats.best, remain),
    };
    this.phase = "win";
    this.paused = false;
    this.urgent = false;
    this.locking = false;
    audio.setDrone(false);
    audio.win();
    sealFx();
    this.persist();
    this.publish();
  }

  private explode() {
    if (this.phase !== "play") return;
    this.clearPending();
    this.time = 0;
    this.tenth = 0;
    this.phase = "boom";
    this.urgent = true;
    this.locking = false;
    this.banner = "";
    this.paused = false;
    audio.setDrone(false);
    audio.boom();
    explodeFx();
    this.flash = "boom";
    this.addImpulse(18);
    this.publish();
    this.pending = window.setTimeout(() => {
      this.pending = 0;
      if (this.phase !== "boom") return;
      this.phase = "lose";
      this.flash = "none";
      this.urgent = false;
      this.stats = { ...this.stats, losses: this.stats.losses + 1 };
      this.persist();
      this.publish();
    }, 1050);
  }

  private loop = (now: number) => {
    const raw = Math.max(0, (now - this.last) / 1000);
    this.last = now;
    let dirty = false;
    if (this.phase === "play" && !this.paused && !this.locking) {
      const prevFloor = Math.floor(this.time + 1e-4);
      this.time = Math.max(0, this.time - raw);
      if (this.time <= 0) {
        this.raf = requestAnimationFrame(this.loop);
        this.explode();
        return;
      }
      const nextFloor = Math.floor(this.time + 1e-4);
      if (nextFloor < prevFloor) audio.tick(this.time <= 5);
      const tenth = Math.floor(this.time * 10 + 1e-4);
      if (tenth !== this.tenth) {
        this.tenth = tenth;
        dirty = true;
      }
      const urgent = this.time <= 5;
      if (urgent !== this.urgent) {
        this.urgent = urgent;
        dirty = true;
      }
    }
    if (this.phase === "play" && this.urgent && !this.paused && !this.reduce) {
      this.impulse = Math.max(this.impulse, 1.6);
    }
    if (this.phase === "boom" && !this.reduce) {
      this.impulse = Math.max(this.impulse, 11);
    }
    this.impulse = Math.max(0, this.impulse - raw * (this.phase === "boom" ? 7 : 14));
    if (dirty) this.publish();
    this.raf = requestAnimationFrame(this.loop);
  };

  private publish() {
    this.snapshot = this.makeSnap();
    this.listeners.forEach((listener) => listener());
  }

  private makeSnap(): Snap {
    return {
      phase: this.phase,
      time: Math.floor(this.time * 10 + 1e-4) / 10,
      order: this.order,
      step: this.step,
      paused: this.paused,
      locking: this.locking,
      banner: this.banner,
      urgent: this.urgent,
      round: this.round,
      muted: this.muted,
      flash: this.flash,
      stats: this.stats,
      hydrated: this.hydrated,
      freshBest: this.freshBest,
    };
  }

  private persist() {
    if (typeof localStorage === "undefined") return;
    const data: Save = { v: 1, ...this.stats, muted: this.muted };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  private clearPending() {
    if (this.pending) window.clearTimeout(this.pending);
    if (this.flashTimer) window.clearTimeout(this.flashTimer);
    this.pending = 0;
    this.flashTimer = 0;
  }
}
