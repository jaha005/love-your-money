import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme, brand } from "./theme";
import { sans, serif } from "./fonts";
import { Avatar, Btn, Card, Eyebrow, GoldLabel, H, Meter, P, Rise, Rule } from "./components/primitives";

const PAD = 140;

/** Svaki kadar se otvori i zatvori mirnim fadeom. */
export const Scene: React.FC<{ durationInFrames: number; children: React.ReactNode }> = ({
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(
    frame,
    [0, 12, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ background: theme.bg, opacity: o }}>
      <AbsoluteFill style={{ padding: PAD, justifyContent: "center" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------

export const Opening: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <Scene durationInFrames={durationInFrames}>
    <Rise delay={8}>
      <Eyebrow>{brand.cohortName}</Eyebrow>
    </Rise>
    <div style={{ height: 34 }} />
    <Rise delay={18} distance={22}>
      <H size={132}>{brand.logoText}</H>
    </Rise>
    <div style={{ height: 30 }} />
    <Rise delay={34}>
      <P size={40}>{brand.tagline}</P>
    </Rise>
    <div style={{ height: 54 }} />
    <Rule delay={46} duration={44} color={theme.accentText} width={520} />
  </Scene>
);

export const Problem: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <Scene durationInFrames={durationInFrames}>
    <Rise delay={6}>
      <Eyebrow>Grupni program</Eyebrow>
    </Rise>
    <div style={{ height: 32 }} />
    <Rise delay={14} distance={20}>
      <H size={96}>
        115 članica. Osam modula.
        <br />
        Ko je stala?
      </H>
    </Rise>
    <div style={{ height: 40 }} />
    <Rise delay={38}>
      <P size={34} style={{ maxWidth: 1100 }}>
        WhatsApp grupa ne pokazuje ko je prestao otvarati lekcije, čiji zadatak čeka pregled
        treću sedmicu i ko se nije javio od zadnjeg poziva.
      </P>
    </Rise>
  </Scene>
);

/** Ekran članice: sljedeća lekcija, otvoreni zadatak, sljedeći poziv. */
export const MemberHome: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <Scene durationInFrames={durationInFrames}>
    <Rise delay={4}>
      <Eyebrow>Članica</Eyebrow>
    </Rise>
    <div style={{ height: 22 }} />
    <Rise delay={10} distance={18}>
      <H size={72}>Dobrodošla nazad, Marija.</H>
    </Rise>
    <div style={{ height: 16 }} />
    <Rise delay={20}>
      <P size={28}>Modul 4 · Cijene i naplata · 2 od 3 lekcije</P>
    </Rise>

    <div style={{ height: 44 }} />

    <Rise delay={30} distance={24}>
      <Card padding={40} style={{ maxWidth: 1180 }}>
        <Eyebrow>Sljedeća lekcija</Eyebrow>
        <div style={{ height: 18 }} />
        <H size={54}>Naplata: rokovi, podsjetnici i kad prestati raditi</H>
        <div style={{ height: 14 }} />
        <P size={26}>Modul 4 · 11 min</P>
        <div style={{ height: 34 }} />
        <Btn>Nastavi lekciju</Btn>
      </Card>
    </Rise>

    <div style={{ height: 28 }} />

    <div style={{ display: "flex", gap: 28, maxWidth: 1180 }}>
      <Rise delay={48} style={{ flex: 1 }}>
        <Card>
          <Eyebrow>Otvoreni zadatak</Eyebrow>
          <div style={{ height: 14 }} />
          <H size={38}>Budžet za sljedeći mjesec</H>
          <div style={{ height: 10 }} />
          <P size={24}>Rok je danas</P>
        </Card>
      </Rise>
      <Rise delay={58} style={{ flex: 1 }}>
        <Card>
          <Eyebrow>Sljedeći poziv</Eyebrow>
          <div style={{ height: 14 }} />
          <H size={38}>Rezerva i štednja</H>
          <div style={{ height: 10 }} />
          <P size={24}>24. rujna u 19:00</P>
        </Card>
      </Rise>
    </div>
  </Scene>
);

/** Lekcija se čita kao članak, ispod nje diskusija s Andrejinim odgovorom. */
export const LessonAndDiscussion: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const lines = [
    "Nenaplaćen posao nije posao. To je poklon s fakturom.",
    "Avans. Za nove klijente 30 do 50 posto unaprijed.",
    "Rok napisan brojem: 15 dana od datuma računa, ne „po završetku“.",
  ];
  return (
    <Scene durationInFrames={durationInFrames}>
      <Rise delay={4}>
        <Eyebrow>Modul 4 · Cijene i naplata</Eyebrow>
      </Rise>
      <div style={{ height: 20 }} />
      <Rise delay={10} distance={18}>
        <H size={68}>Naplata bez izvinjavanja</H>
      </Rise>
      <div style={{ height: 30 }} />

      {lines.map((l, i) => (
        <Rise key={i} delay={22 + i * 8}>
          <div
            style={{
              fontFamily: sans,
              fontSize: 31,
              lineHeight: 1.7,
              color: theme.text,
              maxWidth: 1180,
            }}
          >
            {l}
          </div>
        </Rise>
      ))}

      <div style={{ height: 34 }} />
      <Rise delay={54}>
        <Btn variant="secondary">Preuzmi radni list (PDF)</Btn>
      </Rise>

      <div style={{ height: 40 }} />
      <Rule delay={64} duration={34} width={1180} />
      <div style={{ height: 30 }} />

      <Rise delay={76}>
        <div style={{ display: "flex", gap: 20, maxWidth: 1180 }}>
          <Avatar name="Sara Klarić" size={52} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: sans, fontSize: 26, fontWeight: 500, color: theme.text }}>
                Sara Klarić
              </span>
              <span style={{ fontFamily: sans, fontSize: 21, color: theme.muted }}>prije 3 dana</span>
            </div>
            <div style={{ height: 8 }} />
            <P size={27} style={{ color: theme.text }}>
              Avans od 30 posto mi je zvučao bezobrazno dok nisam vidjela da to svi rade.
            </P>
          </div>
        </div>
      </Rise>

      <div style={{ height: 26 }} />

      <Rise delay={98}>
        <div
          style={{
            display: "flex",
            gap: 20,
            maxWidth: 1180,
            marginLeft: 72,
            borderLeft: `1px solid ${theme.line}`,
            paddingLeft: 28,
          }}
        >
          <Avatar name="Andreja Katić" size={52} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: sans, fontSize: 26, fontWeight: 500, color: theme.text }}>
                Andreja Katić
              </span>
              <GoldLabel>Andreja</GoldLabel>
            </div>
            <div style={{ height: 8 }} />
            <P size={27} style={{ color: theme.text }}>
              Avans nije nepovjerenje nego standard. Klijent koji ga odbije obično je isti onaj koji kasni s ostatkom.
            </P>
          </div>
        </div>
      </Rise>
    </Scene>
  );
};

/** Zadatak → pregled → povratna informacija. */
export const Homework: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <Scene durationInFrames={durationInFrames}>
    <Rise delay={4}>
      <Eyebrow>Zadaci</Eyebrow>
    </Rise>
    <div style={{ height: 22 }} />
    <Rise delay={10} distance={18}>
      <H size={72}>Predaš. Neko pročita. Odgovori.</H>
    </Rise>

    <div style={{ height: 44 }} />

    <div style={{ display: "flex", gap: 28, maxWidth: 1240, alignItems: "flex-start" }}>
      <Rise delay={26} style={{ flex: 1 }}>
        <Card>
          <Eyebrow>Tvoj odgovor</Eyebrow>
          <div style={{ height: 16 }} />
          <P size={25} style={{ color: theme.text }}>
            Fiksno 780, promjenjivo 600, povremeno 200, prostor za život 90 eura. Ako mjesec bude
            loš, prvo pada uplata u rezervu.
          </P>
          <div style={{ height: 20 }} />
          <P size={22}>Predano 14. rujna 2026.</P>
        </Card>
      </Rise>

      <Rise delay={52} style={{ flex: 1 }}>
        <div
          style={{
            border: `1px solid ${theme.accentText}`,
            background: theme.tint,
            borderRadius: 8,
            padding: 34,
          }}
        >
          <Eyebrow color={theme.accentText}>Povratna informacija</Eyebrow>
          <div style={{ height: 16 }} />
          <P size={25} style={{ color: theme.text }}>
            Budžet radi. Jedina zamjerka: nisi napisala šta pada prvo ako mjesec bude loš. Dopiši
            to, to je najvažnija rečenica u zadatku.
          </P>
          <div style={{ height: 20 }} />
          <P size={22}>Petra Šimunović · 16. rujna 2026.</P>
        </div>
      </Rise>
    </div>
  </Scene>
);

/** Raspored kohorte: 8 kolona, crvena tačka na stalima. */
export const Cohort: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const columns: { members: { name: string; stalled?: boolean }[] }[] = [
    { members: [] },
    { members: [{ name: "Lana Brkić" }] },
    { members: [{ name: "Katarina Vuković" }, { name: "Maja Šimić" }, { name: "Tena Lovrić", stalled: true }] },
    { members: [{ name: "Marija Kovač" }, { name: "Tea Radić" }] },
    { members: [{ name: "Petra Novak" }, { name: "Dora Jurić" }, { name: "Sara Klarić" }] },
    { members: [{ name: "Ana Horvat" }, { name: "Lucija Marić" }, { name: "Iva Perić", stalled: true }] },
    { members: [{ name: "Ivana Babić" }, { name: "Nika Pavlović" }] },
    { members: [] },
  ];

  return (
    <Scene durationInFrames={durationInFrames}>
      <Rise delay={4}>
        <Eyebrow>Andreja · Kohorta</Eyebrow>
      </Rise>
      <div style={{ height: 22 }} />
      <Rise delay={10} distance={18}>
        <H size={72}>Vidiš ko je gdje. Na jednom ekranu.</H>
      </Rise>

      <div style={{ height: 40 }} />

      <div style={{ display: "flex", gap: 22 }}>
        {[
          { v: "14", l: "Članica u programu" },
          { v: "11", l: "Aktivnih ove sedmice" },
          { v: "6", l: "Zadataka za pregled" },
          { v: "2", l: "Stale", danger: true },
        ].map((s, i) => (
          <Rise key={s.l} delay={24 + i * 6} style={{ flex: 1 }}>
            <Card padding={26}>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 58,
                  color: s.danger ? theme.danger : theme.text,
                }}
              >
                {s.v}
              </div>
              <div style={{ height: 6 }} />
              <P size={22}>{s.l}</P>
            </Card>
          </Rise>
        ))}
      </div>

      <div style={{ height: 40 }} />
      <Rise delay={52}>
        <Eyebrow>Raspored kohorte</Eyebrow>
      </Rise>
      <div style={{ height: 18 }} />

      <div style={{ display: "flex", gap: 1, background: theme.line, border: `1px solid ${theme.line}` }}>
        {columns.map((col, i) => (
          <Rise key={i} delay={60 + i * 5} style={{ flex: 1 }}>
            <div style={{ background: theme.bg, padding: "20px 16px", minHeight: 250 }}>
              <div style={{ fontFamily: sans, fontSize: 20, letterSpacing: "0.14em", color: theme.muted }}>
                {i + 1}
              </div>
              <div style={{ height: 18 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {col.members.map((m) => (
                  <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar name={m.name} size={38} stalled={m.stalled} />
                    <span style={{ fontFamily: sans, fontSize: 19, color: theme.text }}>
                      {m.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
                {col.members.length === 0 ? (
                  <span style={{ fontFamily: sans, fontSize: 19, color: theme.muted }}>—</span>
                ) : null}
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </Scene>
  );
};

/** Filter na stale + podsjetnik. */
export const Reminder: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const sent = frame > 74;
  return (
    <Scene durationInFrames={durationInFrames}>
      <Rise delay={4}>
        <Eyebrow>Filter: stale</Eyebrow>
      </Rise>
      <div style={{ height: 22 }} />
      <Rise delay={10} distance={18}>
        <H size={72}>Dvije su stale. Podsjetnik je jedan klik.</H>
      </Rise>

      <div style={{ height: 44 }} />

      <div style={{ maxWidth: 1240 }}>
        <Rise delay={18}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 4px 14px",
              fontFamily: sans,
              fontSize: 21,
              color: theme.muted,
            }}
          >
            <div style={{ width: 40 }} />
            <div style={{ flex: 2 }}>Ime</div>
            <div style={{ flex: 1 }}>Modul</div>
            <div style={{ flex: 1 }}>% lekcija</div>
            <div style={{ flex: 1.4 }}>Od aktivnosti</div>
            <div style={{ flex: 1 }}>Kasni</div>
            <div style={{ flex: 1.2 }}>Status</div>
          </div>
        </Rise>
        <Rule delay={22} duration={30} width="100%" />
        {[
          { name: "Iva Perić", module: "6", pct: "33%", days: "18 dana", late: "—" },
          { name: "Tena Lovrić", module: "3", pct: "67%", days: "4 dana", late: "2" },
        ].map((r, i) => (
          <Rise key={r.name} delay={30 + i * 10}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "22px 4px",
                borderBottom: `1px solid ${theme.line}`,
                fontFamily: sans,
                fontSize: 25,
                color: theme.text,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <div style={{ width: 40 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: `1px solid ${theme.line}`,
                    background: sent ? theme.accent : "transparent",
                  }}
                />
              </div>
              <div style={{ flex: 2 }}>{r.name}</div>
              <div style={{ flex: 1 }}>{r.module}</div>
              <div style={{ flex: 1 }}>{r.pct}</div>
              <div style={{ flex: 1.4 }}>{r.days}</div>
              <div style={{ flex: 1, color: r.late === "—" ? theme.muted : theme.danger }}>{r.late}</div>
              <div style={{ flex: 1.2 }}>
                <span
                  style={{
                    border: `1px solid ${theme.danger}`,
                    color: theme.danger,
                    borderRadius: 6,
                    padding: "3px 12px",
                    fontSize: 20,
                  }}
                >
                  Stala
                </span>
              </div>
            </div>
          </Rise>
        ))}
      </div>

      <div style={{ height: 38 }} />
      <Rise delay={58}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <Btn variant="secondary">Pošalji podsjetnik</Btn>
          <div style={{ opacity: sent ? 1 : 0, transition: "opacity 200ms" }}>
            <P size={26} style={{ color: theme.accentText }}>
              Podsjetnik poslan: 2
            </P>
          </div>
        </div>
      </Rise>
    </Scene>
  );
};

export const Features: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const items = [
    ["Kurikulum", "Moduli se otključavaju po rasporedu kohorte. Svaka lekcija ima svoj link."],
    ["Zadaci", "Predaja s fajlom, red čekanja za pregled, feedback koji članica vidi."],
    ["Pozivi", "Zoom, snimke, bilješke i pitanja grupisana po modulu prije poziva."],
    ["Kohorta", "Status svake članice, stale prve, podsjetnik na jedan klik."],
  ];
  return (
    <Scene durationInFrames={durationInFrames}>
      <Rise delay={4}>
        <Eyebrow>Šta je unutra</Eyebrow>
      </Rise>
      <div style={{ height: 34 }} />
      <div style={{ maxWidth: 1300 }}>
        {items.map(([t, d], i) => (
          <Rise key={t} delay={14 + i * 12}>
            <div style={{ padding: "26px 0", borderBottom: `1px solid ${theme.line}` }}>
              <div style={{ display: "flex", gap: 40, alignItems: "baseline" }}>
                <div style={{ fontFamily: serif, fontSize: 44, color: theme.text, width: 280 }}>{t}</div>
                <P size={28} style={{ flex: 1 }}>
                  {d}
                </P>
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </Scene>
  );
};

export const Closing: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <Scene durationInFrames={durationInFrames}>
    <Rise delay={6}>
      <Eyebrow>{brand.cohortName}</Eyebrow>
    </Rise>
    <div style={{ height: 30 }} />
    <Rise delay={14} distance={22}>
      <H size={118}>{brand.logoText}</H>
    </Rise>
    <div style={{ height: 28 }} />
    <Rise delay={30}>
      <P size={36}>Demo platforme za grupni program.</P>
    </Rise>
    <div style={{ height: 44 }} />
    <Rule delay={40} duration={40} color={theme.accentText} width={520} />
  </Scene>
);
