import { palette } from "./palette";

export type Burst = {
  x: number;
  y: number;
  color: string;
  count: number;
  speed: number;
  life: number;
};

type Fn = (b: Burst) => void;
const subs = new Set<Fn>();

export function burst(b: Burst) {
  subs.forEach((fn) => fn(b));
}

export function onBurst(fn: Fn) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function explodeFx() {
  const colors = [palette.danger, palette.amber, palette.paper, palette.amberDim];
  for (let i = 0; i < 5; i++) {
    burst({
      x: 0.32 + Math.random() * 0.36,
      y: 0.28 + Math.random() * 0.28,
      color: colors[i % colors.length]!,
      count: 26,
      speed: 160 + Math.random() * 240,
      life: 0.65 + Math.random() * 0.35,
    });
  }
}

export function sealFx() {
  burst({ x: 0.42, y: 0.46, color: palette.ok, count: 22, speed: 150, life: 0.55 });
  burst({ x: 0.58, y: 0.4, color: palette.cyan, count: 14, speed: 110, life: 0.45 });
}
