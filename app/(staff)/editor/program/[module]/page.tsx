import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getCurriculum } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, SectionTitle } from "@/components/ui";
import type { Assignment } from "@/lib/types";
import { StaffShell } from "../../../staff-shell";
import { AssignmentForm, LessonForm, ModuleForm } from "./editor-forms";

export default async function ModuleEditor({ params }: { params: { module: string } }) {
  const me = await requireRole(["admin"]);
  const curriculum = await getCurriculum();
  const mod = curriculum.find((m) => String(m.sort_order) === params.module);
  if (!mod) notFound();

  const supabase = createClient();
  const { data: assignments } = await supabase
    .from("assignments")
    .select("*")
    .eq("module_id", mod.id)
    .order("due_at");
  const assignment = ((assignments ?? []) as Assignment[])[0] ?? null;

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.editor.adminOnly}</p>
      <ul className="mt-4 space-y-2 text-small">
        {curriculum.map((m) => (
          <li key={m.id}>
            <Link
              href={`/editor/program/${m.sort_order}`}
              className={m.id === mod.id ? "text-accent-text-text" : "text-muted hover:text-text"}
            >
              {m.sort_order}. {m.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <StaffShell profile={me} rail={rail}>
      <Link href="/editor/program" className="btn-quiet mb-6 -ml-2 text-tiny">
        ← {copy.editor.programTitle}
      </Link>

      <PageHeader title={`${copy.common.module(mod.sort_order)} · ${mod.title}`} />

      <section>
        <ModuleForm
          moduleId={mod.id}
          title={mod.title}
          subtitle={mod.subtitle}
          unlockAt={mod.unlock_at}
          summary={mod.summary}
        />
      </section>

      <div className="hairline my-12" />

      <section>
        <SectionTitle>{copy.nav.member.program}</SectionTitle>
        <div className="space-y-12">
          {mod.lessons.map((l) => (
            <div key={l.id}>
              <p className="eyebrow mb-4">{copy.common.lesson(l.sort_order)}</p>
              <LessonForm moduleId={mod.id} lesson={l} />
            </div>
          ))}

          <div>
            <p className="eyebrow mb-4">{copy.editor.newLesson}</p>
            <LessonForm moduleId={mod.id} lesson={null} />
          </div>
        </div>
      </section>

      <div className="hairline my-12" />

      <section>
        <SectionTitle>
          {assignment ? copy.assignments.title : copy.editor.newAssignment}
        </SectionTitle>
        <AssignmentForm moduleId={mod.id} assignment={assignment} />
      </section>
    </StaffShell>
  );
}
