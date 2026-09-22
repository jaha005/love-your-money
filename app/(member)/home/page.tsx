import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import {
  getAssignmentsForMember,
  getCalls,
  getCommunityFeed,
  getCurrentModule,
  getCurriculum,
  getMyCompletedLessonIds,
  getNextLesson,
  getReflection,
  getUnreadNotices,
} from "@/lib/data";
import { dueLabel, formatDate, formatDateTime } from "@/lib/dates";
import { Avatar, Empty, Meter, SectionTitle } from "@/components/ui";
import { MemberShell } from "../member-shell";
import { ReflectionCard } from "./reflection-card";

export default async function HomePage() {
  const me = await requireRole(["member"]);

  const [current, next, assignments, calls, reflection, notices, curriculum, done, feed] =
    await Promise.all([
      getCurrentModule(me.id),
      getNextLesson(me.id),
      getAssignmentsForMember(me.id),
      getCalls(),
      getReflection(me.id),
      getUnreadNotices(me.id),
      getCurriculum(),
      getMyCompletedLessonIds(me.id),
      getCommunityFeed(4),
    ]);

  const unlocked = curriculum.filter((m) => m.unlocked);
  const lessonsTotal = unlocked.flatMap((m) => m.lessons).length;
  const lessonsDone = unlocked.flatMap((m) => m.lessons).filter((l) => done.has(l.id)).length;

  const openAssignment = assignments.find((a) => a.module_unlocked && !a.submission) ?? null;
  const firstName = me.full_name.split(" ")[0];

  return (
    <MemberShell profile={me} rail={<ReflectionCard existing={reflection} />}>
      <header>
        <h1 className="font-display text-h1">{copy.home.greeting(firstName)}</h1>
        {current ? (
          <p className="mt-3 text-body text-muted">
            {copy.common.module(current.module.sort_order)} · {current.module.title} ·{" "}
            {copy.common.lessonsOf(current.doneInModule, current.total)}
          </p>
        ) : null}
      </header>

      {notices.length ? (
        <div className="mt-8 rounded border border-accent bg-tint px-5 py-4">
          <p className="eyebrow">{copy.home.notices}</p>
          {notices.map((n) => (
            <p key={n.id} className="mt-2 text-small">
              {n.body}
            </p>
          ))}
        </div>
      ) : null}

      {/* Main card: next lesson */}
      <section className="mt-8 rounded border border-line px-6 py-7">
        <p className="eyebrow">{copy.home.nextLesson}</p>
        {next ? (
          <>
            <h2 className="mt-3 font-display text-h2">{next.lesson.title}</h2>
            <p className="mt-2 text-small text-muted">
              {copy.common.module(next.module.sort_order)} · {next.module.title} ·{" "}
              {copy.program.duration(next.lesson.duration_min)}
            </p>
            <Link
              href={`/program/${next.module.sort_order}/${next.lesson.sort_order}`}
              className="btn-primary mt-6"
            >
              {copy.home.continueLesson}
            </Link>
          </>
        ) : (
          <p className="mt-3 text-body text-muted">{copy.home.allDone}</p>
        )}
      </section>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section className="card">
          <p className="eyebrow">{copy.home.openAssignment}</p>
          {openAssignment ? (
            <>
              <h3 className="mt-3 font-display text-h3">{openAssignment.title}</h3>
              <p className="mt-2 text-small text-muted">
                {copy.common.module(openAssignment.module_order)} · {dueLabel(openAssignment.due_at)}
              </p>
              <Link href={`/assignments/${openAssignment.id}`} className="btn-secondary mt-5">
                {copy.assignments.submit}
              </Link>
            </>
          ) : (
            <div className="mt-3">
              <Empty>{copy.home.noOpenAssignment}</Empty>
            </div>
          )}
        </section>

        <section className="card">
          <p className="eyebrow">{copy.home.nextCall}</p>
          {calls.next ? (
            <>
              <h3 className="mt-3 font-display text-h3">{calls.next.title}</h3>
              <p className="mt-2 text-small text-muted">{formatDateTime(calls.next.scheduled_at)}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {calls.next.zoom_url ? (
                  <a
                    href={calls.next.zoom_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-secondary"
                  >
                    {copy.home.joinZoom}
                  </a>
                ) : null}
                <Link href="/calls#question" className="btn-secondary">
                  {copy.home.askQuestion}
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-3">
              <Empty>{copy.home.noNextCall}</Empty>
            </div>
          )}
        </section>
      </div>

      {/* Where you are: eight modules as a strip, each with its completed-lesson count. */}
      <section className="mt-10">
        <SectionTitle>{copy.home.journey}</SectionTitle>
        <div className="card">
          <div className="flex items-end justify-between gap-4">
            <p className="font-display text-h2">
              {lessonsTotal ? Math.round((lessonsDone / lessonsTotal) * 100) : 0}%
            </p>
            <p className="text-small text-muted">
              {copy.common.lessonsOf(lessonsDone, lessonsTotal)}
            </p>
          </div>
          <div className="mt-3">
            <Meter value={lessonsTotal ? (lessonsDone / lessonsTotal) * 100 : 0} />
          </div>

          <ol className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {curriculum.map((m) => {
              const d = m.lessons.filter((l) => done.has(l.id)).length;
              const full = d === m.lessons.length && m.lessons.length > 0;
              return (
                <li key={m.id}>
                  <div
                    className="h-1.5 w-full rounded-full"
                    style={{
                      background: !m.unlocked
                        ? "var(--line)"
                        : full
                          ? "var(--accent)"
                          : d > 0
                            ? "var(--tint)"
                            : "var(--line)",
                      border: d > 0 && !full ? "1px solid var(--accent)" : undefined,
                      opacity: m.unlocked ? 1 : 0.55,
                    }}
                  />
                  <p className="mt-2 text-tiny text-muted">{m.sort_order}</p>
                  <p className="mt-0.5 line-clamp-2 text-tiny leading-snug">
                    {m.unlocked ? m.title : copy.program.lockedShort}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Latest from the community: proof the programme is alive, without leaving the page. */}
      <section className="mt-10">
        <SectionTitle
          aside={
            <Link href="/community" className="text-small text-accent-text underline underline-offset-2">
              {copy.home.latestAll}
            </Link>
          }
        >
          {copy.home.latest}
        </SectionTitle>

        {feed.length === 0 ? (
          <Empty>{copy.community.empty}</Empty>
        ) : (
          <ul className="card divide-y divide-line p-0">
            {feed.map((c) => (
              <li key={c.id} className="flex gap-3 px-5 py-4">
                <Avatar name={c.author?.full_name ?? "?"} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-small">
                    <span className="font-medium">{c.author?.full_name ?? "—"}</span>
                    {c.author?.role === "admin" ? (
                      <span
                        className="rounded-full border px-2 py-0.5 text-tiny"
                        style={{
                          borderColor: "var(--accent-text)",
                          color: "var(--accent-text)",
                          background: "var(--tint)",
                        }}
                      >
                        {copy.program.coachLabel}
                      </span>
                    ) : null}
                    <span className="text-tiny text-muted">{formatDate(c.created_at)}</span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-small text-muted">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </MemberShell>
  );
}
