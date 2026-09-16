import { NextResponse } from "next/server";
import { GoogleSheetsService } from "@/lib/google/sheets-sync";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await GoogleSheetsService.handleIncomingSheetUpdate(body);

    if (!result.success) {
      return NextResponse.json({ error: "Task not found in Master Tracker" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedTask: result.task });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
