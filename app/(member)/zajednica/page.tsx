import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getCommunityFeed } from "@/lib/data";
import { formatDate } from "@/lib/dates";
import { Avatar, Empty, PageHeader } from "@/components/ui";
import { MemberShell } from "../member-shell";

export default async function CommunityPage() {
  const me = await requireRole(["member"]);
  const feed = await getCommunityFeed(30);

  return (
    <MemberShell profile={me}>
      <PageHeader title={copy.community.title} lead={copy.community.lead} />

      {feed.length === 0 ? (
        <Empty>{copy.community.empty}</Empty>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {feed.map((c) => (
            <li key={c.id} className="flex gap-4 py-6">
              <Avatar name={c.author?.full_name ?? "?"} size={36} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-small">
                  <span className="font-medium">{c.author?.full_name ?? "—"}</span>
                  {c.author?.role === "admin" ? (
                    <span
                      className="rounded border px-1.5 py-0.5 text-tiny"
                      style={{ borderColor: "var(--accent-text)", color: "var(--accent-text)" }}
                    >
                      {copy.program.coachLabel}
                    </span>
                  ) : null}
                  <span className="text-tiny text-muted">{formatDate(c.created_at)}</span>
                </p>
                <p className="mt-1.5 whitespace-pre-line text-body">{c.body}</p>
                {c.lesson && c.module ? (
                  <p className="mt-2 text-tiny text-muted">
                    {copy.community.inLesson}{" "}
                    <Link
                      href={`/program/${c.module.sort_order}/${
                        c.module.lessons.find((l) => l.id === c.lesson!.id)?.sort_order ?? 1
                      }`}
                      className="text-accent-text-text underline underline-offset-2"
                    >
                      {c.lesson.title}
                    </Link>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </MemberShell>
  );
}
