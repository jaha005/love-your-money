"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { copy } from "@/lib/copy";

/** A plain textarea with a preview - no WYSIWYG editor. */
export function MarkdownField({
  name,
  label,
  defaultValue = "",
  rows = 12,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label className="label mb-0" htmlFor={name}>
          {label}
        </label>
        <div className="flex gap-1">
          {[
            { key: false, label: copy.editor.write },
            { key: true, label: copy.editor.preview },
          ].map((t) => (
            <button
              key={String(t.key)}
              type="button"
              onClick={() => setPreview(t.key)}
              aria-pressed={preview === t.key}
              className={`rounded border px-2 py-0.5 text-tiny transition-colors ${
                preview === t.key ? "border-accent-text text-accent-text" : "border-line text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {preview ? (
        <div className="prose-article min-h-[120px] rounded border border-line px-3 py-2.5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          id={name}
          name={name}
          rows={rows}
          className="field font-mono text-small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      {preview ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}
