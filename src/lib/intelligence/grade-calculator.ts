import { Course, TaskItem } from "../types";

export interface CourseGradeSummary {
  courseId: string;
  courseCode: string;
  courseName: string;
  currentGradePercentage: number | null; // e.g. 92.4
  letterGrade: string;
  completedWeight: number; // e.g. 45%
  remainingWeight: number; // e.g. 55%
  categoryBreakdown: Array<{
    category: string;
    weightPercentage: number;
    pointsEarned: number | null;
    pointsPossible: number | null;
  }>;
}

export function calculateCourseGrade(course: Course, tasks: TaskItem[]): CourseGradeSummary {
  const courseTasks = tasks.filter((t) => t.courseId === course.id);

  let totalWeightedScore = 0;
  let totalEvaluatedWeight = 0;

  const categoryBreakdown = course.weightCategories.map((cat) => {
    // Match tasks belonging to category (by title or category keyword)
    const matchingTasks = courseTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(cat.category.toLowerCase().split(" ")[0]) ||
        (t.type === "assignment" && cat.category.toLowerCase().includes("assignment")) ||
        (t.type === "exam" && cat.category.toLowerCase().includes("exam")) ||
        (t.type === "project" && cat.category.toLowerCase().includes("project"))
    );

    const gradedTasks = matchingTasks.filter((t) => t.gradeReceived !== null);
    let avgCategoryScore: number | null = null;

    if (gradedTasks.length > 0) {
      const sumEarned = gradedTasks.reduce((acc, t) => acc + (t.gradeReceived || 0), 0);
      const sumMax = gradedTasks.reduce((acc, t) => acc + (t.gradeMax || 100), 0);
      avgCategoryScore = (sumEarned / sumMax) * 100;

      totalWeightedScore += (avgCategoryScore * cat.percentage) / 100;
      totalEvaluatedWeight += cat.percentage;
    }

    return {
      category: cat.category,
      weightPercentage: cat.percentage,
      pointsEarned: avgCategoryScore ? Math.round(avgCategoryScore * 10) / 10 : null,
      pointsPossible: 100
    };
  });

  const currentGradePercentage =
    totalEvaluatedWeight > 0 ? Math.round((totalWeightedScore / totalEvaluatedWeight) * 1000) / 10 : null;

  const letterGrade = currentGradePercentage !== null ? getLetterGrade(currentGradePercentage) : "N/A";

  return {
    courseId: course.id,
    courseCode: course.code,
    courseName: course.name,
    currentGradePercentage,
    letterGrade,
    completedWeight: totalEvaluatedWeight,
    remainingWeight: Math.max(0, 100 - totalEvaluatedWeight),
    categoryBreakdown
  };
}

export function simulateTargetExamScore(
  currentPercentage: number,
  completedWeight: number,
  targetFinalGrade: number,
  examWeight: number
): { requiredScore: number; isPossible: boolean } {
  // target = (current * completed + score * examWeight) / (completed + examWeight)
  // score * examWeight = target * (completed + examWeight) - current * completed
  const neededTotal = targetFinalGrade * (completedWeight + examWeight) - currentPercentage * completedWeight;
  const requiredScore = Math.round((neededTotal / examWeight) * 10) / 10;

  return {
    requiredScore,
    isPossible: requiredScore <= 100 && requiredScore >= 0
  };
}

function getLetterGrade(pct: number): string {
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 60) return "D";
  return "F";
}
