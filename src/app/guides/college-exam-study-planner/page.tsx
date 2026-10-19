"use client";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "College Exam Study Planner: Build a Review Schedule",
  description: "A practical college exam study planner for turning course coverage, available hours and practice results into a review schedule you can actually verify.",
  alternates: { canonical: "/guides/college-exam-study-planner" },
  openGraph: {
    title: "College Exam Study Planner",
    description: "Plan exam review from the course outline, your available hours and the topics that still need practice.",
    url: "https://syllabiq.ca/guides/college-exam-study-planner",
    type: "article"
  }
};

const link = "text-blue-700 dark:text-blue-300 underline underline-offset-2 hover:text-blue-900";
const panel = "rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900";

export default function CollegeExamStudyPlannerPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200">
      <article className="mx-auto max-w-4xl px-5 py-12 leading-relaxed sm:px-8">
        <Link className={link} href="/">SyllabiQ home</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-wider text-blue-600">Student planning guide | Reviewed October 19, 2026</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">College exam study planner: build a review schedule you can keep</h1>
        <p className="mt-5 text-lg">A useful exam plan starts with the material that can be tested, the hours you genuinely have and evidence about what you can already recall. It is not a promise that a certain number of hours will produce a certain grade.</p>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Use your current course outline, syllabus, instructor announcements and official exam information as the source of truth. Dates, coverage and permitted materials can change.</p>

        <section className={panel + " mt-9"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Start with a coverage map</h2>
          <p className="mt-3">List each examinable unit, reading, lab, formula set or skill. Beside it, record the source document, the assessment format and your confidence: new, partly familiar or ready to practise. This exposes missing information before you spend time polishing notes.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead><tr className="border-b border-slate-300 dark:border-slate-700"><th className="p-3">Topic</th><th className="p-3">Evidence to practise</th><th className="p-3">Next action</th></tr></thead>
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3">Core concept</td><td className="p-3">Explain it without looking at notes</td><td className="p-3">Write a short answer, then check the source</td></tr>
                <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3">Worked problem</td><td className="p-3">Complete a new example under time pressure</td><td className="p-3">Mark the step where your reasoning failed</td></tr>
                <tr><td className="p-3">Required reading</td><td className="p-3">Identify the argument and supporting evidence</td><td className="p-3">Create a closed-book summary and verify it</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-9 space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Turn available hours into sessions</h2>
          <p>Count the time between now and the exam, then remove classes, work, travel, sleep, meals and existing deadlines. Keep a buffer for interruptions. Divide the remaining time into sessions with one visible output, such as completing ten practice questions, explaining a process from memory or correcting an old quiz.</p>
          <p>Put the least familiar and highest-consequence topics earlier in the plan. Use shorter review sessions to revisit material later instead of leaving all revision for the final night. If the plan does not fit, reduce scope honestly, start earlier or ask the instructor or student support service what should take priority.</p>
        </section>

        <section className={panel + " mt-9"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Use practice results to adjust</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>After a practice set, label each miss as a knowledge gap, a reasoning error or a reading mistake.</li>
            <li>Write the correction in your own words and try a similar question later.</li>
            <li>Keep a short list of topics that still require an open-book check.</li>
            <li>Do not count rereading as mastery unless you can retrieve or apply the idea.</li>
            <li>Leave a final session for logistics, permitted materials and the exam location or access method.</li>
          </ul>
        </section>

        <section className="mt-9 space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Verify the plan before relying on it</h2>
          <p>Confirm the exam date, start time, time zone, room or online access, format, permitted resources and coverage with the current official course information. Compare your checklist against later LMS announcements. If SyllabiQ extracts a date or task from a syllabus, review it against the original document before treating it as final.</p>
          <p>For a broader weekly workload view, use the <Link className={link} href="/guides/student-workload-planner">student workload planner</Link>. For document checks, use the <Link className={link} href="/guides/syllabus-deadline-checklist">syllabus deadline checklist</Link>. For a repeatable semester system, see the <Link className={link} href="/guides/student-organization-apps">student organization app comparison</Link>.</p>
          <Link className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white no-underline hover:bg-blue-700" href="/">Explore SyllabiQ</Link>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          This guide provides a planning method, not academic, medical or disability advice. Follow your institution's policies and ask qualified staff about accommodations or course-specific requirements.
        </footer>
      </article>
    </main>
  );
}
