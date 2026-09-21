"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { copy } from "@/lib/copy";

export type ActionState = { error?: string; ok?: boolean; message?: string };

const REMINDER = copy.cohort.reminderBody;

/** In-app nudge (v1: no email). Returns how many members it was sent to. */
export async function sendReminder(memberIds: string[]): Promise<ActionState> {
  const me = await requireRole(["assistant", "admin"]);
  if (!memberIds.length) return { error: copy.cohort.remindEmpty };

  const supabase = createClient();
  const { error, count } = await supabase
    .from("notices")
    .insert(
      memberIds.map((id) => ({ member_id: id, body: REMINDER, created_by: me.id })),
      { count: "exact" },
    );
  if (error) return { error: copy.common.error };

  revalidatePath("/cohort");
  return { ok: true, message: copy.cohort.remindDone(count ?? memberIds.length) };
}

export async function reviewSubmission(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole(["assistant", "admin"]);
  const supabase = createClient();

  const feedback = String(formData.get("feedback") ?? "").trim();
  if (!feedback) return { error: copy.common.error };

  const { error } = await supabase
    .from("submissions")
    .update({
      feedback,
      status: "reviewed",
      reviewed_by: me.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", String(formData.get("submission_id")));
  if (error) return { error: copy.common.error };

  revalidatePath("/review");
  revalidatePath("/cohort");
  return { ok: true };
}

export async function answerQuestion(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["assistant", "admin"]);
  const supabase = createClient();

  const answer = String(formData.get("answer") ?? "").trim();
  const { error } = await supabase
    .from("call_questions")
    .update({ answer: answer || null, answered: formData.get("answered") === "on" })
    .eq("id", String(formData.get("question_id")));
  if (error) return { error: copy.common.error };

  revalidatePath("/questions");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Editor (admin only)
// ---------------------------------------------------------------------------

export async function saveModule(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = createClient();

  const { error } = await supabase
    .from("modules")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      unlock_at: String(formData.get("unlock_at") ?? ""),
      summary: String(formData.get("summary") ?? "") || null,
    })
    .eq("id", String(formData.get("module_id")));
  if (error) return { error: copy.common.error };

  revalidatePath("/editor/program", "layout");
  revalidatePath("/program", "layout");
  return { ok: true, message: copy.editor.saved };
}

export async function saveLesson(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = createClient();

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    video_url: String(formData.get("video_url") ?? "").trim() || null,
    body: String(formData.get("body") ?? ""),
    duration_min: Math.max(1, Number(formData.get("duration_min") ?? 10)),
    worksheet_path: String(formData.get("worksheet_path") ?? "").trim() || null,
  };

  const lessonId = String(formData.get("lesson_id") ?? "");
  const moduleId = String(formData.get("module_id") ?? "");

  if (lessonId) {
    const { error } = await supabase.from("lessons").update(payload).eq("id", lessonId);
    if (error) return { error: copy.common.error };
  } else {
    const { data: siblings } = await supabase
      .from("lessons")
      .select("sort_order")
      .eq("module_id", moduleId)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = (siblings?.[0]?.sort_order ?? 0) + 1;
    const { error } = await supabase
      .from("lessons")
      .insert({ ...payload, module_id: moduleId, sort_order: nextOrder });
    if (error) return { error: copy.common.error };
  }

  revalidatePath("/editor/program", "layout");
  revalidatePath("/program", "layout");
  return { ok: true, message: copy.editor.saved };
}

export async function saveAssignment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = createClient();

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    instructions: String(formData.get("instructions") ?? ""),
    due_at: String(formData.get("due_at") ?? ""),
  };
  const assignmentId = String(formData.get("assignment_id") ?? "");

  const { error } = assignmentId
    ? await supabase.from("assignments").update(payload).eq("id", assignmentId)
    : await supabase
        .from("assignments")
        .insert({ ...payload, module_id: String(formData.get("module_id") ?? "") });
  if (error) return { error: copy.common.error };

  revalidatePath("/editor/program", "layout");
  revalidatePath("/assignments", "layout");
  return { ok: true, message: copy.editor.saved };
}

export async function saveCall(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(["admin"]);
  const supabase = createClient();

  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    scheduled_at: new Date(String(formData.get("scheduled_at") ?? "")).toISOString(),
    zoom_url: String(formData.get("zoom_url") ?? "").trim() || null,
    recording_url: String(formData.get("recording_url") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "") || null,
  };
  const callId = String(formData.get("call_id") ?? "");

  const { error } = callId
    ? await supabase.from("calls").update(payload).eq("id", callId)
    : await supabase.from("calls").insert(payload);
  if (error) return { error: copy.common.error };

  revalidatePath("/editor/calls");
  revalidatePath("/calls");
  revalidatePath("/questions");
  return { ok: true, message: copy.editor.saved };
}
