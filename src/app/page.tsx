"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Calendar,
  Layers,
  Table2,
  Brain,
  Sun,
  Share2,
  Mic,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Plus,
  Clock,
  BookOpen,
  FolderLock,
  Palette,
  CheckSquare,
  Square,
  Sparkles,
  Bell,
  MoreVertical,
  GraduationCap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Course, TaskItem, BackgroundConfig } from "@/lib/types";
import { Navbar } from "@/components/navbar";
import { SyllabusDropzone } from "@/components/syllabus-dropzone";
import { WorkloadHeatmap } from "@/components/workload-heatmap";
import { ScheduleTimeline } from "@/components/schedule-timeline";
import { CoursicleScheduleView } from "@/components/coursicle-schedule-view";
import { FlashcardsTab } from "@/components/flashcards-tab";
import { PhoneNotificationsStrip } from "@/components/phone-notifications-strip";
import { BottomTabBar, TabMode } from "@/components/bottom-tab-bar";
import { DormwayStartWidget } from "@/components/dormway-start-widget";
import { SemesterTimelineView } from "@/components/semester-timeline-view";
import { DormwayShowcaseSections } from "@/components/dormway-showcase-sections";
import { LMSSyncModal } from "@/components/lms-sync-modal";
import { GoogleSheetsModal } from "@/components/google-sheets-modal";
import { GradeCalculatorModal } from "@/components/grade-calculator-modal";
import { MorningDispatchModal } from "@/components/morning-dispatch-modal";
import { AudioTranscriberModal } from "@/components/audio-transcriber-modal";
import { ShareScheduleModal } from "@/components/share-schedule-modal";
import { MobilePreviewModal } from "@/components/mobile-preview-modal";
import { ClassLockerModal } from "@/components/class-locker-modal";
import { AIChatDrawer } from "@/components/ai-chat-drawer";
import { NotificationBar } from "@/components/notification-bar";
import { HomeworkPhotoModal } from "@/components/homework-photo-modal";
import { ColorCustomizerModal } from "@/components/color-customizer-modal";
import { CampusPeerHubModal } from "@/components/campus-peer-hub-modal";
import { StripePaywallModal } from "@/components/stripe-paywall-modal";
import { BackgroundLayer } from "@/components/background-layer";
import { BackgroundCustomizerModal } from "@/components/background-customizer-modal";
import { GoogleCloudVaultModal } from "@/components/google-cloud-vault-modal";
import { ContactModal } from "@/components/contact-modal";
import { CoursicleModal } from "@/components/coursicle-modal";
import { SemesterTimelineModal } from "@/components/semester-timeline-modal";
import { AuthModal } from "@/components/auth-modal";
import { AdminPanelModal } from "@/components/admin-panel-modal";
import { StoryCardModal } from "@/components/story-card-modal";
import { ClassGroupsModal } from "@/components/class-groups-modal";
import { SettingsModal } from "@/components/settings-modal";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";

const LANDING_FAQS = [
  {
    q: "What syllabus file formats does SyllabiQ support?",
    a: "SyllabiQ accepts PDF files (.pdf), Word documents (.docx), plain text (.txt), Markdown (.md), and photo scans / phone camera screenshots (JPEG, PNG, HEIC). Our multimodal AI accurately extracts grade breakdowns, assignments, exam dates, and policies in under 60 seconds."
  },
  {
    q: "How does the first month free, then $5/month subscription work?",
    a: "You get full SyllabiQ Pro access 100% free for your first month ($0 billed today via Stripe). Then Pro is just $5.00/month. You can cancel at any time with a single click in your account settings with zero commitments or hidden fees."
  },
  {
    q: "Can I sync Canvas without campus IT approval?",
    a: "Yes! SyllabiQ connects using a read-only student access token generated directly from your Canvas profile. It takes 30 seconds to set up, requires zero administrator approvals, and auto-syncs your assignments, running grades, and deadlines bidirectionally."
  },
  {
    q: "Is SyllabiQ 100% compliant with my university's Academic Integrity Code?",
    a: "Yes, 100%. SyllabiQ is strictly an academic organization, scheduling, and study system. It never writes essays, never solves exam questions, and never submits assignments or messages professors on your behalf."
  },
  {
    q: "How do Google Calendar and Google Sheets sync work?",
    a: "SyllabiQ creates dedicated sub-calendars for each of your enrolled courses with custom color coding and emojis. Any deadline added or edited in SyllabiQ immediately syncs to your Google Calendar on your phone. You can also export a live master tracker to Google Sheets."
  },
  {
    q: "Can I use SyllabiQ on my phone as a mobile app?",
    a: "Yes! SyllabiQ is fully responsive and optimized for mobile viewports (iPhone & Android). You can tap 'Share' -> 'Add to Home Screen' in Safari or Chrome to use it just like a native mobile app with bottom navigation and push notifications."
  }
];

export default function SyllabiQDashboard() {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const requirePro = async (action: () => void | Promise<void>): Promise<void> => {
    if (user?.isPro) {
      await action();
    } else {
      setShowPaywallModal(true);
    }
  };
  const [activeMainTab, setActiveMainTab] = useState<TabMode>("TIMELINE");
  const [showDropzone, setShowDropzone] = useState(false);
  const [showCoursicleModal, setShowCoursicleModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Background state
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>({
    type: "default",
    templateId: "default-grid",
    blurPx: 0,
    overlayOpacity: 0.35,
    overlayTint: "auto"
  });

  // Modals state
  const [showLmsModal, setShowLmsModal] = useState(false);
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showLockerModal, setShowLockerModal] = useState(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showPeerModal, setShowPeerModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallNotice, setPaywallNotice] = useState("");
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showCloudVaultModal, setShowCloudVaultModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyHighlightTask, setStoryHighlightTask] = useState<TaskItem | null>(null);
  const [showClassGroupsModal, setShowClassGroupsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses || []);
      setTasks(data.tasks || []);

      // Also fetch background config
      const bgRes = await fetch("/api/background");
      const bgData = await bgRes.json();
      if (bgData.config) {
        setBackgroundConfig(bgData.config);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Handle return from Stripe Checkout (success_url includes ?checkout=success&session_id=...).
    // The return-verify endpoint only CONFIRMS the session (read-only, no
    // billing mutation). Pro status is driven by the verified
    // checkout.session.completed webhook, so poll /api/subscription until
    // the webhook lands, then refresh the session and celebrate.
    const params = new URLSearchParams(window.location.search);
    const checkoutState = params.get("checkout");
    const sessionId = params.get("session_id");
    if (checkoutState === "success" && sessionId) {
      window.history.replaceState(null, "", window.location.pathname);
      (async () => {
        try {
          const verify = await fetch(`/api/stripe/checkout?session_id=${encodeURIComponent(sessionId)}`);
          if (!verify.ok) return;
          for (let i = 0; i < 20; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            const subRes = await fetch("/api/subscription");
            if (subRes.ok) {
              const sub = await subRes.json();
              if (sub.isPro || sub.tier === "PRO") {
                await refreshUser();
                await fetchDashboardData();
                confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
                setShowPaywallModal(true);
                return;
              }
            }
          }
          // Webhook hasn't landed yet — open the modal with an activating note.
          setPaywallNotice("Payment confirmed — your Pro trial is activating. This usually takes a few seconds; refresh if it doesn't appear.");
          setShowPaywallModal(true);
        } catch (err) {
          console.error("Checkout verification failed", err);
        }
      })();
    } else if (checkoutState === "cancelled") {
      window.history.replaceState(null, "", window.location.pathname);
      setShowPaywallModal(true);
    }
  }, []);

  const scrollToMainView = () => {
    setTimeout(() => {
      const el = document.getElementById("main-view-container");
      if (el) {
        const yOffset = -85;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 60);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/google/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_all" })
      });
      if (res.ok) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
        await fetchDashboardData();
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTask = async (taskId: string, patch: any) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, ...patch })
      });
      if (res.ok) {
        await fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeconstructTask = async (taskId: string) => {
    const res = await fetch("/api/ai/deconstruct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId })
    });
    if (res.ok) {
      confetti({ particleCount: 50, spread: 50 });
      await fetchDashboardData();
    }
  };

  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col selection:bg-yellow-300 selection:text-slate-900 pb-36 sm:pb-28 pb-safe transition-colors duration-200">
      {/* Background Wallpaper Layer */}
      <BackgroundLayer config={backgroundConfig} />

      {/* Top Navbar */}
      <Navbar
        onOpenLmsModal={() => setShowLmsModal(true)}
        onOpenSheetsModal={() => requirePro(() => setShowSheetsModal(true))}
        onOpenGradeModal={() => requirePro(() => setShowGradeModal(true))}
        onOpenDispatchModal={() => requirePro(() => setShowDispatchModal(true))}
        onOpenLockerModal={() => requirePro(() => setShowLockerModal(true))}
        onOpenAudioModal={() => requirePro(() => setShowAudioModal(true))}
        onOpenShareModal={() => requirePro(() => setShowShareModal(true))}
        onOpenMobileModal={() => setShowMobileModal(true)}
        onOpenHomeworkModal={() => requirePro(() => setShowHomeworkModal(true))}
        onOpenColorModal={() => requirePro(() => setShowColorModal(true))}
        onOpenPeerModal={() => requirePro(() => setShowPeerModal(true))}
        onOpenPaywallModal={() => setShowPaywallModal(true)}
        onOpenBackgroundModal={() => requirePro(() => setShowBackgroundModal(true))}
        onOpenCloudVaultModal={() => requirePro(() => setShowCloudVaultModal(true))}
        onOpenStoryModal={() => {
          setStoryHighlightTask(null);
          setShowStoryModal(true);
        }}
        onOpenClassGroupsModal={() => setShowClassGroupsModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenAdminPanel={() => setShowAdminModal(true)}
        onOpenSettingsModal={() => setShowSettingsModal(true)}
        onSyncAll={() => requirePro(handleSyncAll)}
        isSyncing={isSyncing}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-8 sm:space-y-10 w-full max-w-full overflow-x-hidden">
        {/* TOP NOTIFICATION BAR: Urgent countdown & phone alerts */}
        <NotificationBar
          tasks={tasks}
          isPro={user?.isPro}
          onOpenPaywall={() => setShowPaywallModal(true)}
        />

        {/* HERO SECTION combining DormWay & Due Gooder punch */}
        <section className="relative text-center py-4 sm:py-6 space-y-4 max-w-3xl mx-auto">
          {/* Social Proof Pill Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full bg-white px-4 py-1.5 border border-slate-200 shadow-xs">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700">
              Never Wonder What&apos;s Due · Try It Free Today
            </span>
          </div>

          {/* Headline with Yellow Marker Highlighter */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Never Wonder <br />
            <span className="marker-highlight text-slate-950 font-black px-4 py-0.5 rounded-lg shadow-xs">
              What&apos;s Due
            </span>{" "}
            This Semester
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto">
            Drop a syllabus or connect Canvas. SyllabiQ builds your semester timeline automatically, syncs with Google Calendar, and keeps you organized.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => requirePro(() => setShowDropzone(true))}
              className="rounded-full bg-blue-600 px-7 py-2.5 text-sm font-extrabold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 transition cursor-pointer"
            >
              Upload Syllabus Here
            </button>

            <button
              onClick={() => setShowLmsModal(true)}
              className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-6 py-2.5 text-sm font-extrabold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-200 transition cursor-pointer"
            >
              Import Calendar (Preview)
            </button>

            <button
              onClick={() => setShowDropzone(!showDropzone)}
              className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-800 border border-slate-300 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            >
              {showDropzone ? "Hide Upload Area" : "How It Works"}
            </button>
          </div>

          {/* Pricing Callout */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <div className="inline-flex items-center space-x-3 bg-white/95 dark:bg-[#131B2E]/95 border border-slate-200 dark:border-slate-800 rounded-full py-2 px-5 shadow-sm backdrop-blur-xs">
              <div className="text-left text-xs leading-tight">
                <span className="font-extrabold text-slate-900 dark:text-white block">
                  First Month Free · Then $5/Month
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Cancel anytime with 1 click. No commitments.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Dropzone Area (Expandable or always accessible) */}
        {showDropzone && (
          <section className="max-w-4xl mx-auto animate-fade-in">
            <SyllabusDropzone
              isPro={user?.isPro}
              onOpenPaywall={() => setShowPaywallModal(true)}
              onCommitSuccess={async () => {
                await fetchDashboardData();
                setShowDropzone(false);
              }}
            />
          </section>
        )}

        {/* REAL CAMPUS LIFE & STUDENT PHOTO GALLERY BANNER */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#131B2E]/90 p-6 sm:p-8 backdrop-blur-md shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Life on Campus with SyllabiQ</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Study Smarter, Stress Less, Together
              </h3>
            </div>
            <Link
              href="/who-its-for"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>See student stories across every major</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Photo 1: User's Study photo */}
            <div className="relative rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
              <div className="h-52 w-full overflow-hidden">
                <img
                  src="/images/student-studying.jpg"
                  alt="Student preparing for exams in campus cafe"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 text-white space-y-1">
                <span className="text-[10px] font-extrabold bg-blue-600 px-2 py-0.5 rounded-md w-fit">
                  FOCUSED STUDY
                </span>
                <h4 className="text-sm font-black">Never Miss an 11:59 PM Deadline</h4>
                <p className="text-[11px] text-slate-200 line-clamp-2">
                  Break big term papers and problem sets into daily achievable milestones.
                </p>
              </div>
            </div>

            {/* Photo 2: User's Student Group photo */}
            <div className="relative rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
              <div className="h-52 w-full overflow-hidden">
                <img
                  src="/images/student-group.jpg"
                  alt="College friends walking on campus quad"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 text-white space-y-1">
                <span className="text-[10px] font-extrabold bg-emerald-600 px-2 py-0.5 rounded-md w-fit">
                  CAMPUS PEER HUB
                </span>
                <h4 className="text-sm font-black">Collaborate with Classmates</h4>
                <p className="text-[11px] text-slate-200 line-clamp-2">
                  Share conceptual homework hints, study guides, and lecture audio notes.
                </p>
              </div>
            </div>

            {/* Photo 3: College Library Study Session */}
            <div className="relative rounded-2xl overflow-hidden group border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
              <div className="h-52 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                  alt="College friends studying in library"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 text-white space-y-1">
                <span className="text-[10px] font-extrabold bg-purple-600 px-2 py-0.5 rounded-md w-fit">
                  AUTOMATED SYNC
                </span>
                <h4 className="text-sm font-black">Syncs to Google Calendar &amp; Cloud</h4>
                <p className="text-[11px] text-slate-200 line-clamp-2">
                  Your whole semester color-coded and organized across iPhone, iPad, and laptop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DORMWAY "CHOOSE HOW YOU START" INTERACTIVE SELECTOR WIDGET */}
        <section className="space-y-3">
          <DormwayStartWidget
            onOpenUpload={() => requirePro(() => setShowDropzone(true))}
            onOpenCanvas={() => setShowLmsModal(true)}
          />
        </section>

        {/* DUE GOODER PHONE NOTIFICATIONS SHOWCASE STRIP */}
        <section className="space-y-3 w-full max-w-full overflow-hidden">
          <PhoneNotificationsStrip />
        </section>

        {/* 3-WAY VIEW SWITCHER: DormWay Timeline vs Coursicle Timetable vs Due Gooder Dashboard */}
        <div id="main-view-container" className="flex items-center justify-center space-x-2 pt-2 scroll-mt-24">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-1.5 shadow-inner">
            <button
              onClick={() => setActiveMainTab("TIMELINE")}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeMainTab === "TIMELINE"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-4 w-4 text-blue-600" />
              <span><span className="hidden sm:inline">Semester </span>Timeline</span>
            </button>

            <button
              onClick={() => setActiveMainTab("SCHEDULE")}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeMainTab === "SCHEDULE"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span>Coursicle<span className="hidden sm:inline"> Timetable</span></span>
            </button>

            <button
              onClick={() => setActiveMainTab("TASKS")}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeMainTab === "TASKS"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckSquare className="h-4 w-4 text-emerald-600" />
              <span><span className="hidden sm:inline">Due Gooder </span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveMainTab("FLASHCARDS")}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeMainTab === "FLASHCARDS"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Brain className="h-4 w-4 text-purple-600" />
              <span>Flashcards<span className="hidden sm:inline"> &amp; Decks</span></span>
            </button>
          </div>
        </div>

        {/* VIEW 1: DORMWAY AUTOMATED SEMESTER TIMELINE */}
        {activeMainTab === "TIMELINE" && (
          <section className="space-y-4 animate-fade-in">
            <SemesterTimelineView
              tasks={tasks}
              courses={courses}
              onUpdateTask={handleUpdateTask}
              onDeconstructTask={(id) => requirePro(() => handleDeconstructTask(id))}
              onOpenGradeModal={() => requirePro(() => setShowGradeModal(true))}
              onOpenStoryModal={(task) => {
                setStoryHighlightTask(task || null);
                setShowStoryModal(true);
              }}
              onOpenClassGroupsModal={() => setShowClassGroupsModal(true)}
            />
          </section>
        )}

        {/* VIEW 2: COURSICLE WEEKLY TIMETABLE */}
        {activeMainTab === "SCHEDULE" && (
          <section className="space-y-4 animate-fade-in">
            <CoursicleScheduleView />
          </section>
        )}

        {/* VIEW 3: DUE GOODER DASHBOARD & TIMELINE */}
        {activeMainTab === "TASKS" && (
          <section className="rounded-3xl border border-slate-300/80 bg-white shadow-xl overflow-hidden animate-fade-in">
            {/* Mockup Browser Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>

              <div className="text-xs font-semibold text-slate-500 bg-white px-6 py-1 rounded-full border border-slate-200 shadow-2xs">
                syllabiq.ca/dashboard
              </div>

              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Fall 2026 Active
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-6">
              {/* Student Welcome Header & Progress Ring */}
              <div className="bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs">
                      🧑‍🎓
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-sm">✨</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                      WEDNESDAY, SEPT 16
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      Howdy, Alex Student 👋
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-slate-200">
                        <strong>0</strong> due today
                      </span>
                      <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-200">
                        <strong>{tasks.length}</strong> this week
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <strong>{completedCount}</strong> completed
                      </span>
                      <button
                        onClick={() => {
                          setStoryHighlightTask(null);
                          setShowStoryModal(true);
                        }}
                        className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-2xs hover:opacity-90 transition cursor-pointer"
                        title="Generate 9:16 Instagram & Snapchat Story Card"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Share Story Card</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Circular Donut Progress Ring */}
                <div className="flex items-center space-x-3 self-center sm:self-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="relative h-14 w-14 flex items-center justify-center">
                    <svg className="h-14 w-14 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-amber-500"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-900">
                      {progressPercent}%
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-sm font-black text-slate-900 block">
                      {completedCount}/{totalTasks}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">This week</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => requirePro(() => setShowLockerModal(true))}
                  className="flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  <FolderLock className="h-4 w-4" />
                  <span>Upload to Locker</span>
                </button>

                <button
                  onClick={() => requirePro(() => setShowDropzone(true))}
                  className="flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Class</span>
                </button>

                <button
                  onClick={() => requirePro(() => setShowGradeModal(true))}
                  className="flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
                >
                  <Palette className="h-4 w-4" />
                  <span>Color Preset</span>
                </button>

                <button
                  onClick={() => requirePro(handleSyncAll)}
                  disabled={isSyncing}
                  className="flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{isSyncing ? "Syncing..." : "Sync to Calendar"}</span>
                </button>
              </div>

              {/* SIDE-BY-SIDE WORKSPACE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Left Column (7 cols): To-do this week */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-base font-extrabold text-slate-900">To-do this week</h3>
                    <span className="text-xs font-bold text-slate-500">{completedCount}/{totalTasks} this week</span>
                  </div>

                  <div className="space-y-2.5">
                    {tasks.map((t) => (
                      <div
                        key={t.id}
                        className="group bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between hover:border-slate-300 shadow-2xs transition"
                      >
                        <div className="flex items-start space-x-3 max-w-[75%]">
                          <button
                            onClick={() =>
                              handleUpdateTask(t.id, {
                                status: t.status === "DONE" ? "TODO" : "DONE"
                              })
                            }
                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                          >
                            {t.status === "DONE" ? (
                              <CheckSquare className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <Square className="h-5 w-5 text-slate-300 hover:text-blue-500" />
                            )}
                          </button>

                          <div className="space-y-0.5">
                            <h4
                              className={`text-sm font-bold text-slate-900 leading-tight ${
                                t.status === "DONE" ? "line-through text-slate-400" : ""
                              }`}
                            >
                              {t.title}
                            </h4>
                            <p className="text-xs font-medium text-slate-500">
                              {t.courseName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {new Date(t.dueDate).toLocaleDateString([], {
                              weekday: "short",
                              month: "numeric",
                              day: "numeric"
                            })}
                          </span>
                          <button
                            onClick={() => requirePro(() => handleDeconstructTask(t.id))}
                            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                            title="Break down with AI"
                          >
                            <Sparkles className="h-4 w-4 text-indigo-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column (5 cols): Today's Schedule Timeline & iPhone Widget */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-base font-extrabold text-slate-900">Today</h3>
                    <span className="text-xs font-semibold text-slate-500">Wednesday, Sept 16</span>
                  </div>

                  {/* Hour-by-Hour Timeline with Colored Blocks */}
                  <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 space-y-4 font-mono text-xs">
                    <div className="flex items-start space-x-3">
                      <span className="text-slate-400 w-12 text-right text-[11px] pt-1">11AM</span>
                      <div className="flex-1 bg-purple-100 border border-purple-300 rounded-xl p-3 text-purple-900 font-sans shadow-2xs">
                        <div className="font-extrabold text-xs">CS 3110: Functional Programming</div>
                        <div className="text-[11px] text-purple-700">11:00 AM - 12:15 PM (Gates Hall 314)</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-red-500 font-bold w-12 text-right text-[11px]">12PM</span>
                      <div className="flex-1 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-100" />
                        <div className="h-[2px] w-full bg-red-500 shadow-xs" />
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="text-slate-400 w-12 text-right text-[11px] pt-1">2PM</span>
                      <div className="flex-1 bg-emerald-100 border border-emerald-300 rounded-xl p-3 text-emerald-900 font-sans shadow-2xs">
                        <div className="font-extrabold text-xs">ECON 1010: Principles of Microeconomics</div>
                        <div className="text-[11px] text-emerald-700">2:00 PM - 3:15 PM (Uris Hall 468)</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="text-slate-400 w-12 text-right text-[11px] pt-1">4PM</span>
                      <div className="flex-1 bg-amber-100 border border-amber-300 rounded-xl p-3 text-amber-900 font-sans shadow-2xs">
                        <div className="font-extrabold text-xs">⚡ AI Prep Buffer Block</div>
                        <div className="text-[11px] text-amber-700">Start OCaml Warm-Up draft (5 days early)</div>
                      </div>
                    </div>
                  </div>

                  {/* iPhone Notification Center Mockup */}
                  <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <div className="flex items-center space-x-1.5">
                        <Smartphone className="h-4 w-4 text-blue-600" />
                        <span>Lockscreen Notification Center</span>
                      </div>
                      <span className="text-[10px] text-slate-400">9:02 AM</span>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            🔔 Class Starting Soon!
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">3m ago</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Principles of Economics starts in 30 minutes at Room 108, Business Building.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            📝 2 Things DUE TODAY
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">7m ago</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          • Programming Assignment 1<br />• Chapter Review 2
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 4: FLASHCARDS & STUDY DECKS */}
        {activeMainTab === "FLASHCARDS" && (
          <section className="space-y-4 animate-fade-in">
            <FlashcardsTab
              courses={courses}
              isPro={user?.isPro}
              onOpenPaywall={() => setShowPaywallModal(true)}
            />
          </section>
        )}

        {/* WORKLOAD CRUNCH DETECTOR & HEATMAP */}
        <section className="space-y-3">
          <WorkloadHeatmap tasks={tasks} />
        </section>

        {/* SCHEDULE TIMELINE & DEADLINE LIST */}
        <section className="space-y-3">
          <ScheduleTimeline
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeconstructTask={(id) => requirePro(() => handleDeconstructTask(id))}
          />
        </section>

        {/* DORMWAY HALLMARK SHOWCASE SECTIONS: Canvas Sync Without IT, Forward a Syllabus Breakdown, Founder Story */}
        <section className="space-y-12">
          <DormwayShowcaseSections
            onOpenCanvas={() => setShowLmsModal(true)}
            onOpenUpload={() => requirePro(() => setShowDropzone(true))}
          />
        </section>

        {/* 5 FEATURE CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            onClick={() => requirePro(() => setShowDropzone(true))}
            className="paper-card-interactive p-5 space-y-2 cursor-pointer"
          >
            <div className="text-2xl">📅</div>
            <h4 className="text-base font-extrabold text-slate-900">Syllabus Import</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI turns your syllabus into a full semester plan in seconds. Supports PDF, DOCX, and mobile scans.
            </p>
          </div>

          <div
            onClick={() => requirePro(() => setShowHomeworkModal(true))}
            className="paper-card-interactive p-5 space-y-2 cursor-pointer border-indigo-200 bg-indigo-50/20"
          >
            <div className="text-2xl">📸</div>
            <h4 className="text-base font-extrabold text-slate-900">Snap Homework</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Photo OCR extracts problem sets, questions, and auto-schedules milestones into your calendar.
            </p>
          </div>

          <div
            onClick={() => requirePro(() => setShowPeerModal(true))}
            className="paper-card-interactive p-5 space-y-2 cursor-pointer border-emerald-200 bg-emerald-50/20"
          >
            <div className="text-2xl">👥</div>
            <h4 className="text-base font-extrabold text-slate-900">Campus Peer Hub</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share homework hints, lecture audio notes, and exam study guides with students in your school.
            </p>
          </div>

          <div
            onClick={() => requirePro(() => setShowAudioModal(true))}
            className="paper-card-interactive p-5 space-y-2 cursor-pointer"
          >
            <div className="text-2xl">🎙️</div>
            <h4 className="text-base font-extrabold text-slate-900">AI Lecture Notes</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Record class live, get chapter-marked notes, and export directly into Google Docs and Word.
            </p>
          </div>

          <div
            onClick={() => requirePro(() => setShowGradeModal(true))}
            className="paper-card-interactive p-5 space-y-2 cursor-pointer"
          >
            <div className="text-2xl">✨</div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Grade &amp; What-If</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track running grades by syllabus weight and simulate the exact final exam score needed for an A.
            </p>
          </div>

          <div
            onClick={() => requirePro(() => setShowCloudVaultModal(true))}
            className="paper-card-interactive p-5 space-y-2 cursor-pointer border-blue-200 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20"
          >
            <div className="text-2xl">☁️</div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Google Cloud Papers Vault</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Store papers, reports, and homework drafts on GCS with versioning and 1-click Google Docs launch.
            </p>
          </div>

          <div
            onClick={() => requirePro(() => setShowBackgroundModal(true))}
            className="paper-card-interactive p-5 space-y-2 cursor-pointer border-purple-200 dark:border-purple-800 bg-purple-50/20 dark:bg-purple-950/20"
          >
            <div className="text-2xl">🖼️</div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Wallpapers &amp; Themes</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              10 curated aesthetic wallpapers or custom photo uploads with live blur and opacity contrast sliders.
            </p>
          </div>

          <Link
            href="/features"
            className="paper-card-interactive p-5 space-y-2 cursor-pointer border-slate-200 dark:border-slate-800 block"
          >
            <div className="text-2xl">📖</div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Product Tour &amp; Q&amp;A</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Full breakdown of features, app pictures, who it&apos;s for across college majors, and student FAQ.
            </p>
          </Link>
        </section>

        {/* INTERACTIVE FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <section id="faq" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131B2E]/95 p-5 sm:p-8 md:p-10 shadow-sm space-y-6 w-full max-w-full min-w-0 overflow-hidden scroll-mt-24">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-2xs">
              <HelpCircle className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Got questions? We&apos;ve got answers.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
              Everything you need to know about syllabi parsing, Canvas integration, Google sync, academic safety, and subscriptions.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 pt-2">
            {LANDING_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer hover:bg-white dark:hover:bg-slate-800/80 transition gap-3"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <span className="h-6 w-6 rounded-full bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/70 dark:border-slate-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Support & Full FAQ Link */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Have a specific question not covered here?
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 shadow-xs transition cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Contact Harbour &amp; Main</span>
              </button>
              <Link
                href="/faq"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Full Help Center</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* BOTTOM TAB BAR */}
      <BottomTabBar
        activeTab={showChatDrawer ? "CHAT" : activeMainTab}
        onSelectTab={(tab) => {
          if (tab === "TIMELINE") {
            setShowChatDrawer(false);
            setActiveMainTab("TIMELINE");
            setShowTimelineModal(true);
            scrollToMainView();
          } else if (tab === "SCHEDULE") {
            setShowChatDrawer(false);
            setActiveMainTab("SCHEDULE");
            setShowCoursicleModal(true);
            scrollToMainView();
          } else if (tab === "TASKS") {
            setShowChatDrawer(false);
            setActiveMainTab("TASKS");
            scrollToMainView();
          } else if (tab === "FLASHCARDS") {
            setShowChatDrawer(false);
            setActiveMainTab("FLASHCARDS");
            scrollToMainView();
          } else if (tab === "REMINDERS") {
            setShowDispatchModal(true);
          } else if (tab === "CHAT") {
            setShowChatDrawer(true);
          }
        }}
      />

      {/* Floating / Mobile Syllabird Mascot Chatbot */}
      <AIChatDrawer
        isOpen={showChatDrawer}
        onClose={() => setShowChatDrawer(false)}
        onOpen={() => setShowChatDrawer(true)}
      />

      {/* Modals */}
      {showLmsModal && (
        <LMSSyncModal
          onClose={() => setShowLmsModal(false)}
          onSyncComplete={async () => {
            await fetchDashboardData();
          }}
        />
      )}

      {showSheetsModal && (
        <GoogleSheetsModal
          onClose={() => setShowSheetsModal(false)}
          onSyncUpdated={async () => {
            await fetchDashboardData();
          }}
        />
      )}

      {showGradeModal && (
        <GradeCalculatorModal
          courses={courses}
          tasks={tasks}
          onClose={() => setShowGradeModal(false)}
        />
      )}

      {showDispatchModal && (
        <MorningDispatchModal
          tasks={tasks}
          onClose={() => setShowDispatchModal(false)}
        />
      )}

      {showAudioModal && (
        <AudioTranscriberModal
          onClose={() => setShowAudioModal(false)}
        />
      )}

      {showShareModal && (
        <ShareScheduleModal
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showMobileModal && (
        <MobilePreviewModal
          tasks={tasks}
          courses={courses}
          onClose={() => setShowMobileModal(false)}
        />
      )}

      {showLockerModal && (
        <ClassLockerModal
          courses={courses}
          onClose={() => setShowLockerModal(false)}
        />
      )}

      {showHomeworkModal && (
        <HomeworkPhotoModal
          courses={courses}
          onClose={() => setShowHomeworkModal(false)}
          onOpenPaywall={() => {
            setShowHomeworkModal(false);
            setShowPaywallModal(true);
          }}
          onHomeworkAdded={async () => {
            await fetchDashboardData();
          }}
        />
      )}

      {showColorModal && (
        <ColorCustomizerModal
          courses={courses}
          onClose={() => setShowColorModal(false)}
          onColorsUpdated={async () => {
            await fetchDashboardData();
          }}
        />
      )}

      {showPeerModal && (
        <CampusPeerHubModal
          courses={courses}
          onClose={() => setShowPeerModal(false)}
        />
      )}

      {showPaywallModal && (
        <StripePaywallModal
          notice={paywallNotice}
          onClose={() => {
            setShowPaywallModal(false);
            setPaywallNotice("");
          }}
          onOpenAuthModal={() => {
            setShowPaywallModal(false);
            setShowAuthModal(true);
          }}
          onSubscriptionUpdated={async () => {
            await fetchDashboardData();
          }}
        />
      )}

      {showBackgroundModal && (
        <BackgroundCustomizerModal
          config={backgroundConfig}
          onClose={() => setShowBackgroundModal(false)}
          onSaveConfig={async (newCfg) => {
            setBackgroundConfig(newCfg);
            try {
              await fetch("/api/background", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCfg)
              });
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      {showCloudVaultModal && (
        <GoogleCloudVaultModal
          courses={courses}
          onClose={() => setShowCloudVaultModal(false)}
        />
      )}

      {showContactModal && (
        <ContactModal
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showCoursicleModal && (
        <CoursicleModal
          isOpen={showCoursicleModal}
          onClose={() => setShowCoursicleModal(false)}
          onViewOnPage={() => {
            setShowCoursicleModal(false);
            setActiveMainTab("SCHEDULE");
            scrollToMainView();
          }}
        />
      )}

      {showTimelineModal && (
        <SemesterTimelineModal
          isOpen={showTimelineModal}
          onClose={() => setShowTimelineModal(false)}
          tasks={tasks}
          courses={courses}
          onUpdateTask={handleUpdateTask}
          onDeconstructTask={handleDeconstructTask}
          onOpenGradeModal={() => setShowGradeModal(true)}
          onViewOnPage={() => {
            setShowTimelineModal(false);
            setActiveMainTab("TIMELINE");
            scrollToMainView();
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onOpenAdminPanel={() => setShowAdminModal(true)}
        />
      )}

      {showAdminModal && (
        <AdminPanelModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onOpenPaywall={() => setShowPaywallModal(true)}
          onOpenDispatch={() => setShowDispatchModal(true)}
        />
      )}

      {showStoryModal && (
        <StoryCardModal
          tasks={tasks}
          courses={courses}
          highlightTask={storyHighlightTask}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      {showClassGroupsModal && (
        <ClassGroupsModal
          courses={courses}
          onClose={() => setShowClassGroupsModal(false)}
          onUpdateCourseGroup={async () => {
            await fetchDashboardData();
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          courses={courses}
          tasks={tasks}
        />
      )}

      {/* Global Footer with Harbour and Main Company Logo */}
      <Footer
        onOpenContactModal={() => setShowContactModal(true)}
        onOpenCloudVault={() => setShowCloudVaultModal(true)}
        onOpenWallpaper={() => setShowBackgroundModal(true)}
        onOpenCalendarSync={() => setShowShareModal(true)}
        onOpenSheetsModal={() => setShowSheetsModal(true)}
        onOpenHomeworkModal={() => setShowHomeworkModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />
    </div>
  );
}
