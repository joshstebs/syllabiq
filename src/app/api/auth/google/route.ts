import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google Client ID is not configured" }, { status: 500 });
  }

  const { searchParams, origin } = new URL(req.url);
  const redirectUri = `${origin}/api/auth/google/callback`;

  const scope = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/drive.file"
  ].join(" ");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", "syllabiq_oauth_state");

  if (searchParams.get("format") === "json") {
    return NextResponse.json({ url: authUrl.toString(), configured: true });
  }

  return NextResponse.redirect(authUrl.toString());
}
