import type { ReactNode } from "react";
import { audio } from "@/game/audio";
import { palette } from "@/game/palette";
import { PixelText } from "@/components/PixelText";

type Variant = "solid" | "ghost" | "danger";

type PixButtonProps = {
  label: string;
  onClick: () => void;
  variant?: Variant;
  tiny?: boolean;
  disabled?: boolean;
  testId?: string;
  children?: ReactNode;
};

const LABEL: Record<Variant, string> = {
  solid: palette.void,
  ghost: palette.cyan,
  danger: palette.void,
};

export function PixButton({
  label,
  onClick,
  variant = "solid",
  tiny = false,
  disabled = false,
  testId,
}: PixButtonProps) {
  return (
    <button
      type="button"
      className={`pix-btn ${variant}${tiny ? " tiny" : ""}`}
      data-testid={testId}
      disabled={disabled}
      aria-label={label}
      onClick={() => {
        if (disabled) return;
        audio.unlock();
        audio.click();
        onClick();
      }}
    >
      <PixelText text={label} scale={tiny ? 2 : 3} color={LABEL[variant]} />
    </button>
  );
}
