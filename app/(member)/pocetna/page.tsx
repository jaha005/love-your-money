import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import {
  getAssignmentsForMember,
  getCalls,
  getCurrentModule,
  getNextLesson,
  getReflection,
  getUnreadNotices,
} from "@/lib/data";
import { dueLabel, formatDateTime } from "@/lib/dates";
import { Empty } from "@/components/ui";
import { MemberShell } from "../member-shell";
import { ReflectionCard } from "./reflection-card";

export default async function HomePage() {
  const me = await requireRole(["member"]);

  const [current, next, assignments, calls, reflection, notices] = await Promise.all([
    getCurrentModule(me.id),
    getNextLesson(me.id),
    getAssignmentsForMember(me.id),
    getCalls(),
    getReflection(me.id),
    getUnreadNotices(me.id),
  ]);

  const openAssignment = assignments.find((a) => a.module_unlocked && !a.submission) ?? null;
  const firstName = me.full_name.split(" ")[0];

  return (
    <MemberShell profile={me} rail={<ReflectionCard existing={reflection} />}>
      <header>
        <h1 className="font-serif text-h1">{copy.home.greeting(firstName)}</h1>
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

      {/* Glavna kartica: sljedeća lekcija */}
      <section className="mt-8 rounded border border-line px-6 py-7">
        <p className="eyebrow">{copy.home.nextLesson}</p>
        {next ? (
          <>
            <h2 className="mt-3 font-serif text-h2">{next.lesson.title}</h2>
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
              <h3 className="mt-3 font-serif text-h3">{openAssignment.title}</h3>
              <p className="mt-2 text-small text-muted">
                {copy.common.module(openAssignment.module_order)} · {dueLabel(openAssignment.due_at)}
              </p>
              <Link href={`/zadaci/${openAssignment.id}`} className="btn-secondary mt-5">
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
              <h3 className="mt-3 font-serif text-h3">{calls.next.title}</h3>
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
                <Link href="/pozivi#pitanje" className="btn-secondary">
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
    </MemberShell>
  );
}
