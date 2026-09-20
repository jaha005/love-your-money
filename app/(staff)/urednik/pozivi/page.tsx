import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { getCalls } from "@/lib/data";
import { formatDateTime } from "@/lib/dates";
import { PageHeader, SectionTitle } from "@/components/ui";
import { StaffShell } from "../../staff-shell";
import { CallForm } from "./call-form";

export default async function CallsEditor() {
  const me = await requireRole(["admin"]);
  const { next, past } = await getCalls();

  const rail = (
    <div className="card">
      <p className="eyebrow">{copy.editor.adminOnly}</p>
      <p className="mt-3 text-small text-muted">
        {past.length} prošlih · {next ? "1 zakazan" : "nema zakazanih"}
      </p>
    </div>
  );

  return (
    <StaffShell profile={me} rail={rail}>
      <PageHeader title={copy.editor.callsTitle} lead={copy.editor.callsLead} />

      <section>
        <SectionTitle>{copy.editor.newCall}</SectionTitle>
        <CallForm call={null} />
      </section>

      {next ? (
        <>
          <div className="hairline my-12" />
          <section>
            <SectionTitle>{copy.calls.next}</SectionTitle>
            <CallForm call={next} />
          </section>
        </>
      ) : null}

      <div className="hairline my-12" />

      <section>
        <SectionTitle>{copy.calls.past}</SectionTitle>
        <div className="space-y-12">
          {past.map((c) => (
            <div key={c.id}>
              <p className="eyebrow mb-4">{formatDateTime(c.scheduled_at)}</p>
              <CallForm call={c} />
            </div>
          ))}
        </div>
      </section>
    </StaffShell>
  );
}
