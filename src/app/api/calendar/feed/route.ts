import { NextResponse } from "next/server";
import { getStore } from "@/lib/storage";

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function GET() {
  try {
    const store = getStore();
    const tasks = store.tasks;

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SyllabiQ//Academic Schedule Feed//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:SyllabiQ Master Semester Schedule",
      "X-WR-TIMEZONE:UTC"
    ];

    for (const task of tasks) {
      const dueDate = new Date(task.dueDate);
      const startDate = new Date(dueDate.getTime() - (task.estimatedHours || 2) * 3600 * 1000);
      const now = new Date();

      const summary = `[${task.courseCode}] ${task.title}`;
      const description = `${task.description || ""}\\n\\nType: ${task.type.toUpperCase()}\\nWeight: ${task.weightPercent}%\\nStatus: ${task.status}\\nManaged by SyllabiQ (syllabiq.ca)`;

      icsContent.push(
        "BEGIN:VEVENT",
        `UID:syllabiq-${task.id}@syllabiq.ca`,
        `DTSTAMP:${formatIcsDate(now)}`,
        `DTSTART:${formatIcsDate(startDate)}`,
        `DTEND:${formatIcsDate(dueDate)}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `STATUS:${task.status === "DONE" ? "COMPLETED" : "CONFIRMED"}`,
        `CATEGORIES:${task.courseCode},${task.type.toUpperCase()}`,
        "END:VEVENT"
      );
    }

    icsContent.push("END:VCALENDAR");

    return new Response(icsContent.join("\r\n"), {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="syllabiq-semester.ics"',
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
