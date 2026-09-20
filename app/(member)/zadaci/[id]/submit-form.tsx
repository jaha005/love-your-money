"use client";

import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/copy";
import { submitAssignment, type ActionState } from "@/app/(member)/actions";

const MAX_BYTES = 5 * 1024 * 1024;

export function SubmitForm({
  assignmentId,
  memberId,
  defaultBody,
  existingFile,
  submitLabel,
}: {
  assignmentId: string;
  memberId: string;
  defaultBody: string;
  existingFile: string | null;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(submitAssignment, {});
  const [uploading, setUploading] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(existingFile);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setFileError(null);
    if (file.size > MAX_BYTES) {
      setFileError(copy.assignments.file);
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "dat";
    const path = `${memberId}/${assignmentId}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("submissions").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      setFileError(copy.common.error);
      return;
    }
    setFilePath(path);
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="assignment_id" value={assignmentId} />
      <input type="hidden" name="file_path" value={filePath ?? ""} />

      <div>
        <label className="label" htmlFor="body">
          {copy.assignments.yourAnswer}
        </label>
        <textarea
          id="body"
          name="body"
          rows={8}
          required
          defaultValue={defaultBody}
          className="field"
          placeholder={copy.assignments.bodyPlaceholder}
        />
      </div>

      <div>
        <label className="label" htmlFor="file">
          {copy.assignments.file} <span className="font-normal text-muted">({copy.common.optional})</span>
        </label>
        <input
          id="file"
          ref={fileRef}
          type="file"
          accept="application/pdf,image/*"
          className="field"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
        {uploading ? <p className="mt-1 text-tiny text-muted">{copy.common.loading}</p> : null}
        {filePath && !uploading ? (
          <p className="mt-1 text-tiny text-accent">{copy.assignments.attachment}: {filePath.split("/").pop()}</p>
        ) : null}
        {fileError ? (
          <p className="mt-1 text-tiny" style={{ color: "var(--danger)" }}>
            {fileError}
          </p>
        ) : null}
      </div>

      {state.error ? (
        <p className="text-small" style={{ color: "var(--danger)" }}>
          {state.error}
        </p>
      ) : null}
      {state.ok ? <p className="text-small text-accent">{copy.assignments.waiting}</p> : null}

      <button type="submit" className="btn-primary" disabled={uploading}>
        {submitLabel}
      </button>
    </form>
  );
}
