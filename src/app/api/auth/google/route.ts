import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Google sign-in is not configured for this deployment", configured: false },
      { status: 503 }
    );
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
  const state = randomBytes(24).toString("base64url");
  authUrl.searchParams.set("state", state);

  if (searchParams.get("format") === "json") {
    return NextResponse.json({ url: authUrl.toString(), configured: true });
  }

  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set("syllabiq_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/"
  });
  return response;
}
