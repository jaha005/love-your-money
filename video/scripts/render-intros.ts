// Renderuje intro po modulu iz istog sadržaja koji puni bazu (scripts/content.ts),
// pa se naslovi ne dupliraju. Izlaz ide u public/intro/ Next aplikacije.
// Pokretanje: npm run intros   (iz video/)

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { modules } from "../../scripts/content";

const OUT_DIR = resolve(__dirname, "../../public/intro");
mkdirSync(OUT_DIR, { recursive: true });

for (let i = 0; i < modules.length; i++) {
  const m = modules[i];
  const props = {
    order: i + 1,
    title: m.title,
    subtitle: m.subtitle,
    lessons: m.lessons.length,
  };
  const out = join(OUT_DIR, `modul-${i + 1}.mp4`);
  const poster = join(OUT_DIR, `modul-${i + 1}.jpg`);
  console.log(`→ Modul ${i + 1}: ${m.title}`);
  execFileSync(
    "npx",
    ["remotion", "render", "ModuleIntro", out, `--props=${JSON.stringify(props)}`, "--log=error"],
    { stdio: "inherit", cwd: resolve(__dirname, "..") },
  );
  // Statična sličica: poster za video i jedini prikaz kad je uključen
  // prefers-reduced-motion.
  execFileSync(
    "npx",
    ["remotion", "still", "ModuleIntro", poster, "--frame=120", `--props=${JSON.stringify(props)}`, "--log=error"],
    { stdio: "inherit", cwd: resolve(__dirname, "..") },
  );
}

console.log(`\nGotovo. ${modules.length} intro klipova u public/intro/`);
