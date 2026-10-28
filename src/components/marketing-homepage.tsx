"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  GraduationCap,
  SearchCheck,
  ShieldCheck,
  Upload,
  WandSparkles
} from "lucide-react";
import { AuthModal } from "./auth-modal";
import { WorkloadHeatmap } from "./workload-heatmap";
import {
  SAMPLE_TASKS,
  SAMPLE_WEEK
} from "@/lib/sample-semester";

const spring = { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 };
const FAQS = [
  {
    q: "What syllabus files can I use?",
    a: "SyllabiQ accepts PDF, Word, text, and Markdown files, along with photo scans and phone screenshots. Review dates and grade details against the source document before relying on them."
  },
  {
    q: "Does SyllabiQ connect directly to Canvas or Blackboard?",
    a: "Direct LMS account sync is not available. You can import dated coursework from a supported LMS calendar feed, including Canvas, Blackboard, Brightspace, and Moodle, then verify it against the course source."
  },
  {
    q: "Can I sync Google Calendar?",
    a: "Live Google Calendar sync is not available in this release. SyllabiQ can create calendar-ready exports of your plan."
  },
  {
    q: "How does pricing work?",
    a: "SyllabiQ Pro includes a first month free, then costs $5 CAD per month. You can cancel from account settings."
  },
  {
    q: "Does SyllabiQ do my coursework?",
    a: "No. It helps organize course information and deadlines. Check your institution's rules before using AI tools with course materials."
  }
];

function Reveal({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 42, opacity: 0, filter: "blur(8px)" }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

function SampleTag() {
  return (
    <span className="sq-tag">
      <span className="sq-tag-dot" />
      Sample preview
    </span>
  );
}

function TossDemo() {
  const [tossed, setTossed] = useState(false);
  const files = [
    { code: "PSYCH 101", title: "Introduction to Psychology", pages: "08 pages", angle: -5 },
    { code: "CALC II", title: "Multivariable Calculus", pages: "12 pages", angle: 2 },
    { code: "HIST 203", title: "Cold War Histories", pages: "06 pages", angle: 6 }
  ];

  return (
    <div className="sq-demo" aria-label="Interactive sample syllabus preview">
      <div className="sq-demo-top">
        <div className="sq-window-dots" aria-hidden="true"><i /><i /><i /></div>
        <span>SYLLABIQ / SAMPLE PARSE</span>
        <span className="sq-live-pill">DEMO</span>
      </div>
      <div className="sq-dropzone">
        {!tossed ? (
          <>
            <span className="sq-drop-label"><Upload size={13} /> TOSS A SAMPLE IN</span>
            <span className="sq-drop-hint">Drag a paper into the frame or tap to see the transformation</span>
          </>
        ) : (
          <motion.div className="sq-extracted" initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring}>
            <span className="sq-check"><Check size={17} /></span>
            <span><b>Sample semester organized</b><small>Deadlines and course details, ready to review</small></span>
          </motion.div>
        )}
      </div>
      <div className="sq-demo-stage">
        <AnimatePresence mode="wait">
          {!tossed ? (
            <motion.div key="papers" className="sq-paper-stack" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .9, filter: "blur(8px)" }} transition={spring}>
              {files.map((file, index) => (
                <motion.button
                  key={file.code}
                  type="button"
                  drag
                  dragMomentum={false}
                  dragElastic={0.16}
                  onDragEnd={() => setTossed(true)}
                  onClick={() => setTossed(true)}
                  whileDrag={{ scale: 1.06, rotate: 3 }}
                  whileHover={{ y: -5, rotate: file.angle / 2 }}
                  whileTap={{ scale: .98 }}
                  initial={{ rotate: file.angle, y: index * 7 }}
                  className="sq-paper"
                  style={{ zIndex: files.length - index }}
                  aria-label={`Toss sample ${file.code} syllabus`}
                >
                  <span className="sq-paper-icon"><FileText size={20} /></span>
                  <span className="sq-paper-copy"><b>{file.code}</b><small>{file.title}</small></span>
                  <span className="sq-paper-pages">{file.pages}</span>
                  <span className="sq-paper-lines"><i /><i /><i /></span>
                </motion.button>
              ))}
              <button type="button" className="sq-toss-button" onClick={() => setTossed(true)}>
                Toss the sample syllabi <ArrowRight size={15} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              className="sq-calendar"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            >
              <div className="sq-calendar-head">
                <span><CalendarDays size={16} /> SAMPLE WEEK</span>
                <button type="button" onClick={() => setTossed(false)}>Reset</button>
              </div>
              <div className="sq-weekdays">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => <span key={day}>{day}</span>)}</div>
              <div className="sq-event-list">
                {SAMPLE_WEEK.map((item) => (
                  <motion.div key={item.course + item.title} className="sq-event" layout variants={{ hidden: { y: 18, opacity: 0, filter: "blur(5px)" }, show: { y: 0, opacity: 1, filter: "blur(0px)", transition: spring } }}>
                    <span className="sq-event-mark" style={{ backgroundColor: item.color }} />
                    <span className="sq-event-copy"><b>{item.title}</b><small>{item.course} · {item.kind}</small></span>
                    <span className="sq-event-time">{item.when}</span>
                  </motion.div>
                ))}
              </div>
              <p className="sq-sample-note">Illustrative sample data · your files are processed in your account</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="sq-demo-foot"><span>DRAG · DROP · REVIEW</span><span>Sample only — no document is uploaded</span></div>
    </div>
  );
}

export function MarketingHomepage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const painRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: painRef, offset: ["start end", "end start"] });
  const firstCard = useTransform(scrollYProgress, [0, .42, .68], [0, -5, -14]);
  const secondCard = useTransform(scrollYProgress, [0, .42, .68], [0, 3, -5]);
  const thirdCard = useTransform(scrollYProgress, [0, .42, .68], [0, -2, -9]);

  return (
    <div className="sq-marketing min-h-screen antialiased">
      <div className="sq-grain" aria-hidden="true" />
      <header className="sq-nav">
        <div className="sq-wrap sq-nav-inner">
          <Link href="/" className="sq-brand" aria-label="SyllabiQ home">
            <span className="sq-brand-mark"><GraduationCap size={19} /></span>
            <span>SyllabiQ<span className="sq-brand-period">.</span></span>
          </Link>
          <nav className="sq-nav-links" aria-label="Primary navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#features">What it finds</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <button className="sq-nav-cta" onClick={() => setShowAuthModal(true)}>Log in <ArrowRight size={14} /></button>
        </div>
      </header>

      <main>
        <section className="sq-hero sq-wrap">
          <div className="sq-hero-copy">
            <Reveal>
              <p className="sq-eyebrow"><span /> A calmer way to plan your term</p>
              <h1>From syllabus PDFs<br />to your entire <em>semester.</em></h1>
              <p className="sq-hero-sub">Drop in your course syllabi. SyllabiQ finds dates, exams, grade details, and more, then organizes them into a semester plan you can actually use.</p>
              <div className="sq-hero-actions">
                <button className="sq-primary" onClick={() => setShowAuthModal(true)}>Organize my semester <ArrowRight size={17} /></button>
                <a className="sq-secondary" href="#how-it-works">See how it works <ArrowDown size={15} /></a>
              </div>
              <p className="sq-trust"><ShieldCheck size={14} /> Start with an account · first month free, then $5 CAD/month</p>
              <div className="sq-supported">
                <span>PDF</span><span>DOCX</span><span>PHONE SCANS</span><i /> Review every result before it becomes your plan
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="sq-hero-demo"><TossDemo /></Reveal>
          <div className="sq-hero-index" aria-hidden="true">01 <span>—</span> PAPER TO PLAN</div>
        </section>

        <section ref={painRef} className="sq-pain">
          <div className="sq-wrap sq-pain-grid">
            <Reveal className="sq-pain-intro">
              <p className="sq-kicker">THE MESS IS FAMILIAR</p>
              <h2>Your syllabus<br />is not a <em>calendar.</em></h2>
              <p>Important details hide in long documents, and every instructor lays things out differently. One missed date can turn a manageable week upside down.</p>
            </Reveal>
            <div className="sq-pain-cards">
              <motion.article style={{ y: firstCard }} className="sq-pain-card sq-pain-yellow">
                <span className="sq-card-number">01 / DEADLINES</span>
                <h3>Midterm buried<br />on page four.</h3>
                <div className="sq-paper-snippet">The midterm examination will be held <mark>October 12 at 2:30 PM</mark> and will cover chapters one through four.</div>
              </motion.article>
              <motion.article style={{ y: secondCard }} className="sq-pain-card sq-pain-blue">
                <span className="sq-card-number">02 / OFFICE HOURS</span>
                <h3>Help is there.<br />Somewhere.</h3>
                <div className="sq-margin-note">“Tuesdays, 3–4 pm, or by appointment”<span>— para. 3</span></div>
              </motion.article>
              <motion.article style={{ y: thirdCard }} className="sq-pain-card sq-pain-ink">
                <span className="sq-card-number">03 / FORMATS</span>
                <h3>Five ways to<br />write one date.</h3>
                <div className="sq-date-scraps"><span>Oct 12</span><span>10/12</span><span>Week 6</span></div>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="sq-how sq-wrap">
          <Reveal className="sq-section-heading">
            <p className="sq-kicker">A SMALLER ADMIN JOB</p>
            <h2>Three steps. <em>Then get on with it.</em></h2>
          </Reveal>
          <div className="sq-steps">
            {[
              { n: "01", tag: "DROP", icon: Upload, title: "Add your syllabi", body: "Bring in PDFs, Word documents, text files, or photos of a printed syllabus." },
              { n: "02", tag: "SCAN", icon: SearchCheck, title: "Review what it found", body: "Check extracted deadlines and grade details against each original course document." },
              { n: "03", tag: "LIVE", icon: CalendarDays, title: "Plan your weeks", body: "See what's coming, spot busy stretches, and make calendar-ready exports." }
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * .08}>
                <article className={`sq-step sq-step-${i + 1}`}>
                  <div className="sq-step-top"><span>{step.n}</span><span className="sq-step-tag">{step.tag}</span></div>
                  <div className="sq-step-icon"><step.icon size={23} /></div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <span className="sq-step-rule" />
                </article>
              </Reveal>
            ))}
          </div>
          <p className="sq-accuracy"><ShieldCheck size={16} /> SyllabiQ helps organize information; always verify dates with your instructor or official course source.</p>
        </section>

        <section id="features" className="sq-features">
          <div className="sq-wrap">
            <Reveal className="sq-section-heading sq-feature-heading">
              <p className="sq-kicker">SEE THE SHAPE OF YOUR TERM</p>
              <h2>More than a list<br />of <em>due dates.</em></h2>
              <p>Pull the pieces together before the busy weeks arrive.</p>
            </Reveal>
            <div className="sq-bento">
              <Reveal className="sq-bento-large">
                <article className="sq-feature sq-feature-conflict">
                  <span className="sq-feature-label"><CalendarDays size={14} /> COURSE LOAD</span>
                  <h3>Find your crunch weeks<br />before they find you.</h3>
                  <p>A workload view helps you see when deadlines start to bunch up.</p>
                  <div className="sq-heatmap-frame"><SampleTag /><WorkloadHeatmap tasks={SAMPLE_TASKS} /></div>
                </article>
              </Reveal>
              <Reveal delay={.08} className="sq-bento-side">
                <article className="sq-feature sq-feature-deadlines">
                  <span className="sq-feature-label"><WandSparkles size={14} /> COURSE DETAILS</span>
                  <h3>Deadlines and grade weights, together.</h3>
                  <p>Keep key assessments and their course context in one place for review.</p>
                  <div className="sq-grade-row"><span>Midterm exam</span><b>25%</b><i /></div>
                  <div className="sq-grade-row"><span>Final paper</span><b>30%</b><i /></div>
                  <div className="sq-grade-row"><span>Problem sets</span><b>25%</b><i /></div>
                  <div className="sq-grade-row"><span>Participation</span><b>20%</b><i /></div>
                </article>
                <article className="sq-feature sq-feature-export">
                  <span className="sq-feature-label"><ArrowRight size={14} /> TAKE IT WITH YOU</span>
                  <h3>A plan you can carry forward.</h3>
                  <p>Export your semester in a calendar-ready format when you need it.</p>
                  <div className="sq-export-stamp">.ICS <ArrowRight size={16} /></div>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="sq-sample-proof">
          <div className="sq-marquee" aria-label="SyllabiQ features">
            <div className="sq-marquee-track">
              {["Deadlines, found", "Grade details, together", "Crunch weeks, visible", "Review before you rely", "Deadlines, found", "Grade details, together", "Crunch weeks, visible", "Review before you rely"].map((item, i) => (
                <span key={i}>{item}<i>✳</i></span>
              ))}
            </div>
          </div>
          <div className="sq-wrap sq-sample-note-row">
            <span className="sq-proof-mark">SQ / FIELD NOTE</span>
            <p>This page shows a sample semester. Your uploaded documents are handled inside your account, where you can review and edit what SyllabiQ extracts.</p>
            <a href="#pricing">View plan details <ArrowRight size={14} /></a>
          </div>
        </section>

        <section id="pricing" className="sq-pricing sq-wrap">
          <Reveal className="sq-pricing-copy">
            <p className="sq-kicker">STUDENT-PRICED, NO LONG CONTRACT</p>
            <h2>Make room for<br /><em>the semester.</em></h2>
            <p>Try SyllabiQ Pro for the first month, then $5 CAD/month. Cancel from your account settings.</p>
            <button className="sq-primary" onClick={() => setShowAuthModal(true)}>Start with a free month <ArrowRight size={17} /></button>
            <p className="sq-pricing-note"><ShieldCheck size={14} /> Secure checkout is handled by Stripe when you choose Pro.</p>
          </Reveal>
          <Reveal delay={.1} className="sq-price-card">
            <div className="sq-price-head"><span>SYLLABIQ PRO</span><span>MONTH TO MONTH</span></div>
            <div className="sq-price"><sup>$</sup>5<span>CAD / month</span></div>
            <p className="sq-price-trial">First month free</p>
            <div className="sq-price-rule" />
            {["Unlimited syllabus uploads", "Deadline and grade detail review", "Workload heatmap", "Calendar-ready exports"].map(item => <p className="sq-price-line" key={item}><Check size={15} /> {item}</p>)}
            <button onClick={() => setShowAuthModal(true)} className="sq-price-button">Create your account <ArrowRight size={15} /></button>
            <p className="sq-price-fine">Your plan and billing details are shown before checkout.</p>
          </Reveal>
        </section>

        <section className="sq-faq">
          <div className="sq-wrap sq-faq-grid">
            <Reveal>
              <p className="sq-kicker">GOOD QUESTIONS</p>
              <h2>Before you<br /><em>drop a PDF.</em></h2>
              <p className="sq-faq-help">Need more detail? Visit the <Link href="/faq">help centre</Link>.</p>
            </Reveal>
            <div className="sq-faq-list">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <Reveal key={faq.q} delay={idx * .035}>
                    <div className="sq-faq-item">
                      <button type="button" onClick={() => setOpenFaqIndex(isOpen ? null : idx)} aria-expanded={isOpen}>
                        <span>{faq.q}</span>{isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && <motion.div className="sq-faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring}>{faq.a}</motion.div>}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="sq-final">
          <div className="sq-wrap sq-final-inner">
            <Reveal>
              <p className="sq-kicker">YOUR PAPERS CAN WAIT</p>
              <h2>Stop hunting through syllabi.<br /><em>Start living your semester.</em></h2>
              <p>Turn course documents into a plan you can review, adjust, and use.</p>
              <button className="sq-primary" onClick={() => setShowAuthModal(true)}>Organize my semester <ArrowRight size={17} /></button>
            </Reveal>
            <div className="sq-final-note"><span>01</span><span>DROP → REVIEW → PLAN</span><span>SYLLABIQ.CA</span></div>
          </div>
        </section>
      </main>

      <footer className="sq-footer">
        <div className="sq-wrap sq-footer-inner">
          <Link href="/" className="sq-brand"><span className="sq-brand-mark"><GraduationCap size={17} /></span><span>SyllabiQ<span className="sq-brand-period">.</span></span></Link>
          <nav aria-label="Footer navigation"><Link href="/features">Features</Link><Link href="/guides">Guides</Link><Link href="/faq">Help</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
          <p>© 2026 SyllabiQ by Harbour &amp; Main · Verify dates against your course source.</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
