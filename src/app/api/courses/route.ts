import { NextResponse } from "next/server";
import { getStore, saveStore, deleteCourse, updateCourseGroupChat } from "@/lib/storage";
import { getCurrentUser, isDatabaseConfigured } from "@/lib/server/auth";
import { getUserDashboard } from "@/lib/server/core-data";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (user) return NextResponse.json(await getUserDashboard(user.id));

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
    const user = await getCurrentUser();
    if (user) {
      const course = await prisma.course.create({
        data: {
          userId: user.id,
          name: typeof body.name === "string" ? body.name : "New Course",
          code: typeof body.code === "string" ? body.code : "COURSE 101",
          colorHex: typeof body.colorHex === "string" ? body.colorHex : "#6366F1",
          term: typeof body.term === "string" ? body.term : "Fall 2026",
          instructor: { create: { name: body.instructor?.name || "TBD", email: body.instructor?.email || "", officeHours: body.instructor?.office_hours || "" } },
          weightCategories: { create: Array.isArray(body.weightCategories) ? body.weightCategories.map((category: { category?: string; percentage?: number }) => ({ category: category.category || "General", percentage: Number(category.percentage) || 100 })) : [{ category: "General", percentage: 100 }] }
        }
      });
      return NextResponse.json({ success: true, course });
    }

    if (isDatabaseConfigured() || process.env.NODE_ENV === "production") return NextResponse.json({ error: "Account services are not configured" }, { status: 503 });
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { courseId, groupChat } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const updated = updateCourseGroupChat(courseId, groupChat);
    if (!updated) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course: updated,
      message: `Successfully linked ${groupChat.type} chat to ${updated.code}`
    });
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

    const user = await getCurrentUser();
    if (user) {
      const deleted = await prisma.course.deleteMany({ where: { id: courseId, userId: user.id } });
      if (!deleted.count) return NextResponse.json({ error: "Course not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Course and associated tasks successfully deleted." });
    }
    if (isDatabaseConfigured() || process.env.NODE_ENV === "production") return NextResponse.json({ error: "Account services are not configured" }, { status: 503 });

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

