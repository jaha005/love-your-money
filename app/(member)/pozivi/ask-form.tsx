"use client";

import { useFormState, useFormStatus } from "react-dom";
import { copy } from "@/lib/copy";
import { askQuestion, type ActionState } from "@/app/(member)/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? copy.common.loading : copy.calls.ask}
    </button>
  );
}

export function AskForm({ callId }: { callId: string }) {
  const [state, formAction] = useFormState<ActionState, FormData>(askQuestion, {});

  return (
    <form action={formAction} className="mt-6 space-y-3" id="pitanje" key={state.ok ? "sent" : "draft"}>
      <label className="label" htmlFor="question-body">
        {copy.calls.askTitle}
      </label>
      <textarea
        id="question-body"
        name="body"
        rows={3}
        required
        className="field"
        placeholder={copy.calls.askPlaceholder}
      />
      <input type="hidden" name="call_id" value={callId} />
      {state.error ? (
        <p role="alert" className="text-small" style={{ color: "var(--danger)" }}>
          {state.error}
        </p>
      ) : null}
      <Submit />
    </form>
  );
}
