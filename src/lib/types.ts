export type TaskType = "assignment" | "quiz" | "exam" | "reading" | "project" | "milestone" | "other";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type LMSProvider = "CANVAS" | "BLACKBOARD" | "BRIGHTSPACE" | "MOODLE" | "ICAL_FEED";

export interface Instructor {
  name: string;
  email: string;
  office_hours: string;
  office_location?: string;
}

export interface WeightCategory {
  id?: string;
  category: string;
  percentage: number;
}

export interface TaskItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  courseColor: string;
  emoji?: string; // e.g. "📝", "🎯", "🧪"
  title: string;
  type: TaskType;
  dueDate: string; // ISO 8601 string
  estimatedHours: number;
  weightPercent: number;
  status: TaskStatus;
  gradeReceived: number | null;
  gradeMax: number;
  description: string;
  googleEventId?: string | null;
  googleBufferEventId?: string | null;
  lmsTaskId?: string | null;
  lmsSource?: LMSProvider | null;
  subtasks?: SubTaskItem[];
}

export interface SubTaskItem {
  id: string;
  title: string;
  scheduledDate?: string | null;
  isCompleted: boolean;
  orderIndex: number;
}

export type ClassGroupType = "FACEBOOK" | "DISCORD" | "GROUPME" | "WHATSAPP" | "TELEGRAM";

export interface ClassGroupChat {
  type: ClassGroupType;
  name: string;
  url: string;
  memberCount?: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  colorHex: string;
  emoji?: string; // e.g. "💻", "📈", "🧬"
  term: string;
  googleCalendarId?: string | null;
  instructor: Instructor;
  weightCategories: WeightCategory[];
  syllabusDoc?: {
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    rawPolicies?: string;
  };
  groupChat?: ClassGroupChat;
}

export interface ParsedSyllabus {
  course_name: string;
  course_code: string;
  instructor: {
    name: string;
    email: string;
    office_hours: string;
  };
  weight_distribution: Array<{
    category: string;
    percentage: number;
  }>;
  items: Array<{
    title: string;
    type: "assignment" | "quiz" | "exam" | "reading" | "project";
    due_date: string;
    weight_percent: number;
    description: string;
  }>;
}

export interface GoogleSyncState {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  sheetsSyncEnabled: boolean;
  calendarSyncEnabled: boolean;
  lastSyncedAt: string | null;
}

export interface LMSConnectionState {
  id: string;
  provider: LMSProvider;
  endpoint?: string;
  feedUrl?: string;
  lastSyncedAt: string | null;
  tasksCount: number;
}

export interface DispatchSummary {
  date: string;
  greeting: string;
  tasksDueNext24h: TaskItem[];
  tasksDueNext48h: TaskItem[];
  milestonesStartingToday: TaskItem[];
  weatherAlert?: {
    summary: string;
    temp: number;
    commuteBufferMinutes: number;
  };
}

export type SubscriptionTier = "FREE" | "PRO";
export type SubscriptionStatus = "ACTIVE_TRIAL" | "ACTIVE_SUBSCRIBER" | "PAST_DUE" | "CANCELLED";

export interface SubscriptionState {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trialDaysRemaining: number;
  trialEndsAt: string;
  currentPeriodEnd: string;
  monthlyPrice: number; // 5.00
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  homeworkUploadsCount: number;
  homeworkUploadsLimit: number; // 3 for Free, 99999 for Pro
}

export interface NotificationSettings {
  phone: string;
  smsEnabled: boolean;
  webPushEnabled: boolean;
  soundEnabled: boolean;
  leadTimesMinutes: number[]; // [1440, 180, 60, 15]
  lastAlertSentAt?: string | null;
}

export interface CustomColorPalette {
  courseColors: Record<string, string>; // courseId -> hex
  courseEmojis: Record<string, string>; // courseId -> emoji
  taskTypeColors: Record<TaskType, string>; // taskType -> hex
  taskTypeEmojis: Record<TaskType, string>; // taskType -> emoji
  activePreset: string;
}

export interface PeerUser {
  id: string;
  name: string;
  university: string;
  avatar: string;
  major: string;
  courses: string[];
}

export interface SharedNote {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  type: "homework_hints" | "lecture_summary" | "study_guide" | "exam_prep";
  authorName: string;
  authorUniversity: string;
  content: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  tags: string[];
}

export interface HomeworkUpload {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  dueDate: string;
  imageUrl?: string;
  fileName: string;
  extractedProblems: Array<{
    problemNumber: string;
    prompt: string;
    subtasks: string[];
  }>;
  uploadedAt: string;
}

export type ThemeMode = "light" | "dark" | "system";

export interface BackgroundConfig {
  type: "default" | "template" | "custom";
  templateId?: string;
  customUrl?: string; // Data URL or external image URL
  blurPx: number; // 0 to 20
  overlayOpacity: number; // 0.1 to 0.9
  overlayTint: "auto" | "black" | "navy" | "sepia" | "none";
}

export interface CloudDocument {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  fileName: string;
  fileSize: number; // bytes
  fileType: "pdf" | "docx" | "md" | "txt" | "pptx" | "xlsx" | "zip" | "other";
  category: "paper" | "lab_report" | "homework_draft" | "study_guide" | "notes" | "other";
  version: string; // e.g. "v1.0 Draft", "v2.0 Final"
  gcsBucket: string; // e.g. "gs://syllabiq-academic-vault-cornell"
  gcsPath: string; // e.g. "users/alex-student/cs3110/CS3110_Distributed_KV_Store.pdf"
  cloudUrl: string;
  googleDocsUrl?: string;
  cloudSyncedAt: string;
  syncStatus: "synced" | "syncing" | "pending";
  md5Checksum: string;
  summary?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CloudVaultState {
  provider: "google_cloud";
  projectId: string; // "syllabiq-fall2026-prod"
  bucketName: string; // "gs://syllabiq-academic-vault-cornell"
  region: string; // "us-east1 (South Carolina)"
  storageUsedBytes: number;
  storageQuotaBytes: number; // 50 GB
  documents: CloudDocument[];
  autoSyncEnabled: boolean;
  lastSyncedAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  organization?: string;
  category: string;
  message: string;
  createdAt: string;
  status: "new" | "read" | "replied";
}
