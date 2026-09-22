import { existsSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getCurriculum, getLessonComments, getMyCompletedLessonIds } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { embedUrl } from "@/lib/video";
import { Markdown } from "@/components/markdown";
import { Discussion } from "@/components/discussion";
import { Empty } from "@/components/ui";
import { ModuleIntroClip } from "@/components/module-intro-clip";
import { DoneButton } from "./done-button";

export default async function LessonPage({
  params,
}: {
  params: { module: string; lesson: string };
}) {
  const me = await requireRole(["member"]);
  const curriculum = await getCurriculum();

  const mod = curriculum.find((m) => String(m.sort_order) === params.module);
  const lesson = mod?.lessons.find((l) => String(l.sort_order) === params.lesson);
  if (!mod || !lesson) notFound();

  if (!mod.unlocked) {
    return (
      <div>
        <p className="eyebrow">{copy.common.module(mod.sort_order)}</p>
        <h1 className="mt-3 font-display text-h1">{lesson.title}</h1>
        <div className="hairline my-8" />
        <Empty>{copy.program.lockedBody}</Empty>
      </div>
    );
  }

  const [done, comments] = await Promise.all([
    getMyCompletedLessonIds(me.id),
    getLessonComments(lesson.id),
  ]);

  // Radni listovi su u privatnom bucketu: potpisani link vrijedi sat vremena.
  let worksheetUrl: string | null = null;
  if (lesson.worksheet_path) {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("worksheets")
      .createSignedUrl(lesson.worksheet_path, 3600);
    worksheetUrl = data?.signedUrl ?? null;
  }

  const video = embedUrl(lesson.video_url);

  // The first lesson of a module opens with its title card, if the clip has been
  // rendered (video/ -> npm run intros). Without the file it is simply skipped.
  const showIntro =
    lesson.sort_order === 1 &&
    existsSync(join(process.cwd(), "public", "intro", `module-${mod.sort_order}.jpg`));

  return (
    <article>
      <p className="eyebrow">
        {copy.common.module(mod.sort_order)} · {mod.title}
      </p>
      <h1 className="mt-3 font-display text-h1">{lesson.title}</h1>
      <p className="mt-2 text-small text-muted">
        {copy.common.lesson(lesson.sort_order)} · {copy.program.duration(lesson.duration_min)}
      </p>

      {video ? (
        <div className="mt-7 overflow-hidden rounded border border-line">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={video}
              title={lesson.title}
              allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      ) : showIntro ? (
        // The first lesson of a module shows its title card instead of an empty frame.
        <div className="mt-7">
          <ModuleIntroClip moduleOrder={mod.sort_order} title={mod.title} />
        </div>
      ) : (
        // The demo ships no third-party recordings: a quiet placeholder until Andreja adds her link.
        <div className="mt-7 rounded border border-dashed border-line">
          <div
            className="flex w-full flex-col items-center justify-center gap-1 px-6 text-center"
            style={{ aspectRatio: "16 / 9" }}
          >
            <p className="text-small text-muted">{copy.program.videoPlaceholder}</p>
            <p className="text-tiny text-muted">{copy.program.videoPlaceholderHint}</p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Markdown>{lesson.body}</Markdown>
      </div>

      {worksheetUrl ? (
        <div className="mt-8">
          <a href={worksheetUrl} target="_blank" rel="noreferrer noopener" className="btn-secondary">
            {copy.program.worksheet}
          </a>
        </div>
      ) : null}

      <div className="hairline my-9" />
      <DoneButton lessonId={lesson.id} done={done.has(lesson.id)} />

      <div className="hairline my-9" />
      <Discussion
        lessonId={lesson.id}
        comments={comments.map((c) => ({
          id: c.id,
          body: c.body,
          created_at: c.created_at,
          parent_id: c.parent_id,
          author: c.author
            ? { id: c.author.id, full_name: c.author.full_name, role: c.author.role }
            : null,
        }))}
      />
    </article>
  );
}
