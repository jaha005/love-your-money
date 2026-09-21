import type { ReactNode } from "react";
import { Shell } from "@/components/shell";
import { copy } from "@/lib/copy";
import type { Profile } from "@/lib/types";

const items = [
  { href: "/home", label: copy.nav.member.home, icon: "home" },
  { href: "/program", label: copy.nav.member.program, icon: "program" },
  { href: "/assignments", label: copy.nav.member.assignments, icon: "assignments" },
  { href: "/calls", label: copy.nav.member.calls, icon: "calls" },
  { href: "/community", label: copy.nav.member.community, icon: "community" },
  { href: "/progress", label: copy.nav.member.progress, icon: "progress" },
];

export function MemberShell({
  profile,
  rail,
  children,
}: {
  profile: Profile;
  rail?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Shell items={items} userName={profile.full_name} userRole={copy.roles.member} rail={rail}>
      {children}
    </Shell>
  );
}
