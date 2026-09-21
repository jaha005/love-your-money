import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getAssistants, getCurriculum } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { formatDate, relativeDays } from "@/lib/dates";
import { Avatar, Empty, SectionTitle, StatusPill } from "@/components/ui";
import type { MemberStatusRow, Profile } from "@/lib/types";
import { StaffShell } from "../../staff-shell";

type Event = { at: string; kind: string; title: string; body?: string | null; extra?: string | null };

export default async function MemberProfilePage({ params }: { params: { id: string } }) {
  const me = await requireRole(["assistant", "admin"]);
  const supabase = createClient();

  // RLS: an assistant who isn't assigned to this member gets no row back at all.
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();
  if (!profileRow) notFound();
  const member = profileRow as Profile;

  const [
    { data: statusRow },
    { data: progress },
    { data: submissions },
    { data: reflections },
    { data: questions },
    { data: comments },
    curriculum,
    assistants,
  ] = await Promise.all([
    supabase.from("member_status").select("*").eq("member_id", params.id).maybeSingle(),
    supabase.from("lesson_progress").select("*, lessons(title, module_id)").eq("member_id", params.id),
    supabase
      .from("submissions")
      .select("*, assignments(title)")
      .eq("member_id", params.id)
      .order("submitted_at", { ascending: false }),
    supabase
      .from("weekly_reflections")
      .select("*")
      .eq("member_id", params.id)
      .order("week_start", { ascending: false }),
    supabase
      .from("call_questions")
      .select("*, calls(title)")
      .eq("member_id", params.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("lesson_comments")
      .select("*, lessons(title)")
      .eq("author_id", params.id)
      .order("created_at", { ascending: false }),
    getCurriculum(),
    getAssistants(),
  ]);

  const status = (statusRow ?? null) as MemberStatusRow | null;
  const doneIds = new Set(((progress ?? []) as { lesson_id: string }[]).map((p) => p.lesson_id));

  const events: Event[] = [
    ...((submissions ?? []) as any[]).map((s) => ({
      at: s.submitted_at,
      kind: copy.memberProfile.kindSubmission,
      title: s.assignments?.title ?? "",
      body: s.body,
      extra: s.status === "reviewed" ? s.feedback : null,
    })),
    ...((comments ?? []) as any[]).map((c) => ({
      at: c.created_at,
      kind: copy.memberProfile.kindComment,
      title: c.lessons?.title ?? "",
      body: c.body,
    })),
    ...((reflections ?? []) as any[]).map((r) => ({
      at: r.created_at,
      kind: copy.memberProfile.kindReflection,
      title: copy.progress.weekOf(formatDate(r.week_start)),
      body: [r.win, r.blocker, r.next_step].filter(Boolean).join(" · "),
    })),
    ...((questions ?? []) as any[]).map((q) => ({
      at: q.created_at,
      kind: copy.memberProfile.kindQuestion,
      title: q.calls?.title ?? "",
      body: q.body,
      extra: q.answer,
    })),
    ...((progress ?? []) as any[]).map((p) => ({
      at: p.completed_at,
      kind: copy.memberProfile.kindLesson,
      title: p.lessons?.title ?? "",
    })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  const rail = (
    <div className="card">
      {status ? <StatusPill status={status.status} /> : null}
      <dl className="mt-5 space-y-3 text-small">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{copy.cohort.colModule}</dt>
          <dd>{status?.current_module ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{copy.cohort.colLessons}</dt>
          <dd>{status?.lessons_done_pct ?? 0}%</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{copy.cohort.colDays}</dt>
          <dd>{relativeDays(status?.days_since_activity ?? null)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{copy.cohort.colOverdue}</dt>
          <dd>{status?.overdue_assignments ?? 0}</dd>
        </div>
      </dl>
    </div>
  );

  return (
    <StaffShell profile={me} rail={rail}>
      <Link href="/cohort" className="btn-quiet mb-6 -ml-2 text-tiny">
        ← {copy.memberProfile.back}
      </Link>

      <header className="mb-8 flex items-center gap-4">
        <Avatar name={member.full_name} size={52} />
        <div>
          <h1 className="font-serif text-h1">{member.full_name}</h1>
          <p className="mt-1 text-small text-muted">
            {copy.memberProfile.joined(formatDate(member.joined_at))}
            {member.assistant_id
              ? ` · ${copy.memberProfile.assistant(assistants.get(member.assistant_id) ?? "—")}`
              : ""}
          </p>
        </div>
      </header>

      <section className="mt-10">
        <SectionTitle>{copy.memberProfile.modulesTitle}</SectionTitle>
        <ul className="divide-y divide-line border-y border-line">
          {curriculum.map((m) => {
            const done = m.lessons.filter((l) => doneIds.has(l.id)).length;
            return (
              <li key={m.id} className="flex items-baseline justify-between gap-4 py-3.5">
                <p className="text-small">
                  <span className="text-muted">{copy.common.module(m.sort_order)} · </span>
                  {m.title}
                </p>
                <p className="shrink-0 text-small text-muted">
                  {copy.common.lessonsOf(done, m.lessons.length)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12">
        <SectionTitle>{copy.memberProfile.timeline}</SectionTitle>
        {events.length === 0 ? (
          <Empty>{copy.memberProfile.timelineEmpty}</Empty>
        ) : (
          <ul className="space-y-6 border-l border-line pl-5">
            {events.map((e, i) => (
              <li key={`${e.at}-${i}`}>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="eyebrow">{e.kind}</span>
                  <span className="text-tiny text-muted">{formatDate(e.at)}</span>
                </p>
                <p className="mt-1 text-body">{e.title}</p>
                {e.body ? <p className="mt-1 whitespace-pre-line text-small text-muted">{e.body}</p> : null}
                {e.extra ? (
                  <p className="mt-2 border-l-2 pl-3 text-small text-muted" style={{ borderColor: "var(--accent-text)" }}>
                    {e.extra}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </StaffShell>
  );
}
