"use client";

import { useFormState, useFormStatus } from "react-dom";
import { copy } from "@/lib/copy";
import { answerQuestion, type ActionState } from "@/app/(staff)/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-secondary" disabled={pending}>
      {pending ? copy.common.loading : copy.questions.save}
    </button>
  );
}

export function AnswerForm({
  questionId,
  answer,
  answered,
}: {
  questionId: string;
  answer: string | null;
  answered: boolean;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(answerQuestion, {});

  return (
    <form action={formAction} className="mt-3 space-y-3">
      <input type="hidden" name="question_id" value={questionId} />
      <label className="sr-only" htmlFor={`answer-${questionId}`}>
        {copy.questions.answerPlaceholder}
      </label>
      <textarea
        id={`answer-${questionId}`}
        name="answer"
        rows={3}
        className="field"
        defaultValue={answer ?? ""}
        placeholder={copy.questions.answerPlaceholder}
      />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-small text-muted">
          <input type="checkbox" name="answered" defaultChecked={answered} />
          {copy.questions.markAnswered}
        </label>
        <Submit />
        {state.ok ? <span className="text-small text-accent-text">{copy.editor.saved}</span> : null}
        {state.error ? (
          <span role="alert" className="text-small" style={{ color: "var(--danger)" }}>
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
