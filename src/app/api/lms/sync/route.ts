import { NextResponse } from "next/server";
import { UniversalLMSSyncService } from "@/lib/lms/universal-sync";
import { LMSProvider } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const provider: LMSProvider = body.provider || "CANVAS";
    const { rawIcs, endpoint } = body;

    let result;
    if (rawIcs) {
      result = await UniversalLMSSyncService.syncICalContent(rawIcs, provider);
    } else {
      result = await UniversalLMSSyncService.syncRESTPlatform(provider, endpoint);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("LMS Sync Error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
