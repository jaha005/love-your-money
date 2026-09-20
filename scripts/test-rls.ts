// Provjerava Row Level Security pravim prijavama (anon ključ, bez service role).
// Pokretanje: npm run test:rls   (nakon npm run db:seed)

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
  if (error) throw new Error(`prijava ${email}: ${error.message}`);
  return client;
}

async function main() {
  const admin = createClient(url, service, { auth: { persistSession: false } });

  const { data: people } = await admin.from("profiles").select("id, full_name, role, assistant_id");
  const byName = (n: string) => people!.find((p) => p.full_name.startsWith(n))!;

  const petra = byName("Petra Š"); // asistentica
  const ivanaA = byName("Ivana G"); // druga asistentica
  const marija = byName("Marija"); // Petrina članica
  const dora = byName("Dora"); // Ivanina članica

  const petraMembers = people!.filter((p) => p.assistant_id === petra.id).length;

  // --- Asistentica (Petra) ---
  const assistant = await login("petra@demo.local");

  const a1 = await assistant.from("profiles").select("id").eq("id", dora.id);
  check("asistentica ne može dohvatiti tuđu članicu (profiles)", (a1.data ?? []).length === 0, a1);

  const a2 = await assistant.from("submissions").select("id").eq("member_id", dora.id);
  check("asistentica ne vidi predaje tuđe članice", (a2.data ?? []).length === 0, a2.data?.length);

  const a3 = await assistant.from("weekly_reflections").select("id").eq("member_id", dora.id);
  check("asistentica ne vidi refleksije tuđe članice", (a3.data ?? []).length === 0, a3.data?.length);

  const a4 = await assistant.from("member_status").select("member_id");
  check(
    `asistentica u member_status vidi samo svoje članice (${petraMembers})`,
    a4.data?.length === petraMembers,
    a4.data?.length,
  );

  const a5 = await assistant.from("submissions").select("id").eq("member_id", marija.id);
  check("asistentica vidi predaje svoje članice", (a5.data ?? []).length > 0, a5.error);

  const a6 = await assistant.from("modules").update({ title: "hack" }).eq("sort_order", 1).select("id");
  check("asistentica ne može mijenjati module", (a6.data ?? []).length === 0, a6.data);

  // --- Članica (Marija) ---
  const member = await login("clanica@demo.local");

  const m1 = await member.from("profiles").select("id").eq("id", dora.id);
  check("članica ne može dohvatiti profil druge članice", (m1.data ?? []).length === 0, m1.data);

  const m2 = await member.from("submissions").select("id").eq("member_id", dora.id);
  check("članica ne vidi tuđe predaje", (m2.data ?? []).length === 0, m2.data?.length);

  const m3 = await member.from("weekly_reflections").select("id").eq("member_id", dora.id);
  check("članica ne vidi tuđe refleksije", (m3.data ?? []).length === 0, m3.data?.length);

  const m4 = await member.from("lesson_comments").select("id").limit(5);
  check("članica čita javnu diskusiju ispod lekcija", (m4.data ?? []).length > 0, m4.error);

  const m5 = await member.from("public_profiles").select("id, full_name").eq("id", dora.id);
  check("članica vidi ime autora komentara kroz public_profiles", (m5.data ?? []).length === 1, m5);

  const { data: doraLesson } = await admin
    .from("lesson_progress")
    .select("lesson_id")
    .eq("member_id", dora.id)
    .limit(1)
    .single();
  const m6 = await member
    .from("lesson_progress")
    .insert({ member_id: dora.id, lesson_id: doraLesson!.lesson_id })
    .select("id");
  check("članica ne može upisati napredak umjesto druge", Boolean(m6.error), m6.data);

  const { data: mySubmission } = await admin
    .from("submissions")
    .select("id")
    .eq("member_id", marija.id)
    .eq("status", "pending")
    .limit(1)
    .single();
  const m7 = await member
    .from("submissions")
    .update({ status: "reviewed", feedback: "sama sebi" })
    .eq("id", mySubmission!.id)
    .select("id");
  check("članica ne može sama označiti predaju pregledanom", (m7.data ?? []).length === 0, m7.data);

  const m8 = await member.from("call_questions").select("id").neq("member_id", marija.id);
  check("članica ne vidi tuđa pitanja za poziv", (m8.data ?? []).length === 0, m8.data?.length);

  const m9 = await member.from("notices").select("id").eq("member_id", dora.id);
  check("članica ne vidi tuđe podsjetnike", (m9.data ?? []).length === 0, m9.data?.length);

  // --- Storage ---
  const { data: doraFile } = await admin
    .from("submissions")
    .select("file_path")
    .eq("member_id", dora.id)
    .not("file_path", "is", null)
    .limit(1)
    .maybeSingle();
  if (doraFile?.file_path) {
    const s1 = await member.storage.from("submissions").download(doraFile.file_path);
    check("članica ne može preuzeti tuđi priloženi fajl", Boolean(s1.error), s1.data);
  } else {
    console.log("· (nema priloženih fajlova u seedu, storage test preskočen)");
  }

  const s2 = await member.storage.from("worksheets").list();
  check("članica može listati radne listove", !s2.error, s2.error);

  // --- Admin ---
  const andreja = await login("andreja@demo.local");
  const ad1 = await andreja.from("member_status").select("member_id");
  const totalMembers = people!.filter((p) => p.role === "member").length;
  check(`Andreja vidi cijelu kohortu (${totalMembers})`, ad1.data?.length === totalMembers, ad1.data?.length);

  const ad2 = await andreja.from("submissions").select("id").eq("member_id", dora.id);
  check("Andreja vidi predaje svake članice", (ad2.data ?? []).length > 0, ad2.error);

  console.log(
    failures === 0 ? "\nSvi RLS testovi prošli." : `\n${failures} RLS ${failures === 1 ? "test" : "testova"} nije prošlo.`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
