"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Camera,
  Cloud,
  Mic,
  Palette,
  Users,
  Smartphone,
  Tablet,
  Laptop,
  ArrowRight,
  HelpCircle,
  Clock,
  Target,
  BookOpen,
  GraduationCap,
  Award
} from "lucide-react";
import { Footer } from "@/components/footer";
import { ContactModal } from "@/components/contact-modal";

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<"FEATURES" | "GALLERY" | "AUDIENCE" | "FAQ">("FEATURES");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showContactModal, setShowContactModal] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-xs border border-slate-200/80 hover:border-blue-400 transition-all">
              <img
                src="/images/syllabiq-logo.png"
                alt="SyllabiQ Logo"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
            <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              PRODUCT TOUR
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab("FEATURES")}
              className={`transition cursor-pointer ${
                activeTab === "FEATURES" ? "text-blue-600 dark:text-blue-400" : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Features &amp; Capabilities
            </button>
            <button
              onClick={() => setActiveTab("GALLERY")}
              className={`transition cursor-pointer ${
                activeTab === "GALLERY" ? "text-blue-600 dark:text-blue-400" : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              App Pictures &amp; Views
            </button>
            <button
              onClick={() => setActiveTab("AUDIENCE")}
              className={`transition cursor-pointer ${
                activeTab === "AUDIENCE" ? "text-blue-600 dark:text-blue-400" : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Who It&apos;s For
            </button>
            <button
              onClick={() => setActiveTab("FAQ")}
              className={`transition cursor-pointer ${
                activeTab === "FAQ" ? "text-blue-600 dark:text-blue-400" : "hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Q&amp;A Section
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-extrabold text-white shadow-sm shadow-blue-500/25 transition cursor-pointer"
            >
              Open Dashboard &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-14 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-4 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Everything you need to excel this semester</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          One Intelligent OS For Your <br />
          <span className="marker-highlight text-slate-950 px-4 py-0.5 rounded-xl">
            Entire Semester
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          Say goodbye to syllabus scavenger hunts. SyllabiQ parses your course documents, builds your unified timeline, syncs seamlessly to Google Cloud and Google Calendar, and alerts your phone before anything is due.
        </p>

        {/* View Switcher Tabs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "FEATURES", label: "⚡ Features & Capabilities" },
            { id: "GALLERY", label: "📸 App Pictures & Mockups" },
            { id: "AUDIENCE", label: "🎯 Who It's For" },
            { id: "FAQ", label: "❓ Q&A Section" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md"
                  : "bg-white dark:bg-[#131B2E] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* CONTENT SECTIONS BASED ON ACTIVE TAB */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-20 w-full">

        {/* TAB 1: FEATURES & CAPABILITIES */}
        {activeTab === "FEATURES" && (
          <section className="space-y-12 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black">Full Feature Suite &amp; Functionality</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Engineered from the ground up for modern college students, academic researchers, and high-achievers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="paper-card p-6 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl">
                  📄
                </div>
                <h3 className="text-base font-black">Multimodal AI Syllabus Ingestion</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Drop PDFs, Word documents (.docx), or photos of printed syllabi. Vision models extract instructor office hours, grading weight distributions, and every single deadline into a normalized timeline.
                </p>
                <div className="pt-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  ✓ Supports Canvas, Blackboard, Brightspace &amp; Moodle
                </div>
              </div>

              {/* Feature 2 */}
              <div className="paper-card p-6 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl">
                  ☁️
                </div>
                <h3 className="text-base font-black">Google Cloud Academic Paper Vault</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Store term papers, lab reports, homework drafts, and thesis documents safely on Google Cloud Storage (GCS). Features versioning, MD5 checksum integrity, AI abstract summaries, and 1-click Google Docs launch.
                </p>
                <div className="pt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  ✓ 50 GB High-Durability Cloud Storage
                </div>
              </div>

              {/* Feature 3 */}
              <div className="paper-card p-6 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl">
                  📸
                </div>
                <h3 className="text-base font-black">Unlimited Homework Photos &amp; Vision OCR</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Snap worksheets or problem set handouts with your phone camera. Our OCR engine deconstructs problem numbers into actionable subtasks directly on your study schedule.
                </p>
                <div className="pt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Unlimited uploads on Pro tier ($0 1st month)
                </div>
              </div>

              {/* Feature 4 */}
              <div className="paper-card p-6 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl">
                  🔔
                </div>
                <h3 className="text-base font-black">Urgency Notification Bar &amp; Phone Alerts</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sticky urgency bar with audio chimes keeps you informed of upcoming deadlines. Configure SMS phone text alerts for 24h, 3h, 1h, and 15-minute crunch times so nothing slips by.
                </p>
                <div className="pt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  ✓ Interactive simulated test notifications
                </div>
              </div>

              {/* Feature 5 */}
              <div className="paper-card p-6 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl">
                  🎨
                </div>
                <h3 className="text-base font-black">Course Emojis &amp; Background Wallpapers</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Personalize courses with academic emojis (💻, 📈, 🧬, ⚖️) and preset pastel palettes. Switch between 10 curated academic wallpapers or upload your own background photo with blur and dimmer sliders.
                </p>
                <div className="pt-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  ✓ Light &amp; Dark Mode seamless synchronization
                </div>
              </div>

              {/* Feature 6 */}
              <div className="paper-card p-6 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl">
                  👥
                </div>
                <h3 className="text-base font-black">Campus Peer Hub &amp; Study Circles</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Connect with classmates at your university enrolled in the same lectures. Share conceptual homework hints, lecture notes, and study guides with upvotes and direct link sharing.
                </p>
                <div className="pt-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  ✓ Zero ghostwriting · 100% Honor Code compliant
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: PICTURES & APP GALLERY */}
        {activeTab === "GALLERY" && (
          <section className="space-y-12 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black">App Pictures &amp; Live View Mockups</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Designed to look stunning on iPhone, iPad, Mac, and Windows laptops.
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="space-y-12">
              {/* Picture 1: Real Student Study Session + Laptop View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Photo Left */}
                <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl group">
                  <img
                    src="/images/student-studying.jpg"
                    alt="Student studying with laptop at desk"
                    className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-5 flex flex-col justify-end text-white">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">Late Night Study Session</span>
                    <h4 className="text-base font-black">Zero Clutter. Pure Focus.</h4>
                    <p className="text-xs text-slate-300 font-medium">
                      Built for study sessions where every minute counts before 11:59 PM.
                    </p>
                  </div>
                </div>

                {/* Live App Timetable Right */}
                <div className="lg:col-span-7 paper-card p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Laptop className="h-5 w-5 text-blue-600" />
                      <h3 className="text-base font-black">Desktop Semester Dashboard &amp; Coursicle Timetable</h3>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                      Live Web View
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-900 text-white shadow-xl">
                    {/* Mock Browser Header */}
                    <div className="bg-slate-800 px-4 py-2.5 flex items-center space-x-2 text-xs border-b border-slate-700">
                      <div className="h-3 w-3 rounded-full bg-rose-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="ml-4 font-mono text-slate-400 text-[11px]">https://syllabiq.ca/dashboard</span>
                    </div>
                    <div className="p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 space-y-3">
                      <div className="bg-indigo-600/20 border border-indigo-500/40 p-3 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-black text-indigo-300">🚨 DUE TONIGHT: CS 3110 OCaml Warm-Up (40% weight)</span>
                        <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px]">3h 24m left</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-0.5">
                          <span className="text-lg">💻</span>
                          <h4 className="font-bold text-xs">CS 3110</h4>
                          <p className="text-[10px] text-slate-400">Data Structures</p>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-0.5">
                          <span className="text-lg">📈</span>
                          <h4 className="font-bold text-xs">ECON 1010</h4>
                          <p className="text-[10px] text-slate-400">Microeconomics</p>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-0.5">
                          <span className="text-lg">🧬</span>
                          <h4 className="font-bold text-xs">BIO 1500</h4>
                          <p className="text-[10px] text-slate-400">Molecular Bio</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Picture 2: Real Campus Study Group + Peer Hub */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Peer Hub UI Left */}
                <div className="lg:col-span-7 paper-card p-5 sm:p-6 space-y-4 order-2 lg:order-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-emerald-600" />
                      <h3 className="text-base font-black">Campus Peer Study Circles &amp; Note Exchange</h3>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                      Peer Hub
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src="/images/avatar-maya.jpg" alt="Maya L." className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-500/30" />
                      <div className="text-xs">
                        <span className="font-extrabold text-slate-900 dark:text-white">Maya L. (Cornell &apos;27)</span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Posted CS 3110 OCaml Recursion Cheat Sheet · 18 upvotes</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                      &ldquo;Tip for Problem 3: Remember tail recursion accumulator trick from Lecture 4! Saved me 2 hours of debugging.&rdquo;
                    </div>
                  </div>
                </div>

                {/* Photo Right */}
                <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl group order-1 lg:order-2">
                  <img
                    src="/images/student-group.jpg"
                    alt="College students smiling together on campus"
                    className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-5 flex flex-col justify-end text-white">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Campus Community</span>
                    <h4 className="text-base font-black">Learn Faster Together</h4>
                    <p className="text-xs text-slate-300 font-medium">
                      Share notes, hints, and study guides with your classmates safely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Picture 3: Academic Spaces Mosaic */}
              <div className="space-y-4 pt-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Every Academic Environment Supported
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    From lab benches to quad study sessions and high-tech libraries.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video group shadow-sm">
                    <img
                      src="/images/library-study.jpg"
                      alt="University library study hall"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-bold text-purple-300">CLOUD PAPER VAULT</span>
                      <h5 className="text-xs font-black">University Library Archive</h5>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video group shadow-sm">
                    <img
                      src="/images/premed-lab.jpg"
                      alt="Pre-med student in lab"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-bold text-emerald-300">VISION OCR HANDOUTS</span>
                      <h5 className="text-xs font-black">Science Lab Bench</h5>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 aspect-video group shadow-sm">
                    <img
                      src="/images/campus-quad.jpg"
                      alt="Students on campus quad"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-bold text-amber-300">SMART PHONE ALERTS</span>
                      <h5 className="text-xs font-black">Campus Quad Notifications</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: WHO IT'S FOR */}
        {activeTab === "AUDIENCE" && (
          <section className="space-y-12 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black">Who Is SyllabiQ Built For?</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tailored for every student journey, from fresh undergraduates to PhD candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Audience 1: STEM */}
              <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
                <div className="relative h-40 overflow-hidden bg-slate-900">
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
                    <h3 className="text-base font-black text-slate-900 dark:text-white">STEM &amp; Computer Science</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Managing weekly problem sets, GitHub programming assignments, and cumulative midterms. Break massive project milestones into bite-sized daily tasks with AI task deconstruction.
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800">
                    Ideal for: CS, Data Science, Math, Engineering
                  </div>
                </div>
              </div>

              {/* Audience 2: Pre-Med */}
              <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
                <div className="relative h-40 overflow-hidden bg-slate-900">
                  <img
                    src="/images/premed-lab.jpg"
                    alt="Pre-Med student conducting chemistry lab research"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <span>🧬</span> Pre-Med &amp; Science
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Pre-Med &amp; Life Science</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Balancing 3-hour lab blocks, rigorous lab reports, organic chemistry problem sets, and shadowing. Use the What-If Grade Simulator to protect your GPA for medical school admissions.
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-800">
                    Ideal for: Biology, Pre-Med, Chem, Nursing
                  </div>
                </div>
              </div>

              {/* Audience 3: Humanities */}
              <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
                <div className="relative h-40 overflow-hidden bg-slate-900">
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
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Humanities &amp; Pre-Law</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Juggling 200+ pages of weekly reading, policy case studies, and multiple drafts of term papers. Keep all essay drafts and literature reviews synchronized in the Google Cloud Vault.
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 border-t border-slate-100 dark:border-slate-800">
                    Ideal for: History, Political Science, Philosophy, English
                  </div>
                </div>
              </div>

              {/* Audience 4: Student Athletes */}
              <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
                <div className="relative h-40 overflow-hidden bg-slate-900">
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
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Student Athletes &amp; Leaders</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Navigating travel games, morning practices, executive board meetings, and exams. Synchronize your master academic schedule bidirectionally with Google Calendar and never miss an away-game due date.
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 border-t border-slate-100 dark:border-slate-800">
                    Ideal for: NCAA Athletes, Club Presidents, Greek Life
                  </div>
                </div>
              </div>

              {/* Audience 5: Graduate Students */}
              <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
                <div className="relative h-40 overflow-hidden bg-slate-900">
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
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Graduate Students &amp; PhD</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Tracking conference paper submission deadlines, research grant milestones, and teaching assistant duties. Save seminar research papers with version tags in Google Cloud Storage.
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 border-t border-slate-100 dark:border-slate-800">
                    Ideal for: Masters, MBA, Law, PhD candidates
                  </div>
                </div>
              </div>

              {/* Audience 6: First-Year Students */}
              <div className="paper-card overflow-hidden flex flex-col group hover:shadow-lg transition">
                <div className="relative h-40 overflow-hidden bg-slate-900">
                  <img
                    src="/images/student-studying.jpg"
                    alt="First-year student studying with laptop at desk"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <span>🎒</span> Freshmen &amp; Transfers
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">First-Year &amp; Transfer Students</h3>
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
          </section>
        )}

        {/* TAB 4: Q&A SECTION */}
        {activeTab === "FAQ" && (
          <section className="space-y-8 animate-fade-in max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black">Frequently Asked Questions (Q&amp;A)</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Everything you need to know about syllabi parsing, Google Cloud integration, and privacy.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "What syllabus file formats does SyllabiQ support?",
                  a: "SyllabiQ accepts PDF files (.pdf), Microsoft Word documents (.docx), plain text (.txt), Markdown (.md), and photo scans / phone screenshots (JPEG, PNG, HEIC). Our multimodal parser accurately identifies tabular grading breakdowns, weekly schedules, and policies."
                },
                {
                  q: "How does the Google Cloud Storage (GCS) Paper Vault work?",
                  a: "The Google Cloud Vault securely backs up your term papers, lab reports, homework drafts, and cheat sheets to enterprise Google Cloud Storage with 99.999999999% durability. You get versioning (v1.0 Draft to v2.0 Final), AI-generated abstracts, and 1-click links to open Word or text files directly in Google Docs."
                },
                {
                  q: "Is SyllabiQ 100% compliant with my university's Academic Integrity Code?",
                  a: "Yes, 100%. SyllabiQ does NOT write papers, solve exam problems, or provide ghostwriting services. In the Campus Peer Hub, shared hints are strictly conceptual and moderated. Our tool is purely an academic organization and scheduling assistant."
                },
                {
                  q: "How does the $5/month subscription and 1st Month Free Trial work?",
                  a: "You get full SyllabiQ Pro access 100% free for your first 30 days! After 30 days, Pro is just $5.00/month (billed securely through Stripe). You can cancel at any time with a single click in your settings with no hidden fees or commitments."
                },
                {
                  q: "How does Google Calendar and Google Sheets sync work?",
                  a: "SyllabiQ creates dedicated sub-calendars for each course with custom color coding and emojis. Any deadline added or edited in SyllabiQ immediately syncs to your Google Calendar on your phone. You can also export a live master tracker to Google Sheets."
                },
                {
                  q: "Can I customize the background wallpaper and toggle dark mode?",
                  a: "Yes! Use the theme toggle button in the top navbar to switch between crisp light mode and midnight dark mode. You can also click 'Wallpaper' to select from 10 aesthetic academic presets or upload your own custom photo with live blur and opacity controls."
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="paper-card overflow-hidden border border-slate-200 dark:border-slate-800 transition"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-5 flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Global Footer with Harbour and Main Logo */}
      <Footer onOpenContactModal={() => setShowContactModal(true)} />

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}
