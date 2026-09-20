"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { copy } from "@/lib/copy";
import { DEMO_MODE, demoAccounts, demoPassword, type DemoRole } from "@/lib/demo";

export type LoginState = { error?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: copy.auth.invalid };

  redirect("/");
}

export async function demoSignIn(role: DemoRole): Promise<LoginState> {
  if (!DEMO_MODE) return { error: copy.auth.invalid };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: demoAccounts[role].email,
    password: demoPassword(),
  });
  if (error) return { error: copy.auth.invalid };

  redirect("/");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
