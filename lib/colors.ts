import { brand } from "@/lib/brand";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ] as const;
}

function toHex(rgb: readonly number[]) {
  return "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}

/** Miješa dvije boje: amount 0 = a, 1 = b. */
export function mix(a: string, b: string, amount: number) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return toHex([ar + (br - ar) * amount, ag + (bg - ag) * amount, ab + (bb - ab) * amount]);
}

// Sve izvedeno iz brand.colors da se cijela paleta mijenja s jednog mjesta.
export const cssVars = {
  "--bg": brand.colors.bg,
  "--text": brand.colors.text,
  "--accent": brand.colors.accent,
  "--accent-dark": mix(brand.colors.accent, brand.colors.text, 0.28),
  "--muted": brand.colors.muted,
  "--line": brand.colors.line,
  "--tint": mix(brand.colors.bg, brand.colors.accent, 0.1),
  "--danger": "#B0342B",
} as const;

/** "251 248 241" - da Tailwind modifikatori prozirnosti (text-muted/70) rade. */
function rgbTriplet(hex: string) {
  return hexToRgb(hex).join(" ");
}

export function cssVarsString() {
  return Object.entries(cssVars)
    .flatMap(([k, v]) => [`${k}:${v}`, `${k}-rgb:${rgbTriplet(v)}`])
    .join(";");
}
