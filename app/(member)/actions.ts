"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";
import { weekStartISO } from "@/lib/dates";

export type ActionState = { error?: string; ok?: boolean };

export async function saveReflection(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole(["member"]);
  const supabase = createClient();

  const { error } = await supabase.from("weekly_reflections").upsert(
    {
      member_id: me.id,
      week_start: weekStartISO(),
      win: String(formData.get("win") ?? "").trim(),
      blocker: String(formData.get("blocker") ?? "").trim(),
      next_step: String(formData.get("next_step") ?? "").trim(),
    },
    { onConflict: "member_id,week_start" },
  );
  if (error) return { error: copy.common.error };

  revalidatePath("/home");
  revalidatePath("/progress");
  return { ok: true };
}

export async function toggleLessonDone(lessonId: string, done: boolean) {
  const me = await requireRole(["member"]);
  const supabase = createClient();

  if (done) {
    await supabase
      .from("lesson_progress")
      .upsert({ member_id: me.id, lesson_id: lessonId }, { onConflict: "member_id,lesson_id" });
  } else {
    await supabase.from("lesson_progress").delete().eq("member_id", me.id).eq("lesson_id", lessonId);
  }

  revalidatePath("/program", "layout");
  revalidatePath("/home");
  revalidatePath("/progress");
}

export async function addComment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole(["member", "assistant", "admin"]);
  const supabase = createClient();

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: copy.common.error };

  const { error } = await supabase.from("lesson_comments").insert({
    lesson_id: String(formData.get("lesson_id")),
    author_id: me.id,
    body,
    parent_id: (formData.get("parent_id") as string) || null,
  });
  if (error) return { error: copy.common.error };

  revalidatePath("/program", "layout");
  revalidatePath("/community");
  return { ok: true };
}

export async function submitAssignment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole(["member"]);
  const supabase = createClient();

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: copy.common.error };

  const { error } = await supabase.from("submissions").upsert(
    {
      assignment_id: String(formData.get("assignment_id")),
      member_id: me.id,
      body,
      file_path: (formData.get("file_path") as string) || null,
      submitted_at: new Date().toISOString(),
      status: "pending",
    },
    { onConflict: "assignment_id,member_id" },
  );
  if (error) return { error: copy.common.error };

  revalidatePath("/assignments", "layout");
  revalidatePath("/home");
  return { ok: true };
}

export async function askQuestion(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole(["member"]);
  const supabase = createClient();

  const body = String(formData.get("body") ?? "").trim();
  const callId = String(formData.get("call_id") ?? "");
  if (!body || !callId) return { error: copy.common.error };

  const { error } = await supabase
    .from("call_questions")
    .insert({ call_id: callId, member_id: me.id, body });
  if (error) return { error: copy.common.error };

  revalidatePath("/calls");
  revalidatePath("/home");
  return { ok: true };
}

export async function markNoticeRead(noticeId: string) {
  await requireRole(["member"]);
  const supabase = createClient();
  await supabase.from("notices").update({ read_at: new Date().toISOString() }).eq("id", noticeId);
  revalidatePath("/home");
}
