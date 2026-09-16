"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalIcon,
  Clock,
  MapPin,
  X,
  Check,
  Laptop,
  Smartphone,
  ExternalLink,
  Download,
  Copy,
  Sparkles,
  CheckCircle2,
  Bell,
  ShieldCheck,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { Course, TaskItem } from "@/lib/types";

interface ScheduleBlock {
  id: string;
  courseCode: string;
  courseName: string;
  room: string;
  dayOfWeek: number; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri
  startHour: number; // e.g. 8.5 for 8:30am
  durationHours: number; // e.g. 1.25 for 1h15m
  color: "pink" | "blue" | "green" | "yellow" | "purple" | "peach";
}

const DEFAULT_BLOCKS: ScheduleBlock[] = [
  {
    id: "block-1",
    courseCode: "CS 3110",
    courseName: "Functional Programming",
    room: "Gates Hall 314",
    dayOfWeek: 1, // Mon
    startHour: 8.5, // 8:30am
    durationHours: 1.25,
    color: "pink"
  },
  {
    id: "block-2",
    courseCode: "CS 3110",
    courseName: "Functional Programming",
    room: "Gates Hall 314",
    dayOfWeek: 3, // Wed
    startHour: 8.5,
    durationHours: 1.25,
    color: "pink"
  },
  {
    id: "block-3",
    courseCode: "BIO 1500",
    courseName: "Cellular Biology Lab",
    room: "Corson Hall 210",
    dayOfWeek: 1, // Mon
    startHour: 10.25, // 10:15am
    durationHours: 2.25,
    color: "blue"
  },
  {
    id: "block-4",
    courseCode: "MATH 2210",
    courseName: "Linear Algebra",
    room: "Phillips Hall 332",
    dayOfWeek: 2, // Tue
    startHour: 10.0, // 10:00am
    durationHours: 1.25,
    color: "green"
  },
  {
    id: "block-5",
    courseCode: "MATH 2210",
    courseName: "Linear Algebra",
    room: "Phillips Hall 332",
    dayOfWeek: 4, // Thu
    startHour: 10.0,
    durationHours: 1.25,
    color: "green"
  },
  {
    id: "block-6",
    courseCode: "Lunch Break",
    courseName: "Campus Dining",
    room: "Willard Straight",
    dayOfWeek: 1, // Mon
    startHour: 12.75, // 12:45pm
    durationHours: 1.0,
    color: "yellow"
  },
  {
    id: "block-7",
    courseCode: "Lunch Break",
    courseName: "Campus Dining",
    room: "Willard Straight",
    dayOfWeek: 2, // Tue
    startHour: 11.5, // 11:30am
    durationHours: 0.75,
    color: "yellow"
  },
  {
    id: "block-8",
    courseCode: "Lunch Break",
    courseName: "Campus Dining",
    room: "Willard Straight",
    dayOfWeek: 3, // Wed
    startHour: 12.0, // 12:00pm
    durationHours: 0.75,
    color: "yellow"
  },
  {
    id: "block-9",
    courseCode: "ECON 1010",
    courseName: "Microeconomics",
    room: "Uris Hall 468",
    dayOfWeek: 1, // Mon
    startHour: 14.0, // 2:00pm
    durationHours: 1.25,
    color: "purple"
  },
  {
    id: "block-10",
    courseCode: "ECON 1010",
    courseName: "Microeconomics",
    room: "Uris Hall 468",
    dayOfWeek: 3, // Wed
    startHour: 14.0,
    durationHours: 1.25,
    color: "purple"
  }
];

const COLOR_STYLES = {
  pink: "bg-[#FFE4E6] border-[#FDA4AF] text-[#9F1239] hover:bg-[#FECDD3]",
  blue: "bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF] hover:bg-[#BFDBFE]",
  green: "bg-[#DCFCE7] border-[#86EFAC] text-[#166534] hover:bg-[#BBF7D0]",
  yellow: "bg-[#FEF9C3] border-[#FDE047] text-[#854D0E] hover:bg-[#FEF08A]",
  purple: "bg-[#F3E8FF] border-[#D8B4FE] text-[#6B21A8] hover:bg-[#E9D5FF]",
  peach: "bg-[#FFEDD5] border-[#FDBA74] text-[#9A3412] hover:bg-[#FED7AA]"
};

const SWATCH_BG = {
  pink: "bg-[#FDA4AF]",
  blue: "bg-[#93C5FD]",
  green: "bg-[#86EFAC]",
  yellow: "bg-[#FDE047]",
  purple: "bg-[#D8B4FE]",
  peach: "bg-[#FDBA74]"
};

export function CoursicleScheduleView() {
  const [activeTab, setActiveTab] = useState<"GCAL_DESKTOP" | "GCAL_MOBILE" | "COURSICLE_GRID">("GCAL_DESKTOP");
  const [blocks, setBlocks] = useState<ScheduleBlock[]>(DEFAULT_BLOCKS);
  const [selectedDayIndex, setSelectedDayIndex] = useState(10);
  const [eventTitle, setEventTitle] = useState("");
  const [eventRoom, setEventRoom] = useState("");
  const [selectedColor, setSelectedColor] = useState<"pink" | "blue" | "green" | "yellow" | "purple" | "peach">("pink");
  const [startTime, setStartTime] = useState("10:00am");
  const [endTime, setEndTime] = useState("11:00am");
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(1);
  const [copiedFeed, setCopiedFeed] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState<string | null>(null);

  const days = [
    { name: "Mon", date: "9/15", dayNum: 1 },
    { name: "Tue", date: "9/16", dayNum: 2 },
    { name: "Wed", date: "9/17", dayNum: 3 },
    { name: "Thu", date: "9/18", dayNum: 4 },
    { name: "Fri", date: "9/19", dayNum: 5 }
  ];

  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  const handleCopyFeed = () => {
    const feedUrl = `${window.location.origin}/api/calendar/feed`;
    navigator.clipboard.writeText(feedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2500);
  };

  const handleSubscribeGoogleCalendar = () => {
    const feedUrl = encodeURIComponent(`${window.location.origin}/api/calendar/feed`);
    window.open(`https://calendar.google.com/calendar/r?cid=${feedUrl}`, "_blank");
  };

  const handleAddEvent = () => {
    if (!eventTitle.trim()) return;

    let startH = 10.0;
    if (startTime.includes("8")) startH = 8.5;
    else if (startTime.includes("9")) startH = 9.0;
    else if (startTime.includes("11")) startH = 11.0;
    else if (startTime.includes("12")) startH = 12.0;
    else if (startTime.includes("1")) startH = 13.0;
    else if (startTime.includes("2")) startH = 14.0;
    else if (startTime.includes("3")) startH = 15.0;

    const newBlock: ScheduleBlock = {
      id: `block-${Date.now()}`,
      courseCode: eventTitle.slice(0, 12).toUpperCase(),
      courseName: eventTitle,
      room: eventRoom || "Campus Hall",
      dayOfWeek: selectedDayOfWeek,
      startHour: startH,
      durationHours: 1.25,
      color: selectedColor
    };

    setBlocks([...blocks, newBlock]);
    setEventTitle("");
    setEventRoom("");
  };

  const removeBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] shadow-xl overflow-hidden space-y-0 transition-colors">
      {/* Top Header & View Switcher */}
      <div className="border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Syllabi<span className="text-blue-600 dark:text-blue-400">Q</span> Schedule &amp; Calendar
            </span>
            <span className="rounded-full bg-blue-100 dark:bg-blue-950/80 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Live Example
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            See how your semester schedule looks when synchronized into Google Calendar across web &amp; mobile.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex items-center rounded-2xl bg-slate-200/80 dark:bg-slate-800 p-1 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab("GCAL_DESKTOP")}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "GCAL_DESKTOP"
                ? "bg-white dark:bg-[#0B0F19] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>Google Calendar (Web)</span>
          </button>

          <button
            onClick={() => setActiveTab("GCAL_MOBILE")}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "GCAL_MOBILE"
                ? "bg-white dark:bg-[#0B0F19] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Google Calendar (Mobile)</span>
          </button>

          <button
            onClick={() => setActiveTab("COURSICLE_GRID")}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "COURSICLE_GRID"
                ? "bg-white dark:bg-[#0B0F19] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CalIcon className="h-3.5 w-3.5" />
            <span>Coursicle Grid</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GOOGLE CALENDAR (DESKTOP WEB VIEW) */}
      {activeTab === "GCAL_DESKTOP" && (
        <div className="p-5 sm:p-8 space-y-8 animate-fade-in">
          {/* Action Ribbon: Quick Subscribe & Export */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <CalIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Live Google Calendar Sync Feed
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Classes, lab sections, and 11:59 PM assignment deadlines auto-sync via RFC 5545 feed.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSubscribeGoogleCalendar}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-black shadow-sm transition cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Subscribe in Google Calendar</span>
              </button>

              <button
                onClick={handleCopyFeed}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-3.5 py-2 text-xs font-bold transition cursor-pointer"
              >
                {copiedFeed ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedFeed ? "Feed URL Copied! ✓" : "Copy iCal URL"}</span>
              </button>

              <a
                href="/api/calendar/feed"
                download="syllabiq-schedule.ics"
                className="inline-flex items-center space-x-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-3.5 py-2 text-xs font-bold transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .ics</span>
              </a>
            </div>
          </div>

          {/* Realistic Screenshot Showcase of Classes in Google Calendar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Weekly Class Timetable in Google Calendar</span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                    High Resolution Screenshot
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every class rendered with exact room numbers, recurring schedule blocks, and color-coded tags.
                </p>
              </div>

              <button
                onClick={() => setShowImageZoom("/images/gcal-desktop-schedule.jpg")}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Zoom Screenshot</span>
              </button>
            </div>

            {/* Browser Frame Mockup with Generated Screenshot */}
            <div className="rounded-3xl border border-slate-300 dark:border-slate-700 overflow-hidden shadow-2xl bg-slate-900">
              {/* Chrome Browser Header Bar */}
              <div className="bg-slate-800/90 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-3 font-mono text-[11px] text-slate-300 bg-slate-900/60 px-4 py-0.5 rounded-full border border-slate-700 truncate max-w-xs sm:max-w-md">
                    https://calendar.google.com/calendar/u/0/r/week/2026/9/14
                  </span>
                </div>
                <div className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-2.5 py-0.5 rounded-full hidden sm:block">
                  ● Synced Live via SyllabiQ RFC 5545
                </div>
              </div>

              {/* High-Resolution Screenshot Image */}
              <div className="relative group cursor-pointer" onClick={() => setShowImageZoom("/images/gcal-desktop-schedule.jpg")}>
                <img
                  src="/images/gcal-desktop-schedule.jpg"
                  alt="Google Calendar weekly schedule view showing college classes"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg transition flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5" />
                    Click to Enlarge
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side: Student Study Photography & What Google Calendar Sync Delivers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-center">
            {/* Left Photo: Student Studying */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-lg group">
              <img
                src="/images/student-studying.jpg"
                alt="Student studying with laptop at desk"
                className="w-full h-72 sm:h-80 object-cover opacity-90 group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Zero Typing Required</span>
                <h4 className="text-base font-black">Open Google Calendar &amp; Everything Is There</h4>
                <p className="text-xs text-slate-300 font-medium">
                  Syllabus ingestion writes class locations and problem set deadlines directly into your Google account.
                </p>
              </div>
            </div>

            {/* Right Feature Highlights */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="paper-card p-4 space-y-1.5">
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-wide">
                  <MapPin className="h-4 w-4" />
                  <span>Exact Lecture Hall &amp; Room Details</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Never wonder whether your lab is in Gates Hall or Corson. Every class block in Google Calendar automatically contains the building name, room number, and professor office hours.
                </p>
              </div>

              <div className="paper-card p-4 space-y-1.5">
                <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-wide">
                  <Bell className="h-4 w-4" />
                  <span>11:59 PM All-Day Assignment Bars</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Problem sets, OCaml warmups, and term paper deadlines appear across the top of your Google Calendar week view with automatic 24-hour and 3-hour crunch reminder chimes.
                </p>
              </div>

              <div className="paper-card p-4 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wide">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Bi-Directional Apple &amp; Outlook Sync</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Prefer Apple Calendar on your iPhone or Microsoft Outlook on Windows? The same RFC 5545 feed connects natively to all calendar clients with automatic updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE CALENDAR (MOBILE SMARTPHONE VIEW) */}
      {activeTab === "GCAL_MOBILE" && (
        <div className="p-5 sm:p-8 space-y-8 animate-fade-in">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1 rounded-full">
              Mobile Experience
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Google Calendar in the Palm of Your Hand
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Glance at your next lecture hall on your phone while walking across the campus quad.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Phone Screen Mockup Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-2xl bg-slate-900 max-w-xs group cursor-pointer" onClick={() => setShowImageZoom("/images/gcal-mobile-schedule.jpg")}>
                <img
                  src="/images/gcal-mobile-schedule.jpg"
                  alt="Student holding iPhone with Google Calendar class schedule and notification"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg transition flex items-center gap-1.5">
                    <Maximize2 className="h-3.5 w-3.5" />
                    Enlarge Screenshot
                  </span>
                </div>
              </div>
            </div>

            {/* Accompanying Mobile Details & Campus Group Photo */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <div className="paper-card p-5 space-y-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/20">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    <Bell className="h-4 w-4" />
                    <span>Real-Time 15-Minute Heads Up</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    &ldquo;Google Calendar: CS 3110 starts in 15 mins (Gates Hall 314)&rdquo;
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Pushes directly to your Apple Watch, iPhone lockscreen, or Android banner so you never sprint into the wrong lecture hall.
                  </p>
                </div>

                <div className="paper-card p-5 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Today&apos;s Class Timeline at a Glance</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 font-medium">
                    <li>• <strong>10:15 - 11:30 AM</strong>: CS 3110 Functional Programming (Gates 314)</li>
                    <li>• <strong>12:00 - 1:00 PM</strong>: Campus Dining &amp; Peer Study Group</li>
                    <li>• <strong>2:30 - 3:45 PM</strong>: ECON 1110 Intro to Microeconomics (Statler Aud)</li>
                    <li>• <strong>4:00 - 5:15 PM</strong>: BIO 1350 Cell Biology &amp; Lab (Biotech 101)</li>
                  </ul>
                </div>
              </div>

              {/* Campus Group Photo Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 group">
                <img
                  src="/images/student-group.jpg"
                  alt="Students smiling together on campus"
                  className="w-full h-44 object-cover opacity-60 group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Campus Study Circles</span>
                  <p className="text-xs font-bold leading-tight">
                    &ldquo;Our whole study group subscribed to the same SyllabiQ calendar feed so we always know when each other are out of class.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORIGINAL COURSICLE WEEKLY TIMETABLE GRID */}
      {activeTab === "COURSICLE_GRID" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
          {/* LEFT PANEL: New Event & Mini Calendar */}
          <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 p-5 space-y-5 bg-white dark:bg-[#131B2E]">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center space-x-2">
                <div className={`h-4 w-4 rounded-full ${SWATCH_BG[selectedColor]} border border-black/10`} />
                <h3 className="text-base font-black text-slate-900 dark:text-white">Custom Timetable Block</h3>
              </div>
              <button
                onClick={() => {
                  setEventTitle("");
                  setEventRoom("");
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Color swatch picker */}
            <div className="flex items-center space-x-2">
              {(["pink", "blue", "green", "yellow", "purple", "peach"] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-6 w-6 rounded-full ${SWATCH_BG[color]} border transition cursor-pointer flex items-center justify-center ${
                    selectedColor === color ? "ring-2 ring-blue-600 ring-offset-2" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {selectedColor === color && <Check className="h-3 w-3 text-slate-900 stroke-[3]" />}
                </button>
              ))}
            </div>

            {/* Title input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Class / Event Title</label>
              <input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. CS 3110 Recitation"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Room input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400">Room / Campus Location</label>
              <input
                value={eventRoom}
                onChange={(e) => setEventRoom(e.target.value)}
                placeholder="e.g. Gates Hall 314"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Mini Month Calendar */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span>September 2026</span>
                <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 pb-1">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-700 dark:text-slate-300">
                {[
                  null, null, 1, 2, 3, 4, 5,
                  6, 7, 8, 9, 10, 11, 12,
                  13, 14, 15, 16, 17, 18, 19,
                  20, 21, 22, 23, 24, 25, 26,
                  27, 28, 29, 30
                ].map((day, idx) => (
                  <div key={idx} className="flex justify-center">
                    {day !== null ? (
                      <button
                        onClick={() => {
                          setSelectedDayIndex(day);
                          setSelectedDayOfWeek(((day - 1) % 5) + 1);
                        }}
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold transition cursor-pointer ${
                          selectedDayIndex === day
                            ? "bg-blue-600 text-white shadow-xs"
                            : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {day}
                      </button>
                    ) : (
                      <div className="h-6 w-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Starts & Ends Inputs */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600 dark:text-slate-400">Starts</span>
                <input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-24 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-center font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-600 dark:text-slate-400">Ends</span>
                <input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-24 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-center font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setEventTitle("CS 3110 Office Hours");
                  setEventRoom("Gates Hall 314");
                  setSelectedColor("purple");
                }}
                className="rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Sample Block
              </button>
              <button
                onClick={handleAddEvent}
                className="rounded-full bg-blue-600 px-5 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
              >
                Add Block
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Coursicle Timetable Grid */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-x-auto bg-slate-50/30 dark:bg-slate-900/20">
            {/* Campus Banner */}
            <div className="mb-3 flex items-center justify-center">
              <div className="w-full max-w-sm bg-[#FFEDD5] dark:bg-amber-950/60 border border-[#FDBA74] dark:border-amber-700 text-[#9A3412] dark:text-amber-300 text-xs font-extrabold py-1 px-4 rounded-full text-center shadow-2xs">
                🍁 Fall Campus Career &amp; Internship Fair (All Week)
              </div>
            </div>

            {/* Header Days of Week */}
            <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-800 pb-2 text-center text-xs">
              <div className="text-slate-400 font-bold"></div>
              {days.map((d) => (
                <div key={d.dayNum} className="space-y-0.5">
                  <span className="block font-bold text-slate-700 dark:text-slate-200">{d.name}</span>
                  <span className="block text-[11px] text-slate-400 font-semibold">{d.date}</span>
                </div>
              ))}
            </div>

            {/* Time Rows & Event Positioning Grid */}
            <div className="relative mt-2" style={{ height: "660px" }}>
              {/* Background Hour Lines */}
              {hours.map((h, i) => (
                <div
                  key={h}
                  style={{ top: `${i * 60}px` }}
                  className="absolute left-0 right-0 flex items-center border-t border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-400"
                >
                  <span className="w-12 pr-2 text-right">
                    {h > 12 ? `${h - 12}pm` : h === 12 ? "12pm" : `${h}am`}
                  </span>
                  <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
                </div>
              ))}

              {/* Red Live Time Indicator Line */}
              <div
                style={{ top: "270px" }}
                className="absolute left-12 right-0 flex items-center z-10 pointer-events-none"
              >
                <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-100 dark:ring-red-950" />
                <div className="h-[2px] w-full bg-red-500 shadow-xs" />
              </div>

              {/* Course Blocks overlay */}
              <div className="absolute left-12 right-0 top-0 bottom-0 grid grid-cols-5 gap-2 px-1">
                {days.map((d) => {
                  const dayBlocks = blocks.filter((b) => b.dayOfWeek === d.dayNum);

                  return (
                    <div key={d.dayNum} className="relative h-full">
                      {dayBlocks.map((b) => {
                        const topOffset = (b.startHour - 7) * 60;
                        const height = b.durationHours * 60;

                        return (
                          <div
                            key={b.id}
                            style={{
                              top: `${topOffset}px`,
                              height: `${height}px`
                            }}
                            className={`absolute left-0 right-0 rounded-2xl border p-2.5 text-xs transition-all shadow-2xs cursor-pointer flex flex-col justify-between overflow-hidden group ${
                              COLOR_STYLES[b.color]
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between font-black text-xs leading-tight">
                                <span>{b.courseCode}</span>
                                <button
                                  onClick={(e) => removeBlock(b.id, e)}
                                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-700 p-0.5"
                                  title="Remove block"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="text-[10px] opacity-85 font-medium truncate mt-0.5">
                                {b.courseName}
                              </div>
                            </div>

                            <div className="text-[9px] opacity-75 font-semibold flex items-center gap-1 pt-1">
                              <MapPin className="h-2.5 w-2.5 shrink-0" />
                              <span className="truncate">{b.room}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {showImageZoom && (
        <div
          onClick={() => setShowImageZoom(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={showImageZoom}
              alt="Enlarged Google Calendar Schedule Screenshot"
              className="w-full h-auto object-contain max-h-[85vh] rounded-2xl"
            />
            <button
              onClick={() => setShowImageZoom(null)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
