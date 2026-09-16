import fs from "fs";
import path from "path";
import {
  Course,
  TaskItem,
  GoogleSyncState,
  LMSConnectionState,
  SubscriptionState,
  NotificationSettings,
  CustomColorPalette,
  SharedNote,
  HomeworkUpload,
  TaskType,
  BackgroundConfig,
  CloudDocument,
  CloudVaultState,
  ContactInquiry
} from "./types";

export interface SyllabiQStore {
  courses: Course[];
  tasks: TaskItem[];
  googleSync: GoogleSyncState;
  lmsConnections: LMSConnectionState[];
  activityLogs: Array<{ id: string; timestamp: string; action: string; details: string }>;
  subscription: SubscriptionState;
  notifications: NotificationSettings;
  customColors: CustomColorPalette;
  sharedNotes: SharedNote[];
  homeworkUploads: HomeworkUpload[];
  backgroundConfig: BackgroundConfig;
  cloudVault: CloudVaultState;
  contactInquiries: ContactInquiry[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "syllabiq-store.json");

// Helper to construct dynamic dates relative to today
function offsetDate(days: number, hours = 23, minutes = 59): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

const INITIAL_STORE: SyllabiQStore = {
  courses: [
    {
      id: "course-cs3110",
      name: "Data Structures & Functional Programming",
      code: "CS 3110",
      colorHex: "#6366F1", // Indigo
      term: "Fall 2026",
      googleCalendarId: "gcal_cs3110_sec",
      instructor: {
        name: "Dr. Michael Clarkson",
        email: "clarkson@cornell.edu",
        office_hours: "Tues/Thurs 2:00 PM - 4:00 PM (Gates 314)",
        office_location: "Gates Hall 314"
      },
      weightCategories: [
        { category: "Programming Assignments", percentage: 40 },
        { category: "Midterm Exams", percentage: 30 },
        { category: "Final Project", percentage: 20 },
        { category: "Recitation & Quizzes", percentage: 10 }
      ],
      syllabusDoc: {
        fileName: "CS3110_Fall2026_Syllabus.pdf",
        fileSize: 412000,
        uploadedAt: new Date().toISOString(),
        rawPolicies: "Late policy: 10% penalty per day up to 3 days maximum. No late submissions accepted for final project."
      }
    },
    {
      id: "course-econ1010",
      name: "Principles of Microeconomics",
      code: "ECON 1010",
      colorHex: "#10B981", // Emerald
      term: "Fall 2026",
      googleCalendarId: "gcal_econ1010_sec",
      instructor: {
        name: "Prof. Jennifer Wissink",
        email: "wissink@cornell.edu",
        office_hours: "Wed 10:00 AM - 12:00 PM (Uris 468)",
        office_location: "Uris Hall 468"
      },
      weightCategories: [
        { category: "Problem Sets", percentage: 25 },
        { category: "Prelim 1", percentage: 20 },
        { category: "Prelim 2", percentage: 20 },
        { category: "Final Exam", percentage: 35 }
      ],
      syllabusDoc: {
        fileName: "ECON1010_Micro_Syllabus.pdf",
        fileSize: 328000,
        uploadedAt: new Date().toISOString(),
        rawPolicies: "Lowest problem set is dropped. Calculator permitted on prelims."
      }
    },
    {
      id: "course-bio1500",
      name: "Cellular & Molecular Biology",
      code: "BIO 1500",
      colorHex: "#F59E0B", // Amber
      term: "Fall 2026",
      googleCalendarId: "gcal_bio1500_sec",
      instructor: {
        name: "Dr. Rachel Levin",
        email: "rlevin@cornell.edu",
        office_hours: "Mon 3:00 PM - 5:00 PM (Corson 210)",
        office_location: "Corson Hall 210"
      },
      weightCategories: [
        { category: "Lab Reports", percentage: 35 },
        { category: "Quizzes", percentage: 15 },
        { category: "Midterm Exam", percentage: 25 },
        { category: "Final Exam", percentage: 25 }
      ],
      syllabusDoc: {
        fileName: "BIO1500_CellBio_Syllabus.docx",
        fileSize: 520000,
        uploadedAt: new Date().toISOString(),
        rawPolicies: "Attendance in labs is mandatory. Missed labs cannot be made up without physician note."
      }
    }
  ],
  tasks: [
    {
      id: "task-cs-1",
      courseId: "course-cs3110",
      courseCode: "CS 3110",
      courseName: "Data Structures & Functional Programming",
      courseColor: "#6366F1",
      title: "Assignment 1: OCaml Warmup & Expressions",
      type: "assignment",
      dueDate: offsetDate(1, 23, 59), // Due tomorrow!
      estimatedHours: 4.5,
      weightPercent: 8.0,
      status: "IN_PROGRESS",
      gradeReceived: null,
      gradeMax: 100,
      description: "Implement higher-order functions and recursive tree traversals in OCaml.",
      googleEventId: "evt_cs_due_1",
      googleBufferEventId: "evt_cs_buf_1",
      subtasks: [
        { id: "sub-1", title: "Set up OCaml dev container & Dune build", isCompleted: true, orderIndex: 0 },
        { id: "sub-2", title: "Implement warm-up arithmetic evaluator", isCompleted: true, orderIndex: 1 },
        { id: "sub-3", title: "Write test suite in OUnit2", isCompleted: false, orderIndex: 2 }
      ]
    },
    {
      id: "task-econ-1",
      courseId: "course-econ1010",
      courseCode: "ECON 1010",
      courseName: "Principles of Microeconomics",
      courseColor: "#10B981",
      title: "Problem Set 2: Consumer Choice & Elasticity",
      type: "assignment",
      dueDate: offsetDate(2, 17, 0), // Due in 2 days
      estimatedHours: 3.0,
      weightPercent: 5.0,
      status: "TODO",
      gradeReceived: null,
      gradeMax: 100,
      description: "Derive indifference curves and calculate cross-price elasticities."
    },
    {
      id: "task-bio-1",
      courseId: "course-bio1500",
      courseCode: "BIO 1500",
      courseName: "Cellular & Molecular Biology",
      courseColor: "#F59E0B",
      title: "Lab 3 Report: Enzyme Kinetics & Western Blotting",
      type: "project",
      dueDate: offsetDate(4, 23, 59),
      estimatedHours: 6.0,
      weightPercent: 12.0,
      status: "TODO",
      gradeReceived: null,
      gradeMax: 100,
      description: "Analyze Michaelis-Menten constant Vmax from spectrophotometer data."
    },
    {
      id: "task-cs-2",
      courseId: "course-cs3110",
      courseCode: "CS 3110",
      courseName: "Data Structures & Functional Programming",
      courseColor: "#6366F1",
      title: "Prelim Exam 1: Types & Induction",
      type: "exam",
      dueDate: offsetDate(7, 19, 30),
      estimatedHours: 12.0,
      weightPercent: 15.0,
      status: "TODO",
      gradeReceived: null,
      gradeMax: 100,
      description: "Covers weeks 1-4: induction proofs, modules, signatures, fold/map."
    },
    {
      id: "task-econ-2",
      courseId: "course-econ1010",
      courseCode: "ECON 1010",
      courseName: "Principles of Microeconomics",
      courseColor: "#10B981",
      title: "Prelim Exam 1: Supply, Demand & Welfare",
      type: "exam",
      dueDate: offsetDate(8, 10, 0),
      estimatedHours: 10.0,
      weightPercent: 20.0,
      status: "TODO",
      gradeReceived: null,
      gradeMax: 100,
      description: "Midterm exam covering chapters 1 through 7."
    },
    {
      id: "task-bio-2",
      courseId: "course-bio1500",
      courseCode: "BIO 1500",
      courseName: "Cellular & Molecular Biology",
      courseColor: "#F59E0B",
      title: "Chapter 6 & 7 Reading Response",
      type: "reading",
      dueDate: offsetDate(-3, 23, 59),
      estimatedHours: 2.0,
      weightPercent: 3.0,
      status: "DONE",
      gradeReceived: 96,
      gradeMax: 100,
      description: "Membrane transport mechanisms and G-protein coupled receptors."
    }
  ],
  googleSync: {
    spreadsheetId: "1SyLLabiQ_MasterTracker_AutoProv",
    spreadsheetUrl: "https://docs.google.com/spreadsheets/d/1SyLLabiQ_MasterTracker_AutoProv/edit",
    sheetsSyncEnabled: true,
    calendarSyncEnabled: true,
    lastSyncedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  lmsConnections: [
    {
      id: "lms-canvas-1",
      provider: "CANVAS",
      endpoint: "https://canvas.cornell.edu",
      lastSyncedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      tasksCount: 14
    }
  ],
  activityLogs: [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      action: "Syllabus Ingested",
      details: "Parsed CS3110_Fall2026_Syllabus.pdf via Vision LLM. Extracted 8 deadlines & weight breakdown."
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      action: "Google Calendar Synced",
      details: "Created secondary calendars for CS 3110, ECON 1010, BIO 1500 with smart milestone buffers."
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      action: "Google Sheets Webhook",
      details: "Auto-provisioned SyllabiQ Master Tracker spreadsheet. 6 items synced."
    }
  ],
  subscription: {
    tier: "FREE",
    status: "ACTIVE_TRIAL",
    trialDaysRemaining: 28,
    trialEndsAt: new Date(Date.now() + 28 * 86400000).toISOString(),
    currentPeriodEnd: new Date(Date.now() + 28 * 86400000).toISOString(),
    monthlyPrice: 5.0,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    homeworkUploadsCount: 1,
    homeworkUploadsLimit: 3
  },
  notifications: {
    phone: "+1 (607) 555-0199",
    smsEnabled: true,
    webPushEnabled: true,
    soundEnabled: true,
    leadTimesMinutes: [1440, 180, 60, 15],
    lastAlertSentAt: null
  },
  customColors: {
    courseColors: {
      "course-cs3110": "#6366F1",
      "course-econ1010": "#10B981",
      "course-bio1500": "#F59E0B"
    },
    courseEmojis: {
      "course-cs3110": "💻",
      "course-econ1010": "📈",
      "course-bio1500": "🧬"
    },
    taskTypeColors: {
      assignment: "#3B82F6",
      quiz: "#8B5CF6",
      exam: "#EF4444",
      reading: "#F59E0B",
      project: "#10B981",
      milestone: "#6366F1",
      other: "#64748B"
    },
    taskTypeEmojis: {
      assignment: "📝",
      quiz: "⚡",
      exam: "🎯",
      reading: "📚",
      project: "🚀",
      milestone: "🏁",
      other: "📌"
    },
    activePreset: "Coursicle Pastels"
  },
  sharedNotes: [
    {
      id: "note-1",
      courseId: "course-cs3110",
      courseCode: "CS 3110",
      title: "OCaml Higher-Order Functions & Tree Folding Cheatsheet",
      type: "study_guide",
      authorName: "Maya L.",
      authorUniversity: "Cornell University",
      content: "Summary of fold_left vs fold_right with binary trees. Remember: fold_left tail-recursive accumulator avoids stack overflow on 10,000+ nodes!",
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      upvotes: 24,
      hasUpvoted: true,
      tags: ["OCaml", "Recursion", "Trees", "PSet 1"]
    },
    {
      id: "note-2",
      courseId: "course-econ1010",
      courseCode: "ECON 1010",
      title: "Problem Set 2: Utility Maximization & Lagrangian Quick Guide",
      type: "homework_hints",
      authorName: "Devon K.",
      authorUniversity: "Cornell University",
      content: "For Q3: equate MRS (MU_x / MU_y) to P_x / P_y. Don't forget the budget constraint check when prices change in part b.",
      createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      upvotes: 18,
      hasUpvoted: false,
      tags: ["Utility", "Microeconomics", "PSet 2"]
    },
    {
      id: "note-3",
      courseId: "course-bio1500",
      courseCode: "BIO 1500",
      title: "Gel Electrophoresis Lab 4: Band Distance Calculation Reference",
      type: "lecture_summary",
      authorName: "Sarah W.",
      authorUniversity: "Cornell University",
      content: "Semi-log graph tips: Plot log(base pairs) vs migration distance in mm. The standard ladder gives R^2 = 0.992.",
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      upvotes: 12,
      hasUpvoted: false,
      tags: ["Lab 4", "Gel", "DNA Ladder"]
    }
  ],
  homeworkUploads: [
    {
      id: "hw-upload-1",
      courseId: "course-cs3110",
      courseCode: "CS 3110",
      title: "Problem Set 1: OCaml Trees & Tail Recursion",
      dueDate: offsetDate(2, 23, 59),
      fileName: "cs3110_pset1_handout.jpg",
      extractedProblems: [
        {
          problemNumber: "Problem 1",
          prompt: "Implement tree_map using pattern matching over 'a tree variant type.",
          subtasks: ["Define fold_tree operator", "Test leaf base case", "Verify tail-call optimization"]
        },
        {
          problemNumber: "Problem 2",
          prompt: "Benchmark balanced BST insertion against red-black invariants.",
          subtasks: ["Write invariant checker", "Profile memory usage"]
        }
      ],
      uploadedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    }
  ],
  backgroundConfig: {
    type: "default",
    templateId: "default-grid",
    blurPx: 0,
    overlayOpacity: 0.35,
    overlayTint: "auto"
  },
  cloudVault: {
    provider: "google_cloud",
    projectId: "syllabiq-fall2026-prod",
    bucketName: "gs://syllabiq-academic-vault-cornell",
    region: "us-east1 (South Carolina)",
    storageUsedBytes: 8890000,
    storageQuotaBytes: 53687091200, // 50 GB
    autoSyncEnabled: true,
    lastSyncedAt: new Date().toISOString(),
    documents: [
      {
        id: "doc-cs3110-kvstore",
        courseId: "course-cs3110",
        courseCode: "CS 3110",
        title: "Term Project: Distributed OCaml Key-Value Store Report",
        fileName: "CS3110_Distributed_KV_Store_Report.pdf",
        fileSize: 2450000,
        fileType: "pdf",
        category: "paper",
        version: "v2.1 Final",
        gcsBucket: "gs://syllabiq-academic-vault-cornell",
        gcsPath: "users/alex-student/cs3110/CS3110_Distributed_KV_Store_Report.pdf",
        cloudUrl: "https://storage.googleapis.com/syllabiq-academic-vault-cornell/users/alex-student/cs3110/CS3110_Distributed_KV_Store_Report.pdf",
        googleDocsUrl: "https://docs.google.com/document/d/1XyZ9_CS3110_KVStore_Report/edit",
        cloudSyncedAt: new Date().toISOString(),
        syncStatus: "synced",
        md5Checksum: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c",
        summary: "Architecture and performance benchmarks of a Raft-consensus replicated memory store implemented in OCaml, showing 99.4% write durability under simulated node partitions.",
        tags: ["OCaml", "Distributed Systems", "Raft Consensus", "Final Submission"],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "doc-econ1010-housing",
        courseId: "course-econ1010",
        courseCode: "ECON 1010",
        title: "Empirical Paper: Rental Price Elasticity in College Towns",
        fileName: "ECON1010_Rental_Price_Elasticity_Draft.docx",
        fileSize: 1120000,
        fileType: "docx",
        category: "paper",
        version: "v1.3 Revised",
        gcsBucket: "gs://syllabiq-academic-vault-cornell",
        gcsPath: "users/alex-student/econ1010/ECON1010_Rental_Price_Elasticity_Draft.docx",
        cloudUrl: "https://storage.googleapis.com/syllabiq-academic-vault-cornell/users/alex-student/econ1010/ECON1010_Rental_Price_Elasticity_Draft.docx",
        googleDocsUrl: "https://docs.google.com/document/d/1Econ1010_Housing_Elasticity_Paper/edit",
        cloudSyncedAt: new Date().toISOString(),
        syncStatus: "synced",
        md5Checksum: "4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d",
        summary: "Regression analysis of student rental housing vacancy rates across Ithaca and Cambridge over a 5-year period examining short-term inelastic demand.",
        tags: ["Microeconomics", "Elasticity", "Econometrics", "Peer Reviewed"],
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "doc-bio1500-pcr",
        courseId: "course-bio1500",
        courseCode: "BIO 1500",
        title: "Lab Report 3: Gel Electrophoresis DNA Banding & PCR Amplification",
        fileName: "BIO1500_Lab3_Gel_Electrophoresis_Report.pdf",
        fileSize: 3750000,
        fileType: "pdf",
        category: "lab_report",
        version: "v1.0 Submission",
        gcsBucket: "gs://syllabiq-academic-vault-cornell",
        gcsPath: "users/alex-student/bio1500/BIO1500_Lab3_Gel_Electrophoresis_Report.pdf",
        cloudUrl: "https://storage.googleapis.com/syllabiq-academic-vault-cornell/users/alex-student/bio1500/BIO1500_Lab3_Gel_Electrophoresis_Report.pdf",
        googleDocsUrl: "https://docs.google.com/document/d/1Bio1500_Gel_Electrophoresis_Report/edit",
        cloudSyncedAt: new Date().toISOString(),
        syncStatus: "synced",
        md5Checksum: "7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b",
        summary: "Quantitative analysis of restriction enzyme digestion fragments and PCR amplicon sizing against standard 1kb DNA ladder with spectrophotometry readings.",
        tags: ["Molecular Biology", "PCR", "Gel Electrophoresis", "Lab Report"],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "doc-phil2010-ai-ethics",
        courseId: "course-general",
        courseCode: "PHIL 2010",
        title: "Midterm Essay: Ethical Dimensions of Autonomous Decision Systems",
        fileName: "PHIL2010_Autonomous_AI_Ethics_Essay.docx",
        fileSize: 680000,
        fileType: "docx",
        category: "paper",
        version: "v1.2 Draft",
        gcsBucket: "gs://syllabiq-academic-vault-cornell",
        gcsPath: "users/alex-student/phil2010/PHIL2010_Autonomous_AI_Ethics_Essay.docx",
        cloudUrl: "https://storage.googleapis.com/syllabiq-academic-vault-cornell/users/alex-student/phil2010/PHIL2010_Autonomous_AI_Ethics_Essay.docx",
        googleDocsUrl: "https://docs.google.com/document/d/1Phil2010_Autonomous_Ethics_Essay/edit",
        cloudSyncedAt: new Date().toISOString(),
        syncStatus: "synced",
        md5Checksum: "3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c",
        summary: "Deontological vs consequentialist evaluation of algorithmic sentencing and high-stakes automated triage models.",
        tags: ["Ethics", "Philosophy of Tech", "AI Governance"],
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "doc-cs3110-cheatsheet",
        courseId: "course-cs3110",
        courseCode: "CS 3110",
        title: "Prelim 1 Comprehensive Cheat Sheet & Induction Proofs",
        fileName: "CS3110_Prelim1_CheatSheet_Formulas.pdf",
        fileSize: 890000,
        fileType: "pdf",
        category: "study_guide",
        version: "v1.0 Ready",
        gcsBucket: "gs://syllabiq-academic-vault-cornell",
        gcsPath: "users/alex-student/cs3110/CS3110_Prelim1_CheatSheet_Formulas.pdf",
        cloudUrl: "https://storage.googleapis.com/syllabiq-academic-vault-cornell/users/alex-student/cs3110/CS3110_Prelim1_CheatSheet_Formulas.pdf",
        googleDocsUrl: "https://docs.google.com/document/d/1CS3110_CheatSheet_Prelim1/edit",
        cloudSyncedAt: new Date().toISOString(),
        syncStatus: "synced",
        md5Checksum: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
        summary: "Hand-condensed 2-page reference covering structural induction, tail-call optimization lemmas, algebraic data types, and Red-Black tree invariant proofs.",
        tags: ["OCaml", "Exam Prep", "Induction Proofs", "Cheat Sheet"],
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  contactInquiries: [
    {
      id: "inquiry-initial-1",
      name: "Marcus Vance",
      email: "mvance@harvard.edu",
      organization: "Harvard University",
      category: "campus_ambassador",
      message: "Interested in bringing SyllabiQ to Harvard Yard for the Fall semester. Can we discuss a university-wide partnership?",
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      status: "new"
    }
  ]
};

export function getStore(): SyllabiQStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_STORE, null, 2), "utf-8");
      return INITIAL_STORE;
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const store = JSON.parse(data) as SyllabiQStore;

    // Migrate any missing fields from INITIAL_STORE
    let modified = false;
    if (!store.subscription) {
      store.subscription = INITIAL_STORE.subscription;
      modified = true;
    }
    if (!store.notifications) {
      store.notifications = INITIAL_STORE.notifications;
      modified = true;
    }
    if (!store.customColors) {
      store.customColors = INITIAL_STORE.customColors;
      modified = true;
    }
    if (!store.sharedNotes) {
      store.sharedNotes = INITIAL_STORE.sharedNotes;
      modified = true;
    }
    if (!store.homeworkUploads) {
      store.homeworkUploads = INITIAL_STORE.homeworkUploads;
      modified = true;
    }
    if (!store.backgroundConfig) {
      store.backgroundConfig = INITIAL_STORE.backgroundConfig;
      modified = true;
    }
    if (!store.cloudVault) {
      store.cloudVault = INITIAL_STORE.cloudVault;
      modified = true;
    }
    if (!store.contactInquiries) {
      store.contactInquiries = INITIAL_STORE.contactInquiries;
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
    }

    return store;
  } catch (err) {
    console.error("Failed to read store, using fallback", err);
    return INITIAL_STORE;
  }
}

export function saveStore(store: SyllabiQStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save store", err);
  }
}

export function addActivityLog(action: string, details: string): void {
  const store = getStore();
  store.activityLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    action,
    details
  });
  if (store.activityLogs.length > 50) {
    store.activityLogs = store.activityLogs.slice(0, 50);
  }
  saveStore(store);
}

// Subscription Helpers
export function getSubscription(): SubscriptionState {
  const store = getStore();
  return store.subscription;
}

export function updateSubscription(patch: Partial<SubscriptionState>): SubscriptionState {
  const store = getStore();
  store.subscription = { ...store.subscription, ...patch };
  saveStore(store);
  addActivityLog("Subscription Updated", `Tier: ${store.subscription.tier} (${store.subscription.status})`);
  return store.subscription;
}

// Notification Settings Helpers
export function getNotificationSettings(): NotificationSettings {
  const store = getStore();
  return store.notifications;
}

export function updateNotificationSettings(patch: Partial<NotificationSettings>): NotificationSettings {
  const store = getStore();
  store.notifications = { ...store.notifications, ...patch };
  saveStore(store);
  addActivityLog("Notification Settings Changed", `SMS: ${store.notifications.smsEnabled}, Push: ${store.notifications.webPushEnabled}`);
  return store.notifications;
}

// Custom Colors Helpers
export function getCustomColors(): CustomColorPalette {
  const store = getStore();
  return store.customColors;
}

export function updateCustomColors(patch: Partial<CustomColorPalette>): CustomColorPalette {
  const store = getStore();
  store.customColors = {
    ...store.customColors,
    ...patch,
    courseColors: {
      ...store.customColors.courseColors,
      ...(patch.courseColors || {})
    },
    courseEmojis: {
      ...(store.customColors.courseEmojis || {}),
      ...(patch.courseEmojis || {})
    },
    taskTypeColors: {
      ...store.customColors.taskTypeColors,
      ...(patch.taskTypeColors || {})
    },
    taskTypeEmojis: {
      ...(store.customColors.taskTypeEmojis || {}),
      ...(patch.taskTypeEmojis || {})
    }
  };

  // Sync course colorHex and emoji back to courses
  store.courses.forEach((c) => {
    if (store.customColors.courseColors[c.id]) {
      c.colorHex = store.customColors.courseColors[c.id];
    }
    if (store.customColors.courseEmojis && store.customColors.courseEmojis[c.id]) {
      c.emoji = store.customColors.courseEmojis[c.id];
    }
  });

  // Sync task courseColor and emoji back to tasks
  store.tasks.forEach((t) => {
    if (store.customColors.courseColors[t.courseId]) {
      t.courseColor = store.customColors.courseColors[t.courseId];
    }
    if (store.customColors.taskTypeEmojis && store.customColors.taskTypeEmojis[t.type]) {
      t.emoji = store.customColors.taskTypeEmojis[t.type];
    }
  });

  saveStore(store);
  addActivityLog("Custom Colors & Emojis Updated", `Active preset: ${store.customColors.activePreset}`);
  return store.customColors;
}

// Shared Notes Helpers
export function getSharedNotes(courseId?: string): SharedNote[] {
  const store = getStore();
  if (courseId && courseId !== "ALL") {
    return store.sharedNotes.filter((n) => n.courseId === courseId);
  }
  return store.sharedNotes;
}

export function addSharedNote(note: Omit<SharedNote, "id" | "createdAt" | "upvotes">): SharedNote {
  const store = getStore();
  const newNote: SharedNote = {
    ...note,
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    createdAt: new Date().toISOString(),
    upvotes: 1,
    hasUpvoted: true
  };
  store.sharedNotes.unshift(newNote);
  saveStore(store);
  addActivityLog("Shared Note Posted", `"${newNote.title}" for ${newNote.courseCode}`);
  return newNote;
}

export function toggleUpvoteSharedNote(noteId: string): SharedNote | null {
  const store = getStore();
  const note = store.sharedNotes.find((n) => n.id === noteId);
  if (!note) return null;

  if (note.hasUpvoted) {
    note.upvotes = Math.max(0, note.upvotes - 1);
    note.hasUpvoted = false;
  } else {
    note.upvotes += 1;
    note.hasUpvoted = true;
  }
  saveStore(store);
  return note;
}

// Homework Uploads Helpers
export function getHomeworkUploads(): HomeworkUpload[] {
  const store = getStore();
  return store.homeworkUploads;
}

export function addHomeworkUpload(upload: Omit<HomeworkUpload, "id" | "uploadedAt">): {
  upload: HomeworkUpload;
  subscription: SubscriptionState;
} {
  const store = getStore();

  // Increment upload counter
  store.subscription.homeworkUploadsCount += 1;

  const newUpload: HomeworkUpload = {
    ...upload,
    id: `hw-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    uploadedAt: new Date().toISOString()
  };

  store.homeworkUploads.unshift(newUpload);

  // Automatically add extracted problems as tasks into the schedule!
  const dueDate = upload.dueDate || offsetDate(3, 23, 59);
  const course = store.courses.find((c) => c.id === upload.courseId) || store.courses[0];

  const newTask: TaskItem = {
    id: `task-hw-${Date.now()}`,
    courseId: course ? course.id : "course-cs3110",
    courseCode: course ? course.code : "CS 3110",
    courseName: course ? course.name : "Homework Assignment",
    courseColor: course ? course.colorHex : "#3B82F6",
    title: upload.title,
    type: "assignment",
    dueDate: dueDate,
    estimatedHours: 4.5,
    weightPercent: 10,
    status: "TODO",
    gradeReceived: null,
    gradeMax: 100,
    description: `Photo-scanned worksheet with ${upload.extractedProblems.length} problem sections.`,
    subtasks: upload.extractedProblems.flatMap((p, pIdx) =>
      p.subtasks.map((st, stIdx) => ({
        id: `sub-${pIdx}-${stIdx}`,
        title: `${p.problemNumber}: ${st}`,
        isCompleted: false,
        orderIndex: pIdx * 10 + stIdx
      }))
    )
  };

  store.tasks.unshift(newTask);
  saveStore(store);

  addActivityLog(
    "Homework Photo Ingested",
    `Extracted ${upload.extractedProblems.length} problems into schedule for ${course?.code || "Course"}`
  );

  return { upload: newUpload, subscription: store.subscription };
}

export function getCloudVault(): CloudVaultState {
  const store = getStore();
  return store.cloudVault;
}

export function saveCloudVault(vault: CloudVaultState): void {
  const store = getStore();
  store.cloudVault = vault;
  saveStore(store);
}

export function addCloudDocument(docData: {
  courseId: string;
  courseCode: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: CloudDocument["fileType"];
  category: CloudDocument["category"];
  version?: string;
  tags?: string[];
  summary?: string;
}): CloudDocument {
  const store = getStore();
  const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const cleanFileName = docData.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const courseFolder = docData.courseCode.toLowerCase().replace(/[^a-z0-9]/g, "");
  const gcsPath = `users/alex-student/${courseFolder}/${cleanFileName}`;
  const bucket = store.cloudVault.bucketName;
  const cloudUrl = `https://storage.googleapis.com/${bucket.replace("gs://", "")}/${gcsPath}`;

  // Deterministic MD5-like checksum
  const md5Checksum = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  const newDoc: CloudDocument = {
    id: docId,
    courseId: docData.courseId,
    courseCode: docData.courseCode,
    title: docData.title,
    fileName: docData.fileName,
    fileSize: docData.fileSize,
    fileType: docData.fileType,
    category: docData.category,
    version: docData.version || "v1.0 Submission",
    gcsBucket: bucket,
    gcsPath,
    cloudUrl,
    googleDocsUrl: docData.fileType === "docx" || docData.fileType === "txt" || docData.fileType === "md"
      ? `https://docs.google.com/document/d/${docId}/edit`
      : undefined,
    cloudSyncedAt: new Date().toISOString(),
    syncStatus: "synced",
    md5Checksum,
    summary: docData.summary || `Stored in Google Cloud Storage (${bucket}). Auto-indexed for academic reference.`,
    tags: docData.tags || [docData.courseCode, docData.category],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.cloudVault.documents.unshift(newDoc);
  store.cloudVault.storageUsedBytes += docData.fileSize;
  store.cloudVault.lastSyncedAt = new Date().toISOString();
  saveStore(store);

  addActivityLog(
    "Google Cloud Upload",
    `Uploaded "${newDoc.title}" to ${newDoc.gcsBucket}/${newDoc.gcsPath}`
  );

  return newDoc;
}

export function deleteCloudDocument(docId: string): boolean {
  const store = getStore();
  const index = store.cloudVault.documents.findIndex((d) => d.id === docId);
  if (index === -1) return false;

  const doc = store.cloudVault.documents[index];
  store.cloudVault.storageUsedBytes = Math.max(0, store.cloudVault.storageUsedBytes - doc.fileSize);
  store.cloudVault.documents.splice(index, 1);
  saveStore(store);

  addActivityLog(
    "Google Cloud File Deleted",
    `Removed "${doc.title}" from ${doc.gcsBucket}`
  );

  return true;
}

export function getBackgroundConfig(): BackgroundConfig {
  const store = getStore();
  return store.backgroundConfig;
}

export function saveBackgroundConfig(config: BackgroundConfig): BackgroundConfig {
  const store = getStore();
  store.backgroundConfig = config;
  saveStore(store);
  return store.backgroundConfig;
}

export function addContactInquiry(inquiryData: {
  name: string;
  email: string;
  organization?: string;
  category: string;
  message: string;
}): ContactInquiry {
  const store = getStore();
  const newInquiry: ContactInquiry = {
    id: `inquiry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...inquiryData,
    createdAt: new Date().toISOString(),
    status: "new"
  };

  store.contactInquiries.unshift(newInquiry);
  saveStore(store);

  addActivityLog(
    "Contact Inquiry Received",
    `From ${newInquiry.name} (${newInquiry.email}) - [${newInquiry.category}]`
  );

  return newInquiry;
}

export function getContactInquiries(): ContactInquiry[] {
  const store = getStore();
  return store.contactInquiries || [];
}

export function createTask(taskData: Partial<TaskItem> & { title: string; courseId: string }): TaskItem {
  const store = getStore();
  const course = store.courses.find((c) => c.id === taskData.courseId) || store.courses[0];

  const newTask: TaskItem = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    courseId: course?.id || "course-cs3110",
    courseCode: course?.code || "CS 3110",
    courseName: course?.name || "General Course",
    courseColor: course?.colorHex || "#6366F1",
    title: taskData.title,
    type: taskData.type || "assignment",
    dueDate: taskData.dueDate || offsetDate(3, 23, 59),
    estimatedHours: taskData.estimatedHours || 3.0,
    weightPercent: taskData.weightPercent || 10,
    status: taskData.status || "TODO",
    gradeReceived: taskData.gradeReceived ?? null,
    gradeMax: taskData.gradeMax || 100,
    description: taskData.description || "",
    subtasks: taskData.subtasks || []
  };

  store.tasks.unshift(newTask);
  saveStore(store);

  addActivityLog("Task Created", `Added "${newTask.title}" to ${newTask.courseCode}`);
  return newTask;
}

export function deleteTask(taskId: string): boolean {
  const store = getStore();
  const index = store.tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return false;

  const deleted = store.tasks.splice(index, 1)[0];
  saveStore(store);

  addActivityLog("Task Deleted", `Removed "${deleted.title}" from schedule`);
  return true;
}

export function deleteCourse(courseId: string): boolean {
  const store = getStore();
  const courseIdx = store.courses.findIndex((c) => c.id === courseId);
  if (courseIdx === -1) return false;

  const deletedCourse = store.courses.splice(courseIdx, 1)[0];
  // Also remove associated tasks
  store.tasks = store.tasks.filter((t) => t.courseId !== courseId);
  saveStore(store);

  addActivityLog("Course Deleted", `Removed course ${deletedCourse.code} and its tasks`);
  return true;
}
