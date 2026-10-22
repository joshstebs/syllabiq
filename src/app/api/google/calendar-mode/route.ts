import { NextResponse } from "next/server";
import { getCurrentUser, isDatabaseConfigured } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { migrateCalendarMode, runFullSync, resolveCalendarMode } from "@/lib/server/google-calendar";

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Account persistence is not configured" }, { status: 503 });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to manage Google Calendar" }, { status: 401 });

  let mode: string | undefined;
  try {
    const body = await req.json();
    mode = body?.mode;
  } catch {
    mode = undefined;
  }
  if (mode !== "per-course" && mode !== "combined") {
    return NextResponse.json({ error: 'mode must be "per-course" or "combined"' }, { status: 400 });
  }

  const state = await prisma.googleSyncState.findUnique({ where: { userId: user.id } });
  if (!state) {
    return NextResponse.json(
      { error: "Google Calendar is not connected. Connect your Google account first." },
      { status: 409 }
    );
  }

  try {
    const migration = await migrateCalendarMode(user.id, mode);
    // Repopulate the new calendar set with a full sync.
    const summary = await runFullSync(user.id);
    return NextResponse.json({
      ok: true,
      calendarMode: resolveCalendarMode(mode),
      clearedEvents: migration.clearedEvents,
      ...summary
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Calendar mode change failed";
    console.error("Google Calendar mode change failed");
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
