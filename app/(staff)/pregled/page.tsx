import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getSubmissionsForReview } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/dates";
import { Avatar, Empty, PageHeader } from "@/components/ui";
import { StaffShell } from "../staff-shell";
import { ReviewForm } from "./review-form";

export default async function ReviewPage() {
  const me = await requireRole(["assistant", "admin"]);
  const [pending, recent] = await Promise.all([
    getSubmissionsForReview("pending"),
    getSubmissionsForReview("reviewed"),
  ]);

  // Potpisani linkovi za priložene fajlove (privatni bucket).
  const supabase = createClient();
  const links = new Map<string, string>();
  await Promise.all(
    pending
      .filter((s) => s.file_path)
      .map(async (s) => {
        const { data } = await supabase.storage
          .from("submissions")
          .createSignedUrl(s.file_path!, 3600);
        if (data?.signedUrl) links.set(s.id, data.signedUrl);
      }),
  );

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.review.reviewed}</p>
      <p className="mt-3 font-serif text-h2">{recent.length}</p>
      <p className="mt-1 text-small text-muted">ukupno pregledanih</p>
    </div>
  );

  return (
    <StaffShell profile={me} rail={rail}>
      <PageHeader title={copy.review.title} lead={copy.review.lead} />

      {pending.length === 0 ? (
        <Empty>{copy.review.empty}</Empty>
      ) : (
        <ul className="space-y-px bg-line">
          {pending.map((s) => (
            <li key={s.id} className="bg-bg py-7">
              <div className="flex items-center gap-3">
                <Avatar name={s.member_name} size={34} />
                <div>
                  <p className="text-small font-medium">{s.member_name}</p>
                  <p className="text-tiny text-muted">
                    {copy.common.module(s.module_order)} · {s.assignment_title} ·{" "}
                    {formatDate(s.submitted_at)}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-l border-line pl-5">
                <p className="eyebrow">{copy.review.answer}</p>
                <p className="mt-2 whitespace-pre-line text-body">{s.body}</p>
                {links.get(s.id) ? (
                  <a
                    href={links.get(s.id)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-secondary mt-4"
                  >
                    {copy.review.openFile}
                  </a>
                ) : null}
              </div>

              <div className="mt-6">
                <ReviewForm submissionId={s.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </StaffShell>
  );
}
