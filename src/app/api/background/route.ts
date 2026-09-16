import { NextResponse } from "next/server";
import { getBackgroundConfig, saveBackgroundConfig } from "@/lib/storage";

export async function GET() {
  try {
    const config = getBackgroundConfig();
    return NextResponse.json({
      success: true,
      config
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const config = saveBackgroundConfig(body);
    return NextResponse.json({
      success: true,
      message: "Background configuration updated successfully.",
      config
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
