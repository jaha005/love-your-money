// The only place with the programme name, colours and fonts.
// Concept project - a real person's name appears here and nowhere else.
export const brand = {
  name: "Love Your Money",
  tagline: "A programme for women who want peace with money.",
  logoText: "Love Your Money", // text logo, no image
  colors: {
    /** Page: warm, deeper cream. */
    bg: "#F4EEE2",
    /** Cards and panels: lighter than the page, so depth comes from tone, not shadow. */
    surface: "#FFFCF5",
    text: "#231F1A",
    /** Primary accent. */
    accent: "#B0882E",
    /** Second warm colour: avatars, highlights, labels. */
    accent2: "#9A5442",
    muted: "#645C53",
    line: "#DED5C3",
    danger: "#A63328",
  },
  fonts: {
    heading: "Plus Jakarta Sans",
    body: "Inter",
  },
  coachName: "Andreja",
  coachTitle: "Founder of the programme",
  cohortName: "Autumn 2026",
  timezone: "Europe/Zagreb",
  locale: "en-GB",
} as const;
