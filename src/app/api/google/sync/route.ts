import { NextResponse } from "next/server";
import { GoogleSheetsService } from "@/lib/google/sheets-sync";
import { GoogleCalendarSyncService } from "@/lib/google/calendar-sync";

export async function GET() {
  const sheetData = GoogleSheetsService.getMasterTrackerSheetRows();
  return NextResponse.json({ success: true, sheetData });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || "sync_all";

    if (action === "provision_sheet") {
      const res = await GoogleSheetsService.provisionSpreadsheet();
      return NextResponse.json({ success: true, ...res });
    }

    // Sync all Google Calendars with smart milestones
    const calResult = await GoogleCalendarSyncService.syncAllCourseCalendars();
    const sheetData = GoogleSheetsService.getMasterTrackerSheetRows();

    return NextResponse.json({
      success: true,
      calendar: calResult,
      sheet: sheetData
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
