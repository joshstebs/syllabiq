import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Student Planning Guides",
  description: "Browse practical SyllabiQ guides for syllabus deadlines, LMS calendar imports, exam planning, workload, group projects and Ontario post-secondary research.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "SyllabiQ Student Planning Guides",
    description: "Practical, source-aware planning guides for post-secondary students.",
    url: "https://syllabiq.ca/guides",
    type: "website"
  }
};

const guides = [
  {
    href: "/guides/lms-calendar-feed-import",
    title: "LMS calendar feed import",
    description: "Import dated coursework from Canvas, Blackboard, Brightspace, Moodle or another .ics feed, then verify the result."
  },
  {
    href: "/guides/college-exam-study-planner",
    title: "College exam study planner",
    description: "Turn course coverage, available hours and practice results into a review schedule."
  },
  {
    href: "/guides/student-workload-planner",
    title: "Student workload planner",
    description: "Map deadlines and available time before a heavy week becomes an emergency."
  },
  {
    href: "/guides/syllabus-deadline-checklist",
    title: "Syllabus deadline checklist",
    description: "Review extracted dates, grade weights and course rules against the original syllabus."
  },
  {
    href: "/guides/group-project-planner",
    title: "Group project planner",
    description: "Clarify deliverables, owners, dependencies, review dates and handoff expectations."
  },
  {
    href: "/guides/student-organization-apps",
    title: "Student organization app comparison",
    description: "Compare planning approaches by workflow instead of relying on a generic ranking."
  },
  {
    href: "/guides/ontario-colleges-universities",
    title: "Ontario colleges and universities",
    description: "Start post-secondary research with official institution and application sources."
  },
  {
    href: "/guides/ontario-application-document-tracker",
    title: "Ontario application document tracker",
    description: "Track required documents and verify their status through official application channels."
  }
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <Link className="text-blue-700 underline underline-offset-2 dark:text-blue-300" href="/">SyllabiQ home</Link>
        <header className="mt-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Student planning library</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl">Plan the semester with evidence you can check</h1>
          <p className="mt-5 text-lg leading-relaxed">These guides focus on repeatable planning decisions: where a deadline came from, what still needs verification, who owns the next action and when the plan should be reviewed.</p>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">SyllabiQ can help organize imported information, but your current syllabus, LMS, registrar and instructor communications remain the source of truth.</p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2" aria-label="Student planning guides">
          {guides.map((guide) => (
            <article key={guide.href} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">
                <Link className="hover:text-blue-700 dark:hover:text-blue-300" href={guide.href}>{guide.title}</Link>
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{guide.description}</p>
              <Link className="mt-5 inline-flex font-bold text-blue-700 underline underline-offset-4 dark:text-blue-300" href={guide.href}>Open guide</Link>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-7 dark:border-blue-900 dark:bg-blue-950/30">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Use the guide, then review the source</h2>
          <p className="mt-3 max-w-3xl">A strong planning workflow keeps the original document or official page attached to each important date. When information changes, update the task and record what changed instead of relying on an old screenshot or memory.</p>
          <Link className="mt-5 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700" href="/">Explore SyllabiQ</Link>
        </section>
      </div>
    </main>
  );
}
