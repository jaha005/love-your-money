// Demo data: Andreja, 2 assistants, 14 members, 8 modules × 3 lessons,
// assignments, reviewed submissions, comments, calls, questions and reflections.
// Safe to re-run: it first removes previous @demo.local accounts and content.
// Usage: npm run db:seed

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
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.local");
  process.exit(1);
}
const db = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = process.env.DEMO_PASSWORD || "demo1234";
const TODAY = todayISO();

// The cohort is in its seventh week: modules 1-7 are unlocked (the last one 3 days ago),
// module 8 arrives in 4 days - so the programme tree also shows the locked state.
const RELEASED = 7;
const unlockFor = (order: number) => addDaysISO(TODAY, (order - RELEASED) * 7 - 3);
// Assignment due date: 5 weeks after the module unlocks.
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
// People
// ---------------------------------------------------------------------------

const admin = { key: "andreja", email: "andreja@demo.local", full_name: "Andreja Marin" };

const assistants = [
  { key: "sophie", email: "assistant@demo.local", full_name: "Sophie Walsh" },
  { key: "hannah", email: "hannah@demo.local", full_name: "Hannah Brooks" },
];

type SeedMember = {
  key: string;
  email: string;
  full_name: string;
  assistant: string;
  /** The module she's in (has at least one completed lesson there). */
  module: number;
  /** How many lessons she has completed in that module. */
  lessonsInModule: number;
  /** Days since last activity (set through her most recent lesson_progress). */
  lastActivity: number;
  /** Modules whose assignment she has submitted. */
  submitted: number[];
  joinedDaysAgo: number;
};

// 9 active (≤7 days, 0 overdue) · 3 slowing (8-14 days OR 1 overdue) · 2 stalled (15+ OR 2+ overdue)
const members: SeedMember[] = [
  { key: "mia", email: "member@demo.local", full_name: "Mia Harper", assistant: "sophie", module: 4, lessonsInModule: 2, lastActivity: 1, submitted: [1, 2], joinedDaysAgo: 49 },
  { key: "anna", email: "anna@demo.local", full_name: "Anna Reed", assistant: "sophie", module: 6, lessonsInModule: 1, lastActivity: 2, submitted: [1, 2, 3], joinedDaysAgo: 49 },
  { key: "isla", email: "isla@demo.local", full_name: "Isla Bennett", assistant: "hannah", module: 7, lessonsInModule: 2, lastActivity: 0, submitted: [1, 2, 3, 4], joinedDaysAgo: 49 },
  { key: "chloe", email: "chloe@demo.local", full_name: "Chloe Turner", assistant: "sophie", module: 5, lessonsInModule: 3, lastActivity: 3, submitted: [1, 2, 3], joinedDaysAgo: 49 },
  { key: "lucy", email: "lucy@demo.local", full_name: "Lucy Morgan", assistant: "hannah", module: 6, lessonsInModule: 2, lastActivity: 1, submitted: [1, 2, 3], joinedDaysAgo: 49 },
  { key: "kate", email: "kate@demo.local", full_name: "Kate Sullivan", assistant: "sophie", module: 3, lessonsInModule: 1, lastActivity: 4, submitted: [1, 2], joinedDaysAgo: 42 },
  { key: "daisy", email: "daisy@demo.local", full_name: "Daisy Clarke", assistant: "hannah", module: 5, lessonsInModule: 2, lastActivity: 6, submitted: [1, 2], joinedDaysAgo: 49 },
  { key: "nina", email: "nina@demo.local", full_name: "Nina Foster", assistant: "hannah", module: 7, lessonsInModule: 1, lastActivity: 2, submitted: [1, 2, 3, 4], joinedDaysAgo: 49 },
  { key: "tessa", email: "tessa@demo.local", full_name: "Tessa Hughes", assistant: "sophie", module: 4, lessonsInModule: 3, lastActivity: 5, submitted: [1, 2], joinedDaysAgo: 42 },
  // slowing
  { key: "maya", email: "maya@demo.local", full_name: "Maya Price", assistant: "sophie", module: 3, lessonsInModule: 2, lastActivity: 10, submitted: [1, 2], joinedDaysAgo: 49 },
  { key: "sara", email: "sara@demo.local", full_name: "Sara Lindqvist", assistant: "hannah", module: 5, lessonsInModule: 1, lastActivity: 3, submitted: [1], joinedDaysAgo: 49 },
  { key: "lena", email: "lena@demo.local", full_name: "Lena Fischer", assistant: "sophie", module: 2, lessonsInModule: 2, lastActivity: 12, submitted: [1, 2], joinedDaysAgo: 42 },
  // stalled
  { key: "ivy", email: "ivy@demo.local", full_name: "Ivy Russo", assistant: "hannah", module: 6, lessonsInModule: 1, lastActivity: 18, submitted: [1, 2, 3], joinedDaysAgo: 49 },
  { key: "tara", email: "tara@demo.local", full_name: "Tara Quinn", assistant: "sophie", module: 3, lessonsInModule: 2, lastActivity: 4, submitted: [], joinedDaysAgo: 49 },
];

// Submissions still waiting for review (the rest are reviewed with feedback).
const PENDING = new Set(["mia:2", "anna:3", "isla:4", "daisy:2", "nina:4", "lucy:3"]);

const FEEDBACK: Record<string, string> = {
  "mia:1":
    "Mia, this is honestly written, and that's half the work. I can see the clamping-down pattern you describe in your spending map too — your 'occasional' bucket is empty, yet you do buy those things. In module 3, watch your room for life: your instinct will be to set it too small.",
  "anna:1":
    "Anna, thank you for trusting us with this. The sentence \"I wasn't allowed to ask\" explains a lot of what comes up in module 4. Hold on to it — we'll come back to it when we write your quote.",
  "anna:2":
    "A tidy, complete map. Your invisible bucket is 11 percent of income — the biggest I've seen in this cohort. Go through your subscriptions this weekend. Don't decide anything, just list them.",
  "isla:1":
    "Clear and unvarnished. The avoidance pattern is there, but you already recognise it yourself, which puts you half a step ahead.",
  "isla:2":
    "An excellent map. I noticed you put the children's costs under fixed — try splitting them. Part of it is really occasional, and that's why it keeps surprising you.",
  "isla:3":
    "The budget is realistic, and that's what matters most. Room for life at 6 percent is about right. Leave it for two months before changing anything.",
  "chloe:1": "Chloe, beautifully written. We'll come back to your third sentence on the call.",
  "chloe:2":
    "A complete map. Your 'occasional' bucket averages 240 euros a month — that's the amount that has been breaking every plan so far. Now it's on paper.",
  "chloe:3":
    "The budget works. One note: you didn't write what goes first if the month goes badly. Add it — it's the most important sentence in the assignment.",
  "lucy:1": "Thank you, Lucy. You describe spending-as-relief precisely and without judging yourself. That's rare.",
  "lucy:2": "A tidy map. Fuel and food are in the same category — split them, they behave differently.",
  "kate:1": "Good, Kate. In module 2, focus on the invisible bucket — I think there's a surprise waiting for you there.",
  "kate:2": "A good map. Now don't change anything until the call — the first look is only looking.",
  "daisy:1": "Daisy, honest and useful. I like that you wrote without adjectives — that's not easy the first time.",
  "nina:1": "Nina, really good. The sentence about the dentist comes up for half the group.",
  "nina:2": "A complete, tidy map. A small invisible bucket — that's rare.",
  "nina:3": "A good, conservative budget. Maybe too conservative — give yourself another 20 euros of room for life.",
  "tessa:1": "Tessa, thank you. Keep this text somewhere you'll find it in six months.",
  "tessa:2": "A good map. The three sentences at the end are the best part of the assignment.",
  "maya:1": "Maya, well written. Reach out to your assistant if you get stuck — we're here.",
  "maya:2": "A tidy map. Your occasional bucket is almost entirely missing — fill it in from your bank statement.",
  "sara:1": "Sara, lovely. The avoidance pattern is there, but so is the willingness to look at it.",
  "lena:1": "Lena, thank you. Don't rush module 2 — the map needs four weeks and that's fine.",
  "lena:2": "A good map for a first attempt. A few small costs are missing, but the picture is clear.",
  "ivy:1": "Ivy, honest and precise. Get in touch when you have time — I'd love to hear how it's going.",
  "ivy:2": "A complete map. Well done on keeping it up for four whole weeks.",
  "ivy:3": "The budget is realistic. Room for life is too small — increase it, or it won't hold.",
};

// Four variants per module. Chosen by member, not by submission order,
// so two submissions for the same module never show identical text in the review queue.
const SUBMISSION_BODIES: Record<number, string[]> = {
  1: [
    "The first sentence I remember is \"we can't afford that\". It wasn't unkind, just constant. Money wasn't discussed at the table — it was discussed in the hallway, quietly. I recognise the clamping-down pattern: everything has to be justified, and when I spend something on myself I carry a feeling for two days that I've stolen something. If money weren't a problem, I wouldn't do sums in my head before ordering a coffee, and I wouldn't be putting off the dentist for a third year.",
    "Money simply wasn't talked about at home, which I suppose is a message of its own. My mum ran everything; my dad didn't know what anything cost. The pattern closest to me is avoidance — I don't open my banking app and bills sit unopened for two weeks. The last time I felt uneasy was when a client asked my price and I started apologising before I'd even said it.",
    "Money was the reason for arguments in our house, and I learned the subject was dangerous. I do the same today: when my partner mentions spending, I get defensive automatically. My pattern is spending as relief — after a hard week I buy something, and it's the only moment I'm kind to myself. If money weren't a problem, I'd take Friday afternoons off without justifying it to anyone.",
    "My mum kept the household budget in a notebook and never complained, but I saw her counting coins at the end of the month. I learned not to talk about it. Today I earn a decent income and I still buy the cheapest version of everything, then get annoyed with myself when nothing lasts. If money weren't a problem, I'd pay someone to help around the house and I wouldn't call it a luxury.",
  ],
  2: [
    "Fixed 780 euros, variable 640, occasional 210 on average, invisible 94. The invisible bucket surprised me — four subscriptions I don't use and fees I'd never even noticed. I expected food to be my biggest item, and it is. What I don't understand is why my occasional spending is so uneven: 60 one month, 400 the next.",
    "Fixed 1,120, variable 710, occasional 265, invisible 61. What surprised me was how much goes on small 'just two things' trips — 14 trips to the shop in four weeks. I expected fuel to be higher than it is. I don't understand how to handle the car registration that comes in March.",
    "Fixed 690, variable 520, occasional 180, invisible 43. It surprised me that variable was lower than I thought, but occasional was double. I expected to feel bad seeing the numbers, and actually I feel lighter. I don't understand why I was so afraid of this.",
    "Fixed 950, variable 580, occasional 320, invisible 78. The size of the occasional bucket surprised me — registration, birthdays and the dentist in the same month come to 600 euros. I expected the invisible bucket to be bigger. I don't understand where to put the children's costs; part of it is fixed and part isn't.",
  ],
  3: [
    "Fixed 780, variable 600, occasional 200 set aside monthly, room for life 90. That leaves 140 for the reserve. If the month goes badly, the reserve payment goes first, not room for life — I've learned that part is what holds the plan together.",
    "Fixed 1,120, variable 650, occasional 250, room for life 120. That leaves 180 for the reserve. If the month goes badly, half the room for life and the whole reserve payment go; the minimum repayments stay.",
    "Fixed 690, variable 480, occasional 180, room for life 70. That leaves 210. If the month goes badly, the occasional bucket goes first, because I already have something set aside in it from last month.",
    "Fixed 950, variable 560, occasional 300, room for life 100. That leaves 90, which is too little, but it's the truth. If the month goes badly, room for life drops by half and nothing else — minimum repayments and the occasional bucket stay untouched.",
  ],
  4: [
    "Billable hours per month: 62. Target income after tax: 1,800. Fixed business costs: 240. Tax and contributions: 32 percent. My minimum hourly rate comes out at 48 euros, and I currently charge 30. The quote I sent: \"For a scope of five posts a month, including preparation and publishing, the price is 420 euros a month. Payment within 15 days of the invoice date, 30 percent deposit.\" I didn't add a single sentence negotiating against myself, and it was physically uncomfortable.",
    "Billable hours: 48. Target income: 2,200. Fixed costs: 310. Tax 35 percent. Minimum hourly rate 72 euros; I currently charge 45. Quote: \"For the complete project in the scope we agreed, the price is 1,600 euros. 50 percent deposit before we start, the rest within 15 days of delivery.\" I sent it yesterday and I'm still waiting to hear back.",
    "Billable hours: 35, which surprised me because I work far more than that. Target income 1,500, fixed costs 180, tax 30 percent. Minimum hourly rate 66 euros. I charge 35. Quote: \"The price for the agreed scope is 780 euros, payment within 15 days of the invoice.\" I didn't write a single \"we can work something out if needed\", and that was the hardest part.",
    "Billable hours: 55. Target income 2,000, fixed costs 420, tax 33 percent. Minimum hourly rate 62 euros, I charge 50 — closer than I thought. Quote: \"For a package of three sessions a month, the price is 690 euros, with a 30 percent deposit.\" The client agreed without a single question, which tells me I'm still too cheap.",
  ],
};

/**
 * The seed deletes every @demo.local account, so it first has to prove it is
 * looking at THIS project's database. Demo #1 (coach-portal) has its own
 * @demo.local accounts and its own profiles table - without this check, a wrong
 * URL in .env.local would wipe them.
 */
async function assertOwnDatabase() {
  // Tables that only exist here.
  const mine = ["modules", "lessons", "submissions", "weekly_reflections"];
  for (const t of mine) {
    const { error } = await db.from(t).select("*").limit(1);
    if (error) {
      console.error(
        `✗ Table "${t}" doesn't exist in the database at ${url}.\n` +
          `  Run this first: npm run db:migrate\n` +
          `  If you already have, check that NEXT_PUBLIC_SUPABASE_URL points at the right project.`,
      );
      process.exit(1);
    }
  }

  // Tables that only exist in demo #1.
  const foreign = ["checkins", "workouts", "progress_photos", "client_status"];
  for (const t of foreign) {
    const { error } = await db.from(t).select("*").limit(1);
    if (!error) {
      console.error(
        `✗ The database at ${url} has a "${t}" table - that's demo #1 (coach-portal), not this project.\n` +
          `  The seed stopped before deleting anything.\n` +
          `  This demo needs its own Supabase instance; fix .env.local.`,
      );
      process.exit(1);
    }
  }
}

async function main() {
  console.log(`Seeding ${brand.name} · ${brand.cohortName} · today ${TODAY}`);
  await assertOwnDatabase();

  // -------------------------------------------------------------------------
  // Clean up
  // -------------------------------------------------------------------------
  const { data: existing } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of existing?.users ?? []) {
    if (u.email?.endsWith("@demo.local")) await db.auth.admin.deleteUser(u.id);
  }
  await db.from("calls").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("modules").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  console.log("✓ previous demo data removed");

  // -------------------------------------------------------------------------
  // Accounts
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
      console.error(`✗ account ${email}`, error);
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
    "profiles",
  );
  console.log(`✓ ${1 + assistants.length + members.length} accounts`);

  // -------------------------------------------------------------------------
  // Modules, lessons, assignments
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
      `module ${order}`,
    );
    moduleIds.push(mod.id);

    const perModule: string[] = [];
    for (let j = 0; j < c.lessons.length; j++) {
      const l = c.lessons[j];

      // Three lessons get a generated PDF worksheet (modules 1 and 2, and lesson 4.3).
      let worksheetPath: string | null = null;
      const wantsWorksheet =
        l.worksheet && ((order <= 2 && j === 0) || (order === 4 && j === 2));
      if (wantsWorksheet && l.worksheet) {
        const bytes = await buildWorksheet(l.worksheet.title, l.worksheet.questions);
        const path = `module-${order}-lesson-${j + 1}.pdf`;
        const { error } = await db.storage
          .from("worksheets")
          .upload(path, bytes, { contentType: "application/pdf", upsert: true });
        if (error) {
          console.error("✗ worksheet upload", error);
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
            video_url: l.video_url ?? null,
            body: l.body,
            worksheet_path: worksheetPath,
            duration_min: l.duration_min,
          })
          .select("id")
          .single(),
        `lesson ${order}.${j + 1}`,
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
      `assignment ${order}`,
    );
    assignmentIds.push(assignment.id);
  }
  console.log(
    `✓ ${moduleIds.length} modules · ${lessonIds.flat().length} lessons · ${assignmentIds.length} assignments · ${worksheetCount} PDF worksheets`,
  );

  // -------------------------------------------------------------------------
  // Lesson progress
  // -------------------------------------------------------------------------
  const progressRows: { member_id: string; lesson_id: string; completed_at: string }[] = [];

  for (const m of members) {
    const memberId = ids.get(m.key)!;
    // Every lesson in the modules before her current one, plus part of the current one.
    const completed: string[] = [];
    for (let order = 1; order < m.module; order++) completed.push(...lessonIds[order - 1]);
    completed.push(...lessonIds[m.module - 1].slice(0, m.lessonsInModule));

    // The most recent completed lesson carries her last-activity date; the rest are earlier.
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
  must(await db.from("lesson_progress").insert(progressRows).select("id"), "lesson progress");
  console.log(`✓ ${progressRows.length} completed lessons`);

  // -------------------------------------------------------------------------
  // Submissions
  // -------------------------------------------------------------------------
  const submissionRows: Record<string, unknown>[] = [];
  const adminId = ids.get(admin.key)!;

  members.forEach((m, memberIndex) => {
    const memberId = ids.get(m.key)!;
    m.submitted.forEach((order) => {
      const key = `${m.key}:${order}`;
      const pending = PENDING.has(key);
      // A submission arrives a few days before that module's deadline, but never
      // later than the member's last activity - otherwise it would change her status.
      const submittedDaysAgo = Math.max(
        2,
        daysUntil(dueFor(order)) * -1 + 3,
        m.lastActivity + 1,
      );
      // By member, so two submissions for the same module in the review queue differ.
      const bodies = SUBMISSION_BODIES[order] ?? SUBMISSION_BODIES[1];
      submissionRows.push({
        assignment_id: assignmentIds[order - 1],
        member_id: memberId,
        body: bodies[memberIndex % bodies.length],
        submitted_at: daysAgo(submittedDaysAgo, 19),
        status: pending ? "pending" : "reviewed",
        feedback: pending
          ? null
          : (FEEDBACK[key] ??
            "Thank you for submitting. The assignment is done exactly as it should be — see you on the call, where we'll go through the details."),
        reviewed_by: pending ? null : ids.get(m.assistant)!,
        reviewed_at: pending ? null : daysAgo(Math.max(1, submittedDaysAgo - 2), 16),
      });
    });
  });
  must(await db.from("submissions").insert(submissionRows).select("id"), "submissions");
  console.log(
    `✓ ${submissionRows.length} submissions (${PENDING.size} awaiting review, ${submissionRows.length - PENDING.size} reviewed)`,
  );

  // -------------------------------------------------------------------------
  // Lesson comments (25 from members + Andreja's replies)
  // -------------------------------------------------------------------------
  const COMMENTS: { member: string; module: number; lesson: number; body: string; daysAgo: number; reply?: string }[] = [
    { member: "mia", module: 1, lesson: 1, daysAgo: 44, body: "The clamping-down pattern hit home. I thought I was just 'careful', but I've spent my whole life apologising every time I buy something.", reply: "Mia, that's a distinction most people never make. Being careful is a decision; clamping down is fear. See you on the call." },
    { member: "anna", module: 1, lesson: 1, daysAgo: 43, body: "Money simply wasn't discussed at home. Only now do I see that was a message too." },
    { member: "lucy", module: 1, lesson: 2, daysAgo: 42, body: "The part about language without adjectives — I tried it and it really is different. \"412 euros\" instead of \"a disaster\".", reply: "Exactly. Once the adjective goes, what's left is a task. Hold on to that for the whole programme." },
    { member: "chloe", module: 1, lesson: 2, daysAgo: 41, body: "The hardest thing for me is that I know the numbers, but I avoid looking at them together in one place." },
    { member: "kate", module: 1, lesson: 3, daysAgo: 40, body: "All three of my sentences turned out to be about the dentist, the car, and not taking a day off. It's funny how concrete it is." },
    { member: "tara", module: 1, lesson: 3, daysAgo: 39, body: "The first time anyone has told me a goal doesn't have to be a number." },
    { member: "ivy", module: 2, lesson: 1, daysAgo: 37, body: "I estimated 300 for food. It came out at 512. I'm not even angry, it's just strange how far off I was.", reply: "Ivy, a 40 percent gap is the average. You're not the exception — that's how it is for everyone until they measure." },
    { member: "nina", module: 2, lesson: 1, daysAgo: 36, body: "By day ten I was bored and nearly gave up. I'm glad I didn't." },
    { member: "daisy", module: 2, lesson: 2, daysAgo: 35, body: "My invisible bucket is 94 euros. Four subscriptions I haven't used in a year.", reply: "That's 1,128 euros a year. Don't cancel anything until the call — just list them first." },
    { member: "maya", module: 2, lesson: 2, daysAgo: 34, body: "The occasional bucket is what broke every budget I ever tried. I never counted it." },
    { member: "lena", module: 2, lesson: 3, daysAgo: 33, body: "The 'first look is only looking' rule saved me. Otherwise I'd have cancelled half of everything by evening and been back to normal within a week." },
    { member: "tessa", module: 2, lesson: 3, daysAgo: 32, body: "I wrote my three sentences, and the one that hit hardest was 'what I don't understand'." },
    { member: "isla", module: 3, lesson: 1, daysAgo: 30, body: "Ten minutes a week as the measure of complexity — that immediately ruled out three apps I'd downloaded.", reply: "Exactly. If it needs more attention than that, you'll have abandoned it by March." },
    { member: "mia", module: 3, lesson: 1, daysAgo: 29, body: "My last budget broke in week three and I thought the problem was me." },
    { member: "chloe", module: 3, lesson: 2, daysAgo: 28, body: "A question for the call: how do I work out percentages when my income swings between 900 and 2,400?", reply: "Chloe, plan around your lowest month of the past year. Anything above it is surplus and goes into the reserve. Uncomfortable for the first two months, a lifesaver after that." },
    { member: "lucy", module: 3, lesson: 2, daysAgo: 27, body: "Rent takes 45 percent of my income. For me the 50/30/20 rule mathematically doesn't exist." },
    { member: "anna", module: 3, lesson: 3, daysAgo: 26, body: "I first set my room for life at 30 euros. After the lesson I raised it to 90 and it feels strange — but a good strange." },
    { member: "kate", module: 3, lesson: 3, daysAgo: 25, body: "This is the lesson I'd send to every friend I have." },
    { member: "nina", module: 4, lesson: 1, daysAgo: 24, body: "I worked out my minimum hourly rate. 72 euros. I charge 45. I'm just sitting here looking at it.", reply: "Nina, that's the most common gap in the group. Don't jump straight to 72 — make your next quote 58, and we'll go from there." },
    { member: "isla", module: 4, lesson: 2, daysAgo: 23, body: "I practised out loud ten times. The first five were awful." },
    { member: "daisy", module: 4, lesson: 2, daysAgo: 22, body: "\"I can adjust the price if we reduce the scope\" changed the whole conversation with a client yesterday.", reply: "That's the sentence that ties the price to the work instead of to your willingness to please. Brilliant." },
    { member: "sara", module: 4, lesson: 3, daysAgo: 21, body: "A 30 percent deposit sounded rude to me until I saw that everyone does it.", reply: "Sara, a deposit isn't mistrust — it's standard. The client who refuses one is usually the same one who pays the rest late." },
    { member: "tessa", module: 5, lesson: 1, daysAgo: 19, body: "My reserve comes out at 4,200 euros. Now that I know the number, I'm less afraid than when I didn't." },
    { member: "lucy", module: 5, lesson: 2, daysAgo: 17, body: "I set up a standing order for payday. It didn't hurt as much as I expected." },
    { member: "ivy", module: 5, lesson: 3, daysAgo: 20, body: "\"Unplanned, necessary and urgent — all three, not one of the three.\" I wrote it down and stuck it on the fridge." },
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
    "comments",
  );

  const replyRows = replies.map((r) => ({
    lesson_id: commentRows[r.parentIdx].lesson_id,
    author_id: adminId,
    body: r.body,
    created_at: daysAgo(r.daysAgo, 20),
    parent_id: insertedComments[r.parentIdx].id,
  }));
  must(await db.from("lesson_comments").insert(replyRows).select("id"), "replies");
  console.log(`✓ ${commentRows.length} comments + ${replyRows.length} replies from Andreja`);

  // -------------------------------------------------------------------------
  // Calls
  // -------------------------------------------------------------------------
  const callSpecs = [
    { title: "Kick-off: where your decisions come from", daysAgo: 28 },
    { title: "Spending maps: what you saw", daysAgo: 21 },
    { title: "A budget that survives a bad month", daysAgo: 14 },
    { title: "Pricing: the maths and saying it out loud", daysAgo: 7 },
  ];
  const NOTES = [
    "We went through the three patterns and agreed most of us have two at once. Homework: write without adjectives for seven days.\n\nQuestions that kept coming up: what if a partner doesn't want to take part, and how to start when income is unpredictable. We cover both in module 3.",
    "Nine of you shared your map numbers. The invisible bucket was bigger than expected for everyone, averaging 7 percent of income.\n\nAgreed: nobody cancels anything before the next call. The first look is only looking.",
    "We built first budgets live. The most common mistake: room for life set too low, under 3 percent.\n\nHomework: add the sentence \"what breaks first if the month goes badly\".",
    "We practised saying a price and then staying silent. Five of you sent a quote at your new price during the call.\n\nNext time: getting paid, deposits and reminders without apologising.",
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
    "past calls",
  );

  const nextCall = must<{ id: string }>(
    await db
      .from("calls")
      .insert({
        title: "Reserve and savings: what's your number?",
        scheduled_at: new Date(`${addDaysISO(TODAY, 4)}T17:00:00Z`).toISOString(),
        zoom_url: "https://zoom.us/j/9812345678",
      })
      .select("id")
      .single(),
    "next call",
  );
  console.log(`✓ ${pastCalls.length} past calls + 1 next call in 4 days`);

  // -------------------------------------------------------------------------
  // Questions for calls
  // -------------------------------------------------------------------------
  const lastPast = pastCalls[pastCalls.length - 1].id;
  must(
    await db.from("call_questions").insert([
      {
        call_id: lastPast,
        member_id: ids.get("mia")!,
        body: "How do I set a price when what I do doesn't have a clear hourly rate, only an outcome?",
        created_at: daysAgo(9, 12),
        answered: true,
        answer:
          "Mia, even for an outcome, work out your hourly rate first — you need a floor. Then estimate how many hours really go into it and add 25 percent for whatever always comes up. You present the price as a package, but you calculate it by the hour.",
      },
      {
        call_id: lastPast,
        member_id: ids.get("tessa")!,
        body: "What do I do with a client who has been two months late paying?",
        created_at: daysAgo(8, 13),
        answered: true,
        answer:
          "Send a reminder without apologising, and state the date you expect payment by. If it passes, you stop working. Say it in advance, calmly, in one sentence.",
      },
      {
        call_id: lastPast,
        member_id: ids.get("lena")!,
        body: "Can I start module 3 if my map isn't finished yet?",
        created_at: daysAgo(7, 14),
        answered: false,
      },
      {
        call_id: nextCall.id,
        member_id: ids.get("chloe")!,
        body: "How many months of reserve if I work project to project and have a child?",
        created_at: daysAgo(3, 10),
        answered: true,
        answer:
          "Chloe, in your case six months is the minimum, and nine is what you'll actually sleep on. Count months of minimum expenses, not months of income.",
      },
      {
        call_id: nextCall.id,
        member_id: ids.get("nina")!,
        body: "Is it smarter to build a reserve first or pay off my credit card?",
        created_at: daysAgo(2, 11),
        answered: true,
        answer:
          "A small reserve first (one month of expenses), then the card at full speed, then the rest of the reserve. Without that first month, every car repair sends you back to the card.",
      },
      {
        call_id: nextCall.id,
        member_id: ids.get("daisy")!,
        body: "Where do I keep a reserve so it isn't too easy to reach, but I can get to it within a few days?",
        created_at: daysAgo(2, 15),
        answered: false,
      },
      {
        call_id: nextCall.id,
        member_id: ids.get("kate")!,
        body: "What if the reserve I've calculated feels like an impossible amount?",
        created_at: daysAgo(1, 9),
        answered: false,
      },
    ]).select("id"),
    "questions",
  );
  console.log("✓ 7 questions (4 answered)");

  // -------------------------------------------------------------------------
  // Weekly reflections
  // -------------------------------------------------------------------------
  const REFLECTIONS: { member: string; weeksAgo: number; win: string; blocker: string; next: string }[] = [
    { member: "mia", weeksAgo: 2, win: "I opened my banking app every day without my throat tightening.", blocker: "I still do sums in my head before I order.", next: "Set my room for life and stick to it for seven days." },
    { member: "mia", weeksAgo: 3, win: "I finished my four-week map without skipping a single day.", blocker: "The occasional bucket is still vague to me.", next: "List everything coming up before the end of the year." },
    { member: "anna", weeksAgo: 2, win: "I raised my room for life from 30 to 90 euros.", blocker: "Guilt after every small purchase.", next: "Don't justify a single purchase from that amount." },
    { member: "anna", weeksAgo: 3, win: "I listed every subscription — there are eleven.", blocker: "I don't know which ones I actually need.", next: "Cancel three I haven't opened in a month." },
    { member: "chloe", weeksAgo: 2, win: "I worked out my minimum hourly rate and sent my first quote at it.", blocker: "Waiting to hear back, and second-guessing myself.", next: "Don't lower the price before I get an answer." },
    { member: "lucy", weeksAgo: 2, win: "I set up a standing order for my reserve.", blocker: "I'm afraid of the first month when things get tight.", next: "Write my bad-month plan in advance." },
    { member: "lucy", weeksAgo: 4, win: "I split fuel and food in my map.", blocker: "My fixed costs are too high for my income.", next: "Check rent and insurance." },
    { member: "isla", weeksAgo: 2, win: "I said my price and stayed quiet. The client agreed.", blocker: "Those three seconds of silence felt endless.", next: "Do the same with another client this week." },
    { member: "nina", weeksAgo: 3, win: "My invisible bucket turned out small — the first good news in my numbers.", blocker: "My hourly rate is 27 euros below my minimum.", next: "My next quote goes out at 58 euros." },
    { member: "tessa", weeksAgo: 2, win: "I know my reserve number. 4,200 euros.", blocker: "It feels far away.", next: "Put the first 150 euros aside this month." },
    { member: "daisy", weeksAgo: 3, win: "I cancelled four subscriptions I hadn't used in a year.", blocker: "I still don't enjoy looking at my balance.", next: "Check my balance every Monday morning." },
    { member: "kate", weeksAgo: 2, win: "For the first time I wrote a budget that has room for life in it.", blocker: "I don't know what to pause in a bad month.", next: "Write three steps for a bad month." },
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
    "reflections",
  );
  console.log(`✓ ${REFLECTIONS.length} reflections`);

  // -------------------------------------------------------------------------
  // Status check
  // -------------------------------------------------------------------------
  const { data: status } = await db.from("member_status").select("*").order("full_name");
  const counts = { active: 0, slowing: 0, stalled: 0 } as Record<string, number>;
  for (const row of status ?? []) counts[(row as { status: string }).status]++;

  console.log("\nCohort status:");
  for (const row of (status ?? []) as any[]) {
    console.log(
      `  ${row.full_name.padEnd(18)} module ${String(row.current_module ?? "-").padStart(2)} · ` +
        `${String(row.lessons_done_pct).padStart(3)}% · ${String(row.days_since_activity ?? "-").padStart(3)} days · ` +
        `${row.overdue_assignments} overdue · ${row.status}`,
    );
  }
  console.log(
    `\n  active ${counts.active} · slowing ${counts.slowing} · stalled ${counts.stalled}` +
      `  (target: 9 / 3 / 2)`,
  );

  console.log(`\nDemo accounts (password ${PASSWORD}):`);
  console.log(`  member     ${members[0].email}`);
  console.log(`  assistant  ${assistants[0].email}`);
  console.log(`  Andreja    ${admin.email}`);
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
