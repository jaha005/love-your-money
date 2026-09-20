// Demo podaci: Andreja, 2 asistentice, 14 članica, 8 modula × 3 lekcije,
// zadaci, predaje s feedbackom, komentari, pozivi, pitanja i refleksije.
// Može se pokretati više puta: prvo briše prethodne @demo.local naloge i sadržaj.
// Pokretanje: npm run db:seed

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { brand } from "../lib/brand";
import { addDaysISO, todayISO, weekStartISO } from "../lib/dates";
import { modules as CONTENT } from "./content";
import { buildWorksheet } from "./worksheet-pdf";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY nedostaju u .env.local");
  process.exit(1);
}
const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = process.env.DEMO_PASSWORD || "demo1234";
const TODAY = todayISO();

// Raspored: modul n se otključava (8 - n) sedmica prije danas; modul 8 tek za sedmicu.
const unlockFor = (order: number) => addDaysISO(TODAY, -(8 - order) * 7);
// Rok zadatka: 5 sedmica nakon otključavanja modula.
const dueFor = (order: number) => addDaysISO(unlockFor(order), 35);

const daysAgo = (n: number, hour = 10) =>
  new Date(`${addDaysISO(TODAY, -n)}T${String(hour).padStart(2, "0")}:00:00Z`).toISOString();

function must<T = unknown>(result: { data: unknown; error: unknown }, what: string): T {
  if (result.error || result.data === null) {
    console.error(`✗ ${what}`, result.error);
    process.exit(1);
  }
  return result.data as T;
}

// ---------------------------------------------------------------------------
// Ljudi
// ---------------------------------------------------------------------------

const admin = { key: "andreja", email: "andreja@demo.local", full_name: "Andreja Katić" };

const assistants = [
  { key: "petra", email: "petra@demo.local", full_name: "Petra Šimunović" },
  { key: "ivana", email: "ivana@demo.local", full_name: "Ivana Grgić" },
];

type SeedMember = {
  key: string;
  email: string;
  full_name: string;
  assistant: string;
  /** Modul u kojem je (ima bar jednu završenu lekciju). */
  module: number;
  /** Koliko lekcija je završila u tom modulu. */
  lessonsInModule: number;
  /** Dana od zadnje aktivnosti (postavlja se kroz zadnji lesson_progress). */
  lastActivity: number;
  /** Za koje module je predala zadatak. */
  submitted: number[];
  joinedDaysAgo: number;
};

// 9 active (≤7 dana, 0 kasni) · 3 slowing (8-14 dana ILI 1 kasni) · 2 stalled (15+ ILI 2+ kasne)
const members: SeedMember[] = [
  { key: "marija", email: "clanica@demo.local", full_name: "Marija Kovač", assistant: "petra", module: 4, lessonsInModule: 2, lastActivity: 1, submitted: [1, 2], joinedDaysAgo: 49 },
  { key: "ana", email: "ana@demo.local", full_name: "Ana Horvat", assistant: "petra", module: 6, lessonsInModule: 1, lastActivity: 2, submitted: [1, 2, 3], joinedDaysAgo: 49 },
  { key: "ivana_b", email: "ivana.babic@demo.local", full_name: "Ivana Babić", assistant: "ivana", module: 7, lessonsInModule: 2, lastActivity: 0, submitted: [1, 2, 3, 4], joinedDaysAgo: 49 },
  { key: "petra_n", email: "petra.novak@demo.local", full_name: "Petra Novak", assistant: "petra", module: 5, lessonsInModule: 3, lastActivity: 3, submitted: [1, 2, 3], joinedDaysAgo: 49 },
  { key: "lucija", email: "lucija@demo.local", full_name: "Lucija Marić", assistant: "ivana", module: 6, lessonsInModule: 2, lastActivity: 1, submitted: [1, 2, 3], joinedDaysAgo: 49 },
  { key: "katarina", email: "katarina@demo.local", full_name: "Katarina Vuković", assistant: "petra", module: 3, lessonsInModule: 1, lastActivity: 4, submitted: [1, 2], joinedDaysAgo: 42 },
  { key: "dora", email: "dora@demo.local", full_name: "Dora Jurić", assistant: "ivana", module: 5, lessonsInModule: 2, lastActivity: 6, submitted: [1, 2], joinedDaysAgo: 49 },
  { key: "nika", email: "nika@demo.local", full_name: "Nika Pavlović", assistant: "ivana", module: 7, lessonsInModule: 1, lastActivity: 2, submitted: [1, 2, 3, 4], joinedDaysAgo: 49 },
  { key: "tea", email: "tea@demo.local", full_name: "Tea Radić", assistant: "petra", module: 4, lessonsInModule: 3, lastActivity: 5, submitted: [1, 2], joinedDaysAgo: 42 },
  // usporile
  { key: "maja", email: "maja@demo.local", full_name: "Maja Šimić", assistant: "petra", module: 3, lessonsInModule: 2, lastActivity: 10, submitted: [1, 2], joinedDaysAgo: 49 },
  { key: "sara", email: "sara@demo.local", full_name: "Sara Klarić", assistant: "ivana", module: 5, lessonsInModule: 1, lastActivity: 3, submitted: [1], joinedDaysAgo: 49 },
  { key: "lana", email: "lana@demo.local", full_name: "Lana Brkić", assistant: "petra", module: 2, lessonsInModule: 2, lastActivity: 12, submitted: [1, 2], joinedDaysAgo: 42 },
  // stale
  { key: "iva", email: "iva@demo.local", full_name: "Iva Perić", assistant: "ivana", module: 6, lessonsInModule: 1, lastActivity: 18, submitted: [1, 2, 3], joinedDaysAgo: 49 },
  { key: "tena", email: "tena@demo.local", full_name: "Tena Lovrić", assistant: "petra", module: 3, lessonsInModule: 2, lastActivity: 4, submitted: [], joinedDaysAgo: 49 },
];

// Predaje koje čekaju pregled (ostale su pregledane s feedbackom).
const PENDING = new Set(["marija:2", "ana:3", "ivana_b:4", "dora:2", "nika:4", "lucija:3"]);

const FEEDBACK: Record<string, string> = {
  "marija:1":
    "Marija, ovo je iskreno napisano i to je pola posla. Obrazac stezanja koji opisuješ vidim i u tvojoj mapi troškova — kategorija „povremeno\" ti je prazna, a ti kupuješ te stvari. U modulu 3 posebno pazi na prostor za život: tvoj instinkt će biti da ga staviš premali.",
  "ana:1":
    "Ana, hvala na povjerenju. Rečenica „nisam smjela tražiti\" objašnjava puno toga u modulu 4. Zapamti je, vratit ćemo joj se kad budemo pisale ponudu.",
  "ana:2":
    "Mapa je uredna i potpuna. Nevidljiva kanta ti je 11 posto prihoda — to je najveća koju sam vidjela ove kohorte. Prođi kroz pretplate ovog vikenda, ne odlučuj ništa, samo popiši.",
  "ivana_b:1":
    "Jasno i bez uljepšavanja. Obrazac izbjegavanja je tu, ali ga već prepoznaješ sama, što znači da si pola koraka ispred.",
  "ivana_b:2":
    "Odlična mapa. Primijetila sam da si troškove za djecu stavila u fiksno — probaj ih razdvojiti, dio je zapravo povremeno i zato te iznenađuje.",
  "ivana_b:3":
    "Budžet je realan i to je najvažnije. Prostor za život od 6 posto je taman. Ostavi ga tako dva mjeseca prije nego bilo šta mijenjaš.",
  "petra_n:1": "Petra, lijepo napisano. Vratit ćemo se na treću rečenicu na pozivu.",
  "petra_n:2":
    "Mapa je kompletna. Kanta „povremeno\" ti je 240 eura mjesečno prosječno — to je iznos koji ti je do sada rušio svaki plan. Sad ga imaš na papiru.",
  "petra_n:3":
    "Budžet radi. Jedina zamjerka: nisi napisala šta pada prvo ako mjesec bude loš. Dopiši to, to je najvažnija rečenica u zadatku.",
  "lucija:1": "Hvala, Lucija. Obrazac rasipanja kao olakšanja opisan je tačno i bez osude prema sebi. Rijetko.",
  "lucija:2": "Uredna mapa. Gorivo i hrana su ti u istoj kategoriji — razdvoji ih, ponašaju se drugačije.",
  "katarina:1": "Katarina, dobro. U modulu 2 se fokusiraj na nevidljivu kantu, mislim da te tamo čeka iznenađenje.",
  "katarina:2": "Mapa je dobra. Sad nemoj ništa mijenjati do poziva — prvi pogled je samo gledanje.",
  "dora:1": "Dora, iskreno i korisno. Sviđa mi se što si pisala bez pridjeva, to nije lako iz prve.",
  "nika:1": "Nika, jako dobro. Rečenica o zubaru se ponavlja kod pola grupe.",
  "nika:2": "Mapa je potpuna i uredna. Nevidljiva kanta je mala, to je rijetko.",
  "nika:3": "Budžet je dobar i konzervativan. Možda i previše — dodaj si 20 eura prostora za život.",
  "tea:1": "Tea, hvala. Ostavi ovaj tekst negdje gdje ćeš ga naći za šest mjeseci.",
  "tea:2": "Mapa je dobra. Tri rečenice na kraju su najbolji dio zadatka.",
  "maja:1": "Maja, dobro napisano. Javi se asistentici ako zapneš, tu smo.",
  "maja:2": "Mapa je uredna. Povremena kanta ti fali gotovo cijela, dopuni je iz izvoda.",
  "sara:1": "Sara, lijepo. Obrazac izbjegavanja je tu, ali je i volja da ga se gleda.",
  "lana:1": "Lana, hvala. Nemoj žuriti s modulom 2, mapa traži četiri sedmice i to je u redu.",
  "lana:2": "Mapa je dobra za prvi put. Fali nekoliko sitnih troškova, ali slika je jasna.",
  "iva:1": "Iva, iskreno i precizno. Javi se kad budeš imala vremena, rado bih čula kako ide.",
  "iva:2": "Mapa je potpuna. Svaka čast na dosljednosti kroz četiri sedmice.",
  "iva:3": "Budžet je realan. Prostor za život je premali — povećaj ga, inače neće izdržati.",
};

const SUBMISSION_BODIES: Record<number, string[]> = {
  1: [
    "Prva rečenica koje se sjećam je „nemamo za to\". Nije bila zla, samo je bila stalna. Novac se u našoj kući nije spominjao za stolom, nego u hodniku, tiho. Prepoznajem obrazac stezanja: sve mora biti opravdano, a kad potrošim nešto na sebe, dva dana nosim osjećaj da sam nešto ukrala. Da novac nije problem, ne bih računala u glavi prije nego naručim kavu i ne bih odgađala zubara treću godinu.",
    "Kod nas se o novcu nije govorilo uopće, što je valjda svoja vrsta poruke. Mama je vodila sve, tata nije znao koliko šta košta. Najbliži mi je obrazac izbjegavanja — ne otvaram aplikaciju banke, računi stoje neotvoreni dvije sedmice. Zadnji put mi je bilo neugodno kad mi je klijentica pitala za cijenu i ja sam se počela izvinjavati prije nego sam je izgovorila.",
    "Novac je kod nas bio razlog za svađu i naučila sam da je tema opasna. Danas radim isto: kad partner spomene troškove, ja se automatski branim. Obrazac je rasipanje kao olakšanje — poslije teške sedmice kupim nešto i to je jedini trenutak kad sam dobra prema sebi. Da novac nije problem, uzela bih petak popodne slobodno bez da to nekome pravdam.",
  ],
  2: [
    "Fiksno 780 eura, promjenjivo 640, povremeno 210 prosječno, nevidljivo 94. Iznenadilo me nevidljivo — četiri pretplate koje ne koristim i provizije koje nisam ni primijetila. Očekivala sam da mi je hrana najveća stavka i to je tačno. Ne razumijem zašto mi je povremeno tako neravnomjerno raspoređeno, jedan mjesec 60, drugi 400.",
    "Fiksno 1120, promjenjivo 710, povremeno 265, nevidljivo 61. Iznenadilo me koliko odlazi na sitne kupovine „po dvije stvari\" — 14 odlazaka u trgovinu u četiri sedmice. Očekivala sam da je gorivo veće nego što jest. Ne razumijem kako da rasporedim registraciju auta koja dolazi u martu.",
    "Fiksno 690, promjenjivo 520, povremeno 180, nevidljivo 43. Iznenadilo me da je promjenjivo manje nego što sam mislila, ali povremeno dvostruko više. Očekivala sam da ću se osjećati loše kad vidim brojke, a zapravo mi je lakše. Ne razumijem zašto sam se ovoga toliko bojala.",
  ],
  3: [
    "Fiksno 780, promjenjivo 600, povremeno 200 mjesečno odvajam, prostor za život 90 eura. Ostaje 140 koje idu u rezervu. Ako mjesec bude loš, prvo pada uplata u rezervu, ne prostor za život — naučila sam da mi taj dio drži plan.",
    "Fiksno 1120, promjenjivo 650, povremeno 250, prostor za život 120. Ostaje 180 za rezervu. Ako mjesec bude loš, pada polovina prostora za život i cijela uplata u rezervu, minimalne rate ostaju.",
    "Fiksno 690, promjenjivo 480, povremeno 180, prostor za život 70. Ostaje 210. Ako mjesec bude loš, prvo pada povremena kanta jer u njoj već imam nešto odvojeno od prošlog mjeseca.",
  ],
  4: [
    "Naplativih sati mjesečno: 62. Ciljani prihod nakon poreza: 1800. Fiksni troškovi posla: 240. Porez i doprinosi: 32 posto. Minimalna satnica mi ispada 48 eura, a trenutno naplaćujem 30. Ponuda koju sam poslala: „Za opseg od pet objava mjesečno, uključujući pripremu i objavu, cijena je 420 eura mjesečno. Rok plaćanja 15 dana od datuma računa, avans 30 posto.\" Nisam dodala nijednu rečenicu koja pregovara protiv mene i bilo mi je fizički neugodno.",
    "Naplativih sati: 48. Ciljani prihod: 2200. Fiksni troškovi: 310. Porez 35 posto. Minimalna satnica 72 eura, trenutno naplaćujem 45. Ponuda: „Za kompletan projekt u opsegu koji smo dogovorile cijena je 1600 eura. Avans 50 posto prije početka, ostatak 15 dana od predaje.\" Poslala sam je jučer i još čekam odgovor.",
  ],
};

/**
 * Seed briše sve @demo.local naloge, pa mora prvo dokazati da gleda u bazu
 * OVOG projekta. Demo #1 (coach-portal) ima svoje @demo.local naloge i svoju
 * profiles tabelu - bez ove provjere pogrešan URL u .env.local obrisao bi njih.
 */
async function assertOwnDatabase() {
  // Tabele koje postoje samo ovdje.
  const mine = ["modules", "lessons", "submissions", "weekly_reflections"];
  for (const t of mine) {
    const { error } = await db.from(t).select("*").limit(1);
    if (error) {
      console.error(
        `✗ Tabela "${t}" ne postoji u bazi na ${url}.\n` +
          `  Pokreni prvo: npm run db:migrate\n` +
          `  Ako si je pokrenuo, provjeri pokazuje li NEXT_PUBLIC_SUPABASE_URL na pravi projekat.`,
      );
      process.exit(1);
    }
  }

  // Tabele koje postoje samo u demo #1.
  const foreign = ["checkins", "workouts", "progress_photos", "client_status"];
  for (const t of foreign) {
    const { error } = await db.from(t).select("*").limit(1);
    if (!error) {
      console.error(
        `✗ Baza na ${url} sadrži tabelu "${t}" - to je demo #1 (coach-portal), ne ovaj projekat.\n` +
          `  Seed je prekinut prije nego je išta obrisao.\n` +
          `  Ovaj demo traži zasebnu Supabase instancu; ispravi .env.local.`,
      );
      process.exit(1);
    }
  }
}

async function main() {
  console.log(`Seed za ${brand.name} · ${brand.cohortName} · danas ${TODAY}`);
  await assertOwnDatabase();

  // -------------------------------------------------------------------------
  // Čišćenje
  // -------------------------------------------------------------------------
  const { data: existing } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of existing?.users ?? []) {
    if (u.email?.endsWith("@demo.local")) await db.auth.admin.deleteUser(u.id);
  }
  await db.from("calls").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("modules").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  console.log("✓ prethodni demo podaci obrisani");

  // -------------------------------------------------------------------------
  // Nalozi
  // -------------------------------------------------------------------------
  const ids = new Map<string, string>();

  async function createUser(key: string, email: string, full_name: string) {
    const { data, error } = await db.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name },
    });
    if (error || !data.user) {
      console.error(`✗ nalog ${email}`, error);
      process.exit(1);
    }
    ids.set(key, data.user.id);
    return data.user.id;
  }

  await createUser(admin.key, admin.email, admin.full_name);
  for (const a of assistants) await createUser(a.key, a.email, a.full_name);
  for (const m of members) await createUser(m.key, m.email, m.full_name);

  must(
    await db.from("profiles").insert([
      {
        id: ids.get(admin.key)!,
        role: "admin",
        full_name: admin.full_name,
        joined_at: addDaysISO(TODAY, -120),
        cohort: brand.cohortName,
      },
      ...assistants.map((a) => ({
        id: ids.get(a.key)!,
        role: "assistant",
        full_name: a.full_name,
        joined_at: addDaysISO(TODAY, -90),
        cohort: brand.cohortName,
      })),
      ...members.map((m) => ({
        id: ids.get(m.key)!,
        role: "member",
        full_name: m.full_name,
        assistant_id: ids.get(m.assistant)!,
        joined_at: addDaysISO(TODAY, -m.joinedDaysAgo),
        cohort: brand.cohortName,
      })),
    ]).select("id"),
    "profili",
  );
  console.log(`✓ ${1 + assistants.length + members.length} naloga`);

  // -------------------------------------------------------------------------
  // Moduli, lekcije, zadaci
  // -------------------------------------------------------------------------
  const moduleIds: string[] = [];
  const lessonIds: string[][] = [];
  const assignmentIds: string[] = [];
  let worksheetCount = 0;

  for (let i = 0; i < CONTENT.length; i++) {
    const order = i + 1;
    const c = CONTENT[i];

    const mod = must<{ id: string }>(
      await db
        .from("modules")
        .insert({
          sort_order: order,
          title: c.title,
          subtitle: c.subtitle,
          unlock_at: unlockFor(order),
          summary: c.summary,
        })
        .select("id")
        .single(),
      `modul ${order}`,
    );
    moduleIds.push(mod.id);

    const perModule: string[] = [];
    for (let j = 0; j < c.lessons.length; j++) {
      const l = c.lessons[j];

      // Tri lekcije imaju generisan PDF radni list (modul 1, 2 i lekcija 4.3).
      let worksheetPath: string | null = null;
      const wantsWorksheet =
        l.worksheet && ((order <= 2 && j === 0) || (order === 4 && j === 2));
      if (wantsWorksheet && l.worksheet) {
        const bytes = await buildWorksheet(l.worksheet.title, l.worksheet.questions);
        const path = `modul-${order}-lekcija-${j + 1}.pdf`;
        const { error } = await db.storage
          .from("worksheets")
          .upload(path, bytes, { contentType: "application/pdf", upsert: true });
        if (error) {
          console.error("✗ upload radnog lista", error);
          process.exit(1);
        }
        worksheetPath = path;
        worksheetCount++;
      }

      const lesson = must<{ id: string }>(
        await db
          .from("lessons")
          .insert({
            module_id: mod.id,
            sort_order: j + 1,
            title: l.title,
            video_url: l.video_url,
            body: l.body,
            worksheet_path: worksheetPath,
            duration_min: l.duration_min,
          })
          .select("id")
          .single(),
        `lekcija ${order}.${j + 1}`,
      );
      perModule.push(lesson.id);
    }
    lessonIds.push(perModule);

    const assignment = must<{ id: string }>(
      await db
        .from("assignments")
        .insert({
          module_id: mod.id,
          title: c.assignment.title,
          instructions: c.assignment.instructions,
          due_at: dueFor(order),
        })
        .select("id")
        .single(),
      `zadatak ${order}`,
    );
    assignmentIds.push(assignment.id);
  }
  console.log(
    `✓ ${moduleIds.length} modula · ${lessonIds.flat().length} lekcija · ${assignmentIds.length} zadataka · ${worksheetCount} PDF radna lista`,
  );

  // -------------------------------------------------------------------------
  // Napredak kroz lekcije
  // -------------------------------------------------------------------------
  const progressRows: { member_id: string; lesson_id: string; completed_at: string }[] = [];

  for (const m of members) {
    const memberId = ids.get(m.key)!;
    // Sve lekcije modula ispred trenutnog + dio trenutnog.
    const completed: string[] = [];
    for (let order = 1; order < m.module; order++) completed.push(...lessonIds[order - 1]);
    completed.push(...lessonIds[m.module - 1].slice(0, m.lessonsInModule));

    // Zadnja završena lekcija nosi datum zadnje aktivnosti; ostale su ranije.
    const span = Math.max(1, m.joinedDaysAgo - m.lastActivity);
    completed.forEach((lessonId, idx) => {
      const isLast = idx === completed.length - 1;
      const offset = isLast
        ? m.lastActivity
        : m.lastActivity + Math.round(((completed.length - 1 - idx) / completed.length) * span) + 1;
      progressRows.push({
        member_id: memberId,
        lesson_id: lessonId,
        completed_at: daysAgo(offset, 9 + (idx % 8)),
      });
    });
  }
  must(await db.from("lesson_progress").insert(progressRows).select("id"), "napredak");
  console.log(`✓ ${progressRows.length} završenih lekcija`);

  // -------------------------------------------------------------------------
  // Predaje
  // -------------------------------------------------------------------------
  const submissionRows: Record<string, unknown>[] = [];
  const adminId = ids.get(admin.key)!;

  for (const m of members) {
    const memberId = ids.get(m.key)!;
    m.submitted.forEach((order, idx) => {
      const key = `${m.key}:${order}`;
      const pending = PENDING.has(key);
      // Predaja stiže par dana prije roka tog modula, ali nikad kasnije od
      // zadnje aktivnosti te članice - inače bi joj pokvarila status.
      const submittedDaysAgo = Math.max(
        2,
        daysUntil(dueFor(order)) * -1 + 3,
        m.lastActivity + 1,
      );
      const bodies = SUBMISSION_BODIES[order] ?? SUBMISSION_BODIES[1];
      submissionRows.push({
        assignment_id: assignmentIds[order - 1],
        member_id: memberId,
        body: bodies[idx % bodies.length],
        submitted_at: daysAgo(submittedDaysAgo, 19),
        status: pending ? "pending" : "reviewed",
        feedback: pending
          ? null
          : (FEEDBACK[key] ??
            "Hvala na predaji. Zadatak je urađen kako treba — vidimo se na pozivu, tamo ćemo proći detalje."),
        reviewed_by: pending ? null : ids.get(m.assistant === "petra" ? "petra" : "ivana")!,
        reviewed_at: pending ? null : daysAgo(Math.max(1, submittedDaysAgo - 2), 16),
      });
    });
  }
  must(await db.from("submissions").insert(submissionRows).select("id"), "predaje");
  console.log(
    `✓ ${submissionRows.length} predaja (${PENDING.size} čeka pregled, ${submissionRows.length - PENDING.size} pregledano)`,
  );

  // -------------------------------------------------------------------------
  // Komentari ispod lekcija (25 članica + 8 Andrejinih odgovora)
  // -------------------------------------------------------------------------
  const COMMENTS: { member: string; module: number; lesson: number; body: string; daysAgo: number; reply?: string }[] = [
    { member: "marija", module: 1, lesson: 1, daysAgo: 44, body: "Obrazac stezanja me pogodio. Mislila sam da sam „štedljiva\", a zapravo se cijeli život izvinjavam kad nešto kupim.", reply: "Marija, to je razlika koju većina nikad ne napravi. Štedljivost je odluka, stezanje je strah. Vidimo se na pozivu." },
    { member: "ana", module: 1, lesson: 1, daysAgo: 43, body: "Kod nas se o novcu nije govorilo uopće. Tek sad vidim da je i to bila poruka." },
    { member: "lucija", module: 1, lesson: 2, daysAgo: 42, body: "Ovo o jeziku bez pridjeva — probala sam i stvarno je drugačije. „412 eura\" umjesto „katastrofa\".", reply: "Tačno tako. Kad nestane pridjev, ostane zadatak. Drži se toga cijeli program." },
    { member: "petra_n", module: 1, lesson: 2, daysAgo: 41, body: "Meni je najteže to što znam brojke, ali ih izbjegavam pogledati zajedno na jednom mjestu." },
    { member: "katarina", module: 1, lesson: 3, daysAgo: 40, body: "Tri rečenice su mi ispale sve o zubaru, autu i tome da ne uzimam slobodan dan. Smiješno mi je koliko je konkretno." },
    { member: "tena", module: 1, lesson: 3, daysAgo: 39, body: "Prvi put da mi neko kaže da cilj ne mora biti brojka." },
    { member: "iva", module: 2, lesson: 1, daysAgo: 37, body: "Procijenila sam 300 za hranu. Ispalo je 512. Nisam ni ljuta, samo mi je čudno koliko sam bila daleko.", reply: "Iva, 40 posto razlike je prosjek. Nisi izuzetak, to je tako kod svih dok ne izmjere." },
    { member: "nika", module: 2, lesson: 1, daysAgo: 36, body: "Deseti dan mi je bilo dosadno i skoro sam odustala. Drago mi je da nisam." },
    { member: "dora", module: 2, lesson: 2, daysAgo: 35, body: "Kanta „nevidljivo\" mi je 94 eura. Četiri pretplate koje ne koristim već godinu dana.", reply: "To je 1128 eura godišnje. Nemoj ništa otkazivati do poziva — prvo ih samo popiši." },
    { member: "maja", module: 2, lesson: 2, daysAgo: 34, body: "Povremena kanta je ono što mi je rušilo svaki pokušaj budžeta. Nikad je nisam računala." },
    { member: "lana", module: 2, lesson: 3, daysAgo: 33, body: "Pravilo „prvi pogled je samo gledanje\" me spasilo. Inače bih do večeri otkazala pola stvari i za tjedan dana se vratila na staro." },
    { member: "tea", module: 2, lesson: 3, daysAgo: 32, body: "Napisala sam tri rečenice i najviše me pogodilo ono „šta ne razumijem\"." },
    { member: "ivana_b", module: 3, lesson: 1, daysAgo: 30, body: "Deset minuta sedmično kao mjerilo složenosti — to mi je odmah eliminiralo tri aplikacije koje sam skinula.", reply: "Upravo tako. Ako traži više pažnje od toga, napustit ćeš ga do marta." },
    { member: "marija", module: 3, lesson: 1, daysAgo: 29, body: "Moj prošli budžet je pukao treću sedmicu i mislila sam da je problem u meni." },
    { member: "petra_n", module: 3, lesson: 2, daysAgo: 28, body: "Pitanje za poziv: kako računati postotke kad mi prihod varira od 900 do 2400?", reply: "Petra, računaj s najnižim mjesecom zadnjih godinu dana. Sve iznad toga je višak i ide u rezervu. Neudobno prva dva mjeseca, poslije spasonosno." },
    { member: "lucija", module: 3, lesson: 2, daysAgo: 27, body: "Stanarina mi uzima 45 posto. Pravilo 50/30/20 kod mene matematički ne postoji." },
    { member: "ana", module: 3, lesson: 3, daysAgo: 26, body: "Prostor za život sam prvo stavila 30 eura. Poslije lekcije sam ga digla na 90 i osjećam se čudno, ali dobro čudno." },
    { member: "katarina", module: 3, lesson: 3, daysAgo: 25, body: "Ovo je lekcija koju bih poslala svakoj prijateljici." },
    { member: "nika", module: 4, lesson: 1, daysAgo: 24, body: "Izračunala sam minimalnu satnicu. 72 eura. Naplaćujem 45. Sjedim i gledam u to.", reply: "Nika, to je najčešći razmak u grupi. Nemoj skakati odmah na 72 — sljedeća ponuda neka bude 58, pa idemo dalje." },
    { member: "ivana_b", module: 4, lesson: 2, daysAgo: 23, body: "Vježbala sam naglas deset puta. Prvih pet mi je bilo užasno." },
    { member: "dora", module: 4, lesson: 2, daysAgo: 22, body: "Ono „mogu prilagoditi cijenu ako smanjimo opseg\" je promijenilo cijeli razgovor s klijentom jučer.", reply: "To je rečenica koja cijenu veže za rad umjesto za tvoju volju da ugodiš. Odlično." },
    { member: "sara", module: 4, lesson: 3, daysAgo: 21, body: "Avans od 30 posto mi je zvučao bezobrazno dok nisam vidjela da to svi rade.", reply: "Sara, avans nije nepovjerenje nego standard. Klijent koji ga odbije obično je isti onaj koji kasni s ostatkom." },
    { member: "tea", module: 5, lesson: 1, daysAgo: 19, body: "Rezerva mi ispada 4200 eura. Sad kad znam broj, manje me je strah nego kad nisam znala." },
    { member: "lucija", module: 5, lesson: 2, daysAgo: 17, body: "Postavila sam trajni nalog na dan plaće. Nije me boljelo koliko sam mislila." },
    { member: "iva", module: 5, lesson: 3, daysAgo: 20, body: "„Neplanirano, nužno i hitno — sve tri, ne jedna od tri.\" Zapisala sam i zalijepila na frižider." },
  ];

  const commentRows: Record<string, unknown>[] = [];
  const replies: { parentIdx: number; body: string; daysAgo: number }[] = [];

  COMMENTS.forEach((c, idx) => {
    commentRows.push({
      lesson_id: lessonIds[c.module - 1][c.lesson - 1],
      author_id: ids.get(c.member)!,
      body: c.body,
      created_at: daysAgo(c.daysAgo, 11 + (idx % 8)),
    });
    if (c.reply) replies.push({ parentIdx: idx, body: c.reply, daysAgo: Math.max(1, c.daysAgo - 1) });
  });

  const insertedComments = must<{ id: string }[]>(
    await db.from("lesson_comments").insert(commentRows).select("id"),
    "komentari",
  );

  const replyRows = replies.map((r) => ({
    lesson_id: commentRows[r.parentIdx].lesson_id,
    author_id: adminId,
    body: r.body,
    created_at: daysAgo(r.daysAgo, 20),
    parent_id: insertedComments[r.parentIdx].id,
  }));
  must(await db.from("lesson_comments").insert(replyRows).select("id"), "odgovori");
  console.log(`✓ ${commentRows.length} komentara + ${replyRows.length} Andrejinih odgovora`);

  // -------------------------------------------------------------------------
  // Pozivi
  // -------------------------------------------------------------------------
  const callSpecs = [
    { title: "Uvodni poziv: odakle dolaze tvoje odluke", daysAgo: 28 },
    { title: "Mapa troškova: šta ste vidjele", daysAgo: 21 },
    { title: "Budžet koji izdrži loš mjesec", daysAgo: 14 },
    { title: "Cijene: izračun i izgovaranje", daysAgo: 7 },
  ];
  const NOTES = [
    "Prošle smo tri obrasca i zaključile da ih većina ima dva istovremeno. Domaća zadaća: pisati bez pridjeva sedam dana.\n\nPitanja koja su se ponavljala: šta ako partner ne želi sudjelovati, i kako početi ako je prihod nepredvidiv. Oboje rješavamo u modulu 3.",
    "Devet od vas je podijelilo brojke iz mape. Nevidljiva kanta je kod svih bila veća od očekivanog, prosjek 7 posto prihoda.\n\nDogovor: nitko ne otkazuje ništa do sljedećeg poziva. Prvi pogled je samo gledanje.",
    "Napravile smo prve budžete uživo. Najčešća greška: prostor za život postavljen premalo, ispod 3 posto.\n\nDomaća zadaća: dopisati rečenicu „šta pada prvo ako mjesec bude loš\".",
    "Vježbale smo izgovaranje cijene i tišinu poslije. Pet vas je poslalo ponudu po novoj cijeni tokom poziva.\n\nSljedeći put: naplata, avansi i podsjetnici bez izvinjenja.",
  ];

  const pastCalls = must<{ id: string; scheduled_at: string }[]>(
    await db
      .from("calls")
      .insert(
        callSpecs.map((c, i) => ({
          title: c.title,
          scheduled_at: daysAgo(c.daysAgo, 17),
          zoom_url: "https://zoom.us/j/9812345678",
          recording_url: `https://vimeo.com/90000${i + 1}`,
          notes: NOTES[i],
        })),
      )
      .select("id, scheduled_at")
      .order("scheduled_at"),
    "prošli pozivi",
  );

  const nextCall = must<{ id: string }>(
    await db
      .from("calls")
      .insert({
        title: "Rezerva i štednja: koliki je tvoj broj",
        scheduled_at: new Date(`${addDaysISO(TODAY, 4)}T17:00:00Z`).toISOString(),
        zoom_url: "https://zoom.us/j/9812345678",
      })
      .select("id")
      .single(),
    "sljedeći poziv",
  );
  console.log(`✓ ${pastCalls.length} prošlih poziva + 1 sljedeći za 4 dana`);

  // -------------------------------------------------------------------------
  // Pitanja za pozive
  // -------------------------------------------------------------------------
  const lastPast = pastCalls[pastCalls.length - 1].id;
  must(
    await db.from("call_questions").insert([
      {
        call_id: lastPast,
        member_id: ids.get("marija")!,
        body: "Kako da odredim cijenu kad radim nešto što nema jasnu satnicu, nego rezultat?",
        created_at: daysAgo(9, 12),
        answered: true,
        answer:
          "Marija, i za rezultat prvo izračunaj satnicu — treba ti donja granica. Onda procijeni koliko sati stvarno ulazi i dodaj 25 posto za ono što uvijek iskrsne. Cijenu prezentiraš kao paket, ali je izračunaš po satu.",
      },
      {
        call_id: lastPast,
        member_id: ids.get("tea")!,
        body: "Šta da radim s klijentom koji kasni s plaćanjem već dva mjeseca?",
        created_at: daysAgo(8, 13),
        answered: true,
        answer:
          "Pošalji podsjetnik bez izvinjavanja i napiši datum do kojeg očekuješ uplatu. Ako prođe, prestaješ raditi. Reci to unaprijed, mirno, u jednoj rečenici.",
      },
      {
        call_id: lastPast,
        member_id: ids.get("lana")!,
        body: "Mogu li raditi modul 3 ako mapa još nije gotova?",
        created_at: daysAgo(7, 14),
        answered: false,
      },
      {
        call_id: nextCall.id,
        member_id: ids.get("petra_n")!,
        body: "Koliko mjeseci rezerve ako mi je prihod od projekta do projekta i imam dijete?",
        created_at: daysAgo(3, 10),
        answered: true,
        answer:
          "Petra, u tvom slučaju šest mjeseci je minimum, a devet je ono na čemu ćeš stvarno spavati. Računaj mjesece troškova u minimalnoj verziji, ne mjesece prihoda.",
      },
      {
        call_id: nextCall.id,
        member_id: ids.get("nika")!,
        body: "Je li pametnije prvo skupiti rezervu ili otplatiti karticu?",
        created_at: daysAgo(2, 11),
        answered: true,
        answer:
          "Prvo mali iznos rezerve (jedan mjesec troškova), pa onda kartica punom snagom, pa ostatak rezerve. Bez tog prvog mjeseca svaki kvar na autu te vrati na karticu.",
      },
      {
        call_id: nextCall.id,
        member_id: ids.get("dora")!,
        body: "Gdje držati rezervu da mi ne bude previše pri ruci, a da dođem do nje za par dana?",
        created_at: daysAgo(2, 15),
        answered: false,
      },
      {
        call_id: nextCall.id,
        member_id: ids.get("katarina")!,
        body: "Šta ako mi je rezerva izračunata na iznos koji mi se čini nedostižan?",
        created_at: daysAgo(1, 9),
        answered: false,
      },
    ]).select("id"),
    "pitanja",
  );
  console.log("✓ 7 pitanja (4 odgovorena)");

  // -------------------------------------------------------------------------
  // Sedmične refleksije
  // -------------------------------------------------------------------------
  const REFLECTIONS: { member: string; weeksAgo: number; win: string; blocker: string; next: string }[] = [
    { member: "marija", weeksAgo: 2, win: "Otvorila sam aplikaciju banke svaki dan bez da mi se steglo u grlu.", blocker: "Još uvijek računam u glavi prije nego naručim.", next: "Postaviti prostor za život i držati ga se sedam dana." },
    { member: "marija", weeksAgo: 3, win: "Završila sam mapu za četiri sedmice, nijedan dan nisam preskočila.", blocker: "Povremena kanta mi je i dalje maglovita.", next: "Popisati sve što dolazi do kraja godine." },
    { member: "ana", weeksAgo: 2, win: "Digla sam prostor za život s 30 na 90 eura.", blocker: "Osjećaj krivnje nakon svake sitne kupovine.", next: "Ne pravdati nijednu kupovinu iz tog iznosa." },
    { member: "ana", weeksAgo: 3, win: "Popisala sam sve pretplate, ima ih jedanaest.", blocker: "Ne znam koje su mi stvarno potrebne.", next: "Otkazati tri koje nisam otvorila mjesec dana." },
    { member: "petra_n", weeksAgo: 2, win: "Izračunala sam minimalnu satnicu i poslala prvu ponudu po njoj.", blocker: "Čekam odgovor i preispitujem se.", next: "Ne snižavati cijenu prije nego dobijem odgovor." },
    { member: "lucija", weeksAgo: 2, win: "Postavila sam trajni nalog za rezervu.", blocker: "Bojim se prvog mjeseca u kojem će biti tijesno.", next: "Napisati plan za loš mjesec unaprijed." },
    { member: "lucija", weeksAgo: 4, win: "Razdvojila sam gorivo i hranu u mapi.", blocker: "Fiksni troškovi su mi previsoki za prihod.", next: "Provjeriti stanarinu i osiguranje." },
    { member: "ivana_b", weeksAgo: 2, win: "Rekla sam cijenu i zašutjela. Klijent je pristao.", blocker: "Tri sekunde tišine su mi trajale beskonačno.", next: "Ponoviti isto s drugim klijentom ove sedmice." },
    { member: "nika", weeksAgo: 3, win: "Vidjela sam da mi je nevidljiva kanta mala, prvi put nešto dobro u brojkama.", blocker: "Satnica mi je 27 eura ispod minimuma.", next: "Sljedeća ponuda ide na 58 eura." },
    { member: "tea", weeksAgo: 2, win: "Znam koliki mi je iznos rezerve. 4200 eura.", blocker: "Čini mi se daleko.", next: "Odvojiti prvih 150 eura ovaj mjesec." },
    { member: "dora", weeksAgo: 3, win: "Otkazala sam četiri pretplate koje nisam koristila godinu dana.", blocker: "Još uvijek ne gledam stanje računa rado.", next: "Gledati stanje svaki ponedjeljak ujutro." },
    { member: "katarina", weeksAgo: 2, win: "Prvi put sam napisala budžet koji ima prostor za život.", blocker: "Ne znam šta da pauziram u lošem mjesecu.", next: "Napisati tri koraka za loš mjesec." },
  ];

  must(
    await db.from("weekly_reflections").insert(
      REFLECTIONS.map((r) => ({
        member_id: ids.get(r.member)!,
        week_start: weekStartISO(addDaysISO(TODAY, -r.weeksAgo * 7)),
        win: r.win,
        blocker: r.blocker,
        next_step: r.next,
        created_at: daysAgo(r.weeksAgo * 7 - 1, 18),
      })),
    ).select("id"),
    "refleksije",
  );
  console.log(`✓ ${REFLECTIONS.length} refleksija`);

  // -------------------------------------------------------------------------
  // Provjera statusa
  // -------------------------------------------------------------------------
  const { data: status } = await db.from("member_status").select("*").order("full_name");
  const counts = { active: 0, slowing: 0, stalled: 0 } as Record<string, number>;
  for (const row of status ?? []) counts[(row as { status: string }).status]++;

  console.log("\nStatusi kohorte:");
  for (const row of (status ?? []) as any[]) {
    console.log(
      `  ${row.full_name.padEnd(20)} modul ${String(row.current_module ?? "-").padStart(2)} · ` +
        `${String(row.lessons_done_pct).padStart(3)}% · ${String(row.days_since_activity ?? "-").padStart(3)} dana · ` +
        `${row.overdue_assignments} kasni · ${row.status}`,
    );
  }
  console.log(
    `\n  active ${counts.active} · slowing ${counts.slowing} · stalled ${counts.stalled}` +
      `  (cilj: 9 / 3 / 2)`,
  );

  console.log(`\nDemo nalozi (lozinka ${PASSWORD}):`);
  console.log(`  članica     ${members[0].email}`);
  console.log(`  asistentica ${assistants[0].email}`);
  console.log(`  Andreja     ${admin.email}`);
}

function daysUntil(iso: string) {
  const a = Date.UTC(+TODAY.slice(0, 4), +TODAY.slice(5, 7) - 1, +TODAY.slice(8, 10));
  const b = Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  return Math.round((b - a) / 86400000);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
