let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let muted = false;
let drone: OscillatorNode | null = null;
let droneGain: GainNode | null = null;
let wired = false;
let noise: AudioBuffer | null = null;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    sfx = ctx.createGain();
    sfx.connect(master);
    master.connect(ctx.destination);
  }
  return ctx;
}

function wireVisibility() {
  if (wired || typeof document === "undefined") return;
  wired = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && ctx && ctx.state === "suspended") {
      void ctx.resume();
    }
  });
}

function stopDrone() {
  if (!ctx || !drone || !droneGain) {
    drone = null;
    droneGain = null;
    return;
  }
  const d = drone;
  const g = droneGain;
  drone = null;
  droneGain = null;
  g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.03);
  try {
    d.stop(ctx.currentTime + 0.15);
  } catch {
    /* already stopped */
  }
  d.onended = () => {
    d.disconnect();
    g.disconnect();
  };
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain: number,
  when = 0,
  slideTo?: number,
) {
  const ac = ctx;
  if (!ac || !sfx) return;
  const t0 = ac.currentTime + when;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo && slideTo > 0) {
    o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + dur);
  }
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(sfx);
  o.start(t0);
  o.stop(t0 + dur + 0.03);
  o.onended = () => {
    o.disconnect();
    g.disconnect();
  };
}

function boomBuffer(): AudioBuffer | null {
  if (!ctx) return null;
  if (noise) return noise;
  const dur = 0.55;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const env = Math.pow(1 - i / data.length, 1.7);
    data[i] = (Math.random() * 2 - 1) * env;
  }
  noise = buffer;
  return buffer;
}

export const audio = {
  unlock() {
    const ac = ensure();
    if (!ac) return;
    if (ac.state === "suspended") void ac.resume();
    wireVisibility();
  },
  setMuted(next: boolean) {
    muted = next;
    if (!ctx || !master) return;
    master.gain.setTargetAtTime(next ? 0 : 0.9, ctx.currentTime, 0.02);
    if (next) stopDrone();
  },
  setDrone(on: boolean) {
    const ac = ensure();
    if (!ac || !master) return;
    if (!on || muted) {
      stopDrone();
      return;
    }
    if (drone) return;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.value = 52;
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.setTargetAtTime(0.018, ac.currentTime, 0.08);
    o.connect(g);
    g.connect(master);
    o.start();
    drone = o;
    droneGain = g;
  },
  click() {
    tone(720, 0.045, "square", 0.045);
  },
  rotate() {
    tone(240, 0.05, "square", 0.04);
    tone(380, 0.06, "square", 0.035, 0.04);
  },
  tick(urgent: boolean) {
    if (urgent) {
      tone(1480, 0.05, "square", 0.07);
      tone(180, 0.08, "sawtooth", 0.03);
    } else {
      tone(880, 0.04, "square", 0.045);
    }
  },
  bad() {
    tone(96, 0.16, "sawtooth", 0.07, 0, 60);
  },
  hit() {
    tone(660, 0.07, "square", 0.06);
    tone(990, 0.09, "square", 0.05, 0.05);
  },
  seal() {
    tone(523, 0.09, "square", 0.06);
    tone(784, 0.12, "square", 0.06, 0.07);
  },
  arm() {
    tone(196, 0.18, "square", 0.05, 0, 880);
  },
  win() {
    tone(523, 0.12, "square", 0.06);
    tone(659, 0.12, "square", 0.06, 0.1);
    tone(784, 0.14, "square", 0.06, 0.2);
    tone(1046, 0.22, "square", 0.05, 0.32);
  },
  boom() {
    const ac = ctx;
    if (!ac || !sfx) return;
    const buffer = boomBuffer();
    if (buffer) {
      const src = ac.createBufferSource();
      src.buffer = buffer;
      const filter = ac.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, ac.currentTime);
      filter.frequency.exponentialRampToValueAtTime(140, ac.currentTime + 0.5);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.9, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.55);
      src.connect(filter);
      filter.connect(g);
      g.connect(sfx);
      src.start();
      src.onended = () => {
        src.disconnect();
        filter.disconnect();
        g.disconnect();
      };
    }
    tone(140, 0.45, "sine", 0.12, 0, 36);
  },
};
