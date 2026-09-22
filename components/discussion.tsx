"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { copy } from "@/lib/copy";
import { formatDate } from "@/lib/dates";
import { Avatar, Empty } from "@/components/ui";
import { addComment, type ActionState } from "@/app/(member)/actions";

export type DiscussionComment = {
  id: string;
  body: string;
  created_at: string;
  parent_id: string | null;
  author: { id: string; full_name: string; role: string } | null;
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? copy.common.loading : label}
    </button>
  );
}

function CommentForm({
  lessonId,
  parentId,
  autoFocus,
  onDone,
}: {
  lessonId: string;
  parentId?: string;
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const fieldId = `comment-${parentId ?? "root"}-${lessonId}`;
  const [state, formAction] = useFormState<ActionState, FormData>(async (prev, fd) => {
    const result = await addComment(prev, fd);
    if (result.ok) onDone?.();
    return result;
  }, {});

  return (
    <form action={formAction} className="space-y-3" key={state.ok ? "sent" : "draft"}>
      <input type="hidden" name="lesson_id" value={lessonId} />
      {parentId ? <input type="hidden" name="parent_id" value={parentId} /> : null}
      <label className="sr-only" htmlFor={fieldId}>
        {copy.program.commentPlaceholder}
      </label>
      <textarea
        id={fieldId}
        name="body"
        rows={3}
        required
        autoFocus={autoFocus}
        className="field"
        placeholder={copy.program.commentPlaceholder}
      />
      {state.error ? (
        <p role="alert" className="text-small" style={{ color: "var(--danger)" }}>
          {state.error}
        </p>
      ) : null}
      <Submit label={copy.program.send} />
    </form>
  );
}

function CommentBody({
  comment,
  children,
}: {
  comment: DiscussionComment;
  children?: React.ReactNode;
}) {
  const isCoach = comment.author?.role === "admin";
  return (
    <div className="flex gap-3">
      <Avatar name={comment.author?.full_name ?? "?"} size={32} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-small">
          <span className="font-medium">{comment.author?.full_name ?? "—"}</span>
          {isCoach ? (
            <span
              className="rounded border px-1.5 py-0.5 text-tiny"
              style={{ borderColor: "var(--accent-text)", color: "var(--accent-text)" }}
            >
              {copy.program.coachLabel}
            </span>
          ) : null}
          <span className="text-tiny text-muted">{formatDate(comment.created_at)}</span>
        </p>
        <p className="mt-1 whitespace-pre-line text-body">{comment.body}</p>
        {children}
      </div>
    </div>
  );
}

export function Discussion({
  lessonId,
  comments,
}: {
  lessonId: string;
  comments: DiscussionComment[];
}) {
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const roots = comments.filter((c) => !c.parent_id);
  const repliesOf = (id: string) => comments.filter((c) => c.parent_id === id);

  return (
    <section>
      <h2 className="mb-5 font-display text-h2">{copy.program.discussion}</h2>

      {roots.length === 0 ? (
        <Empty>{copy.program.discussionEmpty}</Empty>
      ) : (
        <ul className="space-y-7">
          {roots.map((c) => (
            <li key={c.id}>
              <CommentBody comment={c}>
                <button
                  type="button"
                  className="btn-quiet mt-1 text-tiny"
                  onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                >
                  {copy.program.reply}
                </button>

                {repliesOf(c.id).length ? (
                  <ul className="mt-4 space-y-5 border-l border-line pl-4">
                    {repliesOf(c.id).map((r) => (
                      <li key={r.id}>
                        <CommentBody comment={r} />
                      </li>
                    ))}
                  </ul>
                ) : null}

                {replyTo === c.id ? (
                  <div className="mt-4 border-l border-line pl-4">
                    <CommentForm
                      lessonId={lessonId}
                      parentId={c.id}
                      autoFocus
                      onDone={() => setReplyTo(null)}
                    />
                  </div>
                ) : null}
              </CommentBody>
            </li>
          ))}
        </ul>
      )}

      <div className="hairline my-8" />
      <CommentForm lessonId={lessonId} />
    </section>
  );
}
