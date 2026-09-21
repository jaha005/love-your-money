import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme, brand } from "./theme";
import { sans, serif } from "./fonts";
import { Avatar, Btn, Card, Eyebrow, GoldLabel, H, Meter, P, Rise, Rule } from "./components/primitives";

const PAD = 140;

/** Every scene opens and closes with a calm fade. */
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
      <Eyebrow>A group programme</Eyebrow>
    </Rise>
    <div style={{ height: 32 }} />
    <Rise delay={14} distance={20}>
      <H size={96}>
        115 members. Eight modules.
        <br />
        Who has stalled?
      </H>
    </Rise>
    <div style={{ height: 40 }} />
    <Rise delay={38}>
      <P size={34} style={{ maxWidth: 1100 }}>
        A WhatsApp group won't tell you who stopped opening lessons, whose assignment has been
        waiting three weeks for review, or who hasn't been heard from since the last call.
      </P>
    </Rise>
  </Scene>
);

/** Member screen: next lesson, open assignment, next call. */
export const MemberHome: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => (
  <Scene durationInFrames={durationInFrames}>
    <Rise delay={4}>
      <Eyebrow>Member</Eyebrow>
    </Rise>
    <div style={{ height: 22 }} />
    <Rise delay={10} distance={18}>
      <H size={72}>Welcome back, Mia.</H>
    </Rise>
    <div style={{ height: 16 }} />
    <Rise delay={20}>
      <P size={28}>Module 4 · Pricing and getting paid · 2 of 3 lessons</P>
    </Rise>

    <div style={{ height: 44 }} />

    <Rise delay={30} distance={24}>
      <Card padding={40} style={{ maxWidth: 1180 }}>
        <Eyebrow>Next lesson</Eyebrow>
        <div style={{ height: 18 }} />
        <H size={54}>Getting paid: deadlines, reminders and when to stop working</H>
        <div style={{ height: 14 }} />
        <P size={26}>Module 4 · 11 min</P>
        <div style={{ height: 34 }} />
        <Btn>Continue lesson</Btn>
      </Card>
    </Rise>

    <div style={{ height: 28 }} />

    <div style={{ display: "flex", gap: 28, maxWidth: 1180 }}>
      <Rise delay={48} style={{ flex: 1 }}>
        <Card>
          <Eyebrow>Open assignment</Eyebrow>
          <div style={{ height: 14 }} />
          <H size={38}>A budget for next month</H>
          <div style={{ height: 10 }} />
          <P size={24}>Due in 4 days</P>
        </Card>
      </Rise>
      <Rise delay={58} style={{ flex: 1 }}>
        <Card>
          <Eyebrow>Next call</Eyebrow>
          <div style={{ height: 14 }} />
          <H size={38}>Reserve and savings</H>
          <div style={{ height: 10 }} />
          <P size={24}>25 September, 19:00</P>
        </Card>
      </Rise>
    </div>
  </Scene>
);

/** A lesson reads like an article, with the discussion and Andreja's reply below it. */
export const LessonAndDiscussion: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const lines = [
    "Unpaid work isn't work. It's a gift with an invoice.",
    "A deposit. For new clients, 30 to 50 percent up front.",
    "A deadline written as a number: 15 days from the invoice, not \"on completion\".",
  ];
  return (
    <Scene durationInFrames={durationInFrames}>
      <Rise delay={4}>
        <Eyebrow>Module 4 · Pricing and getting paid</Eyebrow>
      </Rise>
      <div style={{ height: 20 }} />
      <Rise delay={10} distance={18}>
        <H size={68}>Getting paid without apologising</H>
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
        <Btn variant="secondary">Download worksheet (PDF)</Btn>
      </Rise>

      <div style={{ height: 40 }} />
      <Rule delay={64} duration={34} width={1180} />
      <div style={{ height: 30 }} />

      <Rise delay={76}>
        <div style={{ display: "flex", gap: 20, maxWidth: 1180 }}>
          <Avatar name="Sara Lindqvist" size={52} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: sans, fontSize: 26, fontWeight: 500, color: theme.text }}>
                Sara Lindqvist
              </span>
              <span style={{ fontFamily: sans, fontSize: 21, color: theme.muted }}>3 days ago</span>
            </div>
            <div style={{ height: 8 }} />
            <P size={27} style={{ color: theme.text }}>
              A 30 percent deposit sounded rude to me until I saw that everyone does it.
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
          <Avatar name="Andreja Marin" size={52} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: sans, fontSize: 26, fontWeight: 500, color: theme.text }}>
                Andreja Marin
              </span>
              <GoldLabel>Andreja</GoldLabel>
            </div>
            <div style={{ height: 8 }} />
            <P size={27} style={{ color: theme.text }}>
              A deposit isn't mistrust — it's standard. The client who refuses one is usually the same one who pays the rest late.
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
      <Eyebrow>Assignments</Eyebrow>
    </Rise>
    <div style={{ height: 22 }} />
    <Rise delay={10} distance={18}>
      <H size={72}>You submit. Someone reads it. They answer.</H>
    </Rise>

    <div style={{ height: 44 }} />

    <div style={{ display: "flex", gap: 28, maxWidth: 1240, alignItems: "flex-start" }}>
      <Rise delay={26} style={{ flex: 1 }}>
        <Card>
          <Eyebrow>Your answer</Eyebrow>
          <div style={{ height: 16 }} />
          <P size={25} style={{ color: theme.text }}>
            Fixed 780, variable 600, occasional 200, room for life 90 euros. If the month goes
            badly, the reserve payment goes first.
          </P>
          <div style={{ height: 20 }} />
          <P size={22}>Submitted 14 September 2026</P>
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
          <Eyebrow color={theme.accentText}>Feedback</Eyebrow>
          <div style={{ height: 16 }} />
          <P size={25} style={{ color: theme.text }}>
            The budget works. One note: you didn't write what goes first if the month goes badly.
            Add it — it's the most important sentence in the assignment.
          </P>
          <div style={{ height: 20 }} />
          <P size={22}>Sophie Walsh · 16 September 2026</P>
        </div>
      </Rise>
    </div>
  </Scene>
);

/** Cohort map: 8 columns, a red dot on stalled members. */
export const Cohort: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const columns: { members: { name: string; stalled?: boolean }[] }[] = [
    { members: [] },
    { members: [{ name: "Lena Fischer" }] },
    { members: [{ name: "Kate Sullivan" }, { name: "Maya Price" }, { name: "Tara Quinn", stalled: true }] },
    { members: [{ name: "Mia Harper" }, { name: "Tessa Hughes" }] },
    { members: [{ name: "Chloe Turner" }, { name: "Daisy Clarke" }, { name: "Sara Lindqvist" }] },
    { members: [{ name: "Anna Reed" }, { name: "Lucy Morgan" }, { name: "Ivy Russo", stalled: true }] },
    { members: [{ name: "Isla Bennett" }, { name: "Nina Foster" }] },
    { members: [] },
  ];

  return (
    <Scene durationInFrames={durationInFrames}>
      <Rise delay={4}>
        <Eyebrow>Andreja · Cohort</Eyebrow>
      </Rise>
      <div style={{ height: 22 }} />
      <Rise delay={10} distance={18}>
        <H size={72}>See who is where. On one screen.</H>
      </Rise>

      <div style={{ height: 40 }} />

      <div style={{ display: "flex", gap: 22 }}>
        {[
          { v: "14", l: "Members enrolled" },
          { v: "11", l: "Active this week" },
          { v: "6", l: "Assignments to review" },
          { v: "2", l: "Stalled", danger: true },
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
        <Eyebrow>Cohort map</Eyebrow>
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

/** Filter to stalled + send a nudge. */
export const Reminder: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const sent = frame > 74;
  return (
    <Scene durationInFrames={durationInFrames}>
      <Rise delay={4}>
        <Eyebrow>Filter: stalled</Eyebrow>
      </Rise>
      <div style={{ height: 22 }} />
      <Rise delay={10} distance={18}>
        <H size={72}>Two have stalled. A nudge is one click.</H>
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
            <div style={{ flex: 2 }}>Name</div>
            <div style={{ flex: 1 }}>Module</div>
            <div style={{ flex: 1 }}>% of lessons</div>
            <div style={{ flex: 1.4 }}>Since activity</div>
            <div style={{ flex: 1 }}>Overdue</div>
            <div style={{ flex: 1.2 }}>Status</div>
          </div>
        </Rise>
        <Rule delay={22} duration={30} width="100%" />
        {[
          { name: "Ivy Russo", module: "6", pct: "33%", days: "18 days", late: "—" },
          { name: "Tara Quinn", module: "3", pct: "67%", days: "4 days", late: "2" },
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
                  Stalled
                </span>
              </div>
            </div>
          </Rise>
        ))}
      </div>

      <div style={{ height: 38 }} />
      <Rise delay={58}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <Btn variant="secondary">Send a nudge</Btn>
          <div style={{ opacity: sent ? 1 : 0, transition: "opacity 200ms" }}>
            <P size={26} style={{ color: theme.accentText }}>
              Nudge sent to 2
            </P>
          </div>
        </div>
      </Rise>
    </Scene>
  );
};

export const Features: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const items = [
    ["Curriculum", "Modules unlock on the cohort's schedule. Every lesson has its own link."],
    ["Assignments", "Submissions with attachments, a review queue, feedback the member sees."],
    ["Calls", "Zoom, recordings, notes, and questions grouped by module before the call."],
    ["Cohort", "Every member's status, stalled members first, a nudge in one click."],
  ];
  return (
    <Scene durationInFrames={durationInFrames}>
      <Rise delay={4}>
        <Eyebrow>What's inside</Eyebrow>
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
      <P size={36}>A demo platform for a group programme.</P>
    </Rise>
    <div style={{ height: 44 }} />
    <Rule delay={40} duration={40} color={theme.accentText} width={520} />
  </Scene>
);
