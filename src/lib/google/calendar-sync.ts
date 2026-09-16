import { getStore, saveStore, addActivityLog } from "../storage";
import { TaskItem, Course } from "../types";

export interface CalendarEventPayload {
  calendarId: string;
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  colorId: string;
  isMilestone: boolean;
}

export class GoogleCalendarSyncService {
  /**
   * Syncs all tasks for a course or the entire semester to Google Calendar
   */
  static async syncAllCourseCalendars(): Promise<{
    syncedDeadlines: number;
    syncedMilestones: number;
    events: CalendarEventPayload[];
  }> {
    const store = getStore();
    const events: CalendarEventPayload[] = [];
    let syncedDeadlines = 0;
    let syncedMilestones = 0;

    for (const task of store.tasks) {
      const course = store.courses.find((c) => c.id === task.courseId);
      const courseCalendarId = course?.googleCalendarId || `gcal_${task.courseCode.toLowerCase().replace(/\s+/g, "_")}`;

      const deadlineDate = new Date(task.dueDate);
      const deadlineStart = new Date(deadlineDate.getTime() - 60 * 60 * 1000); // 1-hour event
      const deadlineEnd = deadlineDate;

      // 1. Hard Deadline Event
      const deadlineEvent: CalendarEventPayload = {
        calendarId: courseCalendarId,
        summary: `[DUE] ${task.courseCode}: ${task.title}`,
        description: `
### 🎯 Course: ${task.courseName} (${task.courseCode})
**Weight**: ${task.weightPercent}% of Final Grade
**Estimated Time**: ${task.estimatedHours} hours
**Type**: ${task.type.toUpperCase()}
**Status**: ${task.status}

📝 **Description & Rubric**:
${task.description || "No specific rubric notes."}

🔗 Integrated with SyllabiQ Academic Engine
        `.trim(),
        startTime: deadlineStart.toISOString(),
        endTime: deadlineEnd.toISOString(),
        colorId: "11", // Red
        isMilestone: false
      };

      events.push(deadlineEvent);
      task.googleEventId = `gcal_due_${task.id}`;
      syncedDeadlines++;

      // 2. AI "Start Working" Milestone Prep Block (3 to 7 days prior)
      const prepDays = task.weightPercent >= 15 || task.type === "project" || task.type === "exam" ? 5 : 3;
      const prepDate = new Date(deadlineDate.getTime() - prepDays * 24 * 60 * 60 * 1000);
      prepDate.setHours(14, 0, 0, 0); // 2:00 PM local
      const prepEnd = new Date(prepDate.getTime() + 2 * 60 * 60 * 1000); // 2 hour work block

      const milestoneEvent: CalendarEventPayload = {
        calendarId: courseCalendarId,
        summary: `[START WORKING] ${task.courseCode}: ${task.title}`,
        description: `
⚡ **SyllabiQ AI Milestone Prep Buffer**
This task carries a ${task.weightPercent}% weight toward your course grade.
Starting 5 days early prevents bottleneck crunches and improves retention.

Recommended Milestones:
1. Review assignment prompt & grading criteria
2. Draft initial outline / skeleton
3. Reserve 2x 90-minute deep work blocks
        `.trim(),
        startTime: prepDate.toISOString(),
        endTime: prepEnd.toISOString(),
        colorId: "5", // Yellow / Amber
        isMilestone: true
      };

      events.push(milestoneEvent);
      task.googleBufferEventId = `gcal_buf_${task.id}`;
      syncedMilestones++;
    }

    store.googleSync.calendarSyncEnabled = true;
    store.googleSync.lastSyncedAt = new Date().toISOString();
    saveStore(store);

    addActivityLog(
      "Google Calendar Synced",
      `Pushed ${syncedDeadlines} deadlines and generated ${syncedMilestones} AI "Start Working" milestone blocks.`
    );

    return { syncedDeadlines, syncedMilestones, events };
  }
}
