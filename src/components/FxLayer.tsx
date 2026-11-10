import { useEffect, useRef } from "react";
import type { Burst } from "@/game/fxbus";
import { onBurst } from "@/game/fxbus";
import { palette } from "@/game/palette";

type Part = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
  ambient: boolean;
};

export function FxLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parts: Part[] = [];
    let raf = 0;
    let last = performance.now();

    const spawn = (b: Burst, w: number, h: number) => {
      for (let i = 0; i < b.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = b.speed * (0.35 + Math.random());
        parts.push({
          x: b.x * w,
          y: b.y * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: b.life * (0.55 + Math.random() * 0.45),
          max: b.life,
          color: b.color,
          size: 2 + Math.floor(Math.random() * 3),
          ambient: false,
        });
      }
    };

    const unsub = onBurst((b) => {
      const parent = canvas.parentElement;
      spawn(b, parent?.clientWidth ?? 800, parent?.clientHeight ?? 600);
    });

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? 1;
      const h = parent?.clientHeight ?? 1;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const bw = Math.max(1, Math.floor(w * dpr));
      const bh = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const ambient = parts.reduce((n, p) => n + (p.ambient ? 1 : 0), 0);
      if (ambient < 22 && Math.random() < dt * 10) {
        parts.push({
          x: Math.random() * w,
          y: h + 2,
          vx: (Math.random() - 0.5) * 14,
          vy: -18 - Math.random() * 28,
          life: 3.2,
          max: 3.2,
          color: Math.random() < 0.75 ? palette.cyan : palette.amber,
          size: 2,
          ambient: true,
        });
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]!;
        p.life -= dt;
        if (!p.ambient) p.vy += 280 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      unsub();
    };
  }, []);

  return <canvas ref={ref} className="fx-layer" aria-hidden="true" />;
}
