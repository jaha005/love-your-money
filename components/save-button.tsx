"use client";

import { useFormStatus } from "react-dom";
import { copy } from "@/lib/copy";

export function SaveButton({ label = copy.editor.save }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? copy.common.loading : label}
    </button>
  );
}
