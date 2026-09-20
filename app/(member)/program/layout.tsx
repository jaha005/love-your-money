import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getCurriculum, getMyCompletedLessonIds } from "@/lib/data";
import { Meter } from "@/components/ui";
import { MemberShell } from "../member-shell";
import { Tree, type TreeModule } from "./tree";

export default async function ProgramLayout({ children }: { children: React.ReactNode }) {
  const me = await requireRole(["member"]);
  const [curriculum, done] = await Promise.all([getCurriculum(), getMyCompletedLessonIds(me.id)]);

  const modules: TreeModule[] = curriculum.map((m) => ({
    id: m.id,
    sort_order: m.sort_order,
    title: m.title,
    unlock_at: m.unlock_at,
    unlocked: m.unlocked,
    lessons: m.lessons.map((l) => ({
      id: l.id,
      sort_order: l.sort_order,
      title: l.title,
      done: done.has(l.id),
    })),
  }));

  const unlockedLessons = modules.filter((m) => m.unlocked).flatMap((m) => m.lessons);
  const doneCount = unlockedLessons.filter((l) => l.done).length;
  const pct = unlockedLessons.length ? (doneCount / unlockedLessons.length) * 100 : 0;

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.progress.modules}</p>
      <p className="mt-3 font-serif text-h2">{Math.round(pct)}%</p>
      <p className="mb-4 mt-1 text-small text-muted">
        {copy.common.lessonsOf(doneCount, unlockedLessons.length)}
      </p>
      <Meter value={pct} />
    </div>
  );

  return (
    <MemberShell profile={me} rail={rail}>
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <div className="shrink-0 md:w-[240px]">
          <Tree modules={modules} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </MemberShell>
  );
}
