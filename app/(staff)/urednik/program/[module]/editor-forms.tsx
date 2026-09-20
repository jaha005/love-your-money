"use client";

import { useFormState } from "react-dom";
import { copy } from "@/lib/copy";
import { MarkdownField } from "@/components/markdown-field";
import { WorksheetUpload } from "@/components/worksheet-upload";
import { SaveButton } from "@/components/save-button";
import {
  saveAssignment,
  saveLesson,
  saveModule,
  type ActionState,
} from "@/app/(staff)/actions";

function Status({ state }: { state: ActionState }) {
  if (state.error)
    return (
      <span role="alert" className="text-small" style={{ color: "var(--danger)" }}>
        {state.error}
      </span>
    );
  if (state.ok) return <span className="text-small text-accent-text">{state.message}</span>;
  return null;
}

export function ModuleForm({
  moduleId,
  title,
  subtitle,
  unlockAt,
  summary,
}: {
  moduleId: string;
  title: string;
  subtitle: string | null;
  unlockAt: string;
  summary: string | null;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(saveModule, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="module_id" value={moduleId} />
      <div>
        <label className="label" htmlFor="title">
          {copy.editor.moduleTitle}
        </label>
        <input id="title" name="title" required defaultValue={title} className="field" />
      </div>
      <div>
        <label className="label" htmlFor="subtitle">
          {copy.editor.moduleSubtitle}
        </label>
        <input id="subtitle" name="subtitle" defaultValue={subtitle ?? ""} className="field" />
      </div>
      <div>
        <label className="label" htmlFor="unlock_at">
          {copy.editor.moduleUnlock}
        </label>
        <input
          id="unlock_at"
          name="unlock_at"
          type="date"
          required
          defaultValue={unlockAt}
          className="field"
        />
      </div>
      <MarkdownField name="summary" label={copy.editor.moduleSummary} defaultValue={summary ?? ""} rows={5} />
      <div className="flex items-center gap-3">
        <SaveButton />
        <Status state={state} />
      </div>
    </form>
  );
}

export function LessonForm({
  moduleId,
  lesson,
}: {
  moduleId: string;
  lesson: {
    id: string;
    title: string;
    video_url: string | null;
    body: string;
    duration_min: number;
    worksheet_path: string | null;
  } | null;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(saveLesson, {});
  const key = lesson?.id ?? "new";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="module_id" value={moduleId} />
      {lesson ? <input type="hidden" name="lesson_id" value={lesson.id} /> : null}

      <div>
        <label className="label" htmlFor={`title-${key}`}>
          {copy.editor.lessonTitle}
        </label>
        <input
          id={`title-${key}`}
          name="title"
          required
          defaultValue={lesson?.title ?? ""}
          className="field"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div>
          <label className="label" htmlFor={`video-${key}`}>
            {copy.editor.lessonVideo}
          </label>
          <input
            id={`video-${key}`}
            name="video_url"
            type="url"
            defaultValue={lesson?.video_url ?? ""}
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor={`duration-${key}`}>
            {copy.editor.lessonDuration}
          </label>
          <input
            id={`duration-${key}`}
            name="duration_min"
            type="number"
            min={1}
            defaultValue={lesson?.duration_min ?? 10}
            className="field"
          />
        </div>
      </div>

      <MarkdownField
        name={`body`}
        label={copy.editor.lessonBody}
        defaultValue={lesson?.body ?? ""}
      />

      <WorksheetUpload name="worksheet_path" defaultValue={lesson?.worksheet_path ?? null} />

      <div className="flex items-center gap-3">
        <SaveButton />
        <Status state={state} />
      </div>
    </form>
  );
}

export function AssignmentForm({
  moduleId,
  assignment,
}: {
  moduleId: string;
  assignment: { id: string; title: string; instructions: string; due_at: string } | null;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(saveAssignment, {});
  const key = assignment?.id ?? "new";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="module_id" value={moduleId} />
      {assignment ? <input type="hidden" name="assignment_id" value={assignment.id} /> : null}

      <div>
        <label className="label" htmlFor={`atitle-${key}`}>
          {copy.editor.assignmentTitle}
        </label>
        <input
          id={`atitle-${key}`}
          name="title"
          required
          defaultValue={assignment?.title ?? ""}
          className="field"
        />
      </div>
      <div>
        <label className="label" htmlFor={`due-${key}`}>
          {copy.editor.assignmentDue}
        </label>
        <input
          id={`due-${key}`}
          name="due_at"
          type="date"
          required
          defaultValue={assignment?.due_at ?? ""}
          className="field"
        />
      </div>
      <MarkdownField
        name="instructions"
        label={copy.editor.assignmentInstructions}
        defaultValue={assignment?.instructions ?? ""}
        rows={8}
      />
      <div className="flex items-center gap-3">
        <SaveButton />
        <Status state={state} />
      </div>
    </form>
  );
}
