"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Upload,
  SearchCheck,
  CalendarCheck,
  Flame,
  Check,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck,
  FileText,
  ArrowRight
} from "lucide-react";
import { AuthModal } from "./auth-modal";
import { WorkloadHeatmap } from "./workload-heatmap";
import {
  SAMPLE_TASKS,
  SAMPLE_COURSE,
  SAMPLE_WEEK
} from "@/lib/sample-semester";

/* ------------------------------------------------------------------ */
/* Scroll reveal: one signature moment, fully static when the visitor  */
/* prefers reduced motion.                                             */
/* ------------------------------------------------------------------ */
function Reveal({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small labelled-sample tag used on every demo block.                 */
/* ------------------------------------------------------------------ */
function SampleTag() {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F4F5FB] border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0F1B2D]/60">
      Sample semester shown
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ data: trimmed to the five questions the proposal keeps.         */
/* ------------------------------------------------------------------ */
const FAQS = [
  {
    q: "What syllabus file formats does SyllabiQ support?",
    a: "SyllabiQ accepts PDF files (.pdf), Word documents (.docx), plain text (.txt), Markdown (.md), and photo scans or phone camera screenshots (JPEG, PNG, HEIC)."
  },
  {
    q: "How accurate is the extraction? Should I double check?",
    a: "SyllabiQ reads your syllabus, it does not replace it. Always check extracted dates and grade weights against your original document before you rely on them. Results may require correction."
  },
  {
    q: "Can I sync Google Calendar or connect my LMS?",
    a: "What works today: upload PDF, Word, text, Markdown, and photo scans, and export your deadlines in a calendar-ready format. Live LMS and Google sync are not available yet. They are planned, and this page will say so plainly until they ship."
  },
  {
    q: "Can I use SyllabiQ under my school's academic integrity policy?",
    a: "SyllabiQ organizes your coursework. It never does your coursework for you. Check your school rules on AI use with course material."
  },
  {
    q: "How does the first month free, then $5 per month work?",
    a: "You get full SyllabiQ access free for your first month. Then it is $5.00 per month. Cancel anytime with one click. No commitments."
  }
];

/* ------------------------------------------------------------------ */
/* The marketing homepage. Rendered to visitors; the logged-in         */
/* dashboard lives separately and is untouched by this redesign.       */
/* ------------------------------------------------------------------ */
export function MarketingHomepage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1B2D] antialiased">
      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="SyllabiQ home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4338CA] text-white shadow-sm">
              <Send className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-lg font-black tracking-tight">
              Syllabi<span className="text-[#4338CA]">Q</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#0F1B2D]/70 sm:flex" aria-label="Primary">
            <button onClick={() => scrollTo("how-it-works")} className="transition hover:text-[#4338CA]">
              How it works
            </button>
            <button onClick={() => scrollTo("pricing")} className="transition hover:text-[#4338CA]">
              Pricing
            </button>
            <button onClick={() => scrollTo("faq")} className="transition hover:text-[#4338CA]">
              FAQ
            </button>
          </nav>
          <button
            onClick={() => setShowAuthModal(true)}
            className="rounded-full bg-[#4338CA] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#3730A3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] focus-visible:ring-offset-2"
          >
            Log in
          </button>
        </div>
      </header>

      <main>
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(67,56,202,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(67,56,202,0.05) 1px, transparent 1px)",
              backgroundSize: "28px 28px"
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
            <Reveal className="mx-auto max-w-3xl text-center">
              <SampleTag />
              <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">
                Never wonder what is due this semester.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#0F1B2D]/70 sm:text-lg">
                Upload a syllabus and SyllabiQ builds your semester plan: every deadline, exam, and grade
                weight, organized in one place. Review what it found, then get on with your term.
              </p>
              <p className="mt-4 text-sm font-semibold text-[#0F1B2D]/60">
                First month free, then $5 per month. Cancel anytime with one click. No commitments.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4338CA] px-8 py-3.5 text-base font-bold text-white shadow-md shadow-[#4338CA]/25 transition hover:bg-[#3730A3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] focus-visible:ring-offset-2 sm:w-auto"
                >
                  Try it free today
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => scrollTo("sample-demo")}
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#E2E8F0] bg-white px-8 py-3.5 text-base font-bold text-[#0F1B2D] transition hover:border-[#4338CA] hover:text-[#4338CA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] focus-visible:ring-offset-2 sm:w-auto"
                >
                  See a sample semester
                </button>
              </div>
            </Reveal>

            {/* Sample week preview */}
            <Reveal delay={150} className="mx-auto mt-12 max-w-4xl">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F4F5FB] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-[#0F1B2D]/50">
                    Your week in SyllabiQ
                  </p>
                  <SampleTag />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {SAMPLE_WEEK.map((item) => (
                    <div
                      key={item.course}
                      className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-black uppercase tracking-wide text-[#0F1B2D]/60">
                          {item.course} · {item.kind}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold leading-snug">{item.title}</p>
                      <p className="mt-1 text-xs font-semibold text-[#0F1B2D]/55">{item.when}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ BEFORE / AFTER ============ */}
        <section id="sample-demo" className="scroll-mt-20 border-t border-[#E2E8F0]">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-wider text-[#4338CA]">
                One syllabus in, one semester out
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                See what one PDF becomes
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#0F1B2D]/70">
                This is the {SAMPLE_COURSE.code} sample: twelve deadlines, four policy rules, and
                four grade-weight categories, pulled from a single file.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Before */}
              <Reveal>
                <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4F5FB] text-[#0F1B2D]/60">
                      <FileText className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-black">Before: a long syllabus PDF</p>
                      <p className="text-xs text-[#0F1B2D]/55">Deadlines buried among policy pages</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-[13px] leading-relaxed text-[#0F1B2D]/60">
                    <p className="rounded-lg bg-[#F4F5FB] p-3">
                      ...the final examination, worth thirty percent of the final grade, will be held
                      during the examination period. Students should consult the registrar...
                    </p>
                    <p className="rounded-lg bg-[#F4F5FB] p-3">
                      ...problem sets are due Fridays at 11:59 PM unless otherwise noted. The lowest
                      score will be dropped at the end of term. Late submissions lose ten percent per
                      day...
                    </p>
                    <p className="rounded-lg bg-[#F4F5FB] p-3">
                      ...the term paper, worth thirty percent, proceeds in three stages: topic proposal,
                      first draft, and final submission. Details appear in sections 4.2 through 4.5...
                    </p>
                    <p className="pt-1 text-xs font-semibold">
                      The student copies dates into a calendar by hand and hopes nothing was missed.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* After */}
              <Reveal delay={120}>
                <div className="h-full rounded-2xl border-2 border-[#4338CA]/20 bg-[#F4F5FB] p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-black">After: every deadline in date order</p>
                    <SampleTag />
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {[
                      { t: "Midterm Exam", w: "25%", d: "Oct 12 · In class", crunch: true },
                      { t: "Final Term Paper", w: "30%", d: "Dec 18 · 11:59 PM", crunch: true },
                      { t: "7 problem sets", w: "25% total", d: "Fridays · Lowest dropped", crunch: false },
                      { t: "Participation", w: "20%", d: "Weekly", crunch: false }
                    ].map((row) => (
                      <li
                        key={row.t}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: SAMPLE_COURSE.colorHex }}
                            aria-hidden="true"
                          >
                            <Check className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-bold leading-tight">
                              {row.t}
                              {row.crunch && (
                                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#D97706]/10 px-2 py-0.5 text-[11px] font-bold text-[#D97706]">
                                  <Flame className="h-3 w-3" aria-hidden="true" />
                                  Crunch week
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-[#0F1B2D]/55">{row.d}</p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full bg-[#4338CA]/10 px-2.5 py-1 text-xs font-black text-[#4338CA]">
                          {row.w}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-[#0F1B2D]/55">
                    Grade weights attached to every item. Crunch weeks flagged before they arrive, not
                    during them.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section id="how-it-works" className="scroll-mt-20 border-t border-[#E2E8F0] bg-[#F4F5FB]">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-wider text-[#4338CA]">How it works</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Three steps to a calm semester
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {
                  icon: Upload,
                  title: "Drop in a syllabus",
                  body: "Upload a PDF, Word document, text file, or a phone scan of any course syllabus. No account needed to see the sample above."
                },
                {
                  icon: SearchCheck,
                  title: "Review what was extracted",
                  body: "SyllabiQ pulls every due date, exam, and grade weight into one plan. Check it against your original document before you rely on it."
                },
                {
                  icon: CalendarCheck,
                  title: "Use the plan",
                  body: "Get crunch-week warnings before pileups happen, and a week view that always answers what is due next."
                }
              ].map((step, i) => (
                <Reveal key={step.title} delay={i * 100}>
                  <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4338CA] text-white">
                      <step.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-xs font-black uppercase tracking-wider text-[#0F1B2D]/45">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-black">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#0F1B2D]/70">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mx-auto mt-8 max-w-2xl">
              <p className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-4 text-center text-sm leading-relaxed text-[#0F1B2D]/70">
                <span className="font-bold text-[#0F1B2D]">Accuracy note: </span>
                SyllabiQ reads your syllabus, it does not replace it. Always check extracted dates
                and grade weights against your original document before you rely on them.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ CRUNCH WEEKS ============ */}
        <section className="border-t border-[#E2E8F0]">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-wider text-[#4338CA]">
                The distinctive part
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Crunch weeks, flagged before they hit
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#0F1B2D]/70">
                SyllabiQ spots the weeks where a large share of your final grade comes due, so you
                can start preparing early instead of getting blindsided.
              </p>
            </Reveal>
            <Reveal delay={120} className="mt-10">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex justify-center">
                  <SampleTag />
                </div>
                <WorkloadHeatmap tasks={SAMPLE_TASKS} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ WHAT WORKS TODAY ============ */}
        <section className="border-t border-[#E2E8F0] bg-[#0F1B2D] text-white">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
            <Reveal>
              <p className="text-xs font-black uppercase tracking-wider text-white/60">
                Honest status, updated October 2026
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">What works today</h2>
              <p className="mt-4 text-base leading-relaxed text-white/80">
                What works today: upload PDF, Word, text, Markdown, and photo scans, and export your
                deadlines in a calendar-ready format. Live LMS and Google sync are not available
                yet. They are planned, and this page will say so plainly until they ship.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ WHY WE BUILT IT ============ */}
        <section className="border-t border-[#E2E8F0]">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
            <Reveal>
              <p className="text-xs font-black uppercase tracking-wider text-[#4338CA]">
                Why we built it
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Keeping track of what is due should not be a second job
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#0F1B2D]/70">
                Upload a syllabus and get a semester plan: deadlines, readings, and study tasks,
                organized automatically. No more hunting through messy LMS modules and 12-page PDFs
                just to know what is due.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section id="pricing" className="scroll-mt-20 border-t border-[#E2E8F0] bg-[#F4F5FB]">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal className="text-center">
              <p className="text-xs font-black uppercase tracking-wider text-[#4338CA]">Pricing</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                One plan, one price
              </h2>
            </Reveal>
            <Reveal delay={100} className="mt-8">
              <div className="rounded-2xl border-2 border-[#4338CA]/20 bg-white p-8 text-center shadow-sm">
                <p className="text-5xl font-black tracking-tight">
                  $5<span className="text-xl font-bold text-[#0F1B2D]/60">/month</span>
                </p>
                <p className="mt-3 text-sm font-semibold text-[#0F1B2D]/60">
                  First month free, then $5 per month. Cancel anytime with one click. No commitments.
                </p>
                <ul className="mx-auto mt-6 max-w-md space-y-2.5 text-left text-sm">
                  {[
                    "Unlimited syllabus uploads and deadline extraction",
                    "Crunch-week warnings and grade-weight tracking",
                    "Calendar-ready exports of your semester plan",
                    "Works on iPhone, Android, iPad, and laptop"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#067647]/10">
                        <Check className="h-3 w-3 text-[#067647]" aria-hidden="true" />
                      </span>
                      <span className="text-[#0F1B2D]/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#4338CA] px-8 py-3.5 text-base font-bold text-white shadow-md shadow-[#4338CA]/25 transition hover:bg-[#3730A3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA] focus-visible:ring-offset-2 sm:w-auto"
                >
                  Try it free today
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="mx-auto mt-5 flex max-w-md items-start justify-center gap-2 text-xs leading-relaxed text-[#0F1B2D]/60">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#067647]" aria-hidden="true" />
                  <span>
                    SyllabiQ organizes your coursework. It never does your coursework for you. Check
                    your school rules on AI use with course material.
                  </span>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section id="faq" className="scroll-mt-20 border-t border-[#E2E8F0]">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal className="text-center">
              <p className="text-xs font-black uppercase tracking-wider text-[#4338CA]">FAQ</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Got questions? We have answers.
              </h2>
            </Reveal>
            <div className="mt-8 space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <Reveal key={faq.q} delay={idx * 60}>
                    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white transition">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left font-bold text-sm text-[#0F1B2D] transition hover:bg-[#F4F5FB] sm:p-5 sm:text-base"
                      >
                        <span className="leading-snug">{faq.q}</span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F4F5FB] text-[#0F1B2D]/60">
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="border-t border-[#E2E8F0] px-4 pb-5 pt-3 text-sm leading-relaxed text-[#0F1B2D]/70 sm:px-5 sm:text-base">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="mt-8 text-center">
              <p className="text-sm text-[#0F1B2D]/60">
                Have a specific question not covered here?{" "}
                <Link
                  href="/faq"
                  className="font-bold text-[#4338CA] underline-offset-4 hover:underline"
                >
                  Visit the full help center
                </Link>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="border-t border-[#E2E8F0] bg-[#0F1B2D] text-white">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <Reveal>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Never wonder what is due this semester.
              </h2>
              <p className="mt-4 text-sm font-semibold text-white/60">
                First month free, then $5 per month. Cancel anytime with one click. No commitments.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#4338CA] px-10 py-4 text-base font-bold text-white shadow-lg shadow-[#4338CA]/30 transition hover:bg-[#3730A3] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1B2D]"
              >
                Try it free today
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4338CA] text-white">
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-base font-black tracking-tight">
                Syllabi<span className="text-[#4338CA]">Q</span>
              </span>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#0F1B2D]/60" aria-label="Footer">
              <Link href="/features" className="transition hover:text-[#4338CA]">
                Features
              </Link>
              <Link href="/guides" className="transition hover:text-[#4338CA]">
                Guides
              </Link>
              <Link href="/faq" className="transition hover:text-[#4338CA]">
                Help center
              </Link>
              <Link href="/privacy" className="transition hover:text-[#4338CA]">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-[#4338CA]">
                Terms
              </Link>
            </nav>
          </div>
          <div className="mt-8 flex flex-col gap-2 border-t border-[#E2E8F0] pt-6 text-xs text-[#0F1B2D]/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 SyllabiQ by Harbour &amp; Main. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#067647]" aria-hidden="true" />
              Verify deadlines against your course sources.
            </p>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
