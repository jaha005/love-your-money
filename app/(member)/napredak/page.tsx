import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import {
  getAssignmentsForMember,
  getCurriculum,
  getMyCompletedLessonIds,
  getMyReflections,
} from "@/lib/data";
import { formatDate } from "@/lib/dates";
import { Empty, Meter, PageHeader, SectionTitle } from "@/components/ui";
import { MemberShell } from "../member-shell";

export default async function ProgressPage() {
  const me = await requireRole(["member"]);
  const [curriculum, done, assignments, reflections] = await Promise.all([
    getCurriculum(),
    getMyCompletedLessonIds(me.id),
    getAssignmentsForMember(me.id),
    getMyReflections(me.id),
  ]);

  const modules = curriculum.map((m) => {
    const doneCount = m.lessons.filter((l) => done.has(l.id)).length;
    const state: "done" | "current" | "locked" | "open" = !m.unlocked
      ? "locked"
      : doneCount === m.lessons.length && m.lessons.length > 0
        ? "done"
        : doneCount > 0
          ? "current"
          : "open";
    return { ...m, doneCount, state };
  });

  const totalUnlocked = modules.filter((m) => m.unlocked).flatMap((m) => m.lessons).length;
  const totalDone = modules.filter((m) => m.unlocked).reduce((n, m) => n + m.doneCount, 0);
  const pct = totalUnlocked ? Math.round((totalDone / totalUnlocked) * 100) : 0;
  const submitted = assignments.filter((a) => a.submission).length;

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.progress.title}</p>
      <p className="mt-3 font-serif text-h2">{copy.progress.lessonsPct(pct)}</p>
      <p className="mt-1 text-small text-muted">{copy.progress.submissionsCount(submitted)}</p>
      <div className="mt-4">
        <Meter value={pct} />
      </div>
    </div>
  );

  return (
    <MemberShell profile={me} rail={rail}>
      <PageHeader title={copy.progress.title} lead={copy.progress.lead} />

      {/* 8 modula kao horizontalna linija */}
      <section>
        <SectionTitle>{copy.progress.modules}</SectionTitle>
        <ol className="flex gap-1.5">
          {modules.map((m) => (
            <li key={m.id} className="flex-1" title={`${copy.common.module(m.sort_order)} · ${m.title}`}>
              <div
                className="h-1.5 w-full rounded-full"
                style={{
                  backgroundColor:
                    m.state === "done"
                      ? "var(--accent)"
                      : m.state === "current"
                        ? "var(--tint)"
                        : "var(--line)",
                  border: m.state === "current" ? "1px solid var(--accent)" : undefined,
                  opacity: m.state === "locked" ? 0.5 : 1,
                }}
              />
              <p className="mt-2 text-tiny text-muted">{m.sort_order}</p>
            </li>
          ))}
        </ol>

        <ul className="mt-6 divide-y divide-line border-y border-line">
          {modules.map((m) => (
            <li key={m.id} className="flex items-baseline justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-small">
                  <span className="text-muted">{copy.common.module(m.sort_order)} · </span>
                  {m.title}
                </p>
              </div>
              <p className="shrink-0 text-small text-muted">
                {m.unlocked
                  ? copy.common.lessonsOf(m.doneCount, m.lessons.length)
                  : copy.program.lockedShort}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <SectionTitle>{copy.progress.diary}</SectionTitle>
        <p className="-mt-2 mb-5 text-small text-muted">{copy.progress.diaryLead}</p>

        {reflections.length === 0 ? (
          <Empty>{copy.progress.diaryEmpty}</Empty>
        ) : (
          <ul className="space-y-8">
            {reflections.map((r) => (
              <li key={r.id} className="border-l border-line pl-5">
                <p className="eyebrow">{copy.progress.weekOf(formatDate(r.week_start))}</p>
                <dl className="mt-3 space-y-3 text-body">
                  <div>
                    <dt className="text-small text-muted">{copy.reflection.win}</dt>
                    <dd className="mt-0.5">{r.win || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-muted">{copy.reflection.blocker}</dt>
                    <dd className="mt-0.5">{r.blocker || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-small text-muted">{copy.reflection.nextStep}</dt>
                    <dd className="mt-0.5">{r.next_step || "—"}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>
    </MemberShell>
  );
}
