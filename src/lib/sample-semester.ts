import type { TaskItem, TaskType } from "./types";

/**
 * Fixed, labelled sample semester used by the marketing homepage.
 * Never render visitor-facing demos from a live (possibly empty) account;
 * always use this sample and label it as sample data.
 */
export const SAMPLE_COURSE = {
  id: "sample-econ-301",
  code: "ECON 301",
  name: "Intermediate Microeconomics",
  colorHex: "#4338CA",
  term: "Fall 2026"
};

export const SAMPLE_GRADE_WEIGHTS = [
  { category: "Midterm exam", percentage: 25 },
  { category: "Final term paper", percentage: 30 },
  { category: "Problem sets", percentage: 25 },
  { category: "Participation", percentage: 20 }
];

function task(
  id: string,
  title: string,
  type: TaskType,
  dueDate: string,
  weightPercent: number,
  estimatedHours: number,
  description = ""
): TaskItem {
  return {
    id,
    courseId: SAMPLE_COURSE.id,
    courseCode: SAMPLE_COURSE.code,
    courseName: SAMPLE_COURSE.name,
    courseColor: SAMPLE_COURSE.colorHex,
    title,
    type,
    dueDate,
    estimatedHours,
    weightPercent,
    status: "TODO",
    gradeReceived: null,
    gradeMax: 100,
    description
  };
}

/** Twelve deadlines extracted from the ECON 301 sample syllabus. */
export const SAMPLE_TASKS: TaskItem[] = [
  task("s1", "Problem Set 1: Demand Curves", "assignment", "2026-09-11T23:59:00", 3.5, 3),
  task("s2", "Problem Set 2: Elasticity", "assignment", "2026-09-25T23:59:00", 3.5, 3),
  task("s3", "Problem Set 3: Consumer Choice", "assignment", "2026-10-02T23:59:00", 3.5, 3),
  task("s4", "Midterm review session", "milestone", "2026-10-09T19:00:00", 0, 2, "In-class review, bring questions"),
  task("s5", "Midterm Exam", "exam", "2026-10-12T14:00:00", 25, 3, "In-class, closed book"),
  task("s6", "Problem Set 4: Production", "assignment", "2026-10-23T23:59:00", 3.5, 3),
  task("s7", "Term paper topic proposal", "project", "2026-10-30T23:59:00", 5, 2),
  task("s8", "Problem Set 5: Costs", "assignment", "2026-11-06T23:59:00", 3.5, 3),
  task("s9", "Problem Set 6: Market Structures", "assignment", "2026-11-20T23:59:00", 3.5, 3),
  task("s10", "Term paper first draft", "project", "2026-12-04T23:59:00", 10, 8),
  task("s11", "Problem Set 7: Game Theory", "assignment", "2026-12-11T23:59:00", 3.5, 3),
  task("s12", "Final Term Paper", "project", "2026-12-18T23:59:00", 30, 12, "PDF upload, 11:59 PM sharp")
];

/** Three-item week preview for the hero, labelled as sample data. */
export const SAMPLE_WEEK = [
  { course: "ECON 301", kind: "Exam", title: "Midterm review session", when: "Tonight, 7:00 PM", color: "#4338CA" },
  { course: "ENG 102", kind: "Paper", title: "Comparative essay draft", when: "Tomorrow, 5:00 PM", color: "#067647" },
  { course: "BIO 210", kind: "Lab", title: "Cellular respiration report", when: "Friday, 11:59 PM", color: "#D97706" }
];
