import { NextResponse } from "next/server";
import { getSharedNotes, addSharedNote, toggleUpvoteSharedNote, getStore } from "@/lib/storage";

const SUPPORTED_UNIVERSITIES = [
  "Cornell University",
  "New York University (NYU)",
  "UMass Amherst",
  "University of California, Los Angeles (UCLA)",
  "UC Berkeley",
  "University of Texas at Austin",
  "University of Michigan",
  "MIT",
  "Harvard University",
  "Stanford University"
];

const MOCK_CLASSMATES = [
  {
    id: "peer-1",
    name: "Maya L.",
    university: "Cornell University",
    avatar: "👩‍💻",
    photoUrl: "/images/avatar-maya.jpg",
    major: "Computer Science",
    courses: ["CS 3110", "MATH 2210"]
  },
  {
    id: "peer-2",
    name: "Devon K.",
    university: "Cornell University",
    avatar: "🧑‍💼",
    photoUrl: "/images/avatar-david.jpg",
    major: "Economics & Finance",
    courses: ["ECON 1010", "CS 3110"]
  },
  {
    id: "peer-3",
    name: "Sarah W.",
    university: "Cornell University",
    avatar: "👩‍🔬",
    photoUrl: "/images/avatar-elena.jpg",
    major: "Biological Sciences",
    courses: ["BIO 1500", "CHEM 2070"]
  },
  {
    id: "peer-4",
    name: "Vance B.",
    university: "UMass Amherst",
    avatar: "🧑‍🎓",
    photoUrl: "/images/avatar-marcus.jpg",
    major: "Sport Management",
    courses: ["ECON 1010", "STAT 240"]
  },
  {
    id: "peer-5",
    name: "Alex S.",
    university: "Cornell University",
    avatar: "🎒",
    photoUrl: "/images/student-studying.jpg",
    major: "Pre-Med & Chemistry",
    courses: ["CHEM 2070", "BIO 1500"]
  }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId") || undefined;
  const university = searchParams.get("university") || "Cornell University";

  const notes = getSharedNotes(courseId);
  const store = getStore();

  const filteredClassmates = MOCK_CLASSMATES.filter((c) =>
    university === "ALL" ? true : c.university === university
  );

  return NextResponse.json({
    universities: SUPPORTED_UNIVERSITIES,
    selectedUniversity: university,
    classmates: filteredClassmates,
    notes,
    courses: store.courses
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action = "create_note", noteId, ...noteData } = body;

    if (action === "upvote") {
      const updated = toggleUpvoteSharedNote(noteId);
      return NextResponse.json({ success: true, note: updated });
    }

    const newNote = addSharedNote({
      courseId: noteData.courseId || "course-cs3110",
      courseCode: noteData.courseCode || "CS 3110",
      title: noteData.title || "Homework Study Note",
      type: noteData.type || "homework_hints",
      authorName: noteData.authorName || "Alex Student (You)",
      authorUniversity: noteData.authorUniversity || "Cornell University",
      content: noteData.content || "Helpful problem hints and lecture takeaways.",
      tags: noteData.tags || ["Homework", "Study"]
    });

    return NextResponse.json({ success: true, note: newNote });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
