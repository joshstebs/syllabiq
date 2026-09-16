import { SubTaskItem } from "../types";

export interface DeconstructedMilestone {
  title: string;
  daysBeforeDeadline: number;
  estHours: number;
  focus: string;
}

export function deconstructAcademicTask(
  taskTitle: string,
  taskType: string,
  dueDate: string
): SubTaskItem[] {
  const deadline = new Date(dueDate);
  const lower = taskTitle.toLowerCase();
  let templates: DeconstructedMilestone[] = [];

  if (lower.includes("paper") || lower.includes("essay") || taskType === "project") {
    templates = [
      { title: "Topic Exploration & Research Question Definition", daysBeforeDeadline: 14, estHours: 2.0, focus: "Scope" },
      { title: "Literature Search & 5 Peer-Reviewed Citations", daysBeforeDeadline: 10, estHours: 3.5, focus: "Sources" },
      { title: "Detailed Thesis Statement & Structural Outline", daysBeforeDeadline: 7, estHours: 2.0, focus: "Structure" },
      { title: "First Complete Rough Draft (Introduction & Body)", daysBeforeDeadline: 4, estHours: 5.0, focus: "Drafting" },
      { title: "Proofreading, Citation Formatting & Bibliography", daysBeforeDeadline: 1, estHours: 2.0, focus: "Polish" }
    ];
  } else if (taskType === "exam" || lower.includes("midterm") || lower.includes("final")) {
    templates = [
      { title: "Compile Lecture Notes & Identify Knowledge Gaps", daysBeforeDeadline: 7, estHours: 2.5, focus: "Review" },
      { title: "Create Condensed Formula / Concept Cheat Sheet", daysBeforeDeadline: 5, estHours: 3.0, focus: "Synthesis" },
      { title: "Complete 2 Timed Past Practice Exams", daysBeforeDeadline: 3, estHours: 4.0, focus: "Simulation" },
      { title: "Review Missed Practice Problems & Weak Spots", daysBeforeDeadline: 1, estHours: 2.5, focus: "Final Prep" }
    ];
  } else {
    // Standard Assignment
    templates = [
      { title: "Read Prompt & Clarify Ambiguities with TA", daysBeforeDeadline: 4, estHours: 1.0, focus: "Requirements" },
      { title: "Core Implementation / Draft Solutions", daysBeforeDeadline: 2, estHours: 3.0, focus: "Execution" },
      { title: "Edge Case Testing & Final Submission Check", daysBeforeDeadline: 0, estHours: 1.0, focus: "Verification" }
    ];
  }

  return templates.map((tmpl, idx) => {
    const scheduled = new Date(deadline.getTime() - tmpl.daysBeforeDeadline * 24 * 3600 * 1000);
    return {
      id: `subtask-${Date.now()}-${idx}`,
      title: `${tmpl.title} (~${tmpl.estHours}h)`,
      scheduledDate: scheduled.toISOString(),
      isCompleted: false,
      orderIndex: idx
    };
  });
}
