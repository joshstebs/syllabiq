import type { Metadata } from 'next';
import Link from 'next/link';
import ApplicationDocumentTracker from './application-document-tracker';

export const metadata: Metadata = {
  title: 'Ontario College and University Application Document Tracker',
  description: 'Track transcripts, supporting documents, senders, deadlines and receipt status for Ontario college and university applications.',
  alternates: { canonical: '/guides/ontario-application-document-tracker' },
  openGraph: {
    title: 'Ontario Application Document Tracker | SyllabiQ',
    description: 'A practical worksheet for separating application submission from transcript and program-specific document deadlines.',
    url: 'https://syllabiq.ca/guides/ontario-application-document-tracker',
    type: 'article',
  },
};

const card = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';
const link = 'font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900';

export default function OntarioApplicationDocumentTrackerPage() {
  const reviewed = 'October 11, 2026';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Ontario College and University Application Document Tracker',
    dateModified: '2026-10-11',
    author: { '@type': 'Organization', name: 'SyllabiQ' },
    publisher: { '@type': 'Organization', name: 'SyllabiQ' },
    mainEntityOfPage: 'https://syllabiq.ca/guides/ontario-application-document-tracker',
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-800 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Ontario application planning</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">Track the document, the sender and the real deadline</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-650">Submitting an application is only one milestone. Transcripts and program-specific materials may follow different instructions, travel through different systems and arrive on different dates. This worksheet helps you keep those facts separate.</p>
        <div className="mt-8"><ApplicationDocumentTracker /></div>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className={card}>
            <h2 className="text-2xl font-black text-slate-950">University applications</h2>
            <p className="mt-3 leading-7">OUAC says official transcripts are required for each applicable secondary and postsecondary institution for Group B undergraduate applicants. Some transcript types are ordered inside the application, while others must be arranged directly with the institution.</p>
            <p className="mt-3 leading-7">Record who must send each transcript, how it must be sent, and the identifying information it needs. Do not mark a document complete because you requested it. Check the receiving system or university instructions for receipt.</p>
            <a className={link} href="https://www.ouac.on.ca/guide/undergrad-transcript/">Read the current OUAC transcript instructions</a>
          </div>
          <div className={card}>
            <h2 className="text-2xl font-black text-slate-950">College applications</h2>
            <p className="mt-3 leading-7">Ontario Colleges places transcript requests within its application flow, but the steps vary with where and when you studied. Its applicant guidance also warns that adding colleges or a new application can require new transcript requests.</p>
            <p className="mt-3 leading-7">Use the tracker for every institution and program. Keep a separate row when the same document has more than one recipient or deadline.</p>
            <a className={link} href="https://www.ontariocolleges.ca/en/apply">Start with the current Ontario Colleges application guidance</a>
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-slate-950 p-6 text-slate-100 sm:p-8">
          <h2 className="text-2xl font-black text-white">A reliable verification loop</h2>
          <ul className="mt-4 grid gap-3 leading-7 sm:grid-cols-2">
            <li><strong className="text-blue-300">Identify:</strong> read the program page and application portal for every required item.</li>
            <li><strong className="text-blue-300">Assign:</strong> note whether you, a school, a testing service or a referee sends it.</li>
            <li><strong className="text-blue-300">Request:</strong> save the request date and confirmation separately from receipt.</li>
            <li><strong className="text-blue-300">Verify:</strong> check the official portal and follow up before the stated deadline.</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4 leading-7">
          <h2 className="text-2xl font-black text-slate-950">Turn an offer condition into a trackable task</h2>
          <p>Ontario Colleges describes conditional offers as offers that still require named conditions to be completed by the deadline in the offer. Treat each condition as a separate task. Copy the wording into your own plan, attach the official source, and verify when the institution records it as satisfied.</p>
          <p className="rounded-2xl bg-amber-50 p-5 text-amber-950"><strong>Important:</strong> This planner does not submit or verify documents. Requirements differ by applicant, institution and program and can change. The official application service, institution and offer letter control.</p>
        </section>

        <section className="mt-10 flex flex-wrap gap-4">
          <Link className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white" href="/">Explore SyllabiQ</Link>
          <Link className={link} href="/guides/ontario-colleges-universities">Browse Ontario institutions</Link>
          <Link className={link} href="/guides/syllabus-deadline-checklist">Plan syllabus deadlines</Link>
        </section>
        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-600">
          <p>Sources reviewed {reviewed}: <a className={link} href="https://www.ouac.on.ca/guide/undergrad-transcript/">OUAC undergraduate transcript guidance</a>, <a className={link} href="https://www.ouac.on.ca/guide/undergrad-my-supporting-documents/">OUAC supporting documents guidance</a>, and <a className={link} href="https://www.ontariocolleges.ca/en/apply">Ontario Colleges application guidance</a>.</p>
        </footer>
      </article>
    </main>
  );
}
