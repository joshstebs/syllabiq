import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Syllabus Deadline Checklist and Semester Audit",
  description: "A printable checklist for verifying assignment dates, exact times, grading weights and syllabus changes before building a semester plan.",
  alternates: { canonical: "/guides/syllabus-deadline-checklist" },
  openGraph: {
    title: "Syllabus Deadline Checklist and Semester Audit",
    description: "Verify deadlines, grading weights and course changes before relying on a student planner.",
    url: "https://syllabiq.ca/guides/syllabus-deadline-checklist",
    type: "article"
  }
};

const link = "text-blue-700 dark:text-blue-300 underline underline-offset-2 hover:text-blue-900";
const panel = "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6";
const checks = [
  ["Course identity", "Course code, section, instructor, term and the syllabus version or revision date"],
  ["Every graded item", "Assignment, quiz, exam, lab, discussion, presentation and participation requirement"],
  ["Exact deadline", "Date, clock time and time zone, including whether the deadline falls before a class or at the end of the day"],
  ["Submission route", "The required LMS area, email address, classroom hand-in or other submission location"],
  ["Grading weight", "Percentage or points, plus any dropped scores, substitutions, bonus work or category rules"],
  ["Late and missed-work rules", "Penalty, grace period, extension process, accommodation route and documentation requirements"],
  ["Group responsibilities", "Shared milestones, peer review, meeting dates and the person responsible for submission"],
  ["Source changes", "Later announcements, revised files and instructor messages that override the original syllabus"]
];

export default function SyllabusDeadlineChecklistPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200">
      <article className="mx-auto max-w-4xl px-5 py-12 leading-relaxed sm:px-8">
        <Link className={link} href="/">SyllabiQ home</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          Printable semester planning guide | Reviewed October 9, 2026
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Syllabus deadline checklist: audit the source before building your semester
        </h1>
        <p className="mt-5 text-lg">
          A due date copied without its time, time zone, submission route or later revision can still be wrong. Use this checklist for every course before treating any calendar or planner as authoritative.
        </p>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          This guide supports organization only. Course policies and instructor directions remain authoritative. If an extracted item conflicts with the syllabus or a later announcement, use the course source and ask the instructor when the conflict is unresolved.
        </p>

        <section className={panel + " mt-10"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Course audit checklist</h2>
          <p className="mt-2 text-sm">Check each item only after comparing it with the current source document.</p>
          <div className="mt-5 space-y-3">
            {checks.map(([title, detail]) => (
              <label key={title} className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <input className="mt-1 h-5 w-5 shrink-0" type="checkbox" />
                <span>
                  <strong className="block text-slate-950 dark:text-white">{title}</strong>
                  <span className="mt-1 block text-sm">{detail}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Build one verification table per course</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse bg-white text-left text-sm dark:bg-slate-900">
              <thead>
                <tr>
                  {["Item", "Due date and exact time", "Weight", "Submission route", "Source checked"].map((heading) => (
                    <th key={heading} className="border border-slate-300 p-3 dark:border-slate-700">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Assignment", "Quiz or exam", "Lab or tutorial", "Other requirement"].map((label) => (
                  <tr key={label}>
                    <td className="border border-slate-300 p-3 dark:border-slate-700">{label}</td>
                    <td className="border border-slate-300 p-3 dark:border-slate-700"></td>
                    <td className="border border-slate-300 p-3 dark:border-slate-700"></td>
                    <td className="border border-slate-300 p-3 dark:border-slate-700"></td>
                    <td className="border border-slate-300 p-3 dark:border-slate-700"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm">Add rows until every graded or mandatory item is represented. Keep the source URL, file name or announcement date in the final column.</p>
        </section>

        <section className={panel + " mt-10"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Resolve ambiguity before it becomes a missed deadline</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>If a syllabus gives a date without a time, do not silently assume 11:59 p.m. Check the LMS or ask the instructor.</li>
            <li>If the syllabus and LMS disagree, save both references and ask which one controls.</li>
            <li>If a deadline is described only as a week number or class meeting, translate it into a date only after confirming the academic calendar and section schedule.</li>
            <li>If grade weights do not total 100 percent, check category rules, optional work and whether the document was revised.</li>
            <li>If an assignment changes, keep the original record with a note and update the active deadline from the newer authoritative source.</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">A weekly maintenance routine</h2>
          <p>
            Compare your planner with course announcements and the LMS at a consistent time each week. Review the next two weeks first, then scan the rest of the term for changed exams, large assignments and group milestones.
          </p>
          <p>
            SyllabiQ can help turn syllabus information into a working plan. It should not replace the original document, later instructor directions or your own verification.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white" href="/">
              Explore SyllabiQ
            </Link>
            <Link className={link} href="/guides/ontario-colleges-universities">
              Browse Ontario institutions
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
