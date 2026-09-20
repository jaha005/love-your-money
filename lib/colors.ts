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
//
// Zlatna iz brand.colors ima 2.75:1 na krem pozadini - dovoljno za površine
// (dugme, tanka linija), premalo za tekst. Zato --accent-text: ista boja,
// zatamnjena do 5.0:1. Zlatnu kao pozadinu uvijek prati tamni tekst (5.9:1).
export const cssVars = {
  "--bg": brand.colors.bg,
  "--text": brand.colors.text,
  "--accent": brand.colors.accent,
  "--accent-text": mix(brand.colors.accent, brand.colors.text, 0.35),
  "--accent-dark": mix(brand.colors.accent, brand.colors.text, 0.15),
  "--muted": brand.colors.muted,
  "--line": brand.colors.line,
  // Granica polja za unos mora imati 3:1 (WCAG 1.4.11), tanka linija kartice ne mora.
  "--line-strong": mix(brand.colors.line, brand.colors.muted, 0.7),
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
