"use client";

import { useFormState } from "react-dom";
import { copy } from "@/lib/copy";
import { MarkdownField } from "@/components/markdown-field";
import { SaveButton } from "@/components/save-button";
import { saveCall, type ActionState } from "@/app/(staff)/actions";

export function CallForm({
  call,
}: {
  call: {
    id: string;
    title: string;
    scheduled_at: string;
    zoom_url: string | null;
    recording_url: string | null;
    notes: string | null;
  } | null;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(saveCall, {});
  const key = call?.id ?? "new";

  // datetime-local traži "YYYY-MM-DDTHH:mm" u lokalnom vremenu.
  const localValue = call
    ? new Date(new Date(call.scheduled_at).getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";

  return (
    <form action={formAction} className="space-y-4">
      {call ? <input type="hidden" name="call_id" value={call.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`ctitle-${key}`}>
            {copy.editor.callTitle}
          </label>
          <input
            id={`ctitle-${key}`}
            name="title"
            required
            defaultValue={call?.title ?? ""}
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor={`cdate-${key}`}>
            {copy.editor.callDate}
          </label>
          <input
            id={`cdate-${key}`}
            name="scheduled_at"
            type="datetime-local"
            required
            defaultValue={localValue}
            className="field"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`czoom-${key}`}>
            {copy.editor.callZoom}
          </label>
          <input
            id={`czoom-${key}`}
            name="zoom_url"
            type="url"
            defaultValue={call?.zoom_url ?? ""}
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor={`crec-${key}`}>
            {copy.editor.callRecording}
          </label>
          <input
            id={`crec-${key}`}
            name="recording_url"
            type="url"
            defaultValue={call?.recording_url ?? ""}
            className="field"
          />
        </div>
      </div>

      <MarkdownField
        name="notes"
        label={copy.editor.callNotes}
        defaultValue={call?.notes ?? ""}
        rows={6}
      />

      <div className="flex items-center gap-3">
        <SaveButton />
        {state.ok ? <span className="text-small text-accent-text">{state.message}</span> : null}
        {state.error ? (
          <span role="alert" className="text-small" style={{ color: "var(--danger)" }}>
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
