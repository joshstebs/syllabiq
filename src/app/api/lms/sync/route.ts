import { NextResponse } from "next/server";
import { UniversalLMSSyncService } from "@/lib/lms/universal-sync";
import type { LMSProvider } from "@/lib/types";
import { getCurrentUser, isDatabaseConfigured } from "@/lib/server/auth";

const SUPPORTED_PROVIDERS = ["CANVAS", "BLACKBOARD", "BRIGHTSPACE", "MOODLE", "ICAL_FEED"] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const provider: LMSProvider = body.provider || "ICAL_FEED";
    const { rawIcs, feedUrl } = body;
    if (!SUPPORTED_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Unsupported LMS provider." }, { status: 400 });
    }
    if (provider !== "ICAL_FEED") {
      return NextResponse.json({ error: `${provider} live import is not enabled yet. Connect an institution-approved OAuth/API integration before syncing.` }, { status: 501 });
    }
    const user = await getCurrentUser();
    if (isDatabaseConfigured() && !user) {
      return NextResponse.json({ error: "Sign in before importing a calendar feed." }, { status: 401 });
    }
    let calendarText = typeof rawIcs === "string" ? rawIcs : "";
    if (!calendarText && typeof feedUrl === "string" && feedUrl.trim()) {
      let parsedUrl: URL;
      try { parsedUrl = new URL(feedUrl.trim()); } catch {
        return NextResponse.json({ error: "Enter a valid calendar feed URL." }, { status: 400 });
      }
      if (!["https:", "webcal:"].includes(parsedUrl.protocol)) {
        return NextResponse.json({ error: "Only HTTPS or WebCal feed URLs are supported." }, { status: 400 });
      }
      parsedUrl.protocol = parsedUrl.protocol === "webcal:" ? "https:" : parsedUrl.protocol;
      const response = await fetch(parsedUrl, { signal: AbortSignal.timeout(15000), cache: "no-store" });
      if (!response.ok) return NextResponse.json({ error: `Calendar feed returned HTTP ${response.status}.` }, { status: 502 });
      calendarText = await response.text();
    }
    if (!calendarText.includes("BEGIN:VCALENDAR")) {
      return NextResponse.json({ error: "Provide an iCalendar feed or a valid feed URL." }, { status: 400 });
    }
    if (isDatabaseConfigured()) {
      return NextResponse.json({ error: "The feed was fetched successfully, but durable per-account calendar import is not enabled in this deployment yet." }, { status: 503 });
    }
    const result = await UniversalLMSSyncService.syncICalContent(calendarText, provider);

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("LMS Sync Error", err);
    return NextResponse.json({ error: "The calendar feed could not be imported." }, { status: 500 });
  }
}
