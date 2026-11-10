/** Keep hex values aligned with tokens in src/styles.css. Canvas cannot read Tailwind classes. */
export const palette = {
  void: "#07080b",
  ink: "#0e1116",
  panel: "#161b22",
  metal: "#2c343f",
  edge: "#46515e",
  cyan: "#3de2ff",
  cyanDim: "#0c4a58",
  amber: "#ffb020",
  amberDim: "#6a4308",
  danger: "#ff3b3b",
  dangerDim: "#6e1a22",
  ok: "#3dff9a",
  okDim: "#0e5c36",
  paper: "#d5e7ee",
  mute: "#7f8c96",
} as const;

export type Tone = keyof typeof palette;
