import { brand } from "@/lib/brand";

const TZ = brand.timezone;
const LOCALE = brand.locale;

export function todayISO(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = Date.UTC(+fromISO.slice(0, 4), +fromISO.slice(5, 7) - 1, +fromISO.slice(8, 10));
  const b = Date.UTC(+toISO.slice(0, 4), +toISO.slice(5, 7) - 1, +toISO.slice(8, 10));
  return Math.round((b - a) / 86400000);
}

/** Monday of the week the given date falls in. */
export function weekStartISO(iso: string = todayISO()): string {
  const d = new Date(`${iso}T12:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7; // 0 = Monday
  return addDaysISO(iso, -dow);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** 14 October 2026 */
export function formatDate(value: string): string {
  const iso = value.slice(0, 10);
  const day = +iso.slice(8, 10);
  const month = +iso.slice(5, 7) - 1;
  return `${day} ${MONTHS[month]} ${iso.slice(0, 4)}`;
}

/** 14 October, 19:00 */
export function formatDateTime(value: string): string {
  const d = new Date(value);
  const time = d.toLocaleTimeString(LOCALE, {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  });
  const iso = d.toLocaleDateString("en-CA", { timeZone: TZ });
  const day = +iso.slice(8, 10);
  const month = +iso.slice(5, 7) - 1;
  return `${day} ${MONTHS[month]}, ${time}`;
}

/** "3 days ago", "today", "yesterday" */
export function relativeDays(days: number | null): string {
  if (days === null) return "no activity";
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function dueLabel(dueISO: string, today = todayISO()): string {
  const diff = daysBetween(today, dueISO.slice(0, 10));
  if (diff < 0) return `${Math.abs(diff)} ${Math.abs(diff) === 1 ? "day" : "days"} overdue`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due in ${diff} days`;
}
