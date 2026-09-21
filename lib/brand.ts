// Jedino mjesto s imenom programa, bojama i fontovima.
// Concept project - ime stvarne osobe je samo ovdje.
export const brand = {
  name: "Zavoli svoj novac",
  tagline: "Program za žene koje žele mir s novcem.",
  logoText: "Zavoli svoj novac", // tekstualni logo, bez slike
  colors: {
    /** Stranica: topli, dublji krem. */
    bg: "#F4EEE2",
    /** Kartice i paneli: svjetlije od stranice, pa dubina dolazi iz tona a ne iz sjene. */
    surface: "#FFFCF5",
    text: "#231F1A",
    /** Primarni akcent. */
    accent: "#B0882E",
    /** Druga topla boja: avatari, naglasci, oznake. */
    accent2: "#9A5442",
    muted: "#645C53",
    line: "#DED5C3",
    danger: "#A63328",
  },
  fonts: {
    heading: "Libre Bodoni",
    body: "Public Sans",
  },
  coachName: "Andreja",
  coachTitle: "Osnivačica programa",
  cohortName: "Jesen 2026",
  timezone: "Europe/Zagreb",
} as const;
