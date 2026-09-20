import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { theme, brand } from "./theme";
import { sans } from "./fonts";
import { Eyebrow, H, P, Rise, Rule } from "./components/primitives";

export const moduleIntroSchema = z.object({
  order: z.number().int().min(1).max(99),
  title: z.string(),
  subtitle: z.string(),
  lessons: z.number().int().min(1).max(20),
});

export type ModuleIntroProps = z.infer<typeof moduleIntroSchema>;

/**
 * Šest sekundi mira prije lekcije: broj modula, naslov, podnaslov.
 * Namjerno bez zvuka, bez gradijenata i bez brzog kretanja - ide ispred
 * teksta koji se čita kao članak.
 */
export const ModuleIntro: React.FC<ModuleIntroProps> = ({ order, title, subtitle, lessons }) => {
  // Klip stoji u stranici kao blok, pa mora završiti na punoj naslovnoj kartici -
  // fade na kraju bi ostavio crni okvir kad se video zaustavi.
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <AbsoluteFill style={{ padding: 120, justifyContent: "center" }}>
        <Rise delay={6}>
          <Eyebrow>{brand.name}</Eyebrow>
        </Rise>

        <div style={{ height: 40 }} />

        <Rise delay={16}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
            <div
              style={{
                fontFamily: sans,
                fontSize: 30,
                letterSpacing: "0.14em",
                color: theme.accentText,
              }}
            >
              MODUL {String(order).padStart(2, "0")}
            </div>
            <div style={{ flex: 1 }}>
              <Rule delay={24} duration={40} color={theme.accentText} />
            </div>
          </div>
        </Rise>

        <div style={{ height: 28 }} />

        <Rise delay={30} distance={20}>
          <H size={104}>{title}</H>
        </Rise>

        <div style={{ height: 24 }} />

        <Rise delay={44}>
          <P size={36}>{subtitle}</P>
        </Rise>

        <div style={{ height: 56 }} />

        <Rise delay={58}>
          <P size={24} style={{ color: theme.muted }}>
            {lessons} {lessons === 1 ? "lekcija" : lessons < 5 ? "lekcije" : "lekcija"} · {brand.cohortName}
          </P>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
