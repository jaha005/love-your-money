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

const c = brand.colors;

// Sve izvedeno iz brand.colors da se paleta mijenja s jednog mjesta.
//
// Zlatna i glinena imaju dovoljan kontrast kao površina, ali ne kao tekst.
// Zato -text varijante: zatamnjene do 4.5:1 i na kartici i na tintu.
export const cssVars = {
  "--bg": c.bg,
  "--surface": c.surface,
  "--text": c.text,

  "--accent": c.accent,
  "--accent-text": mix(c.accent, c.text, 0.3),
  "--accent-dark": mix(c.accent, c.text, 0.16),
  "--accent2": c.accent2,
  "--accent2-text": mix(c.accent2, c.text, 0.12),

  "--muted": c.muted,
  "--line": c.line,
  // Granica polja za unos mora imati 3:1 (WCAG 1.4.11); linija kartice ne mora.
  "--line-strong": mix(c.line, c.muted, 0.65),

  "--tint": mix(c.surface, c.accent, 0.12),
  "--tint2": mix(c.surface, c.accent2, 0.1),
  "--danger": c.danger,
  "--danger-tint": mix(c.surface, c.danger, 0.09),
} as const;

/**
 * Tople boje za avatare i oznake statusa. Podloga je svijetla verzija boje,
 * tekst tamna - oba izvedena iz iste nijanse, sve preko 4.5:1.
 */
const HUES = {
  gold: c.accent,
  clay: c.accent2,
  sage: "#5F6B4F",
  plum: "#6E4458",
} as const;

export type HueName = keyof typeof HUES;

export function hueSurface(name: HueName) {
  return mix(c.surface, HUES[name], 0.17);
}
export function hueText(name: HueName) {
  return mix(HUES[name], c.text, 0.34);
}

/** Podloga oznake je blago svjetlija od avatara, da pill ne bude težak. */
export function statusColors(hue: HueName | "danger") {
  const base = hue === "danger" ? c.danger : HUES[hue];
  return { bg: mix(c.surface, base, 0.13), fg: mix(base, c.text, 0.34), border: mix(c.surface, base, 0.3) };
}

/** Uvijek isti avatar za isto ime. */
export function hueForName(name: string): HueName {
  const keys = Object.keys(HUES) as HueName[];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return keys[h % keys.length];
}

/** "244 238 226" - da Tailwind modifikatori prozirnosti rade. */
function rgbTriplet(hex: string) {
  return hexToRgb(hex).join(" ");
}

export function cssVarsString() {
  return Object.entries(cssVars)
    .flatMap(([k, v]) => [`${k}:${v}`, `${k}-rgb:${rgbTriplet(v)}`])
    .join(";");
}
