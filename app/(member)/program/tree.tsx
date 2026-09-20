"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatDate } from "@/lib/dates";

export type TreeModule = {
  id: string;
  sort_order: number;
  title: string;
  unlock_at: string;
  unlocked: boolean;
  lessons: { id: string; sort_order: number; title: string; done: boolean }[];
};

export function Tree({ modules }: { modules: TreeModule[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {modules.map((m) => {
        const done = m.lessons.filter((l) => l.done).length;
        return (
          <div key={m.id}>
            <div className="flex items-baseline gap-2">
              <span className="eyebrow">{copy.common.module(m.sort_order)}</span>
              {!m.unlocked ? <Lock size={12} strokeWidth={1.5} className="text-muted" /> : null}
            </div>
            <p className="mt-1 font-serif text-[17px] leading-snug">{m.title}</p>
            {m.unlocked ? (
              <p className="mt-0.5 text-tiny text-muted">
                {copy.common.lessonsOf(done, m.lessons.length)}
              </p>
            ) : (
              <p className="mt-0.5 text-tiny text-muted">{copy.program.locked(formatDate(m.unlock_at))}</p>
            )}

            <ul className="mt-2 space-y-0.5">
              {m.lessons.map((l) => {
                const href = `/program/${m.sort_order}/${l.sort_order}`;
                const active = pathname === href;
                if (!m.unlocked) {
                  return (
                    <li
                      key={l.id}
                      className="flex items-start gap-2 px-2 py-1.5 text-small text-muted/60"
                    >
                      <Lock size={14} strokeWidth={1.5} className="mt-1 shrink-0" />
                      <span className="line-clamp-2">{l.title}</span>
                    </li>
                  );
                }
                return (
                  <li key={l.id}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-start gap-2 rounded px-2 py-1.5 text-small transition-colors ${
                        active ? "bg-tint text-text" : "text-muted hover:text-text"
                      }`}
                    >
                      <span className="mt-1 w-3.5 shrink-0">
                        {l.done ? <Check size={14} strokeWidth={2} className="text-accent" /> : null}
                      </span>
                      <span>{l.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
