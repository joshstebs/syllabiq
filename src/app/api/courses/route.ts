import { NextResponse } from "next/server";
import { getStore, saveStore, deleteCourse } from "@/lib/storage";

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    courses: store.courses,
    tasks: store.tasks,
    googleSync: store.googleSync,
    lmsConnections: store.lmsConnections,
    activityLogs: store.activityLogs
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const store = getStore();

    const newCourse = {
      id: `course-${Date.now()}`,
      name: body.name || "New Course",
      code: body.code || "COURSE 101",
      colorHex: body.colorHex || "#6366F1",
      term: body.term || "Fall 2026",
      instructor: body.instructor || { name: "TBD", email: "", office_hours: "" },
      weightCategories: body.weightCategories || [{ category: "General", percentage: 100 }]
    };

    store.courses.push(newCourse);
    saveStore(store);

    return NextResponse.json({ success: true, course: newCourse });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("id");

    if (!courseId) {
      return NextResponse.json({ error: "Missing course id parameter" }, { status: 400 });
    }

    const deleted = deleteCourse(courseId);
    if (!deleted) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Course and associated tasks successfully deleted."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
