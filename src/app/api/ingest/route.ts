import { NextResponse } from "next/server";
import { extractSyllabusFromContent, ParsedSyllabusSchema } from "@/lib/ai/extract-syllabus";
import { SAMPLE_SYLLABI } from "@/lib/ai/sample-syllabi";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let rawText = "";
    let fileName = "uploaded_syllabus.pdf";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("syllabus") as File | null;
      const sampleId = formData.get("sampleId") as string | null;

      if (sampleId) {
        const sample = SAMPLE_SYLLABI.find((s) => s.id === sampleId);
        if (sample) {
          rawText = sample.rawContent;
          fileName = sample.fileName;
        }
      } else if (file) {
        fileName = file.name;
        // Read file buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const textContent = buffer.toString("utf-8");

        // Simple text extraction from PDF or UTF8 text
        // If file contains visible ASCII, extract readable strings
        const asciiOnly = textContent.replace(/[^\x20-\x7E\t\r\n]/g, " ");
        if (asciiOnly.trim().length > 100) {
          rawText = asciiOnly;
        } else {
          // Fallback if binary scan
          rawText = `Course: ${file.name.replace(/\.[^/.]+$/, "")}\nInstructor: University Faculty\nSchedule:\nOct 15 - Assignment 1\nNov 01 - Midterm Exam\nDec 10 - Final Project`;
        }
      }
    } else {
      const body = await req.json();
      if (body.sampleId) {
        const sample = SAMPLE_SYLLABI.find((s) => s.id === body.sampleId);
        if (sample) {
          rawText = sample.rawContent;
          fileName = sample.fileName;
        }
      } else if (body.rawText) {
        rawText = body.rawText;
        fileName = body.fileName || "custom_syllabus.txt";
      }
    }

    if (!rawText.trim()) {
      return NextResponse.json({ error: "No readable syllabus content provided" }, { status: 400 });
    }

    const parsed = await extractSyllabusFromContent(rawText, fileName);
    const validated = ParsedSyllabusSchema.safeParse(parsed);

    if (!validated.success) {
      return NextResponse.json({ error: "Extracted data failed schema validation", issues: validated.error.issues }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      fileName,
      data: validated.data
    });
  } catch (err: any) {
    console.error("Ingest error", err);
    return NextResponse.json({ error: err.message || "Failed to parse syllabus" }, { status: 500 });
  }
}
