import type { ReactNode } from "react";
import { Shell } from "@/components/shell";
import { brand } from "@/lib/brand";
import { copy } from "@/lib/copy";
import type { Profile } from "@/lib/types";

export function StaffShell({
  profile,
  rail,
  children,
}: {
  profile: Profile;
  rail?: ReactNode;
  children: ReactNode;
}) {
  const items = [
    { href: "/cohort", label: copy.nav.staff.cohort, icon: "cohort" },
    { href: "/review", label: copy.nav.staff.review, icon: "review" },
    { href: "/questions", label: copy.nav.staff.questions, icon: "questions" },
    // Only Andreja sees the programme and call editors.
    ...(profile.role === "admin"
      ? [
          { href: "/editor/program", label: copy.nav.staff.program, icon: "program" },
          { href: "/editor/calls", label: copy.nav.staff.calls, icon: "calls" },
        ]
      : []),
  ];

  return (
    <Shell
      items={items}
      userName={profile.full_name}
      userRole={profile.role === "admin" ? brand.coachTitle : copy.roles.assistant}
      rail={rail}
    >
      {children}
    </Shell>
  );
}
