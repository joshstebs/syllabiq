import { NextResponse } from "next/server";
import { getSubscription, addHomeworkUpload, getHomeworkUploads } from "@/lib/storage";

export async function GET() {
  const uploads = getHomeworkUploads();
  const sub = getSubscription();
  return NextResponse.json({ uploads, subscription: sub });
}

export async function POST(req: Request) {
  try {
    const sub = getSubscription();

    // Check quota for Free tier
    if (sub.tier === "FREE" && sub.homeworkUploadsCount >= sub.homeworkUploadsLimit) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message: "You've reached your free limit of 3 homework photo uploads this month. Upgrade to SyllabiQ Pro for unlimited photo uploads!",
          subscription: sub
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      courseId = "course-cs3110",
      courseCode = "CS 3110",
      title = "Problem Set Handout",
      dueDate,
      fileName = "homework_photo.jpg",
      extractedProblems = [
        {
          problemNumber: "Problem 1",
          prompt: "Write tail-recursive tree accumulator function in OCaml",
          subtasks: ["Draft base case", "Define helper accumulator", "Test on 10,000 node tree"]
        },
        {
          problemNumber: "Problem 2",
          prompt: "Prove red-black tree insertion height bounded by 2*log(n+1)",
          subtasks: ["Induction hypothesis", "Black-height balancing lemma", "Conclusion step"]
        }
      ]
    } = body;

    const result = addHomeworkUpload({
      courseId,
      courseCode,
      title,
      dueDate: dueDate || new Date(Date.now() + 3 * 86400000).toISOString(),
      fileName,
      extractedProblems
    });

    return NextResponse.json({
      success: true,
      upload: result.upload,
      subscription: result.subscription,
      message: `Extracted ${extractedProblems.length} problem sections and added to your schedule!`
    });
  } catch (err: any) {
    console.error("Homework upload error", err);
    return NextResponse.json({ error: err.message || "Failed to process homework photo" }, { status: 500 });
  }
}
