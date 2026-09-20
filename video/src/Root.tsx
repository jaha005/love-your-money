import React from "react";
import { Composition } from "remotion";
import { FPS, H, W } from "./theme";
import { Promo, PROMO_DURATION } from "./Promo";
import { ModuleIntro, moduleIntroSchema } from "./ModuleIntro";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Promo"
      component={Promo}
      durationInFrames={PROMO_DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="ModuleIntro"
      component={ModuleIntro}
      durationInFrames={180}
      fps={FPS}
      width={W}
      height={H}
      schema={moduleIntroSchema}
      defaultProps={{
        order: 4,
        title: "Budžet bez odricanja",
        subtitle: "Plan koji izdrži i loš mjesec",
        lessons: 3,
      }}
    />
  </>
);
