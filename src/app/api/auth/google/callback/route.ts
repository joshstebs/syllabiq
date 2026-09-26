import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession, isDatabaseConfigured } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const returnedState = searchParams.get("state");
  const expectedState = (await cookies()).get("syllabiq_oauth_state")?.value;

  if (error || !code) {
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error || "No authorization code provided")}`);
  }
  if (!returnedState || !expectedState || returnedState !== expectedState) {
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent("Invalid OAuth state")}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${origin}/?auth_error=${encodeURIComponent("Google sign-in is not configured for this deployment")}`
    );
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent("Account persistence is not configured")}`);
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      }).toString()
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Google token exchange error:", errText);
      return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent("Token exchange failed")}`);
    }

    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;

    // Fetch user profile info. Fail closed: if the userinfo fetch fails,
    // nobody gets a session — never fall back to a default identity.
    let userinfoRes: Response;
    try {
      userinfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    } catch (uErr) {
      console.error("Failed to fetch Google userinfo:", uErr);
      return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent("Could not retrieve your Google profile")}`);
    }
    if (!userinfoRes.ok) {
      console.error("Google userinfo request failed with status:", userinfoRes.status);
      return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent("Could not retrieve your Google profile")}`);
    }

    const info = (await userinfoRes.json()) as { email?: unknown; name?: unknown; picture?: unknown };
    const userEmail = typeof info.email === "string" ? info.email : "";
    if (!userEmail) {
      return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent("Your Google profile did not include an email address")}`);
    }
    const userName = typeof info.name === "string" && info.name ? info.name : userEmail.split("@")[0];
    const userPicture = typeof info.picture === "string" ? info.picture : "";

    const user = await prisma.user.upsert({
      where: { email: userEmail.toLowerCase() },
      update: { name: userName, avatarUrl: userPicture || undefined },
      create: { email: userEmail.toLowerCase(), name: userName, avatarUrl: userPicture || undefined }
    });
    await createSession(user.id);
    const response = NextResponse.redirect(`${origin}/`);
    response.cookies.delete("syllabiq_oauth_state");
    return response;
  } catch (err: unknown) {
    console.error("Google OAuth callback exception:", err);
    const message = err instanceof Error ? err.message : "Internal auth error";
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(message)}`);
  }
}
