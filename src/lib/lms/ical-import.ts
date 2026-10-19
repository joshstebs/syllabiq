import ical from "node-ical";

export interface ParsedIcalEvent {
  uid: string | null;
  title: string;
  dueDate: Date;
  description: string;
  courseCode: string;
  taskType: "assignment" | "quiz" | "exam" | "reading" | "project";
}

const COURSE_CODE_RE = /\[?([A-Z]{2,4}\s?[0-9]{3,4})\]?/i;

/**
 * Deduces a course code from an event title, e.g. "[CS 3110] HW 1" or
 * "CS3110: HW 1" -> "CS 3110". Falls back to "GEN 101" when no code matches.
 */
export function deduceCourseCode(title: string): string {
  const match = title.match(COURSE_CODE_RE);
  if (!match) return "GEN 101";
  return match[1].toUpperCase().replace(/\s+/, " ");
}

/**
 * Guesses the task type from keywords in the event title.
 */
export function inferTaskType(title: string): ParsedIcalEvent["taskType"] {
  const l = title.toLowerCase();
  if (l.includes("exam") || l.includes("midterm") || l.includes("final")) return "exam";
  if (l.includes("quiz")) return "quiz";
  if (l.includes("read") || l.includes("chapter")) return "reading";
  if (l.includes("project") || l.includes("paper")) return "project";
  return "assignment";
}

/**
 * Parses raw iCalendar text into normalized events. Skips non-VEVENT
 * components and events without a summary. Prefers the event end time as
 * the due date (LMS feeds usually encode the deadline as DTEND).
 */
export function parseIcalEvents(rawIcsContent: string): ParsedIcalEvent[] {
  const parsed = ical.sync.parseICS(rawIcsContent);
  const events: ParsedIcalEvent[] = [];

  for (const key of Object.keys(parsed)) {
    const ev = parsed[key] as {
      type?: string;
      summary?: unknown;
      description?: unknown;
      uid?: unknown;
      start?: unknown;
      end?: unknown;
    };
    if (!ev || ev.type !== "VEVENT" || !ev.summary) continue;

    const title = String(ev.summary).trim();
    if (!title) continue;

    const end = ev.end ? new Date(ev.end as string) : null;
    const start = ev.start ? new Date(ev.start as string) : null;
    const dueDate =
      end && !Number.isNaN(end.getTime())
        ? end
        : start && !Number.isNaN(start.getTime())
          ? start
          : new Date();

    events.push({
      uid: ev.uid ? String(ev.uid) : null,
      title,
      dueDate,
      description: ev.description ? String(ev.description) : "",
      courseCode: deduceCourseCode(title),
      taskType: inferTaskType(title)
    });
  }

  return events;
}
