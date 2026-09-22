import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getCurriculum } from "@/lib/data";
import { formatDate } from "@/lib/dates";
import { PageHeader } from "@/components/ui";
import { StaffShell } from "../../staff-shell";

export default async function ProgramEditorIndex() {
  const me = await requireRole(["admin"]);
  const curriculum = await getCurriculum();

  return (
    <StaffShell profile={me}>
      <PageHeader title={copy.editor.programTitle} lead={copy.editor.programLead} />

      <ul className="divide-y divide-line border-y border-line">
        {curriculum.map((m) => (
          <li key={m.id}>
            <Link
              href={`/editor/program/${m.sort_order}`}
              className="flex items-baseline justify-between gap-4 py-5 transition-colors hover:text-accent-text"
            >
              <div>
                <p className="eyebrow">{copy.common.module(m.sort_order)}</p>
                <p className="mt-1.5 font-display text-h3">{m.title}</p>
                <p className="mt-1 text-small text-muted">
                  {copy.editor.lessonCount(m.lessons.length)} · {copy.program.locked(formatDate(m.unlock_at))}
                </p>
              </div>
              <span className="shrink-0 text-small text-muted">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </StaffShell>
  );
}
