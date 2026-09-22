"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { copy } from "@/lib/copy";
import type { WeeklyReflection } from "@/lib/types";
import { saveReflection, type ActionState } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? copy.common.loading : copy.reflection.submit}
    </button>
  );
}

export function ReflectionCard({ existing }: { existing: WeeklyReflection | null }) {
  const [state, formAction] = useFormState<ActionState, FormData>(saveReflection, {});
  const [editing, setEditing] = useState(false);

  const saved = (existing && !editing) || state.ok;

  if (saved) {
    return (
      <div className="card">
        <h2 className="font-display text-h3">{copy.reflection.title}</h2>
        <p className="mt-2 text-small text-muted">{copy.reflection.done}</p>
        {existing ? (
          <button
            type="button"
            className="btn-quiet mt-3 text-tiny"
            onClick={() => {
              setEditing(true);
            }}
          >
            {copy.reflection.edit}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="font-display text-h3">{copy.reflection.title}</h2>
      <p className="mt-1 text-small text-muted">{copy.reflection.lead}</p>
      <form action={formAction} className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="win">
            {copy.reflection.win}
          </label>
          <textarea id="win" name="win" rows={2} className="field" defaultValue={existing?.win ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="blocker">
            {copy.reflection.blocker}
          </label>
          <textarea id="blocker" name="blocker" rows={2} className="field" defaultValue={existing?.blocker ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="next_step">
            {copy.reflection.nextStep}
          </label>
          <textarea id="next_step" name="next_step" rows={2} className="field" defaultValue={existing?.next_step ?? ""} />
        </div>
        {state.error ? (
          <p role="alert" className="text-small" style={{ color: "var(--danger)" }}>
            {state.error}
          </p>
        ) : null}
        <Submit />
      </form>
    </div>
  );
}
