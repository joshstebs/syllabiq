type CalendarTask = {
  id: string;
  title: string;
  dueDate: Date | string;
  course: { code: string };
};

const escapeText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");

function foldLine(line: string): string {
  const lines: string[] = [];
  let current = "";
  let bytes = 0;
  for (const character of line) {
    const length = Buffer.byteLength(character, "utf8");
    if (bytes + length > 75) {
      lines.push(current);
      current = " ";
      bytes = 1;
    }
    current += character;
    bytes += length;
  }
  lines.push(current);
  return lines.join("\r\n");
}

const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

export function createCalendarExport(tasks: CalendarTask[], now = new Date()): string {
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SyllabiQ//Student Deadlines//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:SyllabiQ Deadlines"
  ];
  for (const task of tasks) {
    const dueDate = new Date(task.dueDate);
    if (!Number.isFinite(dueDate.getTime())) continue;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${escapeText(task.id)}@syllabiq.ca`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(dueDate)}`,
      `SUMMARY:${escapeText(`[${task.course.code}] ${task.title}`)}`,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
