import { redirect } from "next/navigation";
import { getCurrentProfile, homeFor } from "@/lib/auth";

export default async function Index() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  redirect(homeFor(profile.role));
}
