-- Google Calendar two-way sync: calendar mode toggle, combined calendar, incremental sync tokens
ALTER TABLE "google_sync_states" ADD COLUMN "calendarMode" TEXT NOT NULL DEFAULT 'per-course';
ALTER TABLE "google_sync_states" ADD COLUMN "combinedCalendarId" TEXT;
ALTER TABLE "google_sync_states" ADD COLUMN "combinedCalendarSyncToken" TEXT;

ALTER TABLE "courses" ADD COLUMN "calendarSyncToken" TEXT;
