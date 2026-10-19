import { NextResponse } from "next/server";
import { UniversalLMSSyncService } from "@/lib/lms/universal-sync";
import { parseIcalEvents } from "@/lib/lms/ical-import";
import type { LMSProvider } from "@/lib/types";
import { getCurrentUser, isDatabaseConfigured } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

const SUPPORTED_PROVIDERS = ["CANVAS", "BLACKBOARD", "BRIGHTSPACE", "MOODLE", "ICAL_FEED"] as const;

// node-ical yields lowercase type labels; Prisma stores them uppercase.
const TASK_TYPE_MAP: Record<string, "ASSIGNMENT" | "QUIZ" | "EXAM" | "READING" | "PROJECT"> = {
  assignment: "ASSIGNMENT",
  quiz: "QUIZ",
  exam: "EXAM",
  reading: "READING",
  project: "PROJECT"
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const provider: LMSProvider = body.provider || "ICAL_FEED";
    const { rawIcs, feedUrl } = body;
    if (!SUPPORTED_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Unsupported LMS provider." }, { status: 400 });
    }

    const hasIcsText = typeof rawIcs === "string" && rawIcs.includes("BEGIN:VCALENDAR");
    const hasFeedUrl = typeof feedUrl === "string" && feedUrl.trim().length > 0;
    if (!hasIcsText && !hasFeedUrl) {
      // No calendar feed supplied: this is the direct API path, which we do
      // not offer. Per-school OAuth/API integrations are not available.
      return NextResponse.json(
        { error: `${provider} direct API sync is not available. Import works through your school's calendar feed: paste the feed URL from your LMS instead.` },
        { status: 501 }
      );
    }

    const user = await getCurrentUser();
    if (isDatabaseConfigured() && !user) {
      return NextResponse.json({ error: "Sign in before importing a calendar feed." }, { status: 401 });
    }

    let calendarText = hasIcsText ? rawIcs : "";
    if (!calendarText && hasFeedUrl) {
      // Normalize webcal:// to https:// up front: assigning .protocol on a
      // URL with a non-special scheme is a no-op per the WHATWG URL spec.
      const normalized = feedUrl.trim().replace(/^webcal:\/\//i, "https://");
      let parsedUrl: URL;
      try { parsedUrl = new URL(normalized); } catch {
        return NextResponse.json({ error: "Enter a valid calendar feed URL." }, { status: 400 });
      }
      if (parsedUrl.protocol !== "https:") {
        return NextResponse.json({ error: "Only HTTPS or WebCal feed URLs are supported." }, { status: 400 });
      }
      const response = await fetch(parsedUrl, { signal: AbortSignal.timeout(15000), cache: "no-store" });
      if (!response.ok) return NextResponse.json({ error: `Calendar feed returned HTTP ${response.status}.` }, { status: 502 });
      calendarText = await response.text();
    }
    if (!calendarText.includes("BEGIN:VCALENDAR")) {
      return NextResponse.json({ error: "Provide an iCalendar feed or a valid feed URL." }, { status: 400 });
    }

    if (!user) {
      // Local dev without a database: fall back to the client-side store.
      const result = await UniversalLMSSyncService.syncICalContent(calendarText, provider);
      return NextResponse.json({ success: true, ...result });
    }

    const events = parseIcalEvents(calendarText);
    let totalFound = 0;
    let syncedNew = 0;
    let deduplicated = 0;
    const details: string[] = [];

    for (const event of events) {
      totalFound++;

      let course = await prisma.course.findUnique({
        where: { userId_code: { userId: user.id, code: event.courseCode } }
      });
      if (!course) {
        course = await prisma.course.create({
          data: {
            userId: user.id,
            name: `${event.courseCode} Enrolled Class`,
            code: event.courseCode,
            colorHex: "#06B6D4",
            term: "Current Semester"
          }
        });
      }

      // Dedupe: same feed item re-imported (matching lmsTaskId), or an
      // existing task with the same title and due date in this course.
      let existing = null;
      if (event.uid) {
        existing = await prisma.task.findFirst({
          where: { courseId: course.id, lmsTaskId: event.uid }
        });
      }
      if (!existing) {
        existing = await prisma.task.findFirst({
          where: { courseId: course.id, title: event.title, dueDate: event.dueDate }
        });
      }

      if (existing) {
        deduplicated++;
        details.push(`Skipped "${event.title}" (already imported)`);
        continue;
      }

      await prisma.task.create({
        data: {
          courseId: course.id,
          title: event.title,
          description: event.description || null,
          type: TASK_TYPE_MAP[event.taskType] ?? "ASSIGNMENT",
          dueDate: event.dueDate,
          estimatedHours: 2.5,
          weightPercent: 5.0,
          status: "TODO",
          gradeMax: 100,
          lmsTaskId: event.uid,
          lmsSource: provider
        }
      });
      syncedNew++;
      details.push(`Added "${event.title}" for ${event.courseCode}`);
    }

    return NextResponse.json({ success: true, provider, totalFound, syncedNew, deduplicated, details });
  } catch (err) {
    console.error("LMS Sync Error", err);
    return NextResponse.json({ error: "The calendar feed could not be imported." }, { status: 500 });
  }
}
