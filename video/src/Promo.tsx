import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { theme } from "./theme";
import {
  Closing,
  Cohort,
  Features,
  Homework,
  LessonAndDiscussion,
  MemberHome,
  Opening,
  Problem,
  Reminder,
} from "./scenes";

// Kadrovi u sekundama pri 30 fps. Ukupno 72 s.
const SCENES: { component: React.FC<{ durationInFrames: number }>; seconds: number }[] = [
  { component: Opening, seconds: 5 },
  { component: Problem, seconds: 8 },
  { component: MemberHome, seconds: 9 },
  { component: LessonAndDiscussion, seconds: 11 },
  { component: Homework, seconds: 8 },
  { component: Cohort, seconds: 10 },
  { component: Reminder, seconds: 9 },
  { component: Features, seconds: 7 },
  { component: Closing, seconds: 5 },
];

export const FPS = 30;
export const PROMO_DURATION = SCENES.reduce((n, s) => n + s.seconds * FPS, 0);

export const Promo: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {SCENES.map(({ component: C, seconds }, i) => {
        const durationInFrames = seconds * FPS;
        const start = from;
        from += durationInFrames;
        return (
          <Sequence key={i} from={start} durationInFrames={durationInFrames}>
            <C durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
