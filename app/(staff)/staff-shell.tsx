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
    { href: "/kohorta", label: copy.nav.staff.cohort, icon: "cohort" },
    { href: "/pregled", label: copy.nav.staff.review, icon: "review" },
    { href: "/pitanja", label: copy.nav.staff.questions, icon: "questions" },
    // Uređivanje programa i poziva vidi samo Andreja.
    ...(profile.role === "admin"
      ? [
          { href: "/urednik/program", label: copy.nav.staff.program, icon: "program" },
          { href: "/urednik/pozivi", label: copy.nav.staff.calls, icon: "calls" },
        ]
      : []),
  ];

  return (
    <Shell
      items={items}
      userName={profile.full_name}
      userRole={profile.role === "admin" ? brand.coachTitle : "Asistentica"}
      rail={rail}
    >
      {children}
    </Shell>
  );
}
