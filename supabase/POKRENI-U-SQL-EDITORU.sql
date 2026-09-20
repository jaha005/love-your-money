-- Zavoli svoj novac: šema, RLS, member_status view, storage.
-- Pokreće se jednom na svježem Supabase projektu (scripts/migrate.ts).

-- =========================================================
-- Tabele
-- =========================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('member', 'assistant', 'admin')),
  full_name text not null,
  avatar_url text,
  assistant_id uuid references public.profiles(id) on delete set null,
  joined_at date not null default current_date,
  cohort text,
  created_at timestamptz not null default now()
);
create index profiles_assistant_idx on public.profiles(assistant_id);
create index profiles_role_idx on public.profiles(role);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null unique,
  title text not null,
  subtitle text,
  unlock_at date not null,
  summary text
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  sort_order int not null,
  title text not null,
  video_url text,
  body text not null default '',
  worksheet_path text,
  duration_min int not null default 10 check (duration_min > 0),
  unique (module_id, sort_order)
);
create index lessons_module_idx on public.lessons(module_id, sort_order);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (member_id, lesson_id)
);
create index lesson_progress_member_idx on public.lesson_progress(member_id, completed_at desc);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  instructions text not null default '',
  due_at date not null
);
create index assignments_module_idx on public.assignments(module_id);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  body text not null default '',
  file_path text,
  submitted_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  feedback text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  unique (assignment_id, member_id)
);
create index submissions_member_idx on public.submissions(member_id, submitted_at desc);
create index submissions_pending_idx on public.submissions(status, submitted_at);

create table public.lesson_comments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  parent_id uuid references public.lesson_comments(id) on delete cascade
);
create index lesson_comments_lesson_idx on public.lesson_comments(lesson_id, created_at);
create index lesson_comments_author_idx on public.lesson_comments(author_id, created_at desc);

create table public.calls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  scheduled_at timestamptz not null,
  zoom_url text,
  recording_url text,
  notes text
);
create index calls_scheduled_idx on public.calls(scheduled_at desc);

create table public.call_questions (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references public.calls(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  answered boolean not null default false,
  answer text
);
create index call_questions_call_idx on public.call_questions(call_id, created_at);
create index call_questions_member_idx on public.call_questions(member_id, created_at desc);

create table public.weekly_reflections (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  win text not null default '',
  blocker text not null default '',
  next_step text not null default '',
  created_at timestamptz not null default now(),
  unique (member_id, week_start)
);
create index weekly_reflections_member_idx on public.weekly_reflections(member_id, week_start desc);

-- In-app podsjetnik iz A1 Kohorta (v1: bez emaila).
create table public.notices (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index notices_member_idx on public.notices(member_id, created_at desc);

-- =========================================================
-- Pomoćne funkcije (security definer: izbjegava RLS rekurziju)
-- =========================================================

-- "Danas" u vremenskoj zoni programa. Mijenjaj zajedno s lib/brand.ts.
create or replace function public.app_today()
returns date language sql stable
as $$ select (now() at time zone 'Europe/Zagreb')::date $$;

create or replace function public.app_role()
returns text language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false) $$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce((select role in ('assistant', 'admin') from public.profiles where id = auth.uid()), false) $$;

create or replace function public.is_assistant_of(mid uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = mid and assistant_id = auth.uid()) $$;

create or replace function public.my_assistant_id()
returns uuid language sql stable security definer set search_path = public
as $$ select assistant_id from public.profiles where id = auth.uid() $$;

-- Ko smije vidjeti podatke jedne članice: ona sama, admin, njena asistentica.
create or replace function public.can_access_member(mid uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select mid = auth.uid() or public.is_admin() or public.is_assistant_of(mid) $$;

-- Modul je otključan kad je datum stigao (za sve osim staffa).
create or replace function public.module_unlocked(mid uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.modules where id = mid and unlock_at <= public.app_today()) $$;

-- Članice ne mogu sebi mijenjati ulogu ni asistenticu.
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.assistant_id := old.assistant_id;
  end if;
  return new;
end $$;

create trigger profiles_protect_fields
before update on public.profiles
for each row execute function public.protect_profile_fields();

-- =========================================================
-- RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.lesson_comments enable row level security;
alter table public.calls enable row level security;
alter table public.call_questions enable row level security;
alter table public.weekly_reflections enable row level security;
alter table public.notices enable row level security;

-- profiles: puni red vidi samo ona sama, admin, njena asistentica (i članica svoju asistenticu).
-- Ime i avatar drugih članica idu kroz public_profiles view ispod.
create policy profiles_select on public.profiles for select to authenticated
using (
  id = auth.uid()
  or public.is_admin()
  or assistant_id = auth.uid()
  or id = public.my_assistant_id()
);
create policy profiles_update_self on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());
create policy profiles_admin_insert on public.profiles for insert to authenticated
with check (public.is_admin());
create policy profiles_admin_delete on public.profiles for delete to authenticated
using (public.is_admin());

-- moduli i lekcije: svi prijavljeni čitaju, admin piše.
-- (Zaključan modul se vidi u stablu s datumom otključavanja; tijelo lekcije skriva app.)
create policy modules_read on public.modules for select to authenticated using (true);
create policy modules_admin_write on public.modules for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy lessons_read on public.lessons for select to authenticated using (true);
create policy lessons_admin_write on public.lessons for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy assignments_read on public.assignments for select to authenticated using (true);
create policy assignments_admin_write on public.assignments for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- lesson_progress: članica piše svoje; asistentica/admin čitaju svoje članice.
create policy lesson_progress_read on public.lesson_progress for select to authenticated
using (public.can_access_member(member_id));
create policy lesson_progress_insert on public.lesson_progress for insert to authenticated
with check (member_id = auth.uid() and public.module_unlocked(
  (select module_id from public.lessons where id = lesson_id)
));
create policy lesson_progress_delete on public.lesson_progress for delete to authenticated
using (member_id = auth.uid() or public.is_admin());

-- submissions: članica predaje svoje; asistentica/admin čitaju i pišu feedback.
create policy submissions_read on public.submissions for select to authenticated
using (public.can_access_member(member_id));
create policy submissions_member_insert on public.submissions for insert to authenticated
with check (member_id = auth.uid() and status = 'pending' and feedback is null);
create policy submissions_member_update on public.submissions for update to authenticated
using (member_id = auth.uid() and status = 'pending')
with check (member_id = auth.uid() and status = 'pending');
create policy submissions_staff_review on public.submissions for update to authenticated
using (public.is_admin() or public.is_assistant_of(member_id))
with check (public.is_admin() or public.is_assistant_of(member_id));

-- lesson_comments: javna diskusija ispod lekcije, svi prijavljeni čitaju.
create policy lesson_comments_read on public.lesson_comments for select to authenticated using (true);
create policy lesson_comments_insert on public.lesson_comments for insert to authenticated
with check (author_id = auth.uid());
create policy lesson_comments_update_own on public.lesson_comments for update to authenticated
using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy lesson_comments_delete on public.lesson_comments for delete to authenticated
using (author_id = auth.uid() or public.is_admin());

-- pozivi: svi prijavljeni čitaju, admin piše.
create policy calls_read on public.calls for select to authenticated using (true);
create policy calls_admin_write on public.calls for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- pitanja za poziv: članica vidi svoja, staff vidi sva (to im je posao za poziv).
create policy call_questions_read on public.call_questions for select to authenticated
using (member_id = auth.uid() or public.is_staff());
create policy call_questions_insert on public.call_questions for insert to authenticated
with check (member_id = auth.uid() and answered = false and answer is null);
create policy call_questions_staff_answer on public.call_questions for update to authenticated
using (public.is_staff()) with check (public.is_staff());

-- refleksije: privatne, vidi ih članica, njena asistentica i admin.
create policy reflections_read on public.weekly_reflections for select to authenticated
using (public.can_access_member(member_id));
create policy reflections_insert on public.weekly_reflections for insert to authenticated
with check (member_id = auth.uid());
create policy reflections_update on public.weekly_reflections for update to authenticated
using (member_id = auth.uid()) with check (member_id = auth.uid());

-- podsjetnici: članica čita i označava pročitano, staff kreira svojima.
create policy notices_read on public.notices for select to authenticated
using (public.can_access_member(member_id));
create policy notices_update on public.notices for update to authenticated
using (member_id = auth.uid()) with check (member_id = auth.uid());
create policy notices_staff_insert on public.notices for insert to authenticated
with check (public.is_admin() or public.is_assistant_of(member_id));

-- =========================================================
-- public_profiles: samo ime i avatar, za autore komentara u javnoj diskusiji.
-- Puni red (asistentica, kohorta, joined_at) ostaje zaštićen u profiles.
-- =========================================================

create or replace view public.public_profiles
with (security_invoker = false)
as
select id, full_name, avatar_url, role
from public.profiles;

grant select on public.public_profiles to authenticated;

-- =========================================================
-- member_status: gdje je svaka članica i koliko dugo je nema.
-- security_invoker = true -> asistentica kroz view vidi samo svoje članice.
-- =========================================================

create or replace view public.member_status
with (security_invoker = true)
as
with done as (
  select lp.member_id, l.module_id, m.sort_order as module_order, lp.completed_at
  from public.lesson_progress lp
  join public.lessons l on l.id = lp.lesson_id
  join public.modules m on m.id = l.module_id
),
current_module as (
  select distinct on (member_id) member_id, module_id, module_order
  from done
  order by member_id, module_order desc
),
module_totals as (
  select module_id, count(*)::int as total
  from public.lessons
  group by module_id
),
module_done as (
  select d.member_id, d.module_id, count(*)::int as done
  from done d
  group by d.member_id, d.module_id
),
last_activity as (
  select member_id, max(at) as at from (
    select member_id, completed_at as at from public.lesson_progress
    union all
    select member_id, submitted_at from public.submissions
    union all
    select author_id, created_at from public.lesson_comments
    union all
    select member_id, created_at from public.weekly_reflections
  ) t
  group by member_id
),
-- Kasni samo zadatak modula do kojeg je članica stigla: zadatak iz modula 7
-- nije "kasni" nekome ko je tek u modulu 3.
overdue as (
  select p.id as member_id, count(*)::int as overdue_assignments
  from public.profiles p
  join current_module cm on cm.member_id = p.id
  join public.assignments a on true
  join public.modules m on m.id = a.module_id
  where p.role = 'member'
    and a.due_at < public.app_today()
    and m.unlock_at <= public.app_today()
    and m.sort_order <= cm.module_order
    and not exists (
      select 1 from public.submissions s
      where s.assignment_id = a.id and s.member_id = p.id
    )
  group by p.id
)
select
  p.id as member_id,
  p.full_name,
  p.cohort,
  p.assistant_id,
  cm.module_order as current_module,
  mo.title as current_module_title,
  coalesce(md.done, 0) as lessons_done,
  coalesce(mt.total, 0) as lessons_total,
  case when coalesce(mt.total, 0) = 0 then 0
       else round(coalesce(md.done, 0)::numeric * 100 / mt.total)::int end as lessons_done_pct,
  (public.app_today() - (la.at at time zone 'Europe/Zagreb')::date) as days_since_activity,
  coalesce(ov.overdue_assignments, 0) as overdue_assignments,
  case
    when coalesce(ov.overdue_assignments, 0) >= 2
      or coalesce(public.app_today() - (la.at at time zone 'Europe/Zagreb')::date, 999) >= 15
      then 'stalled'
    when coalesce(ov.overdue_assignments, 0) = 1
      or coalesce(public.app_today() - (la.at at time zone 'Europe/Zagreb')::date, 999) >= 8
      then 'slowing'
    else 'active'
  end as status
from public.profiles p
left join current_module cm on cm.member_id = p.id
left join public.modules mo on mo.id = cm.module_id
left join module_totals mt on mt.module_id = cm.module_id
left join module_done md on md.member_id = p.id and md.module_id = cm.module_id
left join last_activity la on la.member_id = p.id
left join overdue ov on ov.member_id = p.id
where p.role = 'member';

grant select on public.member_status to authenticated;

-- =========================================================
-- Storage
-- =========================================================

-- Radni listovi: čitaju svi prijavljeni, piše admin.
insert into storage.buckets (id, name, public)
values ('worksheets', 'worksheets', false)
on conflict (id) do nothing;

create policy "worksheets: svi prijavljeni citaju"
on storage.objects for select to authenticated
using (bucket_id = 'worksheets');

create policy "worksheets: admin pise"
on storage.objects for insert to authenticated
with check (bucket_id = 'worksheets' and public.is_admin());

create policy "worksheets: admin brise"
on storage.objects for delete to authenticated
using (bucket_id = 'worksheets' and public.is_admin());

-- Predaje: privatno, folder po članici ({member_id}/fajl).
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

create or replace function public.can_access_member_folder(object_name text)
returns boolean language plpgsql stable security definer set search_path = public
as $$
declare
  folder text := split_part(object_name, '/', 1);
begin
  if folder !~ '^[0-9a-f-]{36}$' then
    return false;
  end if;
  return public.can_access_member(folder::uuid);
end $$;

create policy "submissions: citaju clanica, njena asistentica i admin"
on storage.objects for select to authenticated
using (bucket_id = 'submissions' and public.can_access_member_folder(name));

create policy "submissions: clanica salje u svoj folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'submissions' and split_part(name, '/', 1) = auth.uid()::text);

create policy "submissions: clanica brise svoje"
on storage.objects for delete to authenticated
using (bucket_id = 'submissions' and split_part(name, '/', 1) = auth.uid()::text);

-- =========================================================
-- Evidencija migracije: da npm run db:migrate zna da je 0001 već primijenjena
-- i da je ne pokuša pokrenuti ponovo.
-- =========================================================

create table if not exists public._migrations (
  name text primary key,
  applied_at timestamptz not null default now()
);
alter table public._migrations enable row level security;

insert into public._migrations (name) values ('0001_init.sql')
on conflict (name) do nothing;
