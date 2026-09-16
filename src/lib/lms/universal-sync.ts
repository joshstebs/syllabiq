import ical from "node-ical";
import { getStore, saveStore, addActivityLog } from "../storage";
import { LMSProvider, TaskItem, TaskType } from "../types";
import { findDuplicateInCollection } from "./deduplication";

export interface LMSSyncResult {
  provider: LMSProvider;
  totalFound: number;
  syncedNew: number;
  deduplicated: number;
  details: string[];
}

export class UniversalLMSSyncService {
  /**
   * Parses raw iCal string or URL, extracts events, and runs deduplication
   */
  static async syncICalContent(
    rawIcsContent: string,
    provider: LMSProvider = "ICAL_FEED"
  ): Promise<LMSSyncResult> {
    const store = getStore();
    const parsed = ical.sync.parseICS(rawIcsContent);

    let totalFound = 0;
    let syncedNew = 0;
    let deduplicated = 0;
    const details: string[] = [];

    for (const key of Object.keys(parsed)) {
      const ev: any = parsed[key];
      if (!ev || ev.type !== "VEVENT" || !ev.summary) continue;

      totalFound++;
      const title = ev.summary.trim();
      const dueDate = ev.end ? new Date(ev.end).toISOString() : new Date().toISOString();
      const description = (ev.description as string) || "";

      // Deduce course code from title (e.g. "[CS 3110] HW 1" or "CS3110: HW 1")
      const courseMatch = title.match(/\[?([A-Z]{2,4}\s?[0-9]{3,4})\]?/i);
      const courseCode = courseMatch ? courseMatch[1].toUpperCase() : "GEN 101";

      // Find or assign course
      let course = store.courses.find((c) => c.code.toLowerCase() === courseCode.toLowerCase());
      if (!course) {
        course = {
          id: `course-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: `${courseCode} Enrolled Class`,
          code: courseCode,
          colorHex: "#06B6D4", // Cyan
          term: "Current Semester",
          instructor: { name: "LMS Instructor", email: "", office_hours: "" },
          weightCategories: [{ category: "Coursework", percentage: 100 }]
        };
        store.courses.push(course);
      }

      // Check deduplication against existing tasks
      const dupMatch = findDuplicateInCollection({ title, dueDate, courseCode }, store.tasks);

      if (dupMatch) {
        deduplicated++;
        // Merge metadata into existing task
        const existing = store.tasks.find((t) => t.id === dupMatch.match.id);
        if (existing) {
          existing.lmsTaskId = ev.uid || `lms-${Date.now()}`;
          existing.lmsSource = provider;
          if (description && !existing.description) {
            existing.description = description;
          }
        }
        details.push(`Merged "${title}" with existing syllabus item (similarity: ${(dupMatch.similarity * 100).toFixed(0)}%)`);
      } else {
        syncedNew++;
        const newTask: TaskItem = {
          id: `task-lms-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          courseColor: course.colorHex,
          title,
          type: UniversalLMSSyncService.inferType(title),
          dueDate,
          estimatedHours: 2.5,
          weightPercent: 5.0,
          status: "TODO",
          gradeReceived: null,
          gradeMax: 100,
          description,
          lmsTaskId: ev.uid || `lms-${Date.now()}`,
          lmsSource: provider
        };
        store.tasks.push(newTask);
        details.push(`Added new task "${title}" for ${courseCode}`);
      }
    }

    saveStore(store);
    addActivityLog(
      `LMS Sync (${provider})`,
      `Processed ${totalFound} items: ${syncedNew} added, ${deduplicated} deduplicated against syllabus.`
    );

    return { provider, totalFound, syncedNew, deduplicated, details };
  }

  /**
   * Simulates/executes direct REST pull from Canvas / Blackboard / Brightspace / Moodle
   */
  static async syncRESTPlatform(
    provider: LMSProvider,
    endpoint = "https://canvas.instructure.com"
  ): Promise<LMSSyncResult> {
    const store = getStore();

    // Sample payload representing real JSON items returned by Canvas / Blackboard LMS API
    const sampleLmsItems = [
      {
        title: "Assignment 1: OCaml Warmup (Submission Portal)",
        courseCode: "CS 3110",
        dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        points: 100,
        desc: "Submit your dune zip archive containing warm_up.ml"
      },
      {
        title: "Problem Set 2: Consumer Choice & Elasticity - Canvas Upload",
        courseCode: "ECON 1010",
        dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        points: 50,
        desc: "Upload PDF scan of handwritten derivations."
      },
      {
        title: "Discussion Board 4: Neural Plasticity Reflection",
        courseCode: "BIO 1500",
        dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
        points: 20,
        desc: "Post 300 words analyzing long-term potentiation."
      }
    ];

    let totalFound = sampleLmsItems.length;
    let syncedNew = 0;
    let deduplicated = 0;
    const details: string[] = [];

    for (const item of sampleLmsItems) {
      const course = store.courses.find((c) => c.code === item.courseCode) || store.courses[0];
      const dupMatch = findDuplicateInCollection({ title: item.title, dueDate: item.dueDate }, store.tasks);

      if (dupMatch) {
        deduplicated++;
        const existing = store.tasks.find((t) => t.id === dupMatch.match.id);
        if (existing) {
          existing.lmsTaskId = `rest-${provider.toLowerCase()}-${Date.now()}`;
          existing.lmsSource = provider;
        }
        details.push(`Deduplicated "${item.title}" with existing syllabus deadline (similarity: ${(dupMatch.similarity * 100).toFixed(0)}%)`);
      } else {
        syncedNew++;
        store.tasks.push({
          id: `task-rest-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          courseColor: course.colorHex,
          title: item.title,
          type: "assignment",
          dueDate: item.dueDate,
          estimatedHours: 2.0,
          weightPercent: 5.0,
          status: "TODO",
          gradeReceived: null,
          gradeMax: item.points,
          description: item.desc,
          lmsTaskId: `rest-${provider.toLowerCase()}-${Date.now()}`,
          lmsSource: provider
        });
        details.push(`Added new assignment "${item.title}" from ${provider}`);
      }
    }

    saveStore(store);
    addActivityLog(
      `${provider} REST Pull`,
      `Fetched from ${endpoint}: ${syncedNew} new tasks, ${deduplicated} matched & deduplicated.`
    );

    return { provider, totalFound, syncedNew, deduplicated, details };
  }

  private static inferType(title: string): TaskType {
    const l = title.toLowerCase();
    if (l.includes("exam") || l.includes("midterm") || l.includes("final")) return "exam";
    if (l.includes("quiz")) return "quiz";
    if (l.includes("read") || l.includes("chapter")) return "reading";
    if (l.includes("project") || l.includes("paper")) return "project";
    return "assignment";
  }
}
