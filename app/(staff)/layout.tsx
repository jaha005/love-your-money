import { requireRole } from "@/lib/auth";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["assistant", "admin"]);
  return <>{children}</>;
}
