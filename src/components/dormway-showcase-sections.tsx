"use client";

import React, { useState } from "react";
import {
  Calendar,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Clock3,
  Award,
  BookOpen,
  GraduationCap
} from "lucide-react";

interface Props {
  onOpenCanvas: () => void;
  onOpenUpload: () => void;
}

export function DormwayShowcaseSections({ onOpenCanvas, onOpenUpload }: Props) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@syllabiq.ca");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: CANVAS SYNC WITHOUT CAMPUS IT */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden w-full max-w-full min-w-0">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full min-w-0">
          {/* Left: Copy & Value Proposition */}
          <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
              <Calendar className="h-3.5 w-3.5 text-rose-600" />
              <span>Canvas & LMS Integration</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight break-words">
              Import Calendar Feeds <br />
              <span className="text-rose-600">as iCal snapshots</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium break-words">
              Paste your private calendar feed URL (Canvas, Blackboard, Brightspace, Moodle) to import deadlines as a one-time snapshot. Direct OAuth integrations are on the roadmap.
            </p>

            <ul className="space-y-3 pt-1 text-xs sm:text-sm font-semibold text-slate-700 w-full min-w-0">
              <li className="flex items-start gap-2.5 sm:gap-3 w-full min-w-0">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-rose-600" />
                </div>
                <span className="flex-1 min-w-0 break-words leading-snug">Import calendar deadlines as a one-time snapshot after setup</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 w-full min-w-0">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-rose-600" />
                </div>
                <span className="flex-1 min-w-0 break-words leading-snug">Provider OAuth/API imports are on the roadmap</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 w-full min-w-0">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-rose-600" />
                </div>
                <span className="flex-1 min-w-0 break-words leading-snug">Calendar-ready reminders on your iPhone, Android &amp; iPad</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 w-full min-w-0 text-emerald-700">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <span className="flex-1 min-w-0 break-words leading-snug">100% academic integrity safe (we never submit or message professors)</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenCanvas}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-5 py-3.5 shadow-md transition cursor-pointer"
              >
                <span>Open LMS Import</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>

          {/* Right: Live Canvas Preview Mockup */}
          <div className="relative space-y-3 w-full min-w-0">
            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-600">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-rose-700">
                <span className="h-2 w-2 rounded-full bg-rose-600" />
                Canvas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-slate-700">
                <FileText className="h-3 w-3 text-blue-600" />
                PDF Syllabus
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-slate-700">
                <Mail className="h-3 w-3 text-amber-600" />
                Email Forward
              </span>
              <span className="text-slate-400">→</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-blue-700">
                SyllabiQ
              </span>
            </div>

            {/* Canvas Sync Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-6 shadow-sm space-y-3 w-full min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">LMS Import Status</h3>
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-amber-700 shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-amber-600" />
                  <span>iCal snapshot pending setup</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white transition w-full min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-slate-900 truncate">MATH 201: Calculus III</div>
                      <div className="text-[11px] text-slate-500 truncate font-medium">Problem Set 7 (Vectors &amp; Surfaces)</div>
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-700 sm:shrink-0 pl-5 sm:pl-0">Tonight · 11:59 PM</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white transition w-full min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-slate-900 truncate">ENG 102: Academic Writing</div>
                      <div className="text-[11px] text-slate-500 truncate font-medium">Comparative Essay Draft (Peer Review)</div>
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-700 sm:shrink-0 pl-5 sm:pl-0">Tomorrow · 5:00 PM</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white transition w-full min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-slate-900 truncate">BIO 210: Molecular Biology</div>
                      <div className="text-[11px] text-slate-500 truncate font-medium">Lab Report 4: Gel Electrophoresis</div>
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-700 sm:shrink-0 pl-5 sm:pl-0">Fri · 11:59 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FORWARD A SYLLABUS & GRADE BREAKDOWN */}
      <section className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden w-full max-w-full min-w-0">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center w-full min-w-0">
          {/* Left: Interactive Syllabus Breakdown Card */}
          <div className="order-2 lg:order-1 relative w-full min-w-0">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-6 shadow-sm space-y-3.5 w-full min-w-0">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">ECON 301 Syllabus Summary</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Intermediate Microeconomics</p>
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  Processed in 48s
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs font-bold text-center">
                <div className="rounded-xl bg-blue-50/70 border border-blue-200 px-2.5 py-2 text-blue-900 truncate">
                  12 deadlines extracted
                </div>
                <div className="rounded-xl bg-amber-50/70 border border-amber-200 px-2.5 py-2 text-amber-900 truncate">
                  4 policies flagged
                </div>
              </div>

              {/* Syllabus Grade Weights Bar Graph */}
              <div className="space-y-3 pt-1 w-full min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="truncate pr-2">Midterm Exam</span>
                    <span className="text-rose-600 shrink-0 font-black">25%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: "25%" }} />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">Oct 12 · 2:00 PM (In-person)</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="truncate pr-2">Final Term Exam</span>
                    <span className="text-indigo-600 shrink-0 font-black">30%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "30%" }} />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">Dec 18 · 9:00 AM (Cumulative)</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="truncate pr-2">Homework Problem Sets</span>
                    <span className="text-emerald-600 shrink-0 font-black">25%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "25%" }} />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">10 assignments · Lowest dropped</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="truncate pr-2">Recitation &amp; Participation</span>
                    <span className="text-amber-600 shrink-0 font-black">20%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }} />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">Weekly discussion attendance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy & Forward Instructions */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6 w-full min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>Multimodal Syllabus Engine</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight break-words">
              Forward a syllabus <br />
              <span className="text-blue-600">We fill your calendar</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium break-words">
              We pull every due date, calculate exact category weights, and extract hidden attendance and late policies.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 space-y-2.5 w-full min-w-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Direct Email Ingestion
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 w-full min-w-0">
                <code className="text-xs sm:text-sm font-mono font-bold text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 truncate select-all">
                  support@syllabiq.ca
                </code>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 transition cursor-pointer shadow-xs text-center shrink-0"
                >
                  {copiedEmail ? "Copied! ✓" : "Copy Email"}
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Forward your course PDFs directly from your university email. No app install needed.
              </p>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenUpload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm px-5 py-3.5 shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <span>Upload a Syllabus Document</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY SYLLABIQ */}
      <section className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 sm:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-8 w-full max-w-full min-w-0 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-3 w-full min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 shadow-2xs max-w-full">
            <GraduationCap className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="truncate">Why SyllabiQ exists</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight break-words">
            Why we built SyllabiQ
          </h2>
          <p className="text-sm sm:text-lg text-slate-700 font-medium max-w-2xl mx-auto break-words">
            Keeping track of what&apos;s due shouldn&apos;t be a second job. Upload a syllabus and get a semester plan — deadlines, readings, and study tasks, organized automatically. No more hunting through messy Canvas modules and 12-page PDFs just to know what&apos;s due.
          </p>
        </div>

        {/* What SyllabiQ does for you */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 w-full min-w-0">
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-4 sm:p-5 shadow-2xs space-y-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Syllabus to schedule in seconds</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed break-words">
              Drop in a course syllabus and SyllabiQ pulls every due date, reading, and exam into one organized semester plan.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-4 sm:p-5 shadow-2xs space-y-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/30 border-2 border-rose-300 dark:border-rose-700 flex items-center justify-center shrink-0">
              <Clock3 className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Crunch weeks flagged early</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed break-words">
              Prep buffers spot the weeks where exams and deadlines pile up, so nothing blindsides you.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-4 sm:p-5 shadow-2xs space-y-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Deadlines in your calendar</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed break-words">
              Import deadlines straight into the calendar you already use. Organization only — SyllabiQ never does your coursework for you.
            </p>
          </div>
        </div>

        {/* CAMPUS LIFE PHOTO SHOWCASE */}
        <div className="pt-4 sm:pt-6 space-y-4 w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white break-words">
                Everyday Academic Life Powered by SyllabiQ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                From quiet library corners to bustling campus quads and study groups.
              </p>
            </div>
            <span className="self-start sm:self-auto inline-block text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 shrink-0">
              Campus Spotlight
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
            {/* Photo 1: User's Studying Photo */}
            <div className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-4/3 shadow-sm hover:shadow-md transition">
              <img
                src="/images/student-studying.jpg"
                alt="Student studying with laptop"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Late Night Focus</span>
                <p className="text-xs font-bold leading-tight">OCaml &amp; Problem Sets In Gates Hall</p>
              </div>
            </div>

            {/* Photo 2: User's Group Photo */}
            <div className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-4/3 shadow-sm hover:shadow-md transition">
              <img
                src="/images/student-group.jpg"
                alt="College students smiling together on campus"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Study Circles</span>
                <p className="text-xs font-bold leading-tight">Peer Note Sharing &amp; Exam Review</p>
              </div>
            </div>

            {/* Photo 3: Campus Quad */}
            <div className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-4/3 shadow-sm hover:shadow-md transition">
              <img
                src="/images/campus-quad.jpg"
                alt="University campus quad"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Campus Wide</span>
                <p className="text-xs font-bold leading-tight">Synchronized across 6,000+ Colleges</p>
              </div>
            </div>

            {/* Photo 4: Library Study */}
            <div className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-4/3 shadow-sm hover:shadow-md transition">
              <img
                src="/images/library-study.jpg"
                alt="University library study hall"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">Paper Vault</span>
                <p className="text-xs font-bold leading-tight">Google Cloud Storage for Term Papers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold text-slate-500 dark:text-slate-400 w-full min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>100% Academic Integrity Safe</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Award className="h-4 w-4 text-blue-600 shrink-0" />
            <span>6,134 Universities Supported</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Lock className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>Read-Only Encrypted API Access</span>
          </div>
        </div>
      </section>
    </div>
  );
}
