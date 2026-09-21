"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { brand } from "@/lib/brand";
import { copy } from "@/lib/copy";

export type NavItem = { href: string; label: string; icon: string };

// Ikone samo u sidebaru (lucide, stroke 1.5).
import {
  Home,
  BookOpen,
  ClipboardList,
  Video,
  MessagesSquare,
  LineChart,
  LayoutGrid,
  Inbox,
  HelpCircle,
} from "lucide-react";

const ICONS: Record<string, typeof Home> = {
  home: Home,
  program: BookOpen,
  assignments: ClipboardList,
  calls: Video,
  community: MessagesSquare,
  progress: LineChart,
  cohort: LayoutGrid,
  review: Inbox,
  questions: HelpCircle,
};

export function Sidebar({
  items,
  userName,
  userRole,
  signOut,
}: {
  items: NavItem[];
  userName: string;
  userRole: string;
  signOut: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? Home;
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[44px] items-center gap-3 rounded px-3 py-2 text-small transition-colors ${
              active ? "bg-tint font-medium text-text" : "text-muted hover:bg-bg hover:text-text"
            }`}
          >
            <Icon size={18} strokeWidth={1.5} className={active ? "text-accent-text-text" : ""} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-auto pt-6">
      <div className="hairline mb-4" />
      <p className="text-small">{userName}</p>
      <p className="text-tiny text-muted">{userRole}</p>
      <form action={signOut}>
        <button type="submit" className="btn-quiet mt-2 text-tiny">
          {copy.auth.signOut}
        </button>
      </form>
    </div>
  );

  const logo = (
    <Link href="/" className="block font-serif text-[22px] leading-tight">
      {brand.logoText}
    </Link>
  );

  return (
    <>
      {/* Desktop: fiksan sidebar 260px */}
      <aside className="fixed inset-y-0 left-0 hidden w-sidebar flex-col border-r border-line bg-surface px-5 py-6 lg:flex">
        {logo}
        <p className="mb-8 mt-1 text-tiny text-muted">{brand.cohortName}</p>
        {nav}
        {footer}
      </aside>

      {/* Mobitel: hamburger, nema donjeg nava */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
        {logo}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Izbornik"
          aria-expanded={open}
          className="btn-quiet"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 top-[57px] z-20 flex flex-col overflow-y-auto border-b border-line bg-surface px-5 py-6 lg:hidden">
          {nav}
          {footer}
        </div>
      ) : null}
    </>
  );
}
