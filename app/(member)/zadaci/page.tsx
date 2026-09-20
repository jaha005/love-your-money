import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getAssignmentsForMember } from "@/lib/data";
import { dueLabel, formatDate, todayISO } from "@/lib/dates";
import { Empty, PageHeader } from "@/components/ui";
import { MemberShell } from "../member-shell";

export default async function AssignmentsPage() {
  const me = await requireRole(["member"]);
  const rows = await getAssignmentsForMember(me.id);
  const today = todayISO();

  const reviewed = rows.filter((r) => r.submission?.status === "reviewed").length;
  const pending = rows.filter((r) => r.submission?.status === "pending").length;

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.assignments.title}</p>
      <dl className="mt-4 space-y-3 text-small">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{copy.assignments.statusReviewed}</dt>
          <dd>{reviewed}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{copy.assignments.statusPending}</dt>
          <dd>{pending}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{copy.assignments.statusOpen}</dt>
          <dd>{rows.filter((r) => r.module_unlocked && !r.submission).length}</dd>
        </div>
      </dl>
    </div>
  );

  return (
    <MemberShell profile={me} rail={rail}>
      <PageHeader title={copy.assignments.title} lead={copy.assignments.lead} />

      {rows.length === 0 ? (
        <Empty>{copy.assignments.empty}</Empty>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {rows.map((a) => {
            const status = !a.module_unlocked
              ? copy.assignments.locked
              : a.submission?.status === "reviewed"
                ? copy.assignments.statusReviewed
                : a.submission
                  ? copy.assignments.statusPending
                  : a.due_at < today
                    ? copy.assignments.overdue
                    : copy.assignments.statusOpen;

            const overdue = a.module_unlocked && !a.submission && a.due_at < today;

            const inner = (
              <div className="flex items-baseline justify-between gap-4 py-5">
                <div className="min-w-0">
                  <p className="eyebrow">{copy.common.module(a.module_order)}</p>
                  <p className="mt-1.5 font-serif text-h3">{a.title}</p>
                  <p className="mt-1 text-small text-muted">
                    {a.module_unlocked ? dueLabel(a.due_at, today) : formatDate(a.due_at)}
                  </p>
                </div>
                <span
                  className="shrink-0 text-small"
                  style={overdue ? { color: "var(--danger)" } : { color: "var(--muted)" }}
                >
                  {status}
                </span>
              </div>
            );

            return (
              <li key={a.id}>
                {a.module_unlocked ? (
                  <Link href={`/zadaci/${a.id}`} className="block transition-colors hover:text-accent-text">
                    {inner}
                  </Link>
                ) : (
                  <div className="opacity-60">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </MemberShell>
  );
}
