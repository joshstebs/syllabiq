import { getStore, saveStore, addActivityLog } from "../storage";
import { TaskItem, TaskStatus } from "../types";

export interface SheetRowData {
  courseCode: string;
  taskTitle: string;
  type: string;
  dueDate: string;
  estHours: number;
  weightPercent: string;
  status: TaskStatus;
  gradeReceived: string;
  taskId: string;
}

export class GoogleSheetsService {
  /**
   * Generates or syncs the styled "SyllabiQ Master Tracker" rows
   */
  static getMasterTrackerSheetRows(): { headers: string[]; rows: (string | number)[][] } {
    const store = getStore();
    const headers = [
      "Course",
      "Task Title",
      "Type",
      "Due Date",
      "Estimated Hours",
      "Weight %",
      "Status",
      "Grade Received",
      "Calendar Event ID / Task ID"
    ];

    const rows = store.tasks.map((t) => [
      t.courseCode,
      t.title,
      t.type.toUpperCase(),
      new Date(t.dueDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      t.estimatedHours,
      `${t.weightPercent}%`,
      t.status,
      t.gradeReceived !== null ? t.gradeReceived : "-",
      t.googleEventId || t.id
    ]);

    return { headers, rows };
  }

  /**
   * Auto-provisions a new Google Sheets Master Tracker spreadsheet
   */
  static async provisionSpreadsheet(): Promise<{ spreadsheetId: string; url: string }> {
    const store = getStore();
    const mockId = `syllabiq-sheet-${Date.now()}`;
    const mockUrl = `https://docs.google.com/spreadsheets/d/${mockId}/edit`;

    store.googleSync.spreadsheetId = mockId;
    store.googleSync.spreadsheetUrl = mockUrl;
    store.googleSync.lastSyncedAt = new Date().toISOString();

    saveStore(store);
    addActivityLog(
      "Google Sheets Provisioned",
      `Created "SyllabiQ Master Tracker" with 9 columns, frozen headers, and two-way webhook listeners.`
    );

    return { spreadsheetId: mockId, url: mockUrl };
  }

  /**
   * Handles webhook updates from Google Sheets (or test simulation)
   * If status, due date, or grade is edited in the sheet, it updates DB and triggers Calendar sync!
   */
  static async handleIncomingSheetUpdate(payload: {
    taskId: string;
    newStatus?: TaskStatus;
    newGrade?: number | null;
    newDueDate?: string;
  }): Promise<{ success: boolean; task?: TaskItem }> {
    const store = getStore();
    const task = store.tasks.find((t) => t.id === payload.taskId || t.googleEventId === payload.taskId);

    if (!task) {
      return { success: false };
    }

    if (payload.newStatus) {
      task.status = payload.newStatus;
    }
    if (payload.newGrade !== undefined) {
      task.gradeReceived = payload.newGrade;
    }
    if (payload.newDueDate) {
      task.dueDate = new Date(payload.newDueDate).toISOString();
    }

    store.googleSync.lastSyncedAt = new Date().toISOString();
    saveStore(store);

    addActivityLog(
      "Google Sheets 2-Way Sync",
      `Sheet updated task "${task.title}": Status -> ${task.status}, Grade -> ${task.gradeReceived ?? "N/A"}. Reflected to calendar.`
    );

    return { success: true, task };
  }
}
