"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Tablet, Bell, CheckCircle2, Calendar, QrCode, Sparkles, BookOpen, Clock } from "lucide-react";
import { TaskItem, Course } from "@/lib/types";

interface Props {
  tasks: TaskItem[];
  courses: Course[];
  onClose: () => void;
}

export function MobilePreviewModal({ tasks, courses, onClose }: Props) {
  const [device, setDevice] = useState<"IPHONE" | "IPAD">("IPHONE");
  const [activeTab, setActiveTab] = useState<"TODAY" | "CLASSES" | "ALERTS">("TODAY");

  const todayTasks = tasks.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div className="flex flex-col items-center space-y-4 max-h-[96vh]">
        {/* Controls Bar */}
        <div className="flex items-center space-x-3 bg-slate-900/90 border border-white/10 px-4 py-2 rounded-2xl shadow-xl">
          <span className="text-xs font-bold text-slate-300">Device Simulator:</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setDevice("IPHONE")}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                device === "IPHONE" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>iPhone 16</span>
            </button>
            <button
              onClick={() => setDevice("IPAD")}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                device === "IPAD" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>iPad Pro</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          <button onClick={onClose} className="text-xs text-slate-400 hover:text-white p-1">✕ Close</button>
        </div>

        {/* Device Frame */}
        <div
          className={`relative rounded-[45px] border-[10px] border-slate-800 bg-[#0B0F17] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            device === "IPHONE" ? "w-[360px] h-[680px]" : "w-[560px] h-[680px]"
          }`}
        >
          {/* Dynamic Island / Camera Notch */}
          <div className="w-full flex justify-center pt-2 pb-1 bg-[#0B0F17] z-20">
            <div className="h-5 w-28 bg-black rounded-full flex items-center justify-between px-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-white">
            {/* Header */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Today, Sept 15</span>
                <h3 className="text-lg font-extrabold text-white">Howdy, Alex 👋</h3>
              </div>
              <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                <span className="text-[10px] font-bold text-emerald-400">3/6 this week</span>
              </div>
            </div>

            {/* Notification Banner */}
            <div className="rounded-xl bg-gradient-to-r from-amber-500/15 to-indigo-500/15 border border-amber-500/30 p-3 flex items-start space-x-2.5">
              <Bell className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] space-y-0.5">
                <span className="font-bold text-amber-300 block">Class In 30 Minutes</span>
                <p className="text-slate-300 leading-tight">CS 3110 starts at 11:00 AM (Gates Hall 314). Commute buffer +10m added.</p>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl text-xs">
              {(["TODAY", "CLASSES", "ALERTS"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition ${
                    activeTab === tab ? "bg-indigo-600 text-white shadow" : "text-slate-400"
                  }`}
                >
                  {tab === "TODAY" ? "To-Do Today" : tab === "CLASSES" ? "My Courses" : "AI Alerts"}
                </button>
              ))}
            </div>

            {/* Content per tab */}
            {activeTab === "TODAY" && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Priority Tasks ({todayTasks.length})
                </span>
                {todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-900/80 border border-white/5 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[75%]">
                      <div className="flex items-center space-x-1.5">
                        <span
                          style={{ color: t.courseColor }}
                          className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/5"
                        >
                          {t.courseCode}
                        </span>
                        <p className="text-xs font-semibold text-white truncate">{t.title}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> Due {new Date(t.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })} • {t.weightPercent}% grade
                      </p>
                    </div>
                    <div className="h-5 w-5 rounded-full border border-slate-600 flex items-center justify-center">
                      {t.status === "DONE" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "CLASSES" && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Enrolled Courses ({courses.length})
                </span>
                {courses.map((c) => (
                  <div key={c.id} className="bg-slate-900/80 border border-white/5 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{c.code}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">Synced GCal</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{c.name}</p>
                    <p className="text-[10px] text-slate-400">Instructor: {c.instructor.name}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "ALERTS" && (
              <div className="space-y-2 text-xs">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-300 space-y-1">
                  <span className="font-bold text-[11px] block">⚡ Workload Crunch Alert</span>
                  <p className="text-[11px] text-slate-300">
                    Week 5 carries 35% of your total semester grade (CS 3110 Prelim + ECON 1010 Exam). Start working on prep blocks now.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom App Navigation */}
          <div className="bg-slate-950 border-t border-white/10 py-2.5 px-6 flex items-center justify-between text-slate-400">
            <button className="flex flex-col items-center space-y-0.5 text-indigo-400 font-bold">
              <Calendar className="h-4 w-4" />
              <span className="text-[9px]">Schedule</span>
            </button>
            <button className="flex flex-col items-center space-y-0.5 hover:text-white">
              <BookOpen className="h-4 w-4" />
              <span className="text-[9px]">Classes</span>
            </button>
            <button className="flex flex-col items-center space-y-0.5 hover:text-white">
              <Sparkles className="h-4 w-4" />
              <span className="text-[9px]">AI Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
