import { useEffect, useRef } from "react";
import { ICONS } from "@/game/icons";

type PixelIconProps = {
  name: string;
  scale?: number;
  color: string;
};

export function PixelIcon({ name, scale = 4, color }: PixelIconProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = 9 * scale;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, size, size);
    const glyph = ICONS[name] ?? ICONS.box!;
    ctx.fillStyle = color;
    for (let y = 0; y < 9; y++) {
      const row = glyph[y] ?? "";
      for (let x = 0; x < 9; x++) {
        if (row[x] === "1") ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }, [name, scale, color, size]);

  return (
    <canvas
      ref={ref}
      className="pix-canvas"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
