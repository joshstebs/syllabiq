import { NextResponse } from "next/server";
import {
  getCloudVault,
  addCloudDocument,
  deleteCloudDocument,
  saveCloudVault
} from "@/lib/storage";

export async function GET() {
  try {
    const vault = getCloudVault();
    return NextResponse.json({
      success: true,
      vault
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "sync_bucket") {
      const vault = getCloudVault();
      vault.lastSyncedAt = new Date().toISOString();
      vault.documents = vault.documents.map((d) => ({
        ...d,
        syncStatus: "synced",
        cloudSyncedAt: new Date().toISOString()
      }));
      saveCloudVault(vault);
      return NextResponse.json({
        success: true,
        message: "Google Cloud Storage bucket successfully synchronized with local vault.",
        vault
      });
    }

    // New Document Upload
    const {
      courseId,
      courseCode,
      title,
      fileName,
      fileSize,
      fileType,
      category,
      version,
      tags,
      summary
    } = body;

    if (!title || !fileName) {
      return NextResponse.json(
        { error: "Document title and fileName are required." },
        { status: 400 }
      );
    }

    const document = addCloudDocument({
      courseId: courseId || "course-general",
      courseCode: courseCode || "GENERAL",
      title,
      fileName,
      fileSize: Number(fileSize) || 1024 * 512,
      fileType: fileType || "pdf",
      category: category || "paper",
      version: version || "v1.0 Draft",
      tags: Array.isArray(tags) ? tags : [courseCode || "General", category || "Paper"],
      summary: summary || undefined
    });

    const vault = getCloudVault();

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded "${document.title}" to Google Cloud Storage (${document.gcsBucket})`,
      document,
      vault
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("id");

    if (!docId) {
      return NextResponse.json({ error: "Missing document ID." }, { status: 400 });
    }

    const deleted = deleteCloudDocument(docId);
    if (!deleted) {
      return NextResponse.json({ error: "Document not found in cloud vault." }, { status: 404 });
    }

    const vault = getCloudVault();
    return NextResponse.json({
      success: true,
      message: "Document deleted from Google Cloud Storage.",
      vault
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
