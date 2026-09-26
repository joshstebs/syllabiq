import { NextResponse } from "next/server";
import { getStore, saveStore, addActivityLog } from "@/lib/storage";
import { ParsedSyllabus } from "@/lib/types";
import { GoogleCalendarSyncService } from "@/lib/google/calendar-sync";
import { getCurrentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

const COURSE_COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];

type PrismaTaskType = "ASSIGNMENT" | "QUIZ" | "EXAM" | "READING" | "PROJECT" | "MILESTONE" | "OTHER";

function toTaskType(t: unknown): PrismaTaskType {
  const u = String(t ?? "").toUpperCase();
  return (["ASSIGNMENT", "QUIZ", "EXAM", "READING", "PROJECT", "MILESTONE", "OTHER"] as const).includes(u as PrismaTaskType)
    ? (u as PrismaTaskType)
    : "ASSIGNMENT";
}

/**
 * Persist a committed syllabus to the signed-in user's own Postgres records
 * (course + instructor + weight categories + tasks + syllabus document).
 * The dashboard/courses/tasks read paths already serve per-user Prisma data,
 * so committed items now show up there instead of vanishing into the shared
 * demo store.
 */
async function commitForUser(userId: string, syllabus: ParsedSyllabus, fileName: string, body: any) {
  const code = String(syllabus.course_code || "COURSE 101").trim();

  let course = await prisma.course.findFirst({
    where: { userId, code: { equals: code, mode: "insensitive" } }
  });

  const instructorName = syllabus.instructor?.name?.trim() || "TBD";
  const weights = Array.isArray(syllabus.weight_distribution) ? syllabus.weight_distribution : [];

  if (!course) {
    const existingCount = await prisma.course.count({ where: { userId } });
    course = await prisma.course.create({
      data: {
        userId,
        name: syllabus.course_name || code,
        code,
        colorHex: COURSE_COLORS[existingCount % COURSE_COLORS.length],
        term: "Current Semester",
        googleCalendarId: `gcal_${code.toLowerCase().replace(/\s+/g, "_")}`,
        instructor: {
          create: {
            name: instructorName,
            email: syllabus.instructor?.email || "",
            officeHours: syllabus.instructor?.office_hours || "",
            officeLocation: (syllabus.instructor as any)?.office_location || ""
          }
        },
        weightCategories: {
          create: weights.map((w) => ({
            category: w.category || "General",
            percentage: Number(w.percentage) || 0
          }))
        }
      }
    });
  } else {
    // Capture the id once: `course` is a `let` narrowed by the branch, but
    // narrowing does not survive inside the arrow-function closures below.
    const courseId = course.id;
    await prisma.instructor.upsert({
      where: { courseId },
      update: {
        name: instructorName,
        email: syllabus.instructor?.email || "",
        officeHours: syllabus.instructor?.office_hours || "",
        officeLocation: (syllabus.instructor as any)?.office_location || ""
      },
      create: {
        courseId,
        name: instructorName,
        email: syllabus.instructor?.email || "",
        officeHours: syllabus.instructor?.office_hours || "",
        officeLocation: (syllabus.instructor as any)?.office_location || ""
      }
    });
    await prisma.weightCategory.deleteMany({ where: { courseId } });
    if (weights.length > 0) {
      await prisma.weightCategory.createMany({
        data: weights.map((w) => ({
          courseId,
          category: w.category || "General",
          percentage: Number(w.percentage) || 0
        }))
      });
    }
  }

  let itemsAdded = 0;
  let skipped = 0;
  for (const item of syllabus.items ?? []) {
    const due = new Date(item.due_date);
    if (Number.isNaN(due.getTime())) {
      skipped++;
      continue;
    }
    await prisma.task.create({
      data: {
        courseId: course.id,
        title: item.title || "Untitled item",
        type: toTaskType(item.type),
        dueDate: due,
        estimatedHours: item.type === "exam" ? 10 : item.type === "project" ? 8 : 3,
        weightPercent: Number(item.weight_percent) || 0,
        description: item.description || `Extracted syllabus item for ${course.code}`
      }
    });
    itemsAdded++;
  }

  await prisma.syllabusDocument.create({
    data: {
      courseId: course.id,
      fileName,
      fileSize: typeof body.fileSize === "number" ? body.fileSize : 0,
      mimeType: typeof body.mimeType === "string" ? body.mimeType : "application/pdf",
      storageUrl: typeof body.storageUrl === "string" ? body.storageUrl : null,
      parsedJson: JSON.parse(JSON.stringify(syllabus)),
      rawText: typeof body.rawText === "string" ? body.rawText : null
    }
  });

  return { courseId: course.id, courseCode: course.code, itemsAdded, skipped };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const syllabus: ParsedSyllabus = body.syllabus || body;
    const fileName = body.fileName || `${syllabus.course_code}_Syllabus.pdf`;

    const user = await getCurrentUser();

    // Signed-in users: persist to their own Postgres records. The dashboard
    // already reads per-user data, so committed syllabi show up there.
    // NOTE: per-user Google Calendar sync lives in /api/google/sync; the
    // store-based syncAllCourseCalendars() below only knows the demo store.
    if (user) {
      const result = await commitForUser(user.id, syllabus, fileName, body);
      return NextResponse.json({ success: true, ...result });
    }

    // Logged-out visitors: unchanged demo-store behavior.
    const store = getStore();

    // Check if course exists, or create it
    let course = store.courses.find(
      (c) => c.code.toLowerCase().replace(/\s+/g, "") === syllabus.course_code.toLowerCase().replace(/\s+/g, "")
    );

    const courseColors = ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];
    const randomColor = courseColors[store.courses.length % courseColors.length];

    if (!course) {
      course = {
        id: `course-${Date.now()}`,
        name: syllabus.course_name,
        code: syllabus.course_code,
        colorHex: randomColor,
        term: "Current Semester",
        googleCalendarId: `gcal_${syllabus.course_code.toLowerCase().replace(/\s+/g, "_")}`,
        instructor: syllabus.instructor,
        weightCategories: syllabus.weight_distribution,
        syllabusDoc: {
          fileName,
          fileSize: 345000,
          uploadedAt: new Date().toISOString()
        }
      };
      store.courses.push(course);
    } else {
      course.instructor = syllabus.instructor;
      course.weightCategories = syllabus.weight_distribution;
    }

    // Add extracted tasks
    let itemsAdded = 0;
    for (const item of syllabus.items) {
      const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      store.tasks.push({
        id: taskId,
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        courseColor: course.colorHex,
        title: item.title,
        type: item.type,
        dueDate: item.due_date,
        estimatedHours: item.type === "exam" ? 10 : item.type === "project" ? 8 : 3,
        weightPercent: item.weight_percent,
        status: "TODO",
        gradeReceived: null,
        gradeMax: 100,
        description: item.description || `Extracted syllabus item for ${course.code}`
      });
      itemsAdded++;
    }

    saveStore(store);

    // Auto-trigger Google Calendar & Sheets two-way sync
    await GoogleCalendarSyncService.syncAllCourseCalendars();

    addActivityLog(
      "Syllabus Committed & Synced",
      `Approved ${itemsAdded} items for ${course.code} (${course.name}). Color calendar & milestone buffers generated.`
    );

    return NextResponse.json({
      success: true,
      courseId: course.id,
      courseCode: course.code,
      itemsAdded
    });
  } catch (err: any) {
    console.error("Commit error", err);
    return NextResponse.json({ error: err.message || "Failed to commit syllabus" }, { status: 500 });
  }
}
