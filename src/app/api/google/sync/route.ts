import { NextResponse } from "next/server";
import { getCurrentUser, isDatabaseConfigured } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { runFullSync, resolveCalendarMode } from "@/lib/server/google-calendar";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ connected: false, reason: "database_not_configured" });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ connected: false, reason: "not_signed_in" }, { status: 401 });

  const state = await prisma.googleSyncState.findUnique({ where: { userId: user.id } });
  if (!state) {
    return NextResponse.json({ connected: false, calendarSyncEnabled: false });
  }

  return NextResponse.json({
    connected: true,
    calendarSyncEnabled: state.calendarSyncEnabled,
    calendarMode: resolveCalendarMode(state.calendarMode),
    lastSyncedAt: state.lastSyncedAt ? state.lastSyncedAt.toISOString() : null
  });
}

export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Account persistence is not configured" }, { status: 503 });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to sync with Google Calendar" }, { status: 401 });

  const state = await prisma.googleSyncState.findUnique({ where: { userId: user.id } });
  if (!state) {
    return NextResponse.json(
      { error: "Google Calendar is not connected. Connect your Google account first." },
      { status: 409 }
    );
  }

  try {
    const summary = await runFullSync(user.id);
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    console.error("Google Calendar sync failed");
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
