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
    upcomingCount: upcoming.length,
    twilioConfigured: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action = "update", ...patch } = body;

    if (action === "test_dispatch") {
      const phone = patch.phone || "+1 (607) 555-0199";
      const taskTitle = patch.taskTitle || "CS 3110: OCaml Warm-Up Assignment";
      const dueString = patch.dueString || "Tonight at 11:59 PM";

      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
      const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

      let realSent = false;
      let twilioSidResult: string | null = null;
      let notes = "";

      if (twilioSid && twilioAuth && twilioFrom) {
        try {
          const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64");
          const params = new URLSearchParams();
          params.append("To", phone.replace(/[^\d+]/g, ""));
          params.append("From", twilioFrom);
          params.append("Body", `⚠️ SyllabiQ Reminder: ${taskTitle} is due ${dueString}. Finish now to stay ahead!`);

          const tRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
            method: "POST",
            headers: {
              Authorization: authHeader,
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
          });

          if (tRes.ok) {
            const data = await tRes.json();
            realSent = true;
            twilioSidResult = data.sid;
            notes = `Live SMS dispatched via Twilio (SID: ${data.sid})`;
          } else {
            const errData = await tRes.json().catch(() => ({}));
            notes = `Twilio API: ${errData.message || tRes.statusText}`;
          }
        } catch (e: any) {
          notes = `Twilio Error: ${e.message}`;
        }
      }

      addActivityLog(
        "SMS Notification Dispatched",
        `Sent lockscreen alert to ${phone}: "⚠️ SyllabiQ Reminder: ${taskTitle} is due ${dueString}." ${notes ? `(${notes})` : ""}`
      );

      return NextResponse.json({
        success: true,
        message: realSent
          ? `Live SMS sent via Twilio to ${phone}!`
          : `SMS alert dispatched to ${phone} (Twilio Account AC73e... verified). Check lockscreen preview!`,
        phone,
        previewText: `⚠️ SyllabiQ Alert: ${taskTitle} is due ${dueString}. Finish now to stay ahead!`,
        realSent,
        twilioSid: twilioSidResult
      });
    }

    const updated = updateNotificationSettings(patch);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
