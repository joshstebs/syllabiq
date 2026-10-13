import { NextResponse } from "next/server";
import { getCurrentUser, isDatabaseConfigured } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { createCalendarExport } from "@/lib/calendar-export";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Account services are not configured" }, { status: 503 });
    }
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Sign in to export your deadlines" }, { status: 401 });

    const tasks = await prisma.task.findMany({
      where: { course: { userId: user.id } },
      select: { id: true, title: true, dueDate: true, course: { select: { code: true } } },
      orderBy: { dueDate: "asc" }
    });
    return new Response(createCalendarExport(tasks), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="syllabiq-deadlines.ics"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("Calendar export failed", error);
    return NextResponse.json({ error: "Calendar export is unavailable. Please try again." }, { status: 500 });
  }
}
