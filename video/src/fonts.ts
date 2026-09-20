import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const fraunces = loadFraunces("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
const inter = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });

export const serif = fraunces.fontFamily;
export const sans = inter.fontFamily;
export const fontsReady = Promise.all([fraunces.waitUntilDone(), inter.waitUntilDone()]);
