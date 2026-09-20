import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { copy } from "@/lib/copy";
import { getAssistants, getCohort, getCurriculum, getSubmissionsForReview } from "@/lib/data";
import { Avatar, PageHeader, SectionTitle, Stat } from "@/components/ui";
import { StaffShell } from "../staff-shell";
import { CohortTable } from "./cohort-table";

export default async function CohortPage() {
  const me = await requireRole(["assistant", "admin"]);
  const [rows, assistants, curriculum, pending] = await Promise.all([
    getCohort(),
    getAssistants(),
    getCurriculum(),
    getSubmissionsForReview("pending"),
  ]);

  const activeThisWeek = rows.filter(
    (r) => r.days_since_activity !== null && r.days_since_activity <= 7,
  ).length;
  const stalled = rows.filter((r) => r.status === "stalled").length;

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.cohort.statStalled}</p>
      {stalled === 0 ? (
        <p className="mt-3 text-small text-muted">—</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows
            .filter((r) => r.status === "stalled")
            .map((r) => (
              <li key={r.member_id}>
                <Link href={`/kohorta/${r.member_id}`} className="text-small hover:text-accent">
                  {r.full_name}
                </Link>
                <p className="text-tiny text-muted">
                  {r.days_since_activity !== null ? `${r.days_since_activity} dana` : "nema aktivnosti"}
                  {r.overdue_assignments ? ` · ${r.overdue_assignments} kasni` : ""}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );

  return (
    <StaffShell profile={me} rail={rail}>
      <PageHeader title={copy.cohort.title} lead={copy.cohort.lead(brand.cohortName)} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat value={rows.length} label={copy.cohort.statMembers} />
        <Stat value={activeThisWeek} label={copy.cohort.statActive} />
        <Stat value={pending.length} label={copy.cohort.statToReview} />
        <Stat value={stalled} label={copy.cohort.statStalled} tone={stalled ? "danger" : undefined} />
      </div>

      {/* Raspored kohorte: kolona po modulu */}
      <section className="mt-12">
        <SectionTitle>{copy.cohort.layout}</SectionTitle>
        <p className="-mt-2 mb-5 text-small text-muted">{copy.cohort.layoutLead}</p>

        <div className="overflow-x-auto">
          <div className="flex min-w-[860px] gap-px bg-line">
            {curriculum.map((m) => {
              const here = rows.filter((r) => r.current_module === m.sort_order);
              return (
                <div key={m.id} className="min-w-0 flex-1 bg-bg px-3 py-4">
                  <p className="eyebrow">{m.sort_order}</p>
                  <p className="mb-4 mt-1 text-tiny leading-snug text-muted line-clamp-2">{m.title}</p>
                  {here.length === 0 ? (
                    <p className="text-tiny text-muted/60">—</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {here.map((r) => (
                        <li key={r.member_id}>
                          <Link
                            href={`/kohorta/${r.member_id}`}
                            className="flex items-center gap-2 transition-colors hover:text-accent"
                          >
                            <span className="relative">
                              <Avatar name={r.full_name} size={26} />
                              {r.status === "stalled" ? (
                                <span
                                  className="absolute -right-0.5 -top-0.5 block h-2 w-2 rounded-full"
                                  style={{ backgroundColor: "var(--danger)" }}
                                  aria-label={copy.status.stalled}
                                />
                              ) : null}
                            </span>
                            <span className="min-w-0 truncate text-tiny">
                              {r.full_name.split(" ")[0]}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle>{copy.cohort.table}</SectionTitle>
        <CohortTable
          rows={rows}
          assistants={Object.fromEntries(assistants)}
          currentUserId={me.id}
        />
      </section>
    </StaffShell>
  );
}
