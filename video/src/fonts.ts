import { loadFont as loadHeading } from "@remotion/google-fonts/LibreBodoni";
import { loadFont as loadBody } from "@remotion/google-fonts/PublicSans";

// Same pairing as the app (lib/brand.ts -> app/layout.tsx).
const heading = loadHeading("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
});
const body = loadBody("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin", "latin-ext"],
});

export const serif = heading.fontFamily;
export const sans = body.fontFamily;
export const fontsReady = Promise.all([heading.waitUntilDone(), body.waitUntilDone()]);
