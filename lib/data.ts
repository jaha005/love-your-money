import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { todayISO, weekStartISO } from "@/lib/dates";
import type {
  Assignment,
  Call,
  CallQuestion,
  Lesson,
  LessonComment,
  MemberStatusRow,
  Module,
  Notice,
  Submission,
  WeeklyReflection,
} from "@/lib/types";

export type PublicProfile = { id: string; full_name: string; avatar_url: string | null; role: string };

export type ModuleWithLessons = Module & { lessons: Lesson[]; unlocked: boolean };

/** Module → lesson tree, with whether each module is unlocked. */
export const getCurriculum = cache(async (): Promise<ModuleWithLessons[]> => {
  const supabase = createClient();
  const [{ data: modules }, { data: lessons }] = await Promise.all([
    supabase.from("modules").select("*").order("sort_order"),
    supabase.from("lessons").select("*").order("sort_order"),
  ]);

  const today = todayISO();
  return ((modules ?? []) as Module[]).map((m) => ({
    ...m,
    unlocked: m.unlock_at <= today,
    lessons: ((lessons ?? []) as Lesson[]).filter((l) => l.module_id === m.id),
  }));
});

export const getMyCompletedLessonIds = cache(async (memberId: string): Promise<Set<string>> => {
  const supabase = createClient();
  const { data } = await supabase.from("lesson_progress").select("lesson_id").eq("member_id", memberId);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
});

/** The first unfinished lesson in an unlocked module. */
export async function getNextLesson(memberId: string) {
  const [curriculum, done] = await Promise.all([getCurriculum(), getMyCompletedLessonIds(memberId)]);
  for (const m of curriculum) {
    if (!m.unlocked) continue;
    for (const l of m.lessons) {
      if (!done.has(l.id)) return { module: m, lesson: l };
    }
  }
  return null;
}

/** The member's current module: the last one with at least one completed lesson (or the first unlocked). */
export async function getCurrentModule(memberId: string) {
  const [curriculum, done] = await Promise.all([getCurriculum(), getMyCompletedLessonIds(memberId)]);
  let current: ModuleWithLessons | null = null;
  for (const m of curriculum) {
    if (m.lessons.some((l) => done.has(l.id))) current = m;
  }
  if (!current) current = curriculum.find((m) => m.unlocked) ?? curriculum[0] ?? null;
  if (!current) return null;

  const doneInModule = current.lessons.filter((l) => done.has(l.id)).length;
  return { module: current, doneInModule, total: current.lessons.length };
}

export type AssignmentRow = Assignment & {
  module_order: number;
  module_title: string;
  module_unlocked: boolean;
  submission: Submission | null;
};

export async function getAssignmentsForMember(memberId: string): Promise<AssignmentRow[]> {
  const supabase = createClient();
  const [curriculum, { data: assignments }, { data: submissions }] = await Promise.all([
    getCurriculum(),
    supabase.from("assignments").select("*").order("due_at"),
    supabase.from("submissions").select("*").eq("member_id", memberId),
  ]);

  const byModule = new Map(curriculum.map((m) => [m.id, m]));
  return ((assignments ?? []) as Assignment[])
    .map((a) => {
      const m = byModule.get(a.module_id);
      return {
        ...a,
        module_order: m?.sort_order ?? 0,
        module_title: m?.title ?? "",
        module_unlocked: m?.unlocked ?? false,
        submission: ((submissions ?? []) as Submission[]).find((s) => s.assignment_id === a.id) ?? null,
      };
    })
    .sort((a, b) => a.module_order - b.module_order);
}

export async function getCalls(): Promise<{ next: Call | null; past: Call[] }> {
  const supabase = createClient();
  const { data } = await supabase.from("calls").select("*").order("scheduled_at", { ascending: false });
  const all = (data ?? []) as Call[];
  const now = Date.now();
  const upcoming = all.filter((c) => new Date(c.scheduled_at).getTime() >= now);
  return {
    next: upcoming.length ? upcoming[upcoming.length - 1] : null,
    past: all.filter((c) => new Date(c.scheduled_at).getTime() < now),
  };
}

export async function getMyQuestions(memberId: string): Promise<(CallQuestion & { call_title: string })[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("call_questions")
    .select("*, calls(title)")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });
  return ((data ?? []) as (CallQuestion & { calls: { title: string } | null })[]).map((q) => ({
    ...q,
    call_title: q.calls?.title ?? "",
  }));
}

export async function getReflection(memberId: string, weekStart = weekStartISO()) {
  const supabase = createClient();
  const { data } = await supabase
    .from("weekly_reflections")
    .select("*")
    .eq("member_id", memberId)
    .eq("week_start", weekStart)
    .maybeSingle();
  return (data as WeeklyReflection) ?? null;
}

export async function getMyReflections(memberId: string): Promise<WeeklyReflection[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("weekly_reflections")
    .select("*")
    .eq("member_id", memberId)
    .order("week_start", { ascending: false });
  return (data ?? []) as WeeklyReflection[];
}

export async function getUnreadNotices(memberId: string): Promise<Notice[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("notices")
    .select("*")
    .eq("member_id", memberId)
    .is("read_at", null)
    .order("created_at", { ascending: false });
  return (data ?? []) as Notice[];
}

/** Comment author names: the full profile is protected, only the name is needed here. */
export async function getPublicProfiles(ids: string[]): Promise<Map<string, PublicProfile>> {
  if (!ids.length) return new Map();
  const supabase = createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("id, full_name, avatar_url, role")
    .in("id", Array.from(new Set(ids)));
  return new Map(((data ?? []) as PublicProfile[]).map((p) => [p.id, p]));
}

export type CommentWithAuthor = LessonComment & { author: PublicProfile | null };

export async function getLessonComments(lessonId: string): Promise<CommentWithAuthor[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("lesson_comments")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("created_at");
  const comments = (data ?? []) as LessonComment[];
  const authors = await getPublicProfiles(comments.map((c) => c.author_id));
  return comments.map((c) => ({ ...c, author: authors.get(c.author_id) ?? null }));
}

export async function getCommunityFeed(limit = 30) {
  const supabase = createClient();
  const { data } = await supabase
    .from("lesson_comments")
    .select("*, lessons(id, title, module_id)")
    .order("created_at", { ascending: false })
    .limit(limit);

  const rows = (data ?? []) as (LessonComment & {
    lessons: { id: string; title: string; module_id: string } | null;
  })[];
  const [authors, curriculum] = await Promise.all([
    getPublicProfiles(rows.map((r) => r.author_id)),
    getCurriculum(),
  ]);
  const moduleOf = new Map(curriculum.map((m) => [m.id, m]));

  return rows.map((r) => ({
    ...r,
    author: authors.get(r.author_id) ?? null,
    lesson: r.lessons,
    module: r.lessons ? (moduleOf.get(r.lessons.module_id) ?? null) : null,
  }));
}

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export async function getCohort(): Promise<MemberStatusRow[]> {
  const supabase = createClient();
  const { data } = await supabase.from("member_status").select("*").order("full_name");
  return (data ?? []) as MemberStatusRow[];
}

export async function getAssistants(): Promise<Map<string, string>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("id, full_name, role")
    .in("role", ["assistant", "admin"]);
  return new Map(((data ?? []) as PublicProfile[]).map((p) => [p.id, p.full_name]));
}

export type PendingSubmission = Submission & {
  member_name: string;
  assignment_title: string;
  module_order: number;
  instructions: string;
};

export async function getSubmissionsForReview(status: "pending" | "reviewed" = "pending") {
  const supabase = createClient();
  const { data } = await supabase
    .from("submissions")
    .select("*, assignments(title, instructions, module_id)")
    .eq("status", status)
    .order("submitted_at", { ascending: status === "pending" });

  const rows = (data ?? []) as (Submission & {
    assignments: { title: string; instructions: string; module_id: string } | null;
  })[];
  const [members, curriculum] = await Promise.all([
    getPublicProfiles(rows.map((r) => r.member_id)),
    getCurriculum(),
  ]);
  const moduleOf = new Map(curriculum.map((m) => [m.id, m]));

  return rows.map((r) => ({
    ...r,
    member_name: members.get(r.member_id)?.full_name ?? "—",
    assignment_title: r.assignments?.title ?? "",
    instructions: r.assignments?.instructions ?? "",
    module_order: r.assignments ? (moduleOf.get(r.assignments.module_id)?.sort_order ?? 0) : 0,
  }));
}

export async function getQuestionsForCall(callId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("call_questions")
    .select("*")
    .eq("call_id", callId)
    .order("created_at");

  const rows = (data ?? []) as CallQuestion[];
  const [members, cohort] = await Promise.all([
    getPublicProfiles(rows.map((r) => r.member_id)),
    getCohort(),
  ]);
  const moduleOf = new Map(cohort.map((c) => [c.member_id, c]));

  return rows.map((r) => ({
    ...r,
    member_name: members.get(r.member_id)?.full_name ?? "—",
    module: moduleOf.get(r.member_id)?.current_module ?? null,
    module_title: moduleOf.get(r.member_id)?.current_module_title ?? null,
  }));
}
