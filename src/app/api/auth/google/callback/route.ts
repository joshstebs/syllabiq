import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error || "No authorization code provided")}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${origin}/?auth_error=${encodeURIComponent("Google sign-in is not configured for this deployment")}`
    );
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

    // Fetch user profile info
    let userEmail = "josh.stebs@gmail.com";
    let userName = "Josh Stebs (Google)";
    let userPicture = "";

    try {
      const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (userinfoRes.ok) {
        const info = await userinfoRes.json();
        userEmail = info.email || userEmail;
        userName = info.name || userName;
        userPicture = info.picture || "";
      }
    } catch (uErr) {
      console.warn("Failed to fetch Google userinfo:", uErr);
    }

    const redirectTarget = new URL(`${origin}/`);
    redirectTarget.searchParams.set("google_auth", "success");
    redirectTarget.searchParams.set("email", userEmail);
    redirectTarget.searchParams.set("name", userName);
    if (userPicture) redirectTarget.searchParams.set("picture", userPicture);

    const res = NextResponse.redirect(redirectTarget.toString());
    // Store access token in cookie for Google Calendar and Drive API requests
    res.cookies.set("google_access_token", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/"
    });

    return res;
  } catch (err: unknown) {
    console.error("Google OAuth callback exception:", err);
    const message = err instanceof Error ? err.message : "Internal auth error";
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(message)}`);
  }
}
