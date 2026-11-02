import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Academic Calendar Deadline Checklist for Ontario Students",
  description: "Verify add, drop, refund, withdrawal, reading week and exam dates using your institution's official academic calendar and registrar sources.",
  alternates: { canonical: "/guides/academic-calendar-deadline-checklist" },
  openGraph: {
    title: "Academic Calendar Deadline Checklist for Ontario Students",
    description: "A source-first worksheet for important college and university dates that can affect enrolment, fees and course planning.",
    url: "https://syllabiq.ca/guides/academic-calendar-deadline-checklist",
    type: "article"
  }
};

const link = "text-blue-700 dark:text-blue-300 underline underline-offset-2 hover:text-blue-900";
const panel = "rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900";
const checks = [
  ["Course add deadline", "The last date to add or switch a course, including any program-specific approval route."],
  ["Course drop deadline", "Whether the course disappears from the record, receives a notation, or requires a form after a certain date."],
  ["Financial deadline", "The separate date that controls tuition adjustment or refund eligibility. Do not assume it matches the academic drop date."],
  ["Withdrawal deadline", "The last date for voluntary withdrawal and the transcript result described by the institution."],
  ["Reading week and closures", "Days without regular classes, plus any program exceptions, placements, labs or make-up sessions."],
  ["Final class and exam period", "The end of classes, examination window and where the final schedule will be published."],
  ["Program-specific calendar", "Dates for accelerated, collaborative, apprenticeship, placement or other non-standard schedules."],
  ["Source and review date", "The official URL, term, program and date you checked every entry."]
];

export default function AcademicCalendarDeadlineChecklistPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200">
      <article className="mx-auto max-w-5xl px-5 py-12 leading-relaxed sm:px-8">
        <Link className={link} href="/">SyllabiQ home</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          Ontario student planning guide | Reviewed November 2, 2026
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Academic calendar deadline checklist: verify the dates that can change your semester
        </h1>
        <p className="mt-5 text-lg">
          Course add, drop, refund and withdrawal deadlines can be different dates with different consequences. Build one verified record for your program and term before adding these dates to any planner.
        </p>
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <strong>Use your institution as the source of truth.</strong> Calendar rules and dates vary by school, program, course length and term. This worksheet is an organizational aid, not academic, financial or legal advice.
        </div>

        <section className={panel + " mt-10"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Calendar verification checklist</h2>
          <div className="mt-5 grid gap-3">
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
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Record dates with their consequences</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse bg-white text-left text-sm dark:bg-slate-900">
              <thead>
                <tr>{["Deadline", "Exact date and time", "What changes after it", "Official source", "Checked on"].map((heading) => <th key={heading} className="border border-slate-300 p-3 dark:border-slate-700">{heading}</th>)}</tr>
              </thead>
              <tbody>
                {["Add or switch course", "Academic drop", "Financial or refund", "Voluntary withdrawal", "Exam schedule release"].map((label) => (
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
        </section>

        <section className={panel + " mt-10"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Why one generic date list is not enough</h2>
          <p className="mt-3">The University of Windsor publishes official academic calendars separately from its important-dates listing and explains that withdrawal and possible refund dates vary by term. St. Clair College publishes semester dates and separate registrar guidance, including program-specific exceptions.</p>
          <p className="mt-3">These examples show the workflow, not dates that apply to every Ontario student. Start from your own institution and confirm the correct campus, program, term and course length.</p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li><a className={link} href="https://www.uwindsor.ca/secretariat/282/undergraduate-and-graduate-calendars">University of Windsor academic calendars</a></li>
            <li><a className={link} href="https://www.uwindsor.ca/registrar/events-listing/1000">University of Windsor important academic dates</a></li>
            <li><a className={link} href="https://www.stclaircollege.ca/programs/academic-dates">St. Clair College academic dates</a></li>
            <li><a className={link} href="https://www.stclaircollege.ca/programs/policies">St. Clair College course-change policies</a></li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Put verified dates into the semester plan</h2>
          <p>Save the official source beside each important date. Add an earlier reminder for any decision that may require advice from a registrar, financial-aid office, program coordinator or instructor.</p>
          <p>After a schedule change, recheck course syllabi, LMS calendars and assignment deadlines. A dropped, added or shortened course can make an older calendar export inaccurate.</p>
          <div className="flex flex-wrap gap-4">
            <Link className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white" href="/guides/syllabus-deadline-checklist">Audit syllabus deadlines</Link>
            <Link className={link} href="/guides/ontario-colleges-universities">Find official Ontario institution links</Link>
            <Link className={link} href="/guides/lms-calendar-feed-import">Import an LMS calendar feed</Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          Sources reviewed November 2, 2026. Confirm current dates and consequences directly with your institution before acting.
        </footer>
      </article>
    </main>
  );
}
