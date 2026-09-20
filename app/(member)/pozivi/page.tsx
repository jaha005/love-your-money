import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getCalls, getMyQuestions } from "@/lib/data";
import { formatDateTime } from "@/lib/dates";
import { Markdown } from "@/components/markdown";
import { Empty, PageHeader, SectionTitle } from "@/components/ui";
import { MemberShell } from "../member-shell";
import { AskForm } from "./ask-form";

export default async function CallsPage() {
  const me = await requireRole(["member"]);
  const [{ next, past }, questions] = await Promise.all([getCalls(), getMyQuestions(me.id)]);

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.calls.myQuestions}</p>
      {questions.length === 0 ? (
        <div className="mt-3">
          <Empty>{copy.calls.myQuestionsEmpty}</Empty>
        </div>
      ) : (
        <ul className="mt-4 space-y-5">
          {questions.map((q) => (
            <li key={q.id}>
              <p className="text-small">{q.body}</p>
              {q.answered && q.answer ? (
                <div className="mt-2 border-l-2 pl-3" style={{ borderColor: "var(--accent-text)" }}>
                  <p className="text-tiny uppercase tracking-[0.12em] text-accent-text">
                    {copy.program.coachLabel}
                  </p>
                  <p className="mt-1 text-small text-muted">{q.answer}</p>
                </div>
              ) : (
                <p className="mt-1 text-tiny text-muted">{copy.calls.waitingAnswer}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <MemberShell profile={me} rail={rail}>
      <PageHeader title={copy.calls.title} lead={copy.calls.lead} />

      <section className="rounded border border-line px-6 py-7">
        <p className="eyebrow">{copy.calls.next}</p>
        {next ? (
          <>
            <h2 className="mt-3 font-serif text-h2">{next.title}</h2>
            <p className="mt-2 text-small text-muted">{formatDateTime(next.scheduled_at)}</p>
            {next.zoom_url ? (
              <a
                href={next.zoom_url}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-primary mt-6"
              >
                {copy.home.joinZoom}
              </a>
            ) : (
              <p className="mt-4 text-small text-muted">{copy.calls.noZoom}</p>
            )}
            <div className="hairline my-7" />
            <AskForm callId={next.id} />
          </>
        ) : (
          <div className="mt-3">
            <Empty>{copy.home.noNextCall}</Empty>
          </div>
        )}
      </section>

      <div className="mt-12">
        <SectionTitle>{copy.calls.past}</SectionTitle>
        {past.length === 0 ? (
          <Empty>{copy.calls.pastEmpty}</Empty>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {past.map((c) => (
              <li key={c.id} className="py-6">
                <p className="font-serif text-h3">{c.title}</p>
                <p className="mt-1 text-small text-muted">{formatDateTime(c.scheduled_at)}</p>
                {c.recording_url ? (
                  <a
                    href={c.recording_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-secondary mt-4"
                  >
                    {copy.calls.recording}
                  </a>
                ) : null}
                {c.notes ? (
                  <div className="mt-5">
                    <p className="eyebrow">{copy.calls.notes}</p>
                    <div className="mt-2 text-muted">
                      <Markdown>{c.notes}</Markdown>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </MemberShell>
  );
}
