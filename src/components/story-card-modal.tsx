"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Trophy,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  X,
  Zap,
  Shield,
  GraduationCap,
  CalendarCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import { TaskItem, Course } from "@/lib/types";

interface Props {
  tasks: TaskItem[];
  courses: Course[];
  initialTemplate?: "STREAK" | "SUBMISSION" | "FINALS" | "SURVIVAL";
  highlightTask?: TaskItem | null;
  onClose: () => void;
}

export function StoryCardModal({
  tasks,
  courses,
  initialTemplate = "STREAK",
  highlightTask,
  onClose
}: Props) {
  const [template, setTemplate] = useState<"STREAK" | "SUBMISSION" | "FINALS" | "SURVIVAL">(initialTemplate);
  const [theme, setTheme] = useState<"CYBER" | "GOLD" | "EMERALD" | "SUNSET">("CYBER");
  const [studentName, setStudentName] = useState("Alex Student");
  const [campusName, setCampusName] = useState("Cornell University");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  // Derived stats
  const completedTasks = tasks.filter((t) => t.status === "DONE");
  const completedCount = completedTasks.length > 0 ? completedTasks.length : 6;
  const activeTaskTitle = highlightTask ? highlightTask.title : (tasks[0]?.title || "Assignment 1: OCaml Warm-Up");
  const activeCourseCode = highlightTask ? highlightTask.courseCode : (courses[0]?.code || "CS 3110");

  const themes = {
    CYBER: {
      name: "Cyber Neon",
      bgGradient: "from-[#0F172A] via-[#1E1B4B] to-[#311042]",
      cardBg: "bg-white/10 border-indigo-500/30",
      accent: "text-cyan-400",
      pillBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      buttonBg: "from-indigo-600 to-purple-600",
      badgeText: "STUDY STREAK",
      canvasColors: ["#0F172A", "#1E1B4B", "#311042", "#38BDF8"]
    },
    GOLD: {
      name: "Midnight Gold",
      bgGradient: "from-[#18181B] via-[#27272A] to-[#09090B]",
      cardBg: "bg-amber-500/10 border-amber-500/30",
      accent: "text-amber-400",
      pillBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      buttonBg: "from-amber-600 to-yellow-600",
      badgeText: "HONOR ROLL",
      canvasColors: ["#18181B", "#27272A", "#09090B", "#F59E0B"]
    },
    EMERALD: {
      name: "Emerald Matrix",
      bgGradient: "from-[#064E3B] via-[#022C22] to-[#041F1A]",
      cardBg: "bg-emerald-500/10 border-emerald-500/30",
      accent: "text-emerald-400",
      pillBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      buttonBg: "from-emerald-600 to-teal-600",
      badgeText: "CRUSHED IT",
      canvasColors: ["#064E3B", "#022C22", "#041F1A", "#34D399"]
    },
    SUNSET: {
      name: "Sunset Glow",
      bgGradient: "from-[#831843] via-[#4C0519] to-[#1C1917]",
      cardBg: "bg-rose-500/10 border-rose-500/30",
      accent: "text-rose-400",
      pillBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      buttonBg: "from-rose-600 to-orange-600",
      badgeText: "ON FIRE",
      canvasColors: ["#831843", "#4C0519", "#1C1917", "#FB7185"]
    }
  };

  const currentTheme = themes[theme];

  // Generate 1080x1920 high-resolution image via HTML5 Canvas
  const generateCanvasImage = async (): Promise<string> => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    gradient.addColorStop(0, currentTheme.canvasColors[0]);
    gradient.addColorStop(0.5, currentTheme.canvasColors[1]);
    gradient.addColorStop(1, currentTheme.canvasColors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Glow Blobs
    const radial = ctx.createRadialGradient(540, 600, 50, 540, 600, 600);
    radial.addColorStop(0, currentTheme.canvasColors[3] + "33");
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1080, 1920);

    // 3. Top Header: SyllabiQ Branding
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 48px Inter, system-ui, sans-serif";
    ctx.fillText("SyllabiQ", 90, 140);

    // PRO / Campus 2.0 Badge
    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 28px Inter, system-ui, sans-serif";
    ctx.fillText("CAMPUS 2.0 • FALL 2026", 90, 190);

    // Student & University info
    ctx.fillStyle = "#94A3B8";
    ctx.font = "600 32px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(studentName, 990, 140);
    ctx.fillText(campusName, 990, 190);
    ctx.textAlign = "left";

    // 4. Hero Visual Card (Centered Box)
    const cardX = 90;
    const cardY = 280;
    const cardW = 900;
    const cardH = 1320;
    const radius = 50;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, radius);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 5. Template Content
    ctx.textAlign = "center";

    if (template === "STREAK") {
      // Big Emoji
      ctx.font = "140px Inter, system-ui, sans-serif";
      ctx.fillText("🔥", 540, 490);

      // Pill Tag
      ctx.fillStyle = currentTheme.canvasColors[3];
      ctx.font = "900 32px Inter, system-ui, sans-serif";
      ctx.fillText("WEEKLY MILESTONE CLEARED", 540, 580);

      // Main Headline
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 76px Inter, system-ui, sans-serif";
      ctx.fillText(`CLEARED ${completedCount} TASKS`, 540, 710);
      ctx.font = "900 64px Inter, system-ui, sans-serif";
      ctx.fillText("THIS WEEK", 540, 800);

      // Subhead
      ctx.fillStyle = "#CBD5E1";
      ctx.font = "500 36px Inter, system-ui, sans-serif";
      ctx.fillText("14-Day Study Streak • 0 Overdue Tasks", 540, 890);

      // 3 Stat Boxes
      const drawStat = (x: number, y: number, val: string, label: string) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.roundRect(x, y, 250, 200, 30);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 52px Inter, system-ui, sans-serif";
        ctx.fillText(val, x + 125, y + 90);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 26px Inter, system-ui, sans-serif";
        ctx.fillText(label, x + 125, y + 145);
      };

      drawStat(130, 980, "100%", "ON TIME");
      drawStat(415, 980, "0", "LATE FEES");
      drawStat(700, 980, "4/4", "SYLLABI");

      // Quote / Message
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "italic 600 34px Inter, system-ui, sans-serif";
      ctx.fillText("\"Never wonder what's due next.\"", 540, 1340);
    } else if (template === "SUBMISSION") {
      ctx.font = "140px Inter, system-ui, sans-serif";
      ctx.fillText("🚀", 540, 490);

      ctx.fillStyle = currentTheme.canvasColors[3];
      ctx.font = "900 32px Inter, system-ui, sans-serif";
      ctx.fillText("MAJOR ASSIGNMENT SUBMITTED", 540, 580);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 68px Inter, system-ui, sans-serif";
      ctx.fillText(activeCourseCode, 540, 710);
      ctx.font = "800 48px Inter, system-ui, sans-serif";
      ctx.fillText(activeTaskTitle.substring(0, 30), 540, 800);

      ctx.fillStyle = "#34D399";
      ctx.font = "700 40px Inter, system-ui, sans-serif";
      ctx.fillText("✅ Turned In 3 Days Ahead of Deadline", 540, 920);

      // Stat badges
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.roundRect(180, 1010, 720, 200, 30);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 36px Inter, system-ui, sans-serif";
      ctx.fillText("Grade Buffer: 100% Academic Safety", 540, 1090);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "500 30px Inter, system-ui, sans-serif";
      ctx.fillText("Deconstructed into milestones via SyllabiQ AI", 540, 1150);
    } else if (template === "FINALS") {
      ctx.font = "140px Inter, system-ui, sans-serif";
      ctx.fillText("🎓", 540, 490);

      ctx.fillStyle = currentTheme.canvasColors[3];
      ctx.font = "900 32px Inter, system-ui, sans-serif";
      ctx.fillText("EXAM CRUSHED", 540, 580);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 76px Inter, system-ui, sans-serif";
      ctx.fillText("FINALS COMPLETE!", 540, 720);

      ctx.fillStyle = "#CBD5E1";
      ctx.font = "600 38px Inter, system-ui, sans-serif";
      ctx.fillText("All exams finished • Semester survived", 540, 830);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "900 48px Inter, system-ui, sans-serif";
      ctx.fillText("GPA Shield: Active 🛡️", 540, 960);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "500 34px Inter, system-ui, sans-serif";
      ctx.fillText("Zero crunch, zero all-nighters.", 540, 1050);
    } else {
      ctx.font = "140px Inter, system-ui, sans-serif";
      ctx.fillText("📊", 540, 490);

      ctx.fillStyle = currentTheme.canvasColors[3];
      ctx.font = "900 32px Inter, system-ui, sans-serif";
      ctx.fillText("SEMESTER SURVIVAL REPORT", 540, 580);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 72px Inter, system-ui, sans-serif";
      ctx.fillText("SURVIVAL SCORE: 99/100", 540, 720);

      ctx.fillStyle = "#38BDF8";
      ctx.font = "700 42px Inter, system-ui, sans-serif";
      ctx.fillText("⚡ 42.5 Hours Saved with AI Milestones", 540, 840);

      ctx.fillStyle = "#E2E8F0";
      ctx.font = "500 34px Inter, system-ui, sans-serif";
      ctx.fillText("Google Calendar Synced • Phone Alerts Active", 540, 940);
    }

    // 6. Watermark Footer
    ctx.fillStyle = "#64748B";
    ctx.font = "bold 32px Inter, system-ui, sans-serif";
    ctx.fillText("syllabiq.ca • Try It Free Today", 540, 1800);

    return canvas.toDataURL("image/png");
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await generateCanvasImage();
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `syllabiq-story-${template.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      confetti({ particleCount: 50, spread: 60 });
      setShareToast("Saved 1080x1920 Story Card to downloads!");
      setTimeout(() => setShareToast(null), 4000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareInstagram = async () => {
    try {
      const dataUrl = await generateCanvasImage();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "syllabiq-story.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "SyllabiQ Milestone",
          text: "Never wonder what's due next with SyllabiQ!",
          files: [file]
        });
      } else {
        // Fallback: download image and prompt to open IG
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "syllabiq-instagram-story.png";
        a.click();
        setShareToast("Story card saved to Photos! Open Instagram -> Add to Story 📸");
        setTimeout(() => setShareToast(null), 5000);
      }
    } catch (e) {
      console.warn("Share canceled or failed", e);
    }
  };

  const handleShareSnapchat = async () => {
    try {
      const dataUrl = await generateCanvasImage();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "syllabiq-snap.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "SyllabiQ Milestone",
          text: "Crushed my semester milestones on SyllabiQ!",
          files: [file]
        });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "syllabiq-snapchat-story.png";
        a.click();
        setShareToast("Story card saved! Open Snapchat -> Camera Roll -> Send To 👻");
        setTimeout(() => setShareToast(null), 5000);
      }
    } catch (e) {
      console.warn("Snap share failed", e);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://syllabiq.ca");
    setIsCopied(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-6 text-white space-y-5 my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Story Cards Studio</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 font-extrabold px-2 py-0.5 rounded-full border border-pink-500/30">
                  Instagram &amp; Snapchat
                </span>
              </h3>
              <p className="text-xs text-slate-400">Export branded 9:16 vertical milestone graphics for social stories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Toast Notification */}
        {shareToast && (
          <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs font-bold text-emerald-300 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{shareToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Interactive 9:16 Story Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={cardRef}
              className={`relative w-[280px] h-[498px] sm:w-[310px] sm:h-[550px] rounded-[36px] bg-gradient-to-b ${currentTheme.bgGradient} p-4 sm:p-5 border-4 border-slate-700/80 shadow-2xl flex flex-col justify-between overflow-hidden select-none`}
            >
              {/* Simulated Story Progress Bars (Instagram / Snap style) */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="h-1 flex-1 bg-white/40 rounded-full" />
                <div className="h-1 flex-1 bg-white rounded-full shadow-xs" />
                <div className="h-1 flex-1 bg-white/40 rounded-full" />
              </div>

              {/* Story Top Bar */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-xs">
                    SQ
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-[11px] block leading-tight">
                      {studentName}
                    </span>
                    <span className="text-[9px] text-slate-300 block">
                      {campusName}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-white/70">2m</span>
              </div>

              {/* Center Card Content */}
              <div className={`my-auto rounded-2xl ${currentTheme.cardBg} backdrop-blur-md p-4 text-center border space-y-2.5`}>
                {template === "STREAK" && (
                  <>
                    <div className="text-4xl animate-pulse">🔥</div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${currentTheme.pillBg}`}>
                      WEEKLY CRUSH CLEARED
                    </span>
                    <h4 className="text-xl font-black text-white leading-tight">
                      CLEARED {completedCount} TASKS THIS WEEK
                    </h4>
                    <p className="text-[10px] text-slate-300 font-medium">
                      14-Day Study Streak • 0 Overdue Tasks
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px]">
                      <div className="bg-white/5 p-1.5 rounded-lg">
                        <div className="font-black text-white text-xs">100%</div>
                        <div className="text-[8px] text-slate-400">On Time</div>
                      </div>
                      <div className="bg-white/5 p-1.5 rounded-lg">
                        <div className="font-black text-white text-xs">0</div>
                        <div className="text-[8px] text-slate-400">Late Fees</div>
                      </div>
                      <div className="bg-white/5 p-1.5 rounded-lg">
                        <div className="font-black text-white text-xs">4/4</div>
                        <div className="text-[8px] text-slate-400">Syllabi</div>
                      </div>
                    </div>
                  </>
                )}

                {template === "SUBMISSION" && (
                  <>
                    <div className="text-4xl animate-pulse">🚀</div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${currentTheme.pillBg}`}>
                      MAJOR ASSIGNMENT DONE
                    </span>
                    <h4 className="text-lg font-black text-white leading-tight">
                      {activeCourseCode}
                    </h4>
                    <p className="text-xs font-extrabold text-cyan-300">
                      {activeTaskTitle}
                    </p>
                    <div className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold p-1.5 rounded-lg border border-emerald-500/30">
                      ✅ Submitted 3 Days Early
                    </div>
                  </>
                )}

                {template === "FINALS" && (
                  <>
                    <div className="text-4xl animate-pulse">🎓</div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${currentTheme.pillBg}`}>
                      EXAM CRUSHED
                    </span>
                    <h4 className="text-xl font-black text-white leading-tight">
                      FINALS COMPLETE!
                    </h4>
                    <p className="text-xs text-slate-300 font-medium">
                      All exams finished • Semester survived
                    </p>
                    <div className="bg-amber-500/20 text-amber-300 text-[10px] font-bold p-1.5 rounded-lg border border-amber-500/30">
                      🛡️ GPA Shield: 100% Intact
                    </div>
                  </>
                )}

                {template === "SURVIVAL" && (
                  <>
                    <div className="text-4xl animate-pulse">📊</div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${currentTheme.pillBg}`}>
                      ACADEMIC WRAPPED
                    </span>
                    <h4 className="text-xl font-black text-white leading-tight">
                      SURVIVAL: 99/100
                    </h4>
                    <p className="text-xs text-sky-300 font-extrabold">
                      ⚡ 42.5 Hours Saved via AI
                    </p>
                    <p className="text-[10px] text-slate-400">
                      4 Syllabi Synced • Zero Missed Deadlines
                    </p>
                  </>
                )}
              </div>

              {/* Story Watermark Footer */}
              <div className="text-center pt-2">
                <div className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-slate-300">
                  <span>syllabiq.ca</span>
                  <span>•</span>
                  <span>Never Wonder What&apos;s Due</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Customization Controls & Social Export Triggers */}
          <div className="lg:col-span-7 space-y-5">
            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                1. Select Story Milestone Template
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "STREAK", label: "Weekly Streak", icon: "🔥" },
                  { id: "SUBMISSION", label: "Major Paper", icon: "🚀" },
                  { id: "FINALS", label: "Final Exam", icon: "🎓" },
                  { id: "SURVIVAL", label: "Survival Score", icon: "📊" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                      template === t.id
                        ? "bg-indigo-600/30 border-indigo-400 text-white shadow-xs"
                        : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aesthetic Theme Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                2. Story Aesthetic &amp; Color Scheme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(themes) as Array<keyof typeof themes>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                      theme === key
                        ? "bg-white text-slate-900 border-white shadow-sm"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {themes[key].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Student & Campus Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Student Name / Handle
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 1-Tap Viral Social Triggers */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-black text-slate-200 block uppercase tracking-wider">
                3. Share to Social Stories (1-Tap Export)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Share to Instagram Story */}
                <button
                  onClick={handleShareInstagram}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white font-black text-xs transition cursor-pointer shadow-lg shadow-pink-600/20"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Share to Instagram Story</span>
                </button>

                {/* Share to Snapchat */}
                <button
                  onClick={handleShareSnapchat}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#FFFC00] hover:bg-[#F2EE00] text-slate-900 font-black text-xs transition cursor-pointer shadow-lg shadow-yellow-500/20"
                >
                  <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                    <path d="M12 2C7.58 2 4 5.58 4 10c0 1.9.67 3.65 1.79 5.02-.12.44-.38.86-.77 1.25-.39.39-.81.65-1.25.77 1.37 1.12 3.12 1.79 5.02 1.79h6.42c1.9 0 3.65-.67 5.02-1.79-.44-.12-.86-.38-1.25-.77-.39-.39-.65-.81-.77-1.25 1.12-1.37 1.79-3.12 1.79-5.02 0-4.42-3.58-8-8-8z"/>
                  </svg>
                  <span>Share to Snapchat</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {/* Download High-Res PNG */}
                <button
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  <Download className="h-4 w-4 text-cyan-400" />
                  <span>{isDownloading ? "Generating 1080p..." : "Download 9:16 PNG"}</span>
                </button>

                {/* Copy Referral / Web Link */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  {isCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{isCopied ? "Copied Link!" : "Copy Link"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
