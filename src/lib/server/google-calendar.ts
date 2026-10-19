import { prisma } from "./prisma";
import { getValidAccessToken } from "./google-tokens";
import type { Course, Task, User } from "@prisma/client";

const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

interface CalendarEventDateTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

export interface GoogleCalendarEvent {
  id?: string;
  summary?: string;
  description?: string;
  start?: CalendarEventDateTime;
  end?: CalendarEventDateTime;
  updated?: string;
  status?: string; // "confirmed" | "cancelled"
  extendedProperties?: { private?: Record<string, string> };
}

async function googleFetch(
  accessToken: string,
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, string> } = {}
): Promise<{ ok: boolean; status: number; json: any }> {
  const url = new URL(`${CALENDAR_API}${path}`);
  for (const [k, v] of Object.entries(options.query ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { ok: res.ok, status: res.status, json };
}

export interface SyncTask extends Task {
  course: Pick<Course, "id" | "code" | "name" | "googleCalendarId" | "calendarSyncToken">;
}

export function taskToEvent(
  task: SyncTask,
  timeZone: string
): Omit<GoogleCalendarEvent, "id"> {
  const due = new Date(task.dueDate);
  const start = new Date(due.getTime() - 60 * 60 * 1000);
  const lines = [
    `Course: ${task.course.name} (${task.course.code})`,
    task.weightPercent != null && task.weightPercent > 0 ? `Weight: ${task.weightPercent}% of final grade` : null,
    `Type: ${task.type}`,
    `Status: ${task.status}`,
    task.description ? "" : null,
    task.description ?? null,
    "",
    "Synced from SyllabiQ"
  ].filter((l) => l !== null) as string[];

  return {
    summary: `[DUE] ${task.course.code}: ${task.title}`,
    description: lines.join("\n"),
    start: { dateTime: start.toISOString(), timeZone },
    end: { dateTime: due.toISOString(), timeZone },
    extendedProperties: { private: { syllabiqTaskId: task.id, syllabiqCourseId: task.course.id } }
  };
}

async function findCalendarBySummary(accessToken: string, summary: string): Promise<string | null> {
  const { ok, json } = await googleFetch(accessToken, "/users/me/calendarList", {
    query: { minAccessRole: "writer", maxResults: "100" }
  });
  if (!ok || !json?.items) return null;
  const match = (json.items as Array<{ id: string; summary?: string; deleted?: boolean }>).find(
    (c) => !c.deleted && c.summary === summary
  );
  return match ? match.id : null;
}

async function createCalendar(accessToken: string, summary: string): Promise<string> {
  const { ok, status, json } = await googleFetch(accessToken, "/calendars", {
    method: "POST",
    body: { summary, timeZone: "UTC" }
  });
  if (!ok || !json?.id) throw new Error(`Failed to create Google Calendar (${status})`);
  return json.id as string;
}

async function calendarExists(accessToken: string, calendarId: string): Promise<boolean> {
  const { ok } = await googleFetch(accessToken, `/calendars/${encodeURIComponent(calendarId)}`);
  return ok;
}

export async function ensureCourseCalendar(
  accessToken: string,
  userId: string,
  course: Pick<Course, "id" | "code" | "name" | "googleCalendarId">
): Promise<string> {
  if (course.googleCalendarId && (await calendarExists(accessToken, course.googleCalendarId))) {
    return course.googleCalendarId;
  }
  const summary = `SyllabiQ: ${course.code} ${course.name}`.trim();
  const existing = await findCalendarBySummary(accessToken, summary);
  const calendarId = existing ?? (await createCalendar(accessToken, summary));
  await prisma.course.update({ where: { id: course.id }, data: { googleCalendarId: calendarId } });
  return calendarId;
}

export async function ensureCombinedCalendar(accessToken: string, userId: string): Promise<string> {
  const state = await prisma.googleSyncState.findUnique({ where: { userId } });
  if (!state) throw new Error("Google Calendar is not connected for this user");
  if (state.combinedCalendarId && (await calendarExists(accessToken, state.combinedCalendarId))) {
    return state.combinedCalendarId;
  }
  const existing = await findCalendarBySummary(accessToken, "SyllabiQ");
  const calendarId = existing ?? (await createCalendar(accessToken, "SyllabiQ"));
  await prisma.googleSyncState.update({
    where: { userId },
    data: { combinedCalendarId: calendarId }
  });
  return calendarId;
}

export interface PushResult {
  pushed: number;
  skipped: number;
}

export async function pushTaskToCalendar(
  accessToken: string,
  calendarId: string,
  task: SyncTask,
  timeZone: string
): Promise<"created" | "updated" | "skipped"> {
  if (!task.dueDate) return "skipped";
  const event = taskToEvent(task, timeZone);

  if (task.googleEventId) {
    const { ok } = await googleFetch(
      accessToken,
      `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(task.googleEventId)}`,
      { method: "PATCH", body: event }
    );
    return ok ? "updated" : "skipped";
  }

  const { ok, json } = await googleFetch(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events`,
    { method: "POST", body: event }
  );
  if (ok && json?.id) {
    await prisma.task.update({ where: { id: task.id }, data: { googleEventId: json.id as string } });
    return "created";
  }
  return "skipped";
}

export async function deleteTaskEvent(
  accessToken: string,
  calendarId: string,
  task: Pick<Task, "id" | "googleEventId">
): Promise<void> {
  if (!task.googleEventId) return;
  await googleFetch(
    accessToken,
    `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(task.googleEventId)}`,
    { method: "DELETE" }
  ).catch(() => undefined);
  await prisma.task.update({ where: { id: task.id }, data: { googleEventId: null } }).catch(() => undefined);
}

interface PullResult {
  pulled: number;
  updatedTasks: number;
  clearedLinks: number;
  nextSyncToken: string | null;
}

export async function pullCalendarChanges(
  accessToken: string,
  calendarId: string,
  syncToken: string | null,
  userId: string,
  courseId: string | null
): Promise<PullResult> {
  const query: Record<string, string> = {
    singleEvents: "true",
    maxResults: "250",
    showDeleted: "true"
  };
  let token: string | null = syncToken;
  if (token) query.syncToken = token;

  let res = await googleFetch(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events`, { query });

  // Sync token expired or invalid: fall back to a full sync.
  if (!res.ok && res.status === 410) {
    token = null;
    delete query.syncToken;
    res = await googleFetch(accessToken, `/calendars/${encodeURIComponent(calendarId)}/events`, { query });
  }
  if (!res.ok) throw new Error(`Google Calendar pull failed (${res.status})`);

  const items = (res.json?.items ?? []) as GoogleCalendarEvent[];
  const nextSyncToken = (res.json?.nextSyncToken as string | undefined) ?? null;

  let pulled = 0;
  let updatedTasks = 0;
  let clearedLinks = 0;

  for (const item of items) {
    pulled++;
    const privateProps = item.extendedProperties?.private ?? {};
    const syllabiqTaskId = privateProps.syllabiqTaskId;

    let task: (Task & { course: Pick<Course, "id" | "code"> }) | null = null;
    if (syllabiqTaskId) {
      task = await prisma.task.findFirst({
        where: { id: syllabiqTaskId, course: { userId } },
        include: { course: { select: { id: true, code: true } } }
      });
    }
    if (!task && item.id) {
      task = await prisma.task.findFirst({
        where: { googleEventId: item.id, course: { userId } },
        include: { course: { select: { id: true, code: true } } }
      });
    }

    // Event deleted in Google: unlink the task, never delete the task itself.
    if (item.status === "cancelled") {
      if (task?.googleEventId) {
        await prisma.task.update({ where: { id: task.id }, data: { googleEventId: null } });
        clearedLinks++;
      }
      continue;
    }

    if (task) {
      if (isRemoteNewer(item.updated, task.updatedAt)) {
        const updates: Record<string, unknown> = {};
        if (item.summary) {
          const prefix = `[DUE] ${task.course.code}: `;
          updates.title = item.summary.startsWith(prefix)
            ? item.summary.slice(prefix.length)
            : item.summary;
        }
        const start = item.start?.dateTime || item.start?.date;
        if (start) {
          // Our events end at the due date; the event end maps back to dueDate.
          const end = item.end?.dateTime || item.end?.date;
          const dueDate = end ? new Date(end) : new Date(start);
          if (!Number.isNaN(dueDate.getTime())) updates.dueDate = dueDate;
        }
        if (Object.keys(updates).length > 0) {
          await prisma.task.update({ where: { id: task.id }, data: updates });
          updatedTasks++;
        }
      }
      continue;
    }

    // New event created directly in a SyllabiQ-managed calendar: adopt it as a task.
    // Only adopt events that look like ours to avoid importing unrelated entries.
    if (item.id && item.summary && (item.start?.dateTime || item.start?.date)) {
      const looksOurs =
        item.summary.startsWith("[DUE]") || Object.keys(privateProps).length > 0;
      if (!looksOurs) continue;
      const targetCourseId =
        (privateProps.syllabiqCourseId as string | undefined) || courseId;
      if (!targetCourseId) continue;
      const ownsCourse = await prisma.course.findFirst({
        where: { id: targetCourseId, userId },
        select: { id: true }
      });
      if (!ownsCourse) continue;
      const end = item.end?.dateTime || item.end?.date || item.start.dateTime || item.start.date;
      const dueDate = new Date(end as string);
      if (Number.isNaN(dueDate.getTime())) continue;
      await prisma.task.create({
        data: {
          courseId: targetCourseId,
          title: item.summary.replace(/^\[DUE\]\s*[^:]+:\s*/, ""),
          description: item.description ?? null,
          dueDate,
          googleEventId: item.id
        }
      }).catch(() => undefined);
      updatedTasks++;
    }
  }

  return { pulled, updatedTasks, clearedLinks, nextSyncToken };
}

export type CalendarMode = "per-course" | "combined";

export function resolveCalendarMode(mode: string | null | undefined): CalendarMode {
  return mode === "combined" ? "combined" : "per-course";
}

/**
 * Conflict policy for two-way sync: last-write-wins by updated timestamp.
 * Returns true when the remote Google event is newer than the local task
 * and its changes should be applied.
 */
export function isRemoteNewer(
  eventUpdated: string | undefined,
  taskUpdatedAt: Date | string
): boolean {
  if (!eventUpdated) return false;
  const remoteMs = new Date(eventUpdated).getTime();
  if (Number.isNaN(remoteMs)) return false;
  const localMs = new Date(taskUpdatedAt).getTime();
  return remoteMs > localMs;
}

export async function getUserTimezone(user: Pick<User, "timezone">): Promise<string> {
  return user.timezone || "America/New_York";
}

export interface FullSyncSummary {
  mode: CalendarMode;
  pushed: number;
  updated: number;
  pulled: number;
  adoptedTasks: number;
  clearedLinks: number;
  lastSyncedAt: string;
}

export async function runFullSync(userId: string): Promise<FullSyncSummary> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const state = await prisma.googleSyncState.findUnique({ where: { userId } });
  if (!state || !state.calendarSyncEnabled) throw new Error("Google Calendar is not connected");

  const accessToken = await getValidAccessToken(userId);
  const timeZone = await getUserTimezone(user);
  const mode = resolveCalendarMode(state.calendarMode);

  let pushed = 0;
  let updated = 0;
  let pulled = 0;
  let adoptedTasks = 0;
  let clearedLinks = 0;

  const lastSync = state.lastSyncedAt;

  if (mode === "combined") {
    const calendarId = await ensureCombinedCalendar(accessToken, userId);
    const tasks = await prisma.task.findMany({
      where: { course: { userId } },
      include: { course: { select: { id: true, code: true, name: true, googleCalendarId: true, calendarSyncToken: true } } }
    });
    for (const task of tasks) {
      const needsPush = !task.googleEventId || (lastSync && new Date(task.updatedAt) > lastSync);
      if (!needsPush) continue;
      const result = await pushTaskToCalendar(accessToken, calendarId, task as SyncTask, timeZone);
      if (result === "created") pushed++;
      else if (result === "updated") updated++;
    }
    const pull = await pullCalendarChanges(accessToken, calendarId, state.combinedCalendarSyncToken, userId, null);
    pulled += pull.pulled;
    adoptedTasks += pull.updatedTasks;
    clearedLinks += pull.clearedLinks;
    await prisma.googleSyncState.update({
      where: { userId },
      data: {
        combinedCalendarSyncToken: pull.nextSyncToken,
        lastSyncedAt: new Date()
      }
    });
  } else {
    const courses = await prisma.course.findMany({ where: { userId } });
    for (const course of courses) {
      const calendarId = await ensureCourseCalendar(accessToken, userId, course);
      const tasks = await prisma.task.findMany({
        where: { courseId: course.id },
        include: { course: { select: { id: true, code: true, name: true, googleCalendarId: true, calendarSyncToken: true } } }
      });
      for (const task of tasks) {
        if (!task.dueDate) continue;
        const needsPush = !task.googleEventId || (lastSync && new Date(task.updatedAt) > lastSync);
        if (!needsPush) continue;
        const result = await pushTaskToCalendar(accessToken, calendarId, task as SyncTask, timeZone);
        if (result === "created") pushed++;
        else if (result === "updated") updated++;
      }
      const pull = await pullCalendarChanges(accessToken, calendarId, course.calendarSyncToken, userId, course.id);
      pulled += pull.pulled;
      adoptedTasks += pull.updatedTasks;
      clearedLinks += pull.clearedLinks;
      await prisma.course.update({
        where: { id: course.id },
        data: { calendarSyncToken: pull.nextSyncToken }
      });
    }
    await prisma.googleSyncState.update({ where: { userId }, data: { lastSyncedAt: new Date() } });
  }

  const fresh = await prisma.googleSyncState.findUnique({ where: { userId } });
  return {
    mode,
    pushed,
    updated,
    pulled,
    adoptedTasks,
    clearedLinks,
    lastSyncedAt: (fresh?.lastSyncedAt ?? new Date()).toISOString()
  };
}

export interface ModeMigrationSummary {
  from: CalendarMode;
  to: CalendarMode;
  clearedEvents: number;
}

export async function migrateCalendarMode(userId: string, to: CalendarMode): Promise<ModeMigrationSummary> {
  const state = await prisma.googleSyncState.findUnique({ where: { userId } });
  if (!state) throw new Error("Google Calendar is not connected");
  const from = resolveCalendarMode(state.calendarMode);
  if (from === to) return { from, to, clearedEvents: 0 };

  const accessToken = await getValidAccessToken(userId);
  let clearedEvents = 0;

  // Clear SyllabiQ-managed events from the old calendars, then drop the links.
  const tasks = await prisma.task.findMany({
    where: { course: { userId }, googleEventId: { not: null } },
    include: { course: { select: { id: true, googleCalendarId: true } } }
  });

  if (from === "combined" && state.combinedCalendarId) {
    for (const task of tasks) {
      if (!task.googleEventId) continue;
      await deleteTaskEvent(accessToken, state.combinedCalendarId, task);
      clearedEvents++;
    }
    await prisma.googleSyncState.update({
      where: { userId },
      data: { combinedCalendarSyncToken: null }
    });
  } else {
    const courses = await prisma.course.findMany({ where: { userId } });
    const calendarByCourse = new Map<string, string | null>(
      courses.map((c: { id: string; googleCalendarId: string | null }) => [c.id, c.googleCalendarId])
    );
    for (const task of tasks) {
      const calendarId = calendarByCourse.get(task.courseId);
      if (!task.googleEventId || !calendarId) continue;
      await deleteTaskEvent(accessToken, calendarId, task);
      clearedEvents++;
    }
    await prisma.course.updateMany({ where: { userId }, data: { calendarSyncToken: null } });
  }

  await prisma.googleSyncState.update({
    where: { userId },
    data: { calendarMode: to, lastSyncedAt: null }
  });

  return { from, to, clearedEvents };
}
