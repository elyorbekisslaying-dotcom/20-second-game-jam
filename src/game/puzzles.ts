import { DISC_SYMBOLS, SCAN_PAIRS } from "./icons";
import { shuffle } from "./rng";
import type { Kind } from "./types";

export type Disc = {
  symbols: string[];
  current: number;
  target: number;
};

export type ScanPuzzle = {
  cols: number;
  rows: number;
  cells: string[];
  oddIndex: number;
};

const KINDS: Kind[] = ["circuit", "signal", "discs", "scan"];

export function pickThree(rng: () => number = Math.random): Kind[] {
  return shuffle(KINDS, rng).slice(0, 3);
}

export function makeDiscs(rng: () => number = Math.random): Disc[] {
  return [0, 1, 2].map(() => {
    const symbols = shuffle(DISC_SYMBOLS, rng).slice(0, 4);
    const target = Math.floor(rng() * symbols.length);
    const current = (target + 1 + Math.floor(rng() * (symbols.length - 1))) % symbols.length;
    return { symbols, current, target };
  });
}

export function makeZone(rng: () => number = Math.random): { start: number; width: number } {
  const width = 0.22;
  const start = 0.06 + rng() * (1 - width - 0.12);
  return { start, width };
}

export function makeScan(rng: () => number = Math.random): ScanPuzzle {
  const cols = 5;
  const rows = 4;
  const pair = SCAN_PAIRS[Math.floor(rng() * SCAN_PAIRS.length)]!;
  const flip = rng() < 0.5;
  const base = flip ? pair[1] : pair[0];
  const odd = flip ? pair[0] : pair[1];
  const total = cols * rows;
  const oddIndex = Math.floor(rng() * total);
  const cells = Array.from({ length: total }, () => base);
  cells[oddIndex] = odd;
  return { cols, rows, cells, oddIndex };
}
