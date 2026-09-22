import type { ReactNode } from "react";
import { copy } from "@/lib/copy";
import { hueForName, hueSurface, hueText, statusColors } from "@/lib/colors";
import type { MemberStatus } from "@/lib/types";

const STATUS_HUE = { active: "sage", slowing: "gold", stalled: "danger" } as const;

export function StatusPill({ status }: { status: MemberStatus }) {
  const { bg, fg, border } = statusColors(STATUS_HUE[status]);
  return (
    <span className="pill" style={{ background: bg, color: fg, borderColor: border }}>
      <span
        aria-hidden
        className="block h-1.5 w-1.5 rounded-full"
        style={{ background: fg }}
      />
      {copy.status[status]}
    </span>
  );
}

/** Progres kao traka, s postotkom u broju pored. */
export function Meter({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div
        className="meter"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <span style={{ width: `${pct}%` }} />
      </div>
      {label ? <p className="mt-2 text-tiny text-muted">{label}</p> : null}
    </div>
  );
}

/** Initials on a warm background; the same name always gets the same colour. */
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const hue = hueForName(name);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-sans font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        background: hueSurface(hue),
        color: hueText(hue),
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/** Empty states get a sentence, not an illustration. */
export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded border border-dashed border-line bg-surface/60 px-5 py-6 text-small text-muted">
      {children}
    </p>
  );
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-h2">{children}</h2>
      {aside}
    </div>
  );
}

export function PageHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="mb-7">
      <h1 className="font-display text-h1">{title}</h1>
      {lead ? <p className="mt-2 text-body text-muted">{lead}</p> : null}
    </header>
  );
}

export function Stat({
  value,
  label,
  tone,
}: {
  value: number | string;
  label: string;
  tone?: "danger";
}) {
  const danger = tone === "danger";
  return (
    <div
      className="rounded border bg-surface px-4 py-4 shadow-card"
      style={
        danger
          ? { borderColor: "var(--danger)", background: "var(--danger-tint)" }
          : { borderColor: "var(--line)" }
      }
    >
      <p
        className="font-display text-[34px] leading-none"
        style={danger ? { color: "var(--danger)" } : undefined}
      >
        {value}
      </p>
      <p className="mt-2 text-small text-muted">{label}</p>
    </div>
  );
}
