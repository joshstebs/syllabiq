import { TaskItem } from "../types";

export interface WeekLoad {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalWeightPercent: number;
  totalEstHours: number;
  tasks: TaskItem[];
  isCrunchWeek: boolean; // >25% weight or >20 hours
  recommendation?: string;
}

export interface SemesterCrunchAnalysis {
  weeks: WeekLoad[];
  overallDensityScore: number; // 0 to 100
  totalCrunchWeeks: number;
  highestRiskWeek: WeekLoad | null;
  shiftRecommendations: string[];
}

export function analyzeWorkloadCrunch(tasks: TaskItem[]): SemesterCrunchAnalysis {
  if (tasks.length === 0) {
    return {
      weeks: [],
      overallDensityScore: 0,
      totalCrunchWeeks: 0,
      highestRiskWeek: null,
      shiftRecommendations: []
    };
  }

  // Find semester date bounds
  const timestamps = tasks.map((t) => new Date(t.dueDate).getTime()).sort((a, b) => a - b);
  const earliest = new Date(timestamps[0]);
  const latest = new Date(timestamps[timestamps.length - 1]);

  // Group into 7-day buckets
  const weeks: WeekLoad[] = [];
  const currentWeekStart = new Date(earliest);
  currentWeekStart.setHours(0, 0, 0, 0);

  let weekNum = 1;
  while (currentWeekStart.getTime() <= latest.getTime() + 7 * 24 * 3600 * 1000) {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    const weekTasks = tasks.filter((t) => {
      const taskTime = new Date(t.dueDate).getTime();
      return taskTime >= currentWeekStart.getTime() && taskTime <= weekEnd.getTime();
    });

    const totalWeight = weekTasks.reduce((acc, t) => acc + (t.weightPercent || 0), 0);
    const totalHours = weekTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
    const isCrunch = totalWeight >= 25 || totalHours >= 20;

    let rec: string | undefined;
    if (isCrunch) {
      const heavyTask = weekTasks.sort((a, b) => (b.weightPercent || 0) - (a.weightPercent || 0))[0];
      rec = `High risk crunch: ${totalWeight.toFixed(0)}% of semester grade due. Shift prep for "${heavyTask?.title}" 5 days earlier.`;
    }

    weeks.push({
      weekNumber: weekNum,
      startDate: currentWeekStart.toISOString(),
      endDate: weekEnd.toISOString(),
      totalWeightPercent: Math.round(totalWeight * 10) / 10,
      totalEstHours: Math.round(totalHours * 10) / 10,
      tasks: weekTasks,
      isCrunchWeek: isCrunch,
      recommendation: rec
    });

    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekNum++;
    if (weekNum > 16) break; // Max 16-week semester
  }

  const crunchWeeks = weeks.filter((w) => w.isCrunchWeek);
  const highestRisk = [...weeks].sort((a, b) => b.totalWeightPercent - a.totalWeightPercent)[0] || null;

  const shiftRecommendations: string[] = [];
  if (crunchWeeks.length > 0) {
    shiftRecommendations.push(
      `Detected ${crunchWeeks.length} bottleneck crunch weeks where >25% of final grades are due simultaneously.`
    );
    crunchWeeks.forEach((cw) => {
      shiftRecommendations.push(
        `Week ${cw.weekNumber} (${cw.totalWeightPercent}% weight): Proactively start exam revision & milestone drafts 4-7 days ahead of calendar deadlines.`
      );
    });
  } else {
    shiftRecommendations.push("Semester schedule is evenly balanced. No excessive crunch clusters detected.");
  }

  const overallDensityScore = Math.min(
    100,
    Math.round(
      weeks.reduce((acc, w) => acc + (w.isCrunchWeek ? 25 : 5), 0) / Math.max(1, weeks.length) * 3
    )
  );

  return {
    weeks,
    overallDensityScore,
    totalCrunchWeeks: crunchWeeks.length,
    highestRiskWeek: highestRisk,
    shiftRecommendations
  };
}
