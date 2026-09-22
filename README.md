# Love Your Money — group programme platform

A web platform for a coach running a group education programme: eight modules,
lessons with video and text, downloadable worksheets, assignments with a review
queue, weekly Zoom calls, and a cohort dashboard that shows at a glance who has
stalled.

**Concept project.** A real person's name appears only in `lib/brand.ts`.

It is the second of two demos. Demo #1 (`coach-portal`) is a mobile-first fitness
client app; this one is an editorial, desktop-first learning platform. The two
share only the invisible core — the Supabase setup, auth, role system and RLS
pattern. No UI component is shared.

---

## Stack

- Next.js 14 (App Router, TypeScript), Tailwind
- Supabase: Auth (email + password), Postgres, Row Level Security, Storage
- `react-markdown` for lesson text, `@tanstack/react-table` for the cohort table
- Plus Jakarta Sans (headings) + Inter (UI), via Google Fonts
- Remotion for the promo video and per-module intro clips (`video/`)
- No Stripe, no push notifications, no real-time

All interface copy lives in `lib/copy.ts`.

---

## Getting started

### 1. A Supabase project

This demo needs **its own Supabase instance** — it must not share a database with
demo #1.

1. Create a new project at [supabase.com](https://supabase.com).
2. Click **Connect** → **App Frameworks** → Next.js / App Router: copy the project
   URL and the publishable key (`sb_publishable_…`).
3. **Settings → API keys → Secret keys**: copy the secret key (`sb_secret_…`).
4. **Connect → Session pooler**: copy the connection string and replace
   `[YOUR-PASSWORD]` with your database password (used only by the local scripts).

### 2. Environment

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_DB_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_DEMO_MODE=true
DEMO_PASSWORD=demo1234
```

### 3. Database and demo data

```bash
npm install
npm run db:migrate   # schema, RLS, member_status view, storage buckets
npm run db:seed      # 8 modules, 14 members, submissions, comments, calls
npm run test:rls     # checks data isolation with real sign-ins
npm run dev
```

`db:seed` is safe to re-run: it first removes the previous `@demo.local` accounts
and content, and finishes by printing every member's status so you can see the
distribution is right. Dates are relative to the day you run it — **re-run it on
the day you record a demo.**

If you can't use the pooler connection, paste `supabase/RUN-IN-SQL-EDITOR.sql`
into the Supabase SQL Editor instead of running `db:migrate`. The seed and RLS
tests only need the API keys.

`npm run db:reset` drops everything the migration created so you can start over.

### Keeping a public demo fresh

Every date in the seed is relative to the day it runs — "18 days ago", the next
call in 4 days, module 8 still locked. Left alone, the cohort drifts: after a week
nobody reads as active, and after two weeks every member shows as stalled.

So `.github/workflows/reseed.yml` runs the seed every morning at 04:00 UTC. It also
clears anything visitors typed into the demo the day before. It needs two repository
secrets — `SUPABASE_URL` and `SUPABASE_SECRET_KEY` — and not the database password,
because the seed only talks to the API.

> **Don't run `npm run build` while `npm run dev` is running.** Both write to
> `.next`, so the build deletes the dev server's CSS chunks and the page loads
> unstyled. For a local build check use `npm run build:check`, which builds into
> `.next-check`. Vercel still runs the plain `npm run build`.

### Safety rails

`db:seed` deletes every `@demo.local` account, and `db:reset` drops
`public.profiles`. Demo #1 has both of those too. So both scripts first check the
database: if it contains demo #1's tables (`checkins`, `workouts`,
`progress_photos`, `client_status`), they stop before touching anything.

---

## Demo accounts

Password for all of them: `demo1234` (or whatever you set in `DEMO_PASSWORD`).

| Role | Email | Sees |
|---|---|---|
| Member | `member@demo.local` | Mia Harper, in module 4 |
| Assistant | `assistant@demo.local` | Sophie Walsh's 8 members |
| Admin | `andreja@demo.local` | The whole cohort, plus the programme editor |

With `NEXT_PUBLIC_DEMO_MODE=true`, the sign-in page shows three one-click buttons.

---

## Screens

**Member** — `/home` · `/program` · `/assignments` · `/calls` · `/community` · `/progress`

Every lesson has its own URL (`/program/4/3`) so it can be shared in a group chat.

**Assistant / admin** — `/cohort` · `/cohort/[id]` · `/review` · `/questions`,
and for the admin only, `/editor/program` and `/editor/calls`.

---

## Adding a module or lesson

**In the app (admin):** `/editor/program` → pick a module → edit its title, unlock
date and summary. Below that there's a form for each lesson and one for a new
lesson. Worksheets upload as PDFs straight from the form. The module's
assignment is at the bottom of the same page.

**Through the seed (for a fresh demo instance):** the content lives in
`scripts/content.ts` — an array of modules, each with `lessons[]` and an
`assignment`. Add an entry and run `npm run db:seed`. A lesson with a `worksheet`
gets a generated PDF (see `scripts/worksheet-pdf.ts`).

**With SQL:**

```sql
insert into public.modules (sort_order, title, subtitle, unlock_at, summary)
values (9, 'Title', 'Subtitle', '2026-12-01', 'Summary in markdown');
```

`sort_order` is part of each lesson's URL, so don't change it once links have been shared.

---

## Member status

`member_status` is a Postgres view that works out, for each member:

- **current_module** — the highest module with at least one completed lesson
- **lessons_done_pct** — the share of lessons completed in that module
- **days_since_activity** — the latest lesson_progress / submission / comment / reflection
- **overdue_assignments** — assignments past their due date with no submission

| Status | Condition |
|---|---|
| `active` | ≤ 7 days since activity and 0 overdue |
| `slowing` | 8–14 days **or** 1 overdue |
| `stalled` | 15+ days **or** 2+ overdue |

**One deliberate addition to the brief:** an assignment only counts as overdue for
modules the member has actually reached (`sort_order <= current_module`).
Without that, every slower member would have assignments from modules ahead of
her automatically counted as late, and the whole cohort would show as stalled.

---

## Row Level Security

Isolation relies on `security definer` helper functions (`is_admin()`,
`is_assistant_of()`, `can_access_member()`), so policies never recurse.

- **member** — reads modules, lessons and calls; reads and writes her own progress,
  submissions, reflections, comments and questions; reads everyone's comments under
  lessons (it's a public discussion)
- **assistant** — all of the above, plus submissions, reflections and profiles of
  **her own** members (`assistant_id = auth.uid()`)
- **admin** — everything

The full `profiles` row (assistant, cohort, join date) is protected. Comment author
names go through the `public_profiles` view, which exposes only
`id, full_name, avatar_url, role`. That keeps the public discussion working while
an assistant still can't fetch another assistant's member with a query.

`npm run test:rls` signs in as real accounts with the publishable key and checks
both directions — what must be hidden, and what must be visible.

Storage:

- `worksheets` — private bucket; every signed-in user can read, only the admin
  writes; the app serves signed links that last an hour
- `submissions` — private bucket, one folder per member (`{member_id}/file`)

---

## Deploying to Vercel

1. A new Vercel project from this repo (separate from demo #1).
2. Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_DEMO_MODE=true`, `DEMO_PASSWORD`.
   `SUPABASE_DB_URL` is **not** needed on Vercel — only the local scripts use it.
3. Sign-in is email + password only, so no redirect URLs are needed in Supabase.
   Add the Vercel domain under **Authentication → URL Configuration** only if you
   later add OAuth or magic links.

---

## Design

An editorial layout, deliberately the opposite of demo #1: a 248 px sidebar on its
own surface, content up to 920 px, and a 296 px context rail on the right. On
mobile the sidebar becomes a hamburger menu and the rail drops below the content.
There is no bottom nav.

**Typography.** Headings in **Plus Jakarta Sans**, body and UI in **Inter**. Both
faces are sans, so the hierarchy comes from weight, size and tracking rather than
from a serif/sans contrast: headings at 600 with tight tracking (-0.025em on h1)
against body text at 400. The Tailwind token is `font-display`, not `font-serif`.

**Depth without heavy shadows.** The page is a warm, deeper cream (`#F4EEE2`) and
cards are **lighter** than it (`#FFFCF5`). Containers read from tone; the shadow is
only a hint (`shadow-card`).

**Two warm colours.** Gold `#B0882E` is the primary accent, clay `#9A5442` the
second. From those, plus sage and plum, comes the palette for avatars and status
pills — each member always gets the same colour, which gives lists life without a
single image.

Everything flows from `lib/brand.ts` → `lib/colors.ts` → CSS variables set in
`app/layout.tsx`. Changing the accent in one place changes the app, the generated
PDF worksheets and the Remotion videos.

---

## Lesson video

The seed **ships no third-party recordings.** A lesson without a video shows a quiet
placeholder ("The lesson recording goes here"), and the first lesson of each
module plays its own Remotion intro clip instead. As soon as Andreja pastes a
YouTube or Vimeo link in the editor, the lesson shows a real embed.

---

## Video (Remotion)

`video/` is a separate Remotion project with two compositions. Colours and fonts
come from the same `lib/brand.ts` as the app, and module titles from the same
`scripts/content.ts` as the seed — nothing is copied by hand.

```bash
cd video
npm install
npm run studio    # live preview at http://localhost:3000
npm run promo     # out/promo.mp4  (72 s, 1920x1080)
npm run intros    # 8 clips + poster stills into ../public/intro/
```

**Promo** (`video/src/Promo.tsx`) — nine scenes: title, the problem, the member's
home screen, a lesson with its discussion, an assignment and its feedback, the
cohort map, filtering to stalled members and sending a nudge, a feature list, and
a close. No screen recording — everything is rebuilt from the same design tokens,
so it stays accurate when the palette changes.

**ModuleIntro** (`video/src/ModuleIntro.tsx`) — a six-second module title card.
`npm run intros` renders `public/intro/module-1.mp4` … `module-8.mp4`, plus a
`.jpg` poster for each.

The first lesson of every module shows that clip above the text
(`components/module-intro-clip.tsx`): muted, no controls, plays once. With
`prefers-reduced-motion` enabled, only the still poster is shown. If a clip hasn't
been rendered, the page simply skips it.

> **Licence:** Remotion is free for individuals and companies of up to 3 people;
> larger companies need a company licence. Fine for a concept project and a
> portfolio — check before including it in paid client work.
> https://remotion.dev/license

---

## Accessibility

Checked and fixed in a dedicated pass:

- **Contrast.** Gold is strong enough as a surface but not as text. So
  `--accent-text` is used for every gold label, link and focus ring (4.5–5.1:1
  depending on the background), while gold buttons carry dark text (5.0:1). Input
  borders use `--line-strong` (3.1–3.5:1, WCAG 1.4.11); card lines stay soft because
  they're decorative. Avatar and status colours are derived as background/text
  pairs, all above 4.5:1.
- **Keyboard.** A visible focus ring on everything, a "Skip to content" link, and
  `<main>` with an id and `tabIndex={-1}`.
- **Screen readers.** Every field has a label (a visually hidden one where the
  design only called for a placeholder), errors carry `role="alert"`, the nudge
  confirmation is `aria-live="polite"`, progress bars have `role="progressbar"`.
- **Motion.** `prefers-reduced-motion` turns off every transition and swaps the
  intro clip for a still.
- **Touch targets.** Buttons, inputs and nav items are at least 44 px.
- **Numbers.** The cohort table uses `tabular-nums` so columns don't shift.

Contrast values are derived in `lib/colors.ts`, so changing the accent in
`brand.ts` pulls the darker variants along with it.
