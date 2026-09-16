"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Sun,
  Moon,
  Laptop,
  Clock,
  Globe,
  Camera,
  Upload,
  GraduationCap,
  Calendar,
  Download,
  CheckCircle2,
  Sparkles,
  Shield,
  Trash2,
  Building2,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "./theme-provider";
import { Course, TaskItem } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courses?: Course[];
  tasks?: TaskItem[];
}

type TabType = "PROFILE" | "THEME" | "TIMEZONE" | "ACADEMIC";

const EMOJI_AVATARS = [
  "👨‍💼", "🧑‍🎓", "👩‍🔬", "🧑‍💻", "🎓", "⚡",
  "🦉", "🚀", "💡", "📚", "💻", "🏆",
  "🧪", "🎨", "🦁", "🐻", "🍁", "✨"
];

const TIME_ZONE_OPTIONS = [
  // North America
  { label: "Eastern Time (EST / EDT) — New York, Toronto, Boston, Miami", value: "America/New_York", group: "North America" },
  { label: "Central Time (CST / CDT) — Chicago, Dallas, Austin, Winnipeg", value: "America/Chicago", group: "North America" },
  { label: "Mountain Time (MST / MDT) — Denver, Phoenix, Calgary, Salt Lake", value: "America/Denver", group: "North America" },
  { label: "Pacific Time (PST / PDT) — Los Angeles, Vancouver, Seattle, SF", value: "America/Los_Angeles", group: "North America" },
  { label: "Atlantic Time (AST / ADT) — Halifax, Moncton, Puerto Rico", value: "America/Halifax", group: "North America" },
  { label: "Newfoundland Time (NST / NDT) — St. John's", value: "America/St_Johns", group: "North America" },
  { label: "Alaska Time (AKST / AKDT) — Anchorage, Fairbanks", value: "America/Anchorage", group: "North America" },
  { label: "Hawaii-Aleutian Time (HST) — Honolulu", value: "Pacific/Honolulu", group: "North America" },
  // International
  { label: "UTC / GMT — Universal Time Coordinated, London, Dublin, Lisbon", value: "UTC", group: "International" },
  { label: "Central European Time (CET / CEST) — Paris, Berlin, Rome, Madrid", value: "Europe/Paris", group: "International" },
  { label: "Eastern European Time (EET / EEST) — Athens, Helsinki, Bucharest", value: "Europe/Athens", group: "International" },
  { label: "India Standard Time (IST) — New Delhi, Mumbai, Bengaluru", value: "Asia/Kolkata", group: "International" },
  { label: "China / Singapore (CST / SGT) — Beijing, Singapore, Hong Kong", value: "Asia/Singapore", group: "International" },
  { label: "Japan & Korea (JST / KST) — Tokyo, Seoul", value: "Asia/Tokyo", group: "International" },
  { label: "Australian Eastern Time (AEST / AEDT) — Sydney, Melbourne, Brisbane", value: "Australia/Sydney", group: "International" },
  { label: "New Zealand Time (NZST / NZDT) — Auckland, Wellington", value: "Pacific/Auckland", group: "International" }
];

const SCHOOL_SUGGESTIONS = [
  "Cornell University",
  "University of Toronto",
  "Harvard University",
  "Stanford University",
  "McGill University",
  "University of Waterloo",
  "University of British Columbia",
  "University of California, Berkeley",
  "University of California, Los Angeles",
  "New York University",
  "Columbia University",
  "University of Michigan",
  "MIT",
  "Queens University",
  "Western University"
];

export function SettingsModal({ isOpen, onClose, courses = [], tasks = [] }: Props) {
  const { user, updateUserProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>("PROFILE");

  // Profile Form State
  const [name, setName] = useState(user?.name || "Alex Cornell");
  const [email, setEmail] = useState(user?.email || "student@syllabiq.ca");
  const [school, setSchool] = useState(user?.school || "Cornell University");
  const [major, setMajor] = useState(user?.major || "Computer Science");
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || "2027");
  const [avatar, setAvatar] = useState(user?.avatar || "🧑‍🎓");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(user?.photoUrl);

  // Timezone State
  const [timeZoneMode, setTimeZoneMode] = useState<"auto" | "manual">(
    user?.timeZoneMode || "auto"
  );
  const [detectedTz, setDetectedTz] = useState("America/New_York");
  const [selectedTz, setSelectedTz] = useState(user?.timeZone || "America/New_York");
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Academic Settings State
  const [defaultDueTime, setDefaultDueTime] = useState(user?.defaultDueTime || "23:59");
  const [weekStartDay, setWeekStartDay] = useState<"sunday" | "monday">(
    user?.weekStartDay || "sunday"
  );
  const [prepBufferDays, setPrepBufferDays] = useState<number>(user?.prepBufferDays || 5);

  const [isSavedToast, setIsSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect browser timezone on mount
  useEffect(() => {
    try {
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (browserTz) {
        setDetectedTz(browserTz);
        if (timeZoneMode === "auto") {
          setSelectedTz(browserTz);
        }
      }
    } catch {
      // Fallback
    }
  }, [timeZoneMode]);

  // Sync user changes when user context changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSchool(user.school || "Cornell University");
      setMajor(user.major || "Computer Science");
      setGraduationYear(user.graduationYear || "2027");
      setAvatar(user.avatar || "🧑‍🎓");
      setPhotoUrl(user.photoUrl);
      setTimeZoneMode(user.timeZoneMode || "auto");
      if (user.timeZone) setSelectedTz(user.timeZone);
      if (user.defaultDueTime) setDefaultDueTime(user.defaultDueTime);
      if (user.weekStartDay) setWeekStartDay(user.weekStartDay);
      if (user.prepBufferDays) setPrepBufferDays(user.prepBufferDays);
    }
  }, [user]);

  // Live Clock update
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const activeTz = timeZoneMode === "auto" ? detectedTz : selectedTz;
        const formatted = now.toLocaleTimeString("en-US", {
          timeZone: activeTz,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZoneName: "short"
        });
        setCurrentTimeStr(formatted);
      } catch {
        setCurrentTimeStr(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [timeZoneMode, detectedTz, selectedTz]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please select a photo under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      if (result) {
        setPhotoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const effectiveTz = timeZoneMode === "auto" ? detectedTz : selectedTz;

    updateUserProfile({
      name: name.trim() || user?.name,
      email: email.trim() || user?.email,
      school: school.trim(),
      major: major.trim(),
      graduationYear: graduationYear.trim(),
      avatar,
      photoUrl,
      timeZone: effectiveTz,
      timeZoneMode,
      defaultDueTime,
      weekStartDay,
      prepBufferDays
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleExportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        name,
        email,
        school,
        timeZone: selectedTz
      },
      coursesCount: courses.length,
      tasksCount: tasks.length,
      courses,
      tasks
    };

    const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `syllabiq-semester-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-xs">
                <Settings className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <span>Account &amp; App Settings</span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold px-2 py-0.5 rounded-full">
                    SyllabiQ OS
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Customize profile, school identity, time zone, and academic scheduling.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-full cursor-pointer transition-colors"
              title="Close Settings"
            >
              ✕
            </button>
          </div>

          {/* Segmented Tab Navigation */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab("PROFILE")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === "PROFILE"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Profile &amp; School</span>
            </button>

            <button
              onClick={() => setActiveTab("THEME")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === "THEME"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveTab("TIMEZONE")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === "TIMEZONE"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Time Zone</span>
            </button>

            <button
              onClick={() => setActiveTab("ACADEMIC")}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
                activeTab === "ACADEMIC"
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Academic &amp; Data</span>
            </button>
          </div>

          {/* TAB 1: PROFILE & CAMPUS */}
          {activeTab === "PROFILE" && (
            <div className="space-y-5 animate-fade-in text-xs">
              {/* Photo & Avatar Customization */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="relative group">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl shadow-md overflow-hidden border-2 border-white dark:border-slate-700">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="User Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{avatar}</span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition cursor-pointer"
                    title="Upload Custom Photo"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                    >
                      <Upload className="h-3 w-3" />
                      <span>Upload Photo</span>
                    </button>
                    {photoUrl && (
                      <button
                        onClick={() => setPhotoUrl(undefined)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-xs border border-rose-200 dark:border-rose-900 transition cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Use Emoji Instead</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    JPG, PNG, or GIF up to 2MB. Or choose an emoji icon below:
                  </p>
                  {/* Emoji Quick Picker */}
                  <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                    {EMOJI_AVATARS.map((em) => (
                      <button
                        key={em}
                        onClick={() => {
                          setAvatar(em);
                          setPhotoUrl(undefined);
                        }}
                        className={`h-7 w-7 rounded-lg flex items-center justify-center text-sm transition cursor-pointer ${
                          avatar === em && !photoUrl
                            ? "bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500 scale-110"
                            : "bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Cornell"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span>📧</span> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@syllabiq.ca"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" /> School / University
                  </label>
                  <input
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    list="school-list"
                    placeholder="e.g. Cornell University"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                  <datalist id="school-list">
                    {SCHOOL_SUGGESTIONS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Major / Field of Study
                  </label>
                  <input
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g. Computer Science & Economics"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400" /> Graduation Year
                  </label>
                  <input
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="e.g. 2027"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-slate-400" /> Account Plan
                  </label>
                  <div className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">
                      {user?.isPro ? "⭐ SyllabiQ Pro" : "Free Plan"}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEME & LOOK */}
          {activeTab === "THEME" && (
            <div className="space-y-5 animate-fade-in text-xs">
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  Display Theme &amp; Contrast
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select your interface theme preference. Changes take effect immediately across all windows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Light Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer space-y-3 ${
                    theme === "light"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="h-5 w-5" />
                    </div>
                    {theme === "light" && (
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Light Mode</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Clean paper aesthetic for daytime studying and high visibility.
                    </p>
                  </div>
                </button>

                {/* Dark Mode Card */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer space-y-3 ${
                    theme === "dark"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
                      <Moon className="h-5 w-5" />
                    </div>
                    {theme === "dark" && (
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">Midnight Dark</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      High-contrast deep blue palette reduces eye strain during night prep.
                    </p>
                  </div>
                </button>

                {/* System Auto Card */}
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer space-y-3 ${
                    theme === "system"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      <Laptop className="h-5 w-5" />
                    </div>
                    {theme === "system" && (
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">System Match</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Follows your macOS, Windows, iOS, or Android operating system setting.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TIME ZONE SETTINGS */}
          {activeTab === "TIMEZONE" && (
            <div className="space-y-5 animate-fade-in text-xs">
              {/* Live Time Preview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-xs">
                    🌐
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Active Timezone Clock
                    </span>
                    <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                      {currentTimeStr || "Loading clock..."}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-[11px] text-slate-700 dark:text-slate-300">
                    {timeZoneMode === "auto" ? `Auto: ${detectedTz}` : `Manual: ${selectedTz}`}
                  </span>
                </div>
              </div>

              {/* Mode Selection Toggle */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Timezone Selection Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTimeZoneMode("auto");
                      setSelectedTz(detectedTz);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex items-center space-x-3 ${
                      timeZoneMode === "auto"
                        ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                      📍
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        Automatic (Browser / GPS)
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Detected: {detectedTz}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTimeZoneMode("manual")}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex items-center space-x-3 ${
                      timeZoneMode === "manual"
                        ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                      ⚙️
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        Manual Override (EST, UST, etc.)
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Select from global standard zones
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Manual Dropdown */}
              {timeZoneMode === "manual" && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-slate-400" /> Choose Standard Time Zone
                  </label>
                  <select
                    value={selectedTz}
                    onChange={(e) => setSelectedTz(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <optgroup label="North America">
                      {TIME_ZONE_OPTIONS.filter((t) => t.group === "North America").map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="International">
                      {TIME_ZONE_OPTIONS.filter((t) => t.group === "International").map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                ℹ️ All course assignment countdowns, morning dispatches, iCal feeds, and Google Calendar 2-way sync events will automatically calculate against this zone.
              </p>
            </div>
          )}

          {/* TAB 4: ACADEMIC & DATA PREFERENCES */}
          {activeTab === "ACADEMIC" && (
            <div className="space-y-5 animate-fade-in text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> Default Syllabus Due Time
                  </label>
                  <select
                    value={defaultDueTime}
                    onChange={(e) => setDefaultDueTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="23:59">11:59 PM — End of Day (Canvas Standard)</option>
                    <option value="17:00">5:00 PM — End of Business Day</option>
                    <option value="09:00">9:00 AM — Morning Class Start</option>
                    <option value="12:00">12:00 PM — Noon</option>
                  </select>
                  <p className="text-[10px] text-slate-400">
                    Applied when a syllabus lists a due date without an explicit hour.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> Week Start Day
                  </label>
                  <select
                    value={weekStartDay}
                    onChange={(e) => setWeekStartDay(e.target.value as "sunday" | "monday")}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="sunday">Sunday (North America Default)</option>
                    <option value="monday">Monday (International ISO Standard)</option>
                  </select>
                  <p className="text-[10px] text-slate-400">
                    Controls the first column of the semester schedule calendar.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" /> AI Milestone Prep Buffer
                  </label>
                  <select
                    value={prepBufferDays}
                    onChange={(e) => setPrepBufferDays(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value={3}>3 Days Prior (Sprint Mode)</option>
                    <option value={5}>5 Days Prior (Recommended for Exams &amp; Projects)</option>
                    <option value={7}>7 Days Prior (Intensive Prep / Pre-Med Mode)</option>
                  </select>
                  <p className="text-[10px] text-slate-400">
                    Lead time for automatic calendar study blocks before exams.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5 text-slate-400" /> Data Backup &amp; Portability
                  </label>
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Semester Data (.json)</span>
                  </button>
                  <p className="text-[10px] text-slate-400">
                    Download complete snapshot of courses, grades, and tasks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save / Cancel Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              {isSavedToast ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Settings Saved Successfully!</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Settings persist automatically to browser storage.
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm shadow-blue-500/30 transition cursor-pointer flex items-center space-x-1.5"
              >
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
