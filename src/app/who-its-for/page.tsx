"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, Sparkles, Laptop, ShieldCheck, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { ContactModal } from "@/components/contact-modal";

export default function WhoItsForPage() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/25 rotate-[-8deg] group-hover:rotate-0 transition-transform">
              <Send className="h-5 w-5 fill-white stroke-none" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Syllabi<span className="text-blue-600 dark:text-blue-400">Q</span>
              </span>
              <span className="ml-2 rounded-full bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                WHO IT&apos;S FOR
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/features"
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600"
            >
              All Features &rarr;
            </Link>
            <Link
              href="/"
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-extrabold text-white shadow-sm shadow-blue-500/25 transition"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-4 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Built For Student Success Across Every Major</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Who Uses SyllabiQ?
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Whether you&apos;re writing proof lemmas at 2 AM or preparing for medical school exams, SyllabiQ is built for your rigorous academic lifestyle.
          </p>
        </div>

        {/* Campus Community Banner featuring User Attached Photo */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-white shadow-xl">
          <img
            src="/images/student-group.jpg"
            alt="College students smiling together on campus"
            className="w-full h-64 sm:h-80 object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 sm:p-10 flex flex-col justify-end">
            <div className="inline-flex items-center space-x-2 rounded-full bg-blue-500/20 border border-blue-400/40 px-3.5 py-1 text-xs font-bold text-blue-300 w-fit mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Campus Community Across 120+ Universities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-2xl leading-tight">
              Designed for the Students Shaping Tomorrow
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium mt-1">
              Whether you are collaborating on campus benches, studying in quiet library archives, or burning the midnight oil in your dorm room.
            </p>
          </div>
        </div>

        {/* Major & Student Persona Grid with Rich Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: STEM & Computer Science */}
          <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src="/images/stem-coding.jpg"
                alt="Computer Science student programming code"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>💻</span> STEM &amp; CS
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  STEM &amp; Computer Science Majors
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Managing weekly problem sets, GitHub programming assignments, and cumulative midterms. Break massive project milestones into bite-sized daily tasks with AI task deconstruction.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800">
                Ideal for: CS, Data Science, Math, Engineering
              </div>
            </div>
          </div>

          {/* Card 2: Pre-Med & Life Science */}
          <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src="/images/premed-lab.jpg"
                alt="Student conducting chemistry lab research"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>🧬</span> Pre-Med &amp; Science
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Pre-Med &amp; Life Science Students
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Balancing 3-hour lab blocks, rigorous lab reports, organic chemistry problem sets, and shadowing. Use the What-If Grade Simulator to protect your GPA for medical school admissions.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-800">
                Ideal for: Biology, Pre-Med, Chem, Nursing
              </div>
            </div>
          </div>

          {/* Card 3: Humanities & Pre-Law */}
          <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src="/images/humanities-writing.jpg"
                alt="Humanities student writing research paper"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>⚖️</span> Humanities &amp; Law
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Humanities, Pre-Law &amp; Policy
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Juggling 200+ pages of weekly reading, policy case studies, and multiple drafts of term papers. Keep all essay drafts and literature reviews synchronized in the Google Cloud Vault.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 border-t border-slate-100 dark:border-slate-800">
                Ideal for: History, Political Science, Philosophy, English
              </div>
            </div>
          </div>

          {/* Card 4: Student Athletes */}
          <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src="/images/student-athlete.jpg"
                alt="Student athlete training on campus"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>🏃‍♂️</span> Varsity &amp; Athletics
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Student Athletes &amp; Campus Leaders
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Navigating travel games, morning practices, executive board meetings, and exams. Synchronize your master academic schedule bidirectionally with Google Calendar and never miss an away-game due date.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 border-t border-slate-100 dark:border-slate-800">
                Ideal for: NCAA Athletes, Club Presidents, Greek Life
              </div>
            </div>
          </div>

          {/* Card 5: Graduate Students & PhD */}
          <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src="/images/library-study.jpg"
                alt="University library study hall"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>🎓</span> Graduate &amp; PhD
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Graduate Students &amp; PhD Candidates
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tracking conference paper submission deadlines, research grant milestones, and teaching assistant duties. Save seminar research papers with version tags in Google Cloud Storage.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
                Ideal for: Masters, MBA, Law, PhD candidates
              </div>
            </div>
          </div>

          {/* Card 6: First-Year & Transfer (User's Attached Photo) */}
          <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
            <div className="relative h-44 overflow-hidden bg-slate-900">
              <img
                src="/images/student-studying.jpg"
                alt="Student studying with laptop at desk"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>🎒</span> Freshmen &amp; Transfers
              </div>
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  First-Year &amp; Transfer Students
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Overwhelmed by college-paced courses after high school? SyllabiQ acts as your personal digital academic advisor, formatting your first semester into a clear, stress-free road map.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-bold text-rose-600 dark:text-rose-400 border-t border-slate-100 dark:border-slate-800">
                Ideal for: Freshmen, Transfer Students, Community College
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-8 py-3 text-sm font-extrabold shadow-md hover:opacity-90 transition"
          >
            <span>Start Organizing Your Classes Free</span>
            <span className="text-base">&rarr;</span>
          </Link>
        </div>
      </main>

      <Footer onOpenContactModal={() => setShowContactModal(true)} />
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}
