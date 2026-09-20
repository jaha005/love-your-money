# Zavoli svoj novac — platforma za grupni program

Web platforma za coacha koji vodi grupni edukativni program: 8 modula, lekcije s
videom i tekstom, radni listovi, zadaci s pregledom, sedmični Zoom pozivi i
dashboard kohorte koji pokazuje ko je gdje stao.

**Concept project.** Ime stvarne osobe pojavljuje se samo u `lib/brand.ts`.

Demo #1 (`coach-portal`) i ovaj projekat dijele samo nevidljivo jezgro — Supabase
setup, auth, sistem uloga i RLS pattern. Nijedna UI komponenta nije zajednička.

---

## Stack

- Next.js 14 (App Router, TypeScript), Tailwind
- Supabase: Auth (email + lozinka), Postgres, RLS, Storage
- `react-markdown` za tekst lekcija, `@tanstack/react-table` za pregled kohorte
- Fraunces (naslovi) + Inter (tekst), Google Fonts
- Bez Stripea, bez push notifikacija, bez real-time

UI jezik: hrvatski/bosanski ijekavica. Sav tekst je u `lib/copy.ts`.

---

## Pokretanje

### 1. Supabase projekat

Ovaj projekat traži **zasebnu Supabase instancu** (ne dijeli bazu s demo #1).

1. Otvori novi projekat na [supabase.com](https://supabase.com).
2. `Settings → API`: kopiraj **Project URL**, **anon public** i **service_role** ključ.
3. `Connect → Session pooler`: kopiraj connection string (koriste ga samo migracija i seed).

### 2. Env

```bash
cp .env.example .env.local
```

Popuni:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_DB_URL=postgresql://postgres.xxxx:PASSWORD@aws-...pooler.supabase.com:5432/postgres
NEXT_PUBLIC_DEMO_MODE=true
DEMO_PASSWORD=demo1234
```

### 3. Baza i demo podaci

```bash
npm install
npm run db:migrate   # šema, RLS, member_status view, storage bucketi
npm run db:seed      # 8 modula, 14 članica, predaje, komentari, pozivi
npm run test:rls     # provjera izolacije podataka pravim prijavama
npm run dev
```

`db:seed` se može pokretati više puta — prvo obriše prethodne `@demo.local`
naloge i sadržaj. Na kraju ispiše status svake članice, pa se odmah vidi je li
raspodjela ispravna.

---

## Demo nalozi

Lozinka za sve: `demo1234` (ili ono što staviš u `DEMO_PASSWORD`).

| Uloga | Email | Vidi |
|---|---|---|
| Članica | `clanica@demo.local` | Marija Kovač, modul 4 |
| Asistentica | `petra@demo.local` | svojih 7 članica |
| Admin | `andreja@demo.local` | cijelu kohortu + uređivanje programa |

Kad je `NEXT_PUBLIC_DEMO_MODE=true`, login stranica ima tri dugmeta za prijavu
jednim klikom.

---

## Ekrani

**Članica** — `/pocetna` · `/program` · `/zadaci` · `/pozivi` · `/zajednica` · `/napredak`

Lekcija ima vlastiti URL (`/program/4/3`) pa se može dijeliti u WhatsApp grupi.

**Asistentica / admin** — `/kohorta` · `/pregled` · `/pitanja`, a samo admin još
`/urednik/program` i `/urednik/pozivi`.

---

## Kako dodati modul ili lekciju

**Kroz aplikaciju (admin):** `/urednik/program` → odaberi modul → uredi naslov,
datum otključavanja i sažetak, ispod su forme za svaku lekciju i jedna „Nova
lekcija". Radni list se uploada kao PDF direktno u formi. Zadatak modula je na
dnu iste stranice.

**Kroz seed (za novu demo instancu):** sadržaj je u `scripts/content.ts` —
niz modula, svaki s `lessons[]` i `assignment`. Dodaj element i pokreni
`npm run db:seed`. Lekcija koja ima `worksheet` dobije generisan PDF (vidi
`scripts/worksheet-pdf.ts`).

Novi modul kroz SQL:

```sql
insert into public.modules (sort_order, title, subtitle, unlock_at, summary)
values (9, 'Naslov', 'Podnaslov', '2026-12-01', 'Sažetak u markdownu');
```

`sort_order` je i dio URL-a lekcije, pa ga ne mijenjaj nakon što su linkovi podijeljeni.

---

## Statusi članica

`member_status` je Postgres view koji po članici računa:

- **current_module** — najviši modul s barem jednom završenom lekcijom
- **lessons_done_pct** — postotak lekcija u tom modulu
- **days_since_activity** — zadnji lesson_progress / submission / comment / reflection
- **overdue_assignments** — zadaci s prošlim rokom, bez predaje

| Status | Uvjet |
|---|---|
| `active` | ≤ 7 dana od aktivnosti i 0 zadataka kasni |
| `slowing` | 8–14 dana **ili** 1 zadatak kasni |
| `stalled` | 15+ dana **ili** 2+ zadatka kasne |

**Jedna namjerna dopuna specifikacije:** „kasni" se broji samo za module do kojih
je članica stigla (`sort_order <= current_module`). Bez toga bi svakoj sporijoj
članici zadaci iz modula ispred nje automatski brojali kao zakašnjeli i cijela
bi kohorta ispala „stalled".

---

## RLS

Izolacija se oslanja na `security definer` pomoćne funkcije (`is_admin()`,
`is_assistant_of()`, `can_access_member()`), pa nema rekurzije u politikama.

- **članica** — čita module, lekcije i pozive; piše i čita svoj napredak, predaje,
  refleksije, komentare i pitanja; čita tuđe komentare ispod lekcija
- **asistentica** — sve gore + predaje, refleksije i profile **svojih** članica
  (`assistant_id = auth.uid()`)
- **admin** — sve

Puni red u `profiles` (asistentica, kohorta, datum pristupa) zaštićen je. Imena
autora komentara idu kroz view `public_profiles`, koji izlaže samo
`id, full_name, avatar_url, role`. Tako javna diskusija radi, a asistentica i
dalje ne može upitom dohvatiti tuđu članicu.

`npm run test:rls` se prijavljuje pravim nalozima s anon ključem i provjerava
oba smjera — i šta se ne smije vidjeti, i šta se mora.

Storage:

- `worksheets` — privatan bucket, čitaju svi prijavljeni, piše samo admin;
  app servira potpisane linkove koji vrijede sat vremena
- `submissions` — privatan bucket, folder po članici (`{member_id}/fajl`)

---

## Deploy na Vercel

1. Novi Vercel projekat iz ovog repoa (zaseban od demo #1).
2. Environment varijable: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_DEMO_MODE=true`, `DEMO_PASSWORD`.
   `SUPABASE_DB_URL` **ne treba** na Vercelu — koriste ga samo lokalne skripte.
3. U Supabase `Authentication → URL Configuration` dodaj Vercel domenu.

---

## Dizajn

Editorial layout, namjerno suprotan od demo #1: sidebar 260 px lijevo, sadržaj do
960 px, desno kolona 300 px za kontekst. Na mobitelu sidebar postaje hamburger,
desna kolona ide ispod sadržaja. Nema donjeg nava.

Boje, fontovi i razmaci izvedeni su iz `lib/brand.ts` → `lib/colors.ts` → CSS
varijable koje postavlja `app/layout.tsx`. Promjena akcenta na jednom mjestu
mijenja cijelu aplikaciju i generisane PDF radne listove.

Tanke linije umjesto sjena, radius 8 px, progres kao linija a ne krug, ikone samo
u sidebaru (lucide, stroke 1.5), prazna stanja s rečenicom umjesto ilustracije.
