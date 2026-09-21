"use client";

import { useFormState, useFormStatus } from "react-dom";
import { copy } from "@/lib/copy";
import { reviewSubmission, type ActionState } from "@/app/(staff)/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? copy.common.loading : copy.review.markReviewed}
    </button>
  );
}

export function ReviewForm({ submissionId }: { submissionId: string }) {
  const [state, formAction] = useFormState<ActionState, FormData>(reviewSubmission, {});

  if (state.ok) return <p className="text-small text-accent-text">{copy.review.reviewed}</p>;

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="submission_id" value={submissionId} />
      <label className="label sr-only" htmlFor={`feedback-${submissionId}`}>
        {copy.assignments.feedbackTitle}
      </label>
      <textarea
        id={`feedback-${submissionId}`}
        name="feedback"
        rows={4}
        required
        className="field"
        placeholder={copy.review.feedbackPlaceholder}
      />
      {state.error ? (
        <p role="alert" className="text-small" style={{ color: "var(--danger)" }}>
          {state.error}
        </p>
      ) : null}
      <Submit />
    </form>
  );
}
