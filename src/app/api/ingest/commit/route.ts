import { NextResponse } from "next/server";
import { getStore, saveStore, addActivityLog } from "@/lib/storage";
import { ParsedSyllabus } from "@/lib/types";
import { GoogleCalendarSyncService } from "@/lib/google/calendar-sync";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const syllabus: ParsedSyllabus = body.syllabus || body;
    const fileName = body.fileName || `${syllabus.course_code}_Syllabus.pdf`;

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
