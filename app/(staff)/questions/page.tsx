import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getCalls, getQuestionsForCall } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/dates";
import { Empty, PageHeader } from "@/components/ui";
import { StaffShell } from "../staff-shell";
import { AnswerForm } from "./answer-form";

export default async function QuestionsPage() {
  const me = await requireRole(["assistant", "admin"]);
  const { next } = await getCalls();

  if (!next) {
    return (
      <StaffShell profile={me}>
        <PageHeader title={copy.questions.title} lead={copy.questions.lead} />
        <Empty>{copy.questions.noCall}</Empty>
      </StaffShell>
    );
  }

  const questions = await getQuestionsForCall(next.id);

  // Grouped by the module the member is currently in.
  const groups = new Map<string, typeof questions>();
  for (const q of questions) {
    const key = q.module ? `${q.module}` : "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(q);
  }
  const sortedKeys = Array.from(groups.keys()).sort((a, b) => Number(a || 99) - Number(b || 99));

  const answered = questions.filter((q) => q.answered).length;

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.calls.next}</p>
      <p className="mt-2 font-serif text-[17px] leading-snug">{next.title}</p>
      <p className="mt-1 text-small text-muted">{formatDateTime(next.scheduled_at)}</p>
      <div className="hairline my-4" />
      <p className="text-small text-muted">
        {answered} / {questions.length} {copy.questions.markAnswered.toLowerCase()}
      </p>
    </div>
  );

  return (
    <StaffShell profile={me} rail={rail}>
      <PageHeader title={copy.questions.title} lead={copy.questions.lead} />

      {questions.length === 0 ? (
        <Empty>{copy.questions.empty}</Empty>
      ) : (
        <div className="space-y-10">
          {sortedKeys.map((key) => (
            <section key={key || "none"}>
              <h2 className="eyebrow mb-4">
                {key ? copy.common.module(Number(key)) : copy.questions.ungrouped}
                {groups.get(key)![0]?.module_title ? ` · ${groups.get(key)![0].module_title}` : ""}
              </h2>
              <ul className="divide-y divide-line border-y border-line">
                {groups.get(key)!.map((q) => (
                  <li key={q.id} className="py-6">
                    <p className="flex flex-wrap items-center gap-2 text-small">
                      <span className="font-medium">{q.member_name}</span>
                      <span className="text-tiny text-muted">{formatDate(q.created_at)}</span>
                      {q.answered ? (
                        <span
                          className="rounded border px-1.5 py-0.5 text-tiny"
                          style={{ borderColor: "var(--accent-text)", color: "var(--accent-text)" }}
                        >
                          {copy.calls.answered}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-2 whitespace-pre-line text-body">{q.body}</p>
                    <AnswerForm questionId={q.id} answer={q.answer} answered={q.answered} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </StaffShell>
  );
}
