import { NextResponse } from "next/server";
import { getCustomColors, updateCustomColors, getStore } from "@/lib/storage";

export async function GET() {
  const customColors = getCustomColors();
  const store = getStore();
  return NextResponse.json({
    customColors,
    courses: store.courses.map((c) => ({ id: c.id, code: c.code, name: c.name, colorHex: c.colorHex }))
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const updated = updateCustomColors(body);
    const store = getStore();
    return NextResponse.json({
      success: true,
      customColors: updated,
      courses: store.courses,
      tasks: store.tasks
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
