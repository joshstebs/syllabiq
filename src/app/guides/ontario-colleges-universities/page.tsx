import type { Metadata } from "next";
import Link from "next/link";
import OntarioInstitutionsDirectory from "./ontario-institutions-directory";

export const metadata: Metadata = {
  title: "Ontario Colleges and Universities Directory",
  description: "Search Ontario's publicly assisted colleges and universities, then use the official application and program research services.",
  alternates: { canonical: "/guides/ontario-colleges-universities" },
  openGraph: {
    title: "Ontario Colleges and Universities Directory",
    description: "A searchable, unranked directory with official Ontario application and research links.",
    url: "https://syllabiq.ca/guides/ontario-colleges-universities",
    type: "article"
  }
};

const link = "text-blue-700 dark:text-blue-300 underline underline-offset-2 hover:text-blue-900";
const panel = "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6";

export default function OntarioInstitutionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0B0F19] dark:text-slate-200">
      <article className="mx-auto max-w-5xl px-5 py-12 leading-relaxed sm:px-8">
        <Link className={link} href="/">SyllabiQ home</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          Ontario student resource | Verified October 9, 2026
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Ontario colleges and universities directory
        </h1>
        <p className="mt-5 text-lg">
          Ontario reports 23 publicly assisted universities and 24 colleges. Use this directory to find an institution name, then confirm programs, admission requirements, campuses and deadlines through official sources.
        </p>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          This is an unranked planning resource published by SyllabiQ. It does not recommend a school or reproduce program listings. Institution names and counts were checked against Ontario government sources.
        </p>

        <OntarioInstitutionsDirectory />

        <section className={panel + " mt-10"}>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Use the right official service</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">College research and applications</h3>
              <p className="mt-2 text-sm">
                Ontario Colleges provides college and program searches plus the application service. Its current guidance says an application may include up to five program choices, with no more than three at one college.
              </p>
              <a className={link} href="https://www.ontariocolleges.ca/en/" rel="noreferrer">Visit Ontario Colleges</a>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">University research and applications</h3>
              <p className="mt-2 text-sm">
                OUInfo is the research starting point built from Ontario university information. OUAC processes undergraduate applications, while each university makes its own admission decisions.
              </p>
              <a className={link} href="https://www.ouac.on.ca/" rel="noreferrer">Visit OUAC</a>
              <span aria-hidden="true"> · </span>
              <a className={link} href="https://www.ouinfo.ca/" rel="noreferrer">Visit OUInfo</a>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Build a comparison you can verify</h2>
          <p>
            For each possible program, record the exact credential, campus, delivery format, admission prerequisites, application deadline, tuition source and co-op or placement requirements. Save the page URL and the date you checked it. Do not assume the same program name means the same curriculum at every institution.
          </p>
          <p>
            After accepting an offer, collect your course syllabi and record every assignment with its due date, time and time zone. SyllabiQ can help organize syllabus information, but extracted dates still need to be checked against the source document and later instructor announcements.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white" href="/guides/syllabus-deadline-checklist">
              Use the syllabus deadline checklist
            </Link>
            <Link className={link} href="/guides/student-organization-apps">
              Compare student organization approaches
            </Link>
          </div>
        </section>

        <section className={panel + " mt-10 text-sm"}>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Sources and scope</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li><a className={link} href="https://www.ontario.ca/page/learn-about-colleges-universities-and-indigenous-institutes-ontario">Ontario postsecondary overview and institution counts</a></li>
            <li><a className={link} href="https://www.ontario.ca/page/ontario-universities">Ontario public university list</a></li>
            <li><a className={link} href="https://www.ontario.ca/page/ontario-colleges">Ontario college list</a></li>
            <li><a className={link} href="https://www.ouac.on.ca/guide/undergrad-about">OUAC undergraduate application role</a></li>
            <li><a className={link} href="https://www.ontariocolleges.ca/en/">Ontario Colleges program and application service</a></li>
          </ul>
          <p className="mt-4">Institution status, names, programs and admission processes can change. Confirm all decisions with the institution and the relevant application service.</p>
        </section>
      </article>
    </main>
  );
}
