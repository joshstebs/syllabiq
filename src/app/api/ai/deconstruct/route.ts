import { NextResponse } from "next/server";
import { getStore, saveStore, addActivityLog } from "@/lib/storage";
import { deconstructAcademicTask } from "@/lib/intelligence/task-deconstructor";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId } = body;

    const store = getStore();
    const task = store.tasks.find((t) => t.id === taskId);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const subtasks = deconstructAcademicTask(task.title, task.type, task.dueDate);
    task.subtasks = subtasks;

    saveStore(store);
    addActivityLog(
      "AI Task Deconstructed",
      `Generated ${subtasks.length} staged milestone blocks for "${task.title}".`
    );

    return NextResponse.json({ success: true, subtasks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
