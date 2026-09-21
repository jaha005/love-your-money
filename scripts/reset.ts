// Wipes this project's schema so the migration can run again from scratch.
// Empties the storage buckets through the Storage API (direct deletes are blocked),
// then drops every table, view, function and storage policy the migration created.
// Usage: npm run db:reset   (then npm run db:migrate && npm run db:seed)

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = process.env.SUPABASE_DB_URL;
if (!url || !serviceKey || !dbUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_DB_URL are required.");
  process.exit(1);
}

const BUCKETS = ["worksheets", "submissions"];

async function emptyBuckets() {
  const api = createClient(url!, serviceKey!, { auth: { persistSession: false } });
  for (const bucket of BUCKETS) {
    // Submissions are stored one folder per member, so list two levels deep.
    const { data: top } = await api.storage.from(bucket).list("", { limit: 1000 });
    const paths: string[] = [];
    for (const entry of top ?? []) {
      if (entry.id) {
        paths.push(entry.name);
      } else {
        const { data: inner } = await api.storage.from(bucket).list(entry.name, { limit: 1000 });
        for (const f of inner ?? []) paths.push(`${entry.name}/${f.name}`);
      }
    }
    if (paths.length) await api.storage.from(bucket).remove(paths);
    console.log(`✓ emptied ${bucket} (${paths.length} files)`);
  }
}

async function main() {
  const sql = postgres(dbUrl!, { ssl: "require", max: 1, onnotice: () => {} });
  try {
    // Demo #1 (coach-portal) also has a public.profiles table. If SUPABASE_DB_URL
    // points there by mistake, this would drop it - so refuse before touching anything.
    const foreign = await sql`
      select table_name from information_schema.tables
      where table_schema = 'public'
        and table_name in ('checkins', 'workouts', 'progress_photos', 'client_status')`;
    if (foreign.length) {
      console.error(
        `✗ This database has ${foreign.map((r) => r.table_name).join(", ")} - that's demo #1 (coach-portal).\n` +
          `  Reset stopped before dropping anything. Fix SUPABASE_DB_URL in .env.local.`,
      );
      process.exit(1);
    }

    await emptyBuckets();

    // Storage policies: both the current names and the ones from earlier versions of this repo.
    const policies = await sql`
      select policyname from pg_policies
      where schemaname = 'storage' and tablename = 'objects'
        and (policyname like 'worksheets:%' or policyname like 'submissions:%')`;
    for (const { policyname } of policies) {
      await sql.unsafe(`drop policy if exists "${policyname}" on storage.objects`);
    }
    console.log(`✓ dropped ${policies.length} storage policies`);

    await sql.unsafe(`
      drop view if exists public.member_status cascade;
      drop view if exists public.public_profiles cascade;
      drop table if exists
        public.notices, public.weekly_reflections, public.call_questions, public.calls,
        public.lesson_comments, public.submissions, public.assignments, public.lesson_progress,
        public.lessons, public.modules, public.profiles, public._migrations
      cascade;
      drop function if exists
        public.app_today(), public.app_role(), public.is_admin(), public.is_staff(),
        public.is_assistant_of(uuid), public.my_assistant_id(), public.can_access_member(uuid),
        public.module_unlocked(uuid), public.protect_profile_fields(),
        public.can_access_member_folder(text)
      cascade;
    `);
    console.log("✓ dropped tables, views and functions");
  } finally {
    await sql.end();
  }
  console.log("Reset done. Now: npm run db:migrate && npm run db:seed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
