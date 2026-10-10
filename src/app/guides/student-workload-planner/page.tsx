import type { Metadata } from "next";
import Link from "next/link";
import WorkloadPlanner from "./workload-planner";

export const metadata: Metadata = {
  title: "Student Workload Planner: Estimate a Realistic Study Week | SyllabiQ",
  description: "Estimate assignment and study hours, compare them with your actual weekly capacity, and turn the result into a source-checked semester plan.",
  alternates: { canonical: "/guides/student-workload-planner" },
  openGraph: {
    title: "Student Workload Planner: Build a Realistic Week",
    description: "A practical calculator and verification workflow for assignments, study tasks and competing deadlines.",
    url: "https://syllabiq.ca/guides/student-workload-planner",
    type: "article",
  },
};

const link = "text-blue-700 dark:text-blue-300 underline underline-offset-2 hover:text-blue-900";
const panel = "rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900";

export default function StudentWorkloadPlannerPage() {
  return <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200">
    <article className="mx-auto max-w-4xl px-5 py-12 leading-relaxed sm:px-8">
      <Link className={link} href="/">SyllabiQ home</Link>
      <p className="mt-8 text-xs font-bold uppercase tracking-wider text-blue-600">Student planning tool | Reviewed October 10, 2026</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">Student workload planner: build a week that fits the hours you actually have</h1>
      <p className="mt-5 text-lg">A task list can look manageable until every reading, revision session and assignment is translated into time. Use this planner to expose conflicts early, then verify every deadline and requirement against current course sources.</p>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">This is a planning aid, not a grade or completion-time predictor. Your estimate depends on task difficulty, prior knowledge, accommodations, health, work and family commitments. Adjust it after comparing estimates with actual time spent.</p>

      <div className="mt-9"><WorkloadPlanner /></div>

      <section className={panel + " mt-9"}>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Estimate work from the source, not the assignment title</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead><tr className="border-b border-slate-300 dark:border-slate-700"><th className="p-3">Source detail</th><th className="p-3">Work it may create</th><th className="p-3">Question to resolve</th></tr></thead>
          <tbody>
            <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3">Rubric and required sections</td><td className="p-3">Research, outline, draft, revision and formatting</td><td className="p-3">Which parts need evidence, citations or feedback?</td></tr>
            <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3">Group requirements</td><td className="p-3">Coordination, shared review and submission checks</td><td className="p-3">Who owns each deliverable and the final upload?</td></tr>
            <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3">Exam coverage</td><td className="p-3">Review, practice, correction and recall sessions</td><td className="p-3">Which topics remain uncertain after practice?</td></tr>
            <tr><td className="p-3">Submission instructions</td><td className="p-3">File conversion, upload and confirmation</td><td className="p-3">What exact time, time zone and system are required?</td></tr>
          </tbody>
        </table></div>
      </section>

      <section className="mt-9 space-y-4">
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Turn the estimate into a safer plan</h2>
        <p>Place the highest-consequence and least-certain work first. Split large assignments into visible outputs such as choosing a topic, gathering sources, drafting, revising and submitting. Put the final work session before the real deadline so a device, file or transit problem does not consume the entire margin.</p>
        <p>If the estimate exceeds the week, do not solve the problem by hiding hours. Recheck scope, remove optional work, move flexible tasks, begin earlier or contact the instructor or appropriate student support before the conflict becomes urgent.</p>
        <p>At the end of the week, compare estimated and actual time without treating the difference as a personal failure. Update future estimates for the same kind of task. A planner becomes useful when it learns from your real pace.</p>
      </section>

      <section className={panel + " mt-9"}>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Verify before relying on the plan</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Confirm the due date, exact time, time zone and submission location.</li>
          <li>Check the current syllabus, LMS announcements and later instructor messages for changes.</li>
          <li>Include recurring readings, labs, tutorials and group meetings, not only graded deadlines.</li>
          <li>Leave space for meals, sleep, travel, work, care responsibilities and recovery.</li>
          <li>Keep the source URL or document name beside any deadline you may need to recheck.</li>
        </ul>
        <p className="mt-4">Use the <Link className={link} href="/guides/syllabus-deadline-checklist">syllabus deadline checklist</Link> before building the week. For app choices and reminder testing, see the <Link className={link} href="/guides/student-organization-apps">student organization app comparison</Link>.</p>
      </section>

      <section className="mt-9 space-y-3">
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Where SyllabiQ fits</h2>
        <p>SyllabiQ is designed to help organize course and syllabus information. Any extracted date still needs to be checked against the source document and later instructor announcements. Use this workload estimate after verification, not as a replacement for it.</p>
        <Link className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white no-underline hover:bg-blue-700" href="/">Explore SyllabiQ</Link>
      </section>
    </article>
  </main>;
}
