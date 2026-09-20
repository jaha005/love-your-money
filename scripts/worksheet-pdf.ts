// Generiše PDF radni list (naslov + 5 pitanja) iz sadržaja lekcije.
// Ako nađe sistemski TTF, koristi ga zbog naših dijakritika; inače prelazi
// na ugrađeni Helvetica i transliteraciju.

import { existsSync, readFileSync } from "node:fs";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { brand } from "../lib/brand";

const FONT_CANDIDATES = [
  "/System/Library/Fonts/Supplemental/Arial.ttf",
  "/Library/Fonts/Arial.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  "/usr/share/fonts/TTF/DejaVuSans.ttf",
];
const BOLD_CANDIDATES = [
  "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
  "/Library/Fonts/Arial Bold.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
];

const MAP: Record<string, string> = {
  č: "c", ć: "c", š: "s", ž: "z", đ: "d",
  Č: "C", Ć: "C", Š: "S", Ž: "Z", Đ: "D",
};
const ascii = (s: string) => s.replace(/[čćšžđČĆŠŽĐ]/g, (m) => MAP[m] ?? m);

function hexRgb(hex: string) {
  const h = hex.replace("#", "");
  return rgb(
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  );
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildWorksheet(title: string, questions: string[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const regularPath = FONT_CANDIDATES.find((p) => existsSync(p));
  const boldPath = BOLD_CANDIDATES.find((p) => existsSync(p));
  const unicode = Boolean(regularPath && boldPath);

  const body = unicode
    ? await doc.embedFont(readFileSync(regularPath!), { subset: true })
    : await doc.embedFont(StandardFonts.Helvetica);
  const head = unicode
    ? await doc.embedFont(readFileSync(boldPath!), { subset: true })
    : await doc.embedFont(StandardFonts.HelveticaBold);

  const t = (s: string) => (unicode ? s : ascii(s));

  const page = doc.addPage([595, 842]); // A4
  const M = 56;
  const width = 595 - M * 2;
  const text = hexRgb(brand.colors.text);
  const muted = hexRgb(brand.colors.muted);
  const line = hexRgb(brand.colors.line);
  const accent = hexRgb(brand.colors.accent);

  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: hexRgb(brand.colors.bg) });

  let y = 842 - M;

  page.drawText(t(brand.name.toUpperCase()), { x: M, y, size: 9, font: head, color: accent });
  y -= 34;

  for (const l of wrap(t(title), head, 22, width)) {
    page.drawText(l, { x: M, y, size: 22, font: head, color: text });
    y -= 28;
  }

  y -= 10;
  page.drawLine({
    start: { x: M, y },
    end: { x: 595 - M, y },
    thickness: 1,
    color: line,
  });
  y -= 34;

  questions.forEach((q, i) => {
    page.drawText(`${i + 1}.`, { x: M, y, size: 11, font: head, color: accent });
    for (const l of wrap(t(q), body, 11, width - 22)) {
      page.drawText(l, { x: M + 22, y, size: 11, font: body, color: text });
      y -= 16;
    }
    y -= 8;
    // Tri linije za pisanje.
    for (let k = 0; k < 3; k++) {
      page.drawLine({
        start: { x: M + 22, y },
        end: { x: 595 - M, y },
        thickness: 0.5,
        color: line,
      });
      y -= 22;
    }
    y -= 14;
  });

  page.drawText(t(`${brand.cohortName} · ${brand.coachName}`), {
    x: M,
    y: M - 16,
    size: 9,
    font: body,
    color: muted,
  });

  return doc.save();
}
