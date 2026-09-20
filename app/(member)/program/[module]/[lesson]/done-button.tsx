"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { copy } from "@/lib/copy";
import { toggleLessonDone } from "@/app/(member)/actions";

export function DoneButton({ lessonId, done }: { lessonId: string; done: boolean }) {
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 text-small text-accent">
          <Check size={16} strokeWidth={2} />
          {copy.program.markedDone}
        </span>
        <button
          type="button"
          className="btn-quiet text-tiny"
          disabled={pending}
          onClick={() => startTransition(() => void toggleLessonDone(lessonId, false))}
        >
          {copy.program.undo}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="btn-primary"
      disabled={pending}
      onClick={() => startTransition(() => void toggleLessonDone(lessonId, true))}
    >
      {pending ? copy.common.loading : copy.program.markDone}
    </button>
  );
}
