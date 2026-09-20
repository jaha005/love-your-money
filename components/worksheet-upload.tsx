"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { copy } from "@/lib/copy";

export function WorksheetUpload({ name, defaultValue }: { name: string; defaultValue: string | null }) {
  const [path, setPath] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-")}`;
    const { error: err } = await supabase.storage.from("worksheets").upload(key, file, { upsert: true });
    setBusy(false);
    if (err) {
      setError(copy.common.error);
      return;
    }
    setPath(key);
  }

  return (
    <div>
      <label className="label" htmlFor={`${name}-file`}>
        {copy.editor.lessonWorksheet}{" "}
        <span className="font-normal text-muted">({copy.common.optional})</span>
      </label>
      <input
        id={`${name}-file`}
        type="file"
        accept="application/pdf"
        className="field"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />
      <input type="hidden" name={name} value={path} />
      {busy ? <p className="mt-1 text-tiny text-muted">{copy.common.loading}</p> : null}
      {path && !busy ? <p className="mt-1 text-tiny text-accent-text">{path}</p> : null}
      {error ? (
        <p role="alert" className="mt-1 text-tiny" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
