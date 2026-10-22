import { NextResponse } from "next/server";
import { getCurrentUser, isDatabaseConfigured } from "@/lib/server/auth";
import { revokeGoogleTokens } from "@/lib/server/google-tokens";

export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Account persistence is not configured" }, { status: 503 });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to manage Google Calendar" }, { status: 401 });

  // Revokes the grant at Google and deletes stored tokens. The user's Google
  // calendars are left in place; reconnecting re-links them.
  await revokeGoogleTokens(user.id);
  return NextResponse.json({ ok: true, connected: false });
}
