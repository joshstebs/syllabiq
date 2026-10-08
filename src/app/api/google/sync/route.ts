import { NextResponse } from "next/server";
import { GoogleSheetsService } from "@/lib/google/sheets-sync";

// This is a local planning preview. The current service only generates event
// payloads and placeholder spreadsheet IDs, without Google OAuth or API writes.
export async function GET() {
  const sheetData = GoogleSheetsService.getMasterTrackerSheetRows();
  return NextResponse.json({ preview: true, connectedToGoogle: false, sheetData });
}

export async function POST() {
  return NextResponse.json({
    error: "Google Calendar and Google Sheets synchronization is not yet connected. No Google account was updated or spreadsheet created.",
    preview: true,
    connectedToGoogle: false
  }, { status: 501 });
}
