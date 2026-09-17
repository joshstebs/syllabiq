import { randomUUID } from "node:crypto";
import type { Course as PrismaCourse, Task as PrismaTask } from "@prisma/client";
import { prisma } from "./prisma";
import { getStore } from "@/lib/storage";
import type { Course, TaskItem, TaskStatus, TaskType } from "@/lib/types";

type CourseWithRelations = PrismaCourse & {
  instructor: { name: string; email: string | null; officeHours: string | null; officeLocation: string | null } | null;
  weightCategories: Array<{ id: string; category: string; percentage: number }>;
  tasks: Array<PrismaTask & { subtasks: Array<{ id: string; title: string; scheduledDate: Date | null; isCompleted: boolean; orderIndex: number }> }>;
};

const prismaTaskType = (type: TaskType) => type.toUpperCase() as "ASSIGNMENT" | "QUIZ" | "EXAM" | "READING" | "PROJECT" | "MILESTONE" | "OTHER";

export async function ensureUserSeeded(userId: string): Promise<void> {
  const existing = await prisma.course.count({ where: { userId } });
  if (existing > 0) return;

  const demo = getStore();
  const courseIds = new Map<string, string>();
  for (const sourceCourse of demo.courses) {
    const courseId = randomUUID();
    courseIds.set(sourceCourse.id, courseId);
    await prisma.course.create({
      data: {
        id: courseId,
        userId,
        name: sourceCourse.name,
        code: sourceCourse.code,
        colorHex: sourceCourse.colorHex,
        term: sourceCourse.term,
        googleCalendarId: sourceCourse.googleCalendarId,
        instructor: sourceCourse.instructor ? { create: { name: sourceCourse.instructor.name, email: sourceCourse.instructor.email, officeHours: sourceCourse.instructor.office_hours, officeLocation: sourceCourse.instructor.office_location } } : undefined,
        weightCategories: { create: sourceCourse.weightCategories.map((category) => ({ category: category.category, percentage: category.percentage })) }
      }
    });
  }

  for (const sourceTask of demo.tasks) {
    const courseId = courseIds.get(sourceTask.courseId);
    if (!courseId) continue;
    await prisma.task.create({
      data: {
        courseId,
        title: sourceTask.title,
        description: sourceTask.description,
        type: prismaTaskType(sourceTask.type),
        dueDate: new Date(sourceTask.dueDate),
        estimatedHours: sourceTask.estimatedHours,
        weightPercent: sourceTask.weightPercent,
        status: sourceTask.status,
        gradeReceived: sourceTask.gradeReceived,
        gradeMax: sourceTask.gradeMax,
        googleEventId: sourceTask.googleEventId,
        googleBufferEventId: sourceTask.googleBufferEventId,
        lmsTaskId: sourceTask.lmsTaskId,
        lmsSource: sourceTask.lmsSource,
        subtasks: { create: (sourceTask.subtasks ?? []).map((subtask) => ({ title: subtask.title, scheduledDate: subtask.scheduledDate ? new Date(subtask.scheduledDate) : null, isCompleted: subtask.isCompleted, orderIndex: subtask.orderIndex })) }
      }
    });
  }
}

function mapCourse(course: CourseWithRelations): Course {
  return {
    id: course.id,
    name: course.name,
    code: course.code,
    colorHex: course.colorHex,
    term: course.term ?? "",
    googleCalendarId: course.googleCalendarId,
    instructor: { name: course.instructor?.name ?? "TBD", email: course.instructor?.email ?? "", office_hours: course.instructor?.officeHours ?? "", office_location: course.instructor?.officeLocation ?? "" },
    weightCategories: course.weightCategories.map((category) => ({ id: category.id, category: category.category, percentage: category.percentage }))
  };
}

function mapTask(task: CourseWithRelations["tasks"][number], course: CourseWithRelations): TaskItem {
  return {
    id: task.id,
    courseId: course.id,
    courseCode: course.code,
    courseName: course.name,
    courseColor: course.colorHex,
    title: task.title,
    type: task.type.toLowerCase() as TaskType,
    dueDate: task.dueDate.toISOString(),
    estimatedHours: task.estimatedHours ?? 2,
    weightPercent: task.weightPercent ?? 0,
    status: task.status as TaskStatus,
    gradeReceived: task.gradeReceived,
    gradeMax: task.gradeMax ?? 100,
    description: task.description ?? "",
    googleEventId: task.googleEventId,
    googleBufferEventId: task.googleBufferEventId,
    lmsTaskId: task.lmsTaskId,
    lmsSource: task.lmsSource,
    subtasks: task.subtasks.map((subtask) => ({ id: subtask.id, title: subtask.title, scheduledDate: subtask.scheduledDate?.toISOString() ?? null, isCompleted: subtask.isCompleted, orderIndex: subtask.orderIndex }))
  };
}

export async function getUserDashboard(userId: string) {
  await ensureUserSeeded(userId);
  const courses = (await prisma.course.findMany({ where: { userId }, include: { instructor: true, weightCategories: true, tasks: { include: { subtasks: true }, orderBy: { dueDate: "asc" } } }, orderBy: { code: "asc" } })) as CourseWithRelations[];
  return { courses: courses.map(mapCourse), tasks: courses.flatMap((course) => course.tasks.map((task) => mapTask(task, course))) };
}

export async function getUserTask(userId: string, taskId: string) {
  return prisma.task.findFirst({ where: { id: taskId, course: { userId } }, include: { course: true, subtasks: true } });
}
