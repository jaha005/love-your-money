// Verifies Row Level Security with real sign-ins (publishable key, no service role).
// Usage: npm run test:rls   (after npm run db:seed)

import { config } from "dotenv";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PASSWORD = process.env.DEMO_PASSWORD || "demo1234";

let failures = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? "✓" : "✗"} ${name}${ok ? "" : ` -> ${JSON.stringify(detail)}`}`);
  if (!ok) failures++;
}

async function login(email: string): Promise<SupabaseClient> {
  const client = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.auth.signInWithPassword({ email, password: PASSWORD });
  if (error) throw new Error(`sign-in ${email}: ${error.message}`);
  return client;
}

async function main() {
  const admin = createClient(url, service, { auth: { persistSession: false } });

  const { data: people } = await admin.from("profiles").select("id, full_name, role, assistant_id");
  const byName = (n: string) => people!.find((p) => p.full_name.startsWith(n))!;

  const sophie = byName("Sophie"); // assistant
  const mia = byName("Mia"); // Sophie's member
  const daisy = byName("Daisy"); // Hannah's member

  const sophieMembers = people!.filter((p) => p.assistant_id === sophie.id).length;

  // --- Assistant (Sophie) ---
  const assistant = await login("assistant@demo.local");

  const a1 = await assistant.from("profiles").select("id").eq("id", daisy.id);
  check("assistant cannot fetch another assistant's member (profiles)", (a1.data ?? []).length === 0, a1);

  const a2 = await assistant.from("submissions").select("id").eq("member_id", daisy.id);
  check("assistant cannot see another assistant's member's submissions", (a2.data ?? []).length === 0, a2.data?.length);

  const a3 = await assistant.from("weekly_reflections").select("id").eq("member_id", daisy.id);
  check("assistant cannot see another assistant's member's reflections", (a3.data ?? []).length === 0, a3.data?.length);

  const a4 = await assistant.from("member_status").select("member_id");
  check(
    `assistant sees only her own members in member_status (${sophieMembers})`,
    a4.data?.length === sophieMembers,
    a4.data?.length,
  );

  const a5 = await assistant.from("submissions").select("id").eq("member_id", mia.id);
  check("assistant can see her own member's submissions", (a5.data ?? []).length > 0, a5.error);

  const a6 = await assistant.from("modules").update({ title: "hack" }).eq("sort_order", 1).select("id");
  check("assistant cannot edit modules", (a6.data ?? []).length === 0, a6.data);

  // --- Member (Mia) ---
  const member = await login("member@demo.local");

  const m1 = await member.from("profiles").select("id").eq("id", daisy.id);
  check("member cannot fetch another member's profile", (m1.data ?? []).length === 0, m1.data);

  const m2 = await member.from("submissions").select("id").eq("member_id", daisy.id);
  check("member cannot see another member's submissions", (m2.data ?? []).length === 0, m2.data?.length);

  const m3 = await member.from("weekly_reflections").select("id").eq("member_id", daisy.id);
  check("member cannot see another member's reflections", (m3.data ?? []).length === 0, m3.data?.length);

  const m4 = await member.from("lesson_comments").select("id").limit(5);
  check("member can read the public discussion under lessons", (m4.data ?? []).length > 0, m4.error);

  const m5 = await member.from("public_profiles").select("id, full_name").eq("id", daisy.id);
  check("member sees a comment author's name through public_profiles", (m5.data ?? []).length === 1, m5);

  const { data: daisyLesson } = await admin
    .from("lesson_progress")
    .select("lesson_id")
    .eq("member_id", daisy.id)
    .limit(1)
    .single();
  const m6 = await member
    .from("lesson_progress")
    .insert({ member_id: daisy.id, lesson_id: daisyLesson!.lesson_id })
    .select("id");
  check("member cannot record progress on someone else's behalf", Boolean(m6.error), m6.data);

  const { data: mySubmission } = await admin
    .from("submissions")
    .select("id")
    .eq("member_id", mia.id)
    .eq("status", "pending")
    .limit(1)
    .single();
  const m7 = await member
    .from("submissions")
    .update({ status: "reviewed", feedback: "reviewing myself" })
    .eq("id", mySubmission!.id)
    .select("id");
  check("member cannot mark her own submission as reviewed", (m7.data ?? []).length === 0, m7.data);

  const m8 = await member.from("call_questions").select("id").neq("member_id", mia.id);
  check("member cannot see other members' call questions", (m8.data ?? []).length === 0, m8.data?.length);

  const m9 = await member.from("notices").select("id").eq("member_id", daisy.id);
  check("member cannot see other members' nudges", (m9.data ?? []).length === 0, m9.data?.length);

  // --- Storage ---
  const { data: daisyFile } = await admin
    .from("submissions")
    .select("file_path")
    .eq("member_id", daisy.id)
    .not("file_path", "is", null)
    .limit(1)
    .maybeSingle();
  if (daisyFile?.file_path) {
    const s1 = await member.storage.from("submissions").download(daisyFile.file_path);
    check("member cannot download another member's attachment", Boolean(s1.error), s1.data);
  } else {
    console.log("· (no attachments in the seed, storage test skipped)");
  }

  const s2 = await member.storage.from("worksheets").list();
  check("member can list worksheets", !s2.error, s2.error);

  // --- Admin ---
  const andreja = await login("andreja@demo.local");
  const ad1 = await andreja.from("member_status").select("member_id");
  const totalMembers = people!.filter((p) => p.role === "member").length;
  check(`Andreja sees the whole cohort (${totalMembers})`, ad1.data?.length === totalMembers, ad1.data?.length);

  const ad2 = await andreja.from("submissions").select("id").eq("member_id", daisy.id);
  check("Andreja can see every member's submissions", (ad2.data ?? []).length > 0, ad2.error);

  console.log(
    failures === 0 ? "\nAll RLS checks passed." : `\n${failures} RLS ${failures === 1 ? "check" : "checks"} failed.`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
