export type Role = "member" | "assistant" | "admin";
export type MemberStatus = "active" | "slowing" | "stalled";
export type SubmissionStatus = "pending" | "reviewed";

export type Profile = {
  id: string;
  role: Role;
  full_name: string;
  avatar_url: string | null;
  assistant_id: string | null;
  joined_at: string;
  cohort: string | null;
};

export type Module = {
  id: string;
  sort_order: number;
  title: string;
  subtitle: string | null;
  unlock_at: string;
  summary: string | null;
};

export type Lesson = {
  id: string;
  module_id: string;
  sort_order: number;
  title: string;
  video_url: string | null;
  body: string;
  worksheet_path: string | null;
  duration_min: number;
};

export type LessonProgress = {
  id: string;
  member_id: string;
  lesson_id: string;
  completed_at: string;
};

export type Assignment = {
  id: string;
  module_id: string;
  title: string;
  instructions: string;
  due_at: string;
};

export type Submission = {
  id: string;
  assignment_id: string;
  member_id: string;
  body: string;
  file_path: string | null;
  submitted_at: string;
  status: SubmissionStatus;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

export type LessonComment = {
  id: string;
  lesson_id: string;
  author_id: string;
  body: string;
  created_at: string;
  parent_id: string | null;
};

export type Call = {
  id: string;
  title: string;
  scheduled_at: string;
  zoom_url: string | null;
  recording_url: string | null;
  notes: string | null;
};

export type CallQuestion = {
  id: string;
  call_id: string;
  member_id: string;
  body: string;
  created_at: string;
  answered: boolean;
  answer: string | null;
};

export type WeeklyReflection = {
  id: string;
  member_id: string;
  week_start: string;
  win: string;
  blocker: string;
  next_step: string;
  created_at: string;
};

export type Notice = {
  id: string;
  member_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export type MemberStatusRow = {
  member_id: string;
  full_name: string;
  cohort: string | null;
  assistant_id: string | null;
  current_module: number | null;
  current_module_title: string | null;
  lessons_done: number;
  lessons_total: number;
  lessons_done_pct: number;
  days_since_activity: number | null;
  overdue_assignments: number;
  status: MemberStatus;
};
