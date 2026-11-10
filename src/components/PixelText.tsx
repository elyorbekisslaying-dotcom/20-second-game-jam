import { useEffect, useRef } from "react";
import { drawText, measureText } from "@/game/font";

type PixelTextProps = {
  text: string;
  scale?: number;
  color: string;
  glow?: "cyan" | "danger" | "ok" | "amber";
};

export function PixelText({ text, scale = 3, color, glow }: PixelTextProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const box = measureText(text, scale);
  const width = Math.max(1, box.width);
  const height = Math.max(1, box.height);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);
    drawText(ctx, text, 0, 0, scale, color);
  }, [text, scale, color, width, height]);

  return (
    <canvas
      ref={ref}
      className={glow ? `pix-glow pix-glow-${glow}` : "pix-canvas"}
      width={width}
      height={height}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
