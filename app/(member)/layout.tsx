import { requireRole } from "@/lib/auth";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["member"]);
  return <>{children}</>;
}
