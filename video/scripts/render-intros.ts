// Renders one intro per module from the same content that seeds the database (scripts/content.ts),
// so titles are never duplicated. Output goes to the Next app's public/intro/.
// Usage: npm run intros   (from video/)

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { modules } from "../../scripts/content";

const OUT_DIR = resolve(__dirname, "../../public/intro");
mkdirSync(OUT_DIR, { recursive: true });

/** Headless Chrome occasionally dies mid-render; one retry keeps a set of clips complete. */
function run(args: string[]) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      execFileSync("npx", args, { stdio: "inherit", cwd: resolve(__dirname, "..") });
      return;
    } catch (err) {
      if (attempt === 2) throw err;
      console.log("  render failed, retrying once…");
    }
  }
}

for (let i = 0; i < modules.length; i++) {
  const m = modules[i];
  const props = {
    order: i + 1,
    title: m.title,
    subtitle: m.subtitle,
    lessons: m.lessons.length,
  };
  const out = join(OUT_DIR, `module-${i + 1}.mp4`);
  const poster = join(OUT_DIR, `module-${i + 1}.jpg`);
  console.log(`→ Module ${i + 1}: ${m.title}`);
  run(["remotion", "render", "ModuleIntro", out, `--props=${JSON.stringify(props)}`, "--log=error"]);
  // A still frame: the video poster, and the only thing shown when
  // prefers-reduced-motion.
  run(["remotion", "still", "ModuleIntro", poster, "--frame=120", `--props=${JSON.stringify(props)}`, "--log=error"]);
}

console.log(`\nDone. ${modules.length} intro clips in public/intro/`);
