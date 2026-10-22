import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Import Canvas, Blackboard, Brightspace or Moodle Calendars",
  description: "Use an LMS iCalendar feed or .ics file with SyllabiQ, understand what imports, prevent duplicates, and verify every deadline against your course.",
  alternates: { canonical: "/guides/lms-calendar-feed-import" },
  openGraph: {
    title: "LMS Calendar Feed Import Guide",
    description: "A practical guide to bringing dated LMS coursework into SyllabiQ with an iCalendar feed or .ics file.",
    url: "https://syllabiq.ca/guides/lms-calendar-feed-import",
    type: "article"
  }
};

const link = "text-blue-700 dark:text-blue-300 underline underline-offset-2 hover:text-blue-900";
const panel = "rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900";

export default function LmsCalendarFeedImportGuidePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200">
      <article className="mx-auto max-w-4xl px-5 py-12 leading-relaxed sm:px-8">
        <Link className={link} href="/">SyllabiQ home</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-wider text-blue-600">Student planning guide | Reviewed October 22, 2026</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">Import an LMS calendar feed into SyllabiQ</h1>
        <p className="mt-5 text-lg">SyllabiQ can import dated coursework from an iCalendar feed URL or an <code>.ics</code> file. The import works with calendar feeds exported by Canvas, Blackboard, Brightspace, Moodle and other systems that use the iCalendar format.</p>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"><strong>Important:</strong> this is a calendar-feed import, not direct access to your LMS account and not continuous two-way synchronization. Re-import when your school calendar changes, and verify every deadline against the current course page, syllabus and instructor announcements.</p>

        <section className={panel + " mt-9"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">What the import does</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>Accepts an HTTPS or WebCal calendar-feed URL, or an uploaded <code>.ics</code> file.</li>
            <li>Reads dated calendar items and creates course tasks in your SyllabiQ account.</li>
            <li>Uses the calendar item identifier, or the same title and due date, to avoid creating the same task twice.</li>
            <li>Reports how many items were found, added and recognized as duplicates.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">A feed can omit undated work, private course material or items your institution does not publish to its calendar. An imported task is therefore a planning aid, not proof that your course record is complete.</p>
        </section>

        <section className="mt-9 space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">How to import your calendar</h2>
          <ol className="list-decimal space-y-3 pl-5">
            <li>Sign in to SyllabiQ and open the LMS import tool.</li>
            <li>Choose Canvas, Blackboard, Brightspace, Moodle or another <code>.ics</code> feed.</li>
            <li>Copy the calendar-feed URL from your school system, or download its <code>.ics</code> file.</li>
            <li>Paste the feed URL or choose the downloaded file, then run the import.</li>
            <li>Review the import report and compare the created tasks with your official course calendar.</li>
          </ol>
          <p>Calendar-feed links can grant access to your schedule without another login. Treat the link as sensitive, do not post it publicly, and use your school&apos;s controls to replace or revoke it if it is exposed.</p>
        </section>

        <section className={panel + " mt-9"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Where to find the feed</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead><tr className="border-b border-slate-300 dark:border-slate-700"><th className="p-3">System</th><th className="p-3">Typical route</th><th className="p-3">Official help</th></tr></thead>
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3 font-bold">Canvas</td><td className="p-3">Calendar, then Calendar Feed</td><td className="p-3"><a className={link} href="https://community.canvaslms.com/t5/Student-Guide/How-do-I-view-the-Calendar-iCal-feed-to-subscribe-to-an-external/ta-p/331">Canvas Student Guide</a></td></tr>
                <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3 font-bold">Blackboard Ultra</td><td className="p-3">Calendar, Calendar Settings, Share Calendar</td><td className="p-3"><a className={link} href="https://help.blackboard.com/Learn/Instructor/Ultra/Courses/Calendar">Blackboard Calendar help</a></td></tr>
                <tr className="border-b border-slate-200 dark:border-slate-800"><td className="p-3 font-bold">Brightspace</td><td className="p-3">Calendar settings, then enable Calendar Feeds</td><td className="p-3"><a className={link} href="https://community.d2l.com/brightspace/kb/articles/33719-manage-course-events-with-the-calendar-tool">Brightspace Calendar help</a></td></tr>
                <tr><td className="p-3 font-bold">Moodle</td><td className="p-3">Calendar, then Export calendar</td><td className="p-3"><a className={link} href="https://docs.moodle.org/en/Using_Calendar">Moodle Calendar documentation</a></td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Menus vary by school configuration and software version. Your institution may disable calendar feeds entirely.</p>
        </section>

        <section className="mt-9 space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Use a verification pass after every import</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Check the course name, task title, date, start time and time zone.</li>
            <li>Look for assignments that have no calendar date and add them manually.</li>
            <li>Confirm whether the date is a submission deadline, an availability window or an event reminder.</li>
            <li>Review instructor announcements for extensions, cancellations and changed exam details.</li>
            <li>Re-import the feed after a schedule change, then inspect the duplicate report.</li>
          </ul>
          <p>For a broader planning workflow, use the <Link className={link} href="/guides/syllabus-deadline-checklist">syllabus deadline checklist</Link> and the <Link className={link} href="/guides/student-workload-planner">student workload planner</Link>.</p>
          <Link className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white no-underline hover:bg-blue-700" href="/">Open SyllabiQ</Link>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
          SyllabiQ is not affiliated with Canvas, Blackboard, D2L Brightspace or Moodle. Product names belong to their respective owners. Course information from your institution remains the source of truth.
        </footer>
      </article>
    </main>
  );
}
