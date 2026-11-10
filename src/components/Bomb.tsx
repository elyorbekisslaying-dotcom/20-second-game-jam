import { useEffect, useRef } from "react";
import { drawText, measureText } from "@/game/font";
import { palette } from "@/game/palette";

export type BombMode = "idle" | "armed" | "safe" | "dead";

type BombProps = {
  timeText: string;
  mode: BombMode;
  urgent: boolean;
};

const LW = 96;
const LH = 80;

function rect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function draw(ctx: CanvasRenderingContext2D, now: number, props: BombProps) {
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, LW, LH);

  const { mode, urgent, timeText } = props;
  const dead = mode === "dead";
  const safe = mode === "safe";
  const blink = Math.floor(now / (urgent || dead ? 90 : 420)) % 2 === 0;
  const led = safe ? palette.ok : urgent || dead ? palette.danger : blink ? palette.cyan : palette.cyanDim;
  const shell = dead ? palette.dangerDim : palette.panel;
  const edge = safe ? palette.ok : urgent ? palette.danger : palette.metal;
  const ox = dead ? (Math.floor(now / 40) % 2 === 0 ? 1 : -1) : 0;

  const wires: Array<[number, string]> = [
    [30, palette.danger],
    [46, palette.amber],
    [62, palette.cyan],
  ];
  for (const [x, color] of wires) {
    rect(ctx, x, 2, 2, 16, color);
    rect(ctx, x - 1, 2, 4, 2, color);
  }
  rect(ctx, 45, 0, 4, 4, blink ? palette.amber : palette.amberDim);

  rect(ctx, 14 + ox, 18, 68, 54, edge);
  rect(ctx, 17 + ox, 21, 62, 48, shell);
  for (let i = 0; i < 6; i++) {
    rect(ctx, 17 + ox, 22 + i * 8, 5, 4, i % 2 === 0 ? palette.amber : palette.void);
  }

  rect(ctx, 28 + ox, 28, 44, 20, palette.void);
  rect(ctx, 30 + ox, 30, 40, 16, "#050608");
  const label = safe ? "SAFE" : dead ? "XXXX" : timeText;
  const color = safe ? palette.ok : urgent || dead ? palette.danger : palette.cyan;
  const scale = 2;
  const box = measureText(label, scale);
  drawText(ctx, label, 30 + ox + Math.floor((40 - box.width) / 2), 33, scale, color);

  const lamps = [36, 48, 60, 72];
  lamps.forEach((x, i) => {
    const on = safe || ((Math.floor(now / (urgent ? 70 : 180)) + i) % (safe ? 2 : 3) !== 0);
    rect(ctx, x + ox, 54, 6, 6, on ? led : palette.ink);
    if (on) rect(ctx, x + 1 + ox, 55, 4, 2, palette.paper);
  });

  rect(ctx, 22 + ox, 64, 4, 4, palette.edge);
  rect(ctx, 70 + ox, 64, 4, 4, palette.edge);
  rect(ctx, 22 + ox, 24, 4, 4, palette.edge);
  rect(ctx, 70 + ox, 24, 4, 4, palette.edge);

  if (dead) {
    rect(ctx, 40, 22, 2, 30, palette.amber);
    rect(ctx, 34, 36, 18, 2, palette.danger);
    rect(ctx, 58, 26, 8, 2, palette.paper);
  }
}

export function Bomb({ timeText, mode, urgent }: BombProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const props = useRef({ timeText, mode, urgent });
  props.current = { timeText, mode, urgent };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const loop = (now: number) => {
      draw(ctx, now, props.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      className="bomb-canvas"
      width={LW * 2}
      height={LH * 2}
      aria-hidden="true"
    />
  );
}
