// Applies the SQL files in supabase/migrations in order (each one once).
// Usage: npm run db:migrate

import { config } from "dotenv";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

config({ path: ".env.local" });

async function main() {
  const url = process.env.SUPABASE_DB_URL;
  if (!url) throw new Error("SUPABASE_DB_URL missing in .env.local");

  const sql = postgres(url, { ssl: "require", max: 1, onnotice: () => {} });

  try {
    await sql`create table if not exists public._migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )`;
    // Migration bookkeeping must not be reachable through the API.
    await sql`alter table public._migrations enable row level security`;

    const dir = join(process.cwd(), "supabase", "migrations");
    const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
    const applied = new Set((await sql`select name from public._migrations`).map((r) => r.name));

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`✓ ${file} (already applied)`);
        continue;
      }
      const body = readFileSync(join(dir, file), "utf8");
      await sql.begin(async (tx) => {
        await tx.unsafe(body);
        await tx`insert into public._migrations (name) values (${file})`;
      });
      console.log(`✓ ${file}`);
    }
    console.log("Migrations done.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
