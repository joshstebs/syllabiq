import { NextResponse } from "next/server";
import { getStore, saveStore, addActivityLog, createTask, deleteTask } from "@/lib/storage";
import { TaskStatus, TaskType } from "@/lib/types";
import { TaskStatus as PrismaTaskStatus, TaskType as PrismaTaskType } from "@prisma/client";
import { getCurrentUser, isDatabaseConfigured } from "@/lib/server/auth";
import { getUserDashboard } from "@/lib/server/core-data";
import { prisma } from "@/lib/server/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (user) {
      const dashboard = await getUserDashboard(user.id);
      const { searchParams } = new URL(req.url);
      const courseId = searchParams.get("courseId");
      const status = searchParams.get("status");
      const tasks = dashboard.tasks.filter((task) => (!courseId || task.courseId === courseId) && (!status || task.status === status));
      return NextResponse.json({ success: true, tasks, total: tasks.length });
    }
    if (isDatabaseConfigured() || process.env.NODE_ENV === "production") return NextResponse.json({ error: "Account services are not configured" }, { status: 503 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");

    const store = getStore();
    let tasks = store.tasks;

    if (courseId) {
      tasks = tasks.filter((t) => t.courseId === courseId);
    }
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }

    return NextResponse.json({
      success: true,
      tasks,
      total: tasks.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getCurrentUser();
    if (user) {
      if (!body.taskId) {
        if (!body.title) return NextResponse.json({ error: "Task title is required" }, { status: 400 });
        const course = await prisma.course.findFirst({ where: { userId: user.id }, orderBy: { code: "asc" } });
        if (!course) return NextResponse.json({ error: "Create a course first" }, { status: 400 });
        const task = await prisma.task.create({
          data: {
            courseId: body.courseId || course.id,
            title: body.title,
            description: body.description || "",
            type: String(body.type || "ASSIGNMENT").toUpperCase() as PrismaTaskType,
            dueDate: new Date(body.dueDate || Date.now() + 3 * 86400000),
            estimatedHours: body.estimatedHours ? Number(body.estimatedHours) : 3,
            weightPercent: body.weightPercent ? Number(body.weightPercent) : 10,
            status: String(body.status || "TODO").toUpperCase() as PrismaTaskStatus
          }
        });
        return NextResponse.json({ success: true, task });
      }

      const task = await prisma.task.findFirst({ where: { id: body.taskId, course: { userId: user.id } } });
      if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
      const updated = await prisma.task.update({
        where: { id: task.id },
        data: {
          title: body.title ?? undefined,
          status: body.status ? String(body.status).toUpperCase() as PrismaTaskStatus : undefined,
          gradeReceived: body.gradeReceived === undefined ? undefined : body.gradeReceived === null ? null : Number(body.gradeReceived),
          dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
          weightPercent: body.weightPercent === undefined ? undefined : Number(body.weightPercent)
        }
      });
      return NextResponse.json({ success: true, task: updated });
    }
    if (isDatabaseConfigured() || process.env.NODE_ENV === "production") return NextResponse.json({ error: "Account services are not configured" }, { status: 503 });
    const store = getStore();

    // If no taskId, create a new task
    if (!body.taskId) {
      if (!body.title) {
        return NextResponse.json({ error: "Task title is required" }, { status: 400 });
      }

      const newTask = createTask({
        title: body.title,
        courseId: body.courseId || store.courses[0]?.id || "course-cs3110",
        type: (body.type as TaskType) || "assignment",
        dueDate: body.dueDate,
        estimatedHours: body.estimatedHours ? Number(body.estimatedHours) : 3,
        weightPercent: body.weightPercent ? Number(body.weightPercent) : 10,
        description: body.description || "",
        status: (body.status as TaskStatus) || "TODO"
      });

      return NextResponse.json({ success: true, task: newTask });
    }

    // Otherwise, update existing task
    const { taskId, status, gradeReceived, dueDate, subtaskId, toggleSubtask, title, weightPercent } = body;
    const task = store.tasks.find((t) => t.id === taskId);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (title) {
      task.title = title;
    }

    if (weightPercent !== undefined) {
      task.weightPercent = Number(weightPercent);
    }

    if (status) {
      task.status = status as TaskStatus;
      addActivityLog("Task Status Updated", `Marked "${task.title}" as ${task.status}`);
    }

    if (gradeReceived !== undefined) {
      task.gradeReceived = gradeReceived === null ? null : parseFloat(gradeReceived);
      addActivityLog("Grade Recorded", `Logged grade ${task.gradeReceived}% for "${task.title}"`);
    }

    if (dueDate) {
      task.dueDate = new Date(dueDate).toISOString();
      addActivityLog("Due Date Changed", `Rescheduled "${task.title}" to ${new Date(dueDate).toLocaleDateString()}`);
    }

    if (subtaskId && toggleSubtask && task.subtasks) {
      const sub = task.subtasks.find((s) => s.id === subtaskId);
      if (sub) {
        sub.isCompleted = !sub.isCompleted;
        addActivityLog("Subtask Updated", `${sub.isCompleted ? "Completed" : "Reopened"} milestone "${sub.title}"`);
      }
    }

    saveStore(store);
    return NextResponse.json({ success: true, task });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId parameter" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (user) {
      const deleted = await prisma.task.deleteMany({ where: { id: taskId, course: { userId: user.id } } });
      if (!deleted.count) return NextResponse.json({ error: "Task not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Task successfully deleted." });
    }
    if (isDatabaseConfigured()) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const deleted = deleteTask(taskId);
    if (!deleted) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Task successfully deleted."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
