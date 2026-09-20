import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getAssignmentsForMember, getPublicProfiles } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { dueLabel, formatDate } from "@/lib/dates";
import { Markdown } from "@/components/markdown";
import { MemberShell } from "../../member-shell";
import { SubmitForm } from "./submit-form";

export default async function AssignmentPage({ params }: { params: { id: string } }) {
  const me = await requireRole(["member"]);
  const rows = await getAssignmentsForMember(me.id);
  const a = rows.find((r) => r.id === params.id);
  if (!a) notFound();

  const submission = a.submission;
  const reviewed = submission?.status === "reviewed";

  let fileUrl: string | null = null;
  if (submission?.file_path) {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("submissions")
      .createSignedUrl(submission.file_path, 3600);
    fileUrl = data?.signedUrl ?? null;
  }

  const reviewer = submission?.reviewed_by
    ? (await getPublicProfiles([submission.reviewed_by])).get(submission.reviewed_by)
    : null;

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.common.module(a.module_order)}</p>
      <p className="mt-2 font-serif text-[17px] leading-snug">{a.module_title}</p>
      <div className="hairline my-4" />
      <p className="text-small text-muted">{dueLabel(a.due_at)}</p>
      {submission ? (
        <p className="mt-2 text-small text-muted">
          {copy.assignments.submitted(formatDate(submission.submitted_at))}
        </p>
      ) : null}
    </div>
  );

  return (
    <MemberShell profile={me} rail={rail}>
      <Link href="/zadaci" className="btn-quiet mb-6 -ml-2 text-tiny">
        ← {copy.assignments.title}
      </Link>

      <h1 className="font-serif text-h1">{a.title}</h1>

      <div className="mt-6">
        <Markdown>{a.instructions}</Markdown>
      </div>

      <div className="hairline my-9" />

      {reviewed && submission ? (
        <section className="space-y-6">
          <div>
            <p className="eyebrow">{copy.assignments.yourAnswer}</p>
            <p className="mt-2 whitespace-pre-line text-body">{submission.body}</p>
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-secondary mt-4"
              >
                {copy.assignments.attachment}
              </a>
            ) : null}
          </div>

          <div className="rounded border border-accent bg-tint px-5 py-4">
            <p className="eyebrow">{copy.assignments.feedbackTitle}</p>
            <p className="mt-2 whitespace-pre-line text-body">{submission.feedback}</p>
            <p className="mt-3 text-tiny text-muted">
              {copy.assignments.feedbackFrom(
                reviewer?.full_name ?? "—",
                formatDate(submission.reviewed_at ?? submission.submitted_at),
              )}
            </p>
          </div>
        </section>
      ) : (
        <>
          {submission ? (
            <p className="mb-6 text-small text-accent-text">{copy.assignments.waiting}</p>
          ) : null}
          <SubmitForm
            assignmentId={a.id}
            memberId={me.id}
            defaultBody={submission?.body ?? ""}
            existingFile={submission?.file_path ?? null}
            submitLabel={submission ? copy.assignments.resubmit : copy.assignments.submit}
          />
        </>
      )}
    </MemberShell>
  );
}
