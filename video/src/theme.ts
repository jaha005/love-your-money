import { brand } from "../../lib/brand";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] as const;
}
function toHex(rgb: readonly number[]) {
  return "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}
function mix(a: string, b: string, t: number) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return toHex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
}

// Iste vrijednosti kao lib/colors.ts u aplikaciji.
export const theme = {
  bg: brand.colors.bg,
  text: brand.colors.text,
  accent: brand.colors.accent,
  accentText: mix(brand.colors.accent, brand.colors.text, 0.35),
  muted: brand.colors.muted,
  line: brand.colors.line,
  tint: mix(brand.colors.bg, brand.colors.accent, 0.1),
  danger: "#B0342B",
} as const;

export { brand };

export const FPS = 30;
export const W = 1920;
export const H = 1080;
