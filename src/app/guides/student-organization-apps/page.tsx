import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Student Organization Apps Compared: Calendar, MyStudyLife and SyllabiQ",
  description: "A practical comparison of Google Calendar with Tasks, MyStudyLife and syllabus-first planning, including a weekly deadline-checking routine.",
  alternates: { canonical: "/guides/student-organization-apps" },
  openGraph: {
    title: "Student Organization Apps: Find a Planning Routine That Works",
    description: "Compare documented tools and build a deadline-checking routine that does not rely on unverified automatic syncing.",
    url: "https://syllabiq.ca/guides/student-organization-apps",
    type: "article"
  }
};
const a = "text-blue-700 dark:text-blue-300 underline underline-offset-2 hover:text-blue-900";
const section = "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6";
export default function StudentOrganizationGuide() {
  return <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-200">
    <article className="max-w-4xl mx-auto px-5 sm:px-8 py-12 leading-relaxed">
      <Link className={a} href="/">SyllabiQ home</Link>
      <p className="mt-8 uppercase tracking-wider text-xs font-bold text-blue-600">Student planning guide | Reviewed October 2026</p>
      <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">Student organization apps: choose a system you will actually maintain</h1>
      <p className="mt-5 text-lg">A useful student planner is a place for deadlines and a routine for checking them against course announcements. Compare the approach before moving a full semester of commitments into a new app.</p>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Disclosure: This guide is published by SyllabiQ, which appears in the comparison. It compares published help pages and inspected product code, not controlled tests or outcomes. No app is claimed to improve grades or meet every school's academic policy.</p>
      <div className="mt-9 grid md:grid-cols-3 gap-4">
        <section className={section}><h2 className="text-xl font-black text-slate-950 dark:text-white">Google Calendar + Tasks</h2><p className="mt-3 text-sm">Use timed work blocks alongside assignment tasks. Google's help distinguishes task start times from a deadline displayed in the all-day section; keep the exact submission time explicitly recorded.</p><a className={a} href="https://support.google.com/calendar/answer/9901136?co=GENIE.Platform%3DDesktop&hl=en">Google's task documentation</a></section>
        <section className={section}><h2 className="text-xl font-black text-slate-950 dark:text-white">MyStudyLife</h2><p className="mt-3 text-sm">Its official tour describes timetables, classes, exams, homework and reminders, including alternating schedules. Test an actual week and your subscription level before switching planners.</p><a className={a} href="https://mystudylife.com/tour/">MyStudyLife feature tour</a></section>
        <section className={section}><h2 className="text-xl font-black text-slate-950 dark:text-white">SyllabiQ</h2><p className="mt-3 text-sm">A syllabus-focused planner and deadline-review workspace. Do not assume Canvas, Blackboard, Brightspace, Moodle or Google Calendar live sync is available. Production LMS connections and durable feed import are not currently enabled in the reviewed code.</p><Link className={a} href="/">Explore SyllabiQ</Link></section>
      </div>
      <section className={section + " mt-9"}>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Which approach makes sense?</h2>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[520px] border-collapse text-sm text-left">
          <thead><tr className="border-b border-slate-300 dark:border-slate-700"><th className="p-3">Your primary need</th><th className="p-3">Start by trying</th><th className="p-3">Verify for yourself</th></tr></thead>
          <tbody>
          <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3">Coordinate work blocks with everyday appointments</td><td className="p-3">Calendar + Tasks</td><td className="p-3">Time-zone and exact deadline visibility</td></tr>
          <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3">Track classes, exams and rotating timetables</td><td className="p-3">MyStudyLife</td><td className="p-3">Rotation and holiday exceptions</td></tr>
          <tr><td className="p-3">Review assignment information from course documents</td><td className="p-3">SyllabiQ's syllabus workflow</td><td className="p-3">Actual extraction, corrections, data saving and export before depending on it</td></tr>
          </tbody>
        </table></div>
      </section>
      <section className="mt-9 space-y-4">
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">A weekly deadline routine</h2>
        <p>Choose one authoritative task list, then compare it with the current syllabus, course LMS announcements and instructor updates every week. Record an exact due date and time for every assignment, including its time zone if your course is online.</p>
        <p>Break larger tasks into visible outputs: pick a topic, gather sources, outline, draft, revise and submit. Put work sessions earlier than the deadline, leaving space for unexpected delays or shifts in other commitments.</p>
        <p>After any document import, check one upcoming assignment and one exam against the source documents. Test a reminder on your actual phone. Never assume a feed, upload or AI extraction is correct until verified.</p>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Privacy and academic integrity</h2>
        <p>Before uploading class materials or a private iCal feed, review the app's privacy terms and your school's rules. Calendar feed URLs may be sensitive. Keep them out of public messages and web pages. School-specific rules determine whether recording, sharing course content or using AI on assessed material is permitted.</p>
        <p>SyllabiQ's direct LMS and Google integrations remain under development. This article intentionally does not describe their successful use, performance or rollout timing.</p>
        <div className="pt-4"><Link className="inline-flex rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold no-underline" href="/">Explore SyllabiQ's current workspace</Link></div>
      </section>
      <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">Source checks: <a className={a} href="https://support.google.com/calendar/answer/9901136?co=GENIE.Platform%3DDesktop&hl=en">Google Calendar help</a> · <a className={a} href="https://mystudylife.com/tour/">MyStudyLife</a> · SyllabiQ's public repository and deployment route logic. Last editorial review: October 8, 2026.</footer>
    </article>
  </main>;
}
