import type { ReactNode } from "react";
import { copy } from "@/lib/copy";
import type { MemberStatus } from "@/lib/types";

export function StatusPill({ status }: { status: MemberStatus }) {
  const tone =
    status === "active"
      ? "border-line text-muted"
      : status === "slowing"
        ? "border-accent text-accent"
        : "border-[var(--danger)] text-[var(--danger)]";
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-tiny ${tone}`}>
      {copy.status[status]}
    </span>
  );
}

/** Progres kao tanka linija. */
export function Meter({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="meter" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <span style={{ width: `${pct}%` }} />
      </div>
      {label ? <p className="mt-2 text-tiny text-muted">{label}</p> : null}
    </div>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-line font-serif text-muted"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/** Prazna stanja imaju rečenicu, ne ilustraciju. */
export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-small text-muted">{children}</p>;
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="font-serif text-h3">{children}</h2>
      {aside}
    </div>
  );
}

export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-serif text-h1">{title}</h1>
      {lead ? <p className="mt-2 text-body text-muted">{lead}</p> : null}
    </header>
  );
}

export function Stat({ value, label, tone }: { value: number | string; label: string; tone?: "danger" }) {
  return (
    <div className="rounded border border-line px-5 py-4">
      <p
        className="font-serif text-h2"
        style={tone === "danger" ? { color: "var(--danger)" } : undefined}
      >
        {value}
      </p>
      <p className="mt-1 text-small text-muted">{label}</p>
    </div>
  );
}
