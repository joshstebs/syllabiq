import { NextResponse } from "next/server";
import { getNotificationSettings, updateNotificationSettings, addActivityLog, getStore } from "@/lib/storage";

export async function GET() {
  const settings = getNotificationSettings();
  const store = getStore();

  // Find most urgent uncompleted task
  const now = Date.now();
  const upcoming = store.tasks
    .filter((t) => t.status !== "DONE" && new Date(t.dueDate).getTime() >= now - 3600000)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const mostUrgent = upcoming[0] || null;

  return NextResponse.json({
    settings,
    mostUrgent,
    upcomingCount: upcoming.length
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action = "update", ...patch } = body;

    if (action === "test_dispatch") {
      const phone = patch.phone || "+1 (607) 555-0199";
      const taskTitle = patch.taskTitle || "CS 3110: OCaml Warmup Assignment";
      const dueString = patch.dueString || "Tonight at 11:59 PM";

      addActivityLog(
        "SMS Notification Dispatched",
        `Sent lockscreen alert to ${phone}: "⚠️ SyllabiQ Reminder: ${taskTitle} is due ${dueString}."`
      );

      return NextResponse.json({
        success: true,
        message: `Simulated SMS alert sent to ${phone}! Check your lockscreen.`,
        phone,
        previewText: `⚠️ SyllabiQ Alert: ${taskTitle} is due ${dueString}. Finish now to stay ahead!`
      });
    }

    const updated = updateNotificationSettings(patch);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
