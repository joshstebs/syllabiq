-- Initial SyllabiQ schema with server-backed sessions.
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE TYPE "TaskType" AS ENUM ('ASSIGNMENT', 'QUIZ', 'EXAM', 'READING', 'PROJECT', 'MILESTONE', 'OTHER');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE "LMSProvider" AS ENUM ('CANVAS', 'BLACKBOARD', 'BRIGHTSPACE', 'MOODLE', 'ICAL_FEED');
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');

CREATE TABLE "users" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT, "name" TEXT, "avatarUrl" TEXT, "role" "UserRole" NOT NULL DEFAULT 'STUDENT', "timezone" TEXT NOT NULL DEFAULT 'America/New_York', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "users_pkey" PRIMARY KEY ("id"));
CREATE TABLE "sessions" ("id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "sessions_pkey" PRIMARY KEY ("id"));
CREATE TABLE "courses" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "name" TEXT NOT NULL, "code" TEXT NOT NULL, "colorHex" TEXT NOT NULL DEFAULT '#6366F1', "term" TEXT, "googleCalendarId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "courses_pkey" PRIMARY KEY ("id"));
CREATE TABLE "instructors" ("id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT, "officeHours" TEXT, "officeLocation" TEXT, CONSTRAINT "instructors_pkey" PRIMARY KEY ("id"));
CREATE TABLE "weight_categories" ("id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "category" TEXT NOT NULL, "percentage" DOUBLE PRECISION NOT NULL, CONSTRAINT "weight_categories_pkey" PRIMARY KEY ("id"));
CREATE TABLE "tasks" ("id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "categoryId" TEXT, "title" TEXT NOT NULL, "description" TEXT, "type" "TaskType" NOT NULL DEFAULT 'ASSIGNMENT', "dueDate" TIMESTAMP(3) NOT NULL, "estimatedHours" DOUBLE PRECISION DEFAULT 2.0, "weightPercent" DOUBLE PRECISION DEFAULT 0.0, "status" "TaskStatus" NOT NULL DEFAULT 'TODO', "gradeReceived" DOUBLE PRECISION, "gradeMax" DOUBLE PRECISION DEFAULT 100.0, "googleEventId" TEXT, "googleBufferEventId" TEXT, "lmsTaskId" TEXT, "lmsSource" "LMSProvider", "sheetsRowIndex" INTEGER, "normalizedHash" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "tasks_pkey" PRIMARY KEY ("id"));
CREATE TABLE "subtasks" ("id" TEXT NOT NULL, "taskId" TEXT NOT NULL, "title" TEXT NOT NULL, "scheduledDate" TIMESTAMP(3), "isCompleted" BOOLEAN NOT NULL DEFAULT false, "orderIndex" INTEGER NOT NULL DEFAULT 0, CONSTRAINT "subtasks_pkey" PRIMARY KEY ("id"));
CREATE TABLE "syllabus_documents" ("id" TEXT NOT NULL, "courseId" TEXT NOT NULL, "fileName" TEXT NOT NULL, "fileSize" INTEGER NOT NULL, "mimeType" TEXT NOT NULL, "storageUrl" TEXT NOT NULL, "parsedJson" JSONB, "rawText" TEXT, "embedding" vector(1536), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "syllabus_documents_pkey" PRIMARY KEY ("id"));
CREATE TABLE "lms_connections" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "provider" "LMSProvider" NOT NULL, "apiEndpoint" TEXT, "accessToken" TEXT, "feedUrl" TEXT, "lastSyncedAt" TIMESTAMP(3), "syncFrequencyMinutes" INTEGER NOT NULL DEFAULT 360, "isActive" BOOLEAN NOT NULL DEFAULT true, CONSTRAINT "lms_connections_pkey" PRIMARY KEY ("id"));
CREATE TABLE "google_sync_states" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "accessToken" TEXT NOT NULL, "refreshToken" TEXT NOT NULL, "tokenExpiry" TIMESTAMP(3) NOT NULL, "spreadsheetId" TEXT, "spreadsheetUrl" TEXT, "sheetsSyncEnabled" BOOLEAN NOT NULL DEFAULT true, "calendarSyncEnabled" BOOLEAN NOT NULL DEFAULT true, "lastSyncedAt" TIMESTAMP(3), CONSTRAINT "google_sync_states_pkey" PRIMARY KEY ("id"));
CREATE TABLE "dispatch_profiles" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "enabled" BOOLEAN NOT NULL DEFAULT true, "deliveryHour" INTEGER NOT NULL DEFAULT 7, "channel" TEXT NOT NULL DEFAULT 'push', "webhookUrl" TEXT, "phoneNumber" TEXT, "includeWeather" BOOLEAN NOT NULL DEFAULT true, "commuteOrigin" TEXT, CONSTRAINT "dispatch_profiles_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");
CREATE UNIQUE INDEX "courses_userId_code_key" ON "courses"("userId", "code");
CREATE UNIQUE INDEX "instructors_courseId_key" ON "instructors"("courseId");
CREATE INDEX "tasks_courseId_dueDate_idx" ON "tasks"("courseId", "dueDate");
CREATE INDEX "tasks_googleEventId_idx" ON "tasks"("googleEventId");
CREATE INDEX "tasks_lmsTaskId_idx" ON "tasks"("lmsTaskId");
CREATE INDEX "tasks_normalizedHash_idx" ON "tasks"("normalizedHash");
CREATE UNIQUE INDEX "google_sync_states_userId_key" ON "google_sync_states"("userId");
CREATE UNIQUE INDEX "dispatch_profiles_userId_key" ON "dispatch_profiles"("userId");
CREATE UNIQUE INDEX "lms_connections_userId_provider_key" ON "lms_connections"("userId", "provider");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "weight_categories" ADD CONSTRAINT "weight_categories_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "weight_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "subtasks" ADD CONSTRAINT "subtasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "syllabus_documents" ADD CONSTRAINT "syllabus_documents_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lms_connections" ADD CONSTRAINT "lms_connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "google_sync_states" ADD CONSTRAINT "google_sync_states_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dispatch_profiles" ADD CONSTRAINT "dispatch_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
