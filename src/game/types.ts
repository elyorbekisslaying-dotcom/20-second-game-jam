export type Phase = "menu" | "help" | "play" | "boom" | "win" | "lose";

export type Kind = "circuit" | "signal" | "discs" | "scan";

export type Flash = "none" | "good" | "bad" | "boom";

export type Stats = {
  wins: number;
  losses: number;
  best: number;
};

export type Snap = {
  phase: Phase;
  time: number;
  order: Kind[];
  step: number;
  paused: boolean;
  locking: boolean;
  banner: string;
  urgent: boolean;
  round: number;
  muted: boolean;
  flash: Flash;
  stats: Stats;
  hydrated: boolean;
  freshBest: boolean;
};

export const KIND_LABEL: Record<Kind, string> = {
  circuit: "CIRCUIT",
  signal: "SIGNAL",
  discs: "DISCS",
  scan: "SCAN",
};

export const KIND_HINT: Record<Kind, [string, string]> = {
  circuit: ["ROTATE TILES", "LINK SRC TO DST"],
  signal: ["STOP IN THE ZONE", "TWO CLEAN HITS"],
  discs: ["MATCH EACH DISC", "TO ITS LOCK"],
  scan: ["FIND THE ONE", "ODD SYMBOL"],
};

export function formatTime(t: number): string {
  const tenths = Math.max(0, Math.floor(t * 10 + 1e-4));
  const sec = Math.floor(tenths / 10);
  const frac = tenths % 10;
  return `${String(sec).padStart(2, "0")}.${frac}`;
}
