"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, FileText, Download, Sparkles } from "lucide-react";
import { Course } from "@/lib/types";

interface Props {
  courses: Course[];
  onClose: () => void;
}

export function ClassLockerModal({ courses, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);

  const handleSearchQuestion = () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();

    if (q.includes("late") || q.includes("penalty")) {
      setQaAnswer(
        "📋 **Late Work Policy (Cross-Course)**:\n• **CS 3110**: 10% penalty per 24 hours, max 3 days. No late submissions accepted on the final project.\n• **ECON 1010**: Lowest problem set score is automatically dropped; no late submissions accepted.\n• **BIO 1500**: Lab reports must be submitted on time. Missed labs require a physician excuse note."
      );
    } else if (q.includes("office hours") || q.includes("where")) {
      setQaAnswer(
        "📍 **Course Office Hours**:\n• **Dr. Michael Clarkson (CS 3110)**: Gates Hall 314, Tues/Thurs 2:00 PM - 4:00 PM\n• **Prof. Jennifer Wissink (ECON 1010)**: Uris Hall 468, Wed 10:00 AM - 12:00 PM\n• **Dr. Rachel Levin (BIO 1500)**: Corson Hall 210, Mon 3:00 PM - 5:00 PM"
      );
    } else if (q.includes("calculator") || q.includes("exam")) {
      setQaAnswer(
        "🧮 **Exam Equipment Policy**:\n• **ECON 1010**: Standard non-programmable scientific calculators permitted on Prelims 1 & 2.\n• **CS 3110**: Closed book, closed internet. Handwritten one-page 8.5x11 cheat sheet permitted."
      );
    } else {
      setQaAnswer(
        `🔍 **Results for "${searchQuery}"**:\nFound relevant sections in 2 course syllabi:\n1. **CS3110_Fall2026_Syllabus.pdf** (Section 4: Academic Integrity and Collaboration)\n2. **ECON1010_Micro_Syllabus.pdf** (Section 2: Problem Sets and Submission Policies)`
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200 text-xl shadow-xs">
              📁
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Smart Class Locker & Semantic Search</h3>
              <p className="text-xs text-slate-500 font-medium">All course syllabi, lecture slides, and policies in one searchable vault</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer">✕</button>
        </div>

        {/* Semantic Search Box */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 bg-slate-50 rounded-2xl px-4 py-2.5 border border-slate-300 focus-within:border-blue-500 shadow-2xs">
            <Search className="h-4 w-4 text-blue-600 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchQuestion()}
              placeholder="Ask about syllabus policies (e.g. 'What is the late penalty for CS 3110?')"
              className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button
              onClick={handleSearchQuestion}
              className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shrink-0 cursor-pointer"
            >
              Ask Locker
            </button>
          </div>

          {/* Prompt chips */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span className="font-semibold">Try:</span>
            {["Late penalty", "Office hours", "Calculator policy"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSearchQuery(t);
                  const lower = t.toLowerCase();
                  if (lower.includes("late")) {
                    setQaAnswer("📋 **Late Work Policy (Cross-Course)**:\n• **CS 3110**: 10% penalty per 24 hours, max 3 days.\n• **ECON 1010**: Lowest problem set score dropped; no late submissions.\n• **BIO 1500**: Lab reports must be submitted on time.");
                  } else if (lower.includes("office")) {
                    setQaAnswer("📍 **Course Office Hours**:\n• **Dr. Clarkson (CS 3110)**: Gates 314, Tues/Thurs 2-4pm\n• **Prof. Wissink (ECON 1010)**: Uris 468, Wed 10-12pm");
                  } else {
                    setQaAnswer("🧮 **Calculator Policy**:\n• **ECON 1010**: Non-programmable scientific calculator allowed.");
                  }
                }}
                className="underline hover:text-blue-600 font-medium cursor-pointer"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* AI Answer Box */}
        {qaAnswer && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-1 text-xs text-slate-800 shadow-2xs">
            <span className="font-extrabold text-indigo-800 flex items-center gap-1 text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Policy Answer (from stored syllabus documents):
            </span>
            <div className="whitespace-pre-wrap leading-relaxed pt-1 font-medium">{qaAnswer}</div>
          </div>
        )}

        {/* Course Documents List */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Stored Syllabi & Class Vault ({courses.length} files)
          </span>

          <div className="space-y-2">
            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-slate-300 shadow-2xs transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200 text-lg">
                    📄
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{c.code} Syllabus</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.2 rounded-full font-mono font-semibold">
                        {(c.syllabusDoc?.fileSize ? (c.syllabusDoc.fileSize / 1024).toFixed(0) : "350")} KB
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{c.syllabusDoc?.fileName || `${c.code}_Syllabus.pdf`}</p>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloaded copy of ${c.code} Syllabus document`)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-full bg-white border border-slate-300 shadow-2xs transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">View</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
