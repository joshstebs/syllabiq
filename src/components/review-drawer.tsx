"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, User, BookOpen, Trash2, Plus, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { ParsedSyllabus } from "@/lib/types";

interface Props {
  data: ParsedSyllabus;
  onClose: () => void;
  onCommitSuccess: (courseCode: string) => void;
}

export function ReviewDrawer({ data, onClose, onCommitSuccess }: Props) {
  const [syllabus, setSyllabus] = useState<ParsedSyllabus>(JSON.parse(JSON.stringify(data)));
  const [isCommitting, setIsCommitting] = useState(false);

  const updateTask = (index: number, field: string, value: any) => {
    const next = [...syllabus.items];
    next[index] = { ...next[index], [field]: value };
    setSyllabus({ ...syllabus, items: next });
  };

  const removeTask = (index: number) => {
    const next = syllabus.items.filter((_, i) => i !== index);
    setSyllabus({ ...syllabus, items: next });
  };

  const addNewTask = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setSyllabus({
      ...syllabus,
      items: [
        ...syllabus.items,
        {
          title: "New Syllabus Item",
          type: "assignment",
          due_date: d.toISOString(),
          weight_percent: 5,
          description: "Added during review"
        }
      ]
    });
  };

  const handleCommit = async () => {
    setIsCommitting(true);
    try {
      const res = await fetch("/api/ingest/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabus })
      });

      if (!res.ok) throw new Error("Commit failed");

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });

      onCommitSuccess(syllabus.course_code);
    } catch (err: any) {
      alert(`Error committing schedule: ${err.message}`);
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="h-full w-full max-w-2xl bg-white border-l border-slate-200 p-6 overflow-y-auto flex flex-col justify-between shadow-2xl"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700">
                  AI Extraction Verified
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Calendar
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Review & Approve Course Schedule</h2>
              <p className="text-xs text-slate-500">Tweak any due date or grading weight before committing to your Google Calendar.</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 rounded-full p-2 hover:bg-slate-100 transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Course Code & Title
              </label>
              <input
                value={syllabus.course_code}
                onChange={(e) => setSyllabus({ ...syllabus, course_code: e.target.value })}
                className="w-full bg-white font-extrabold text-sm text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
                placeholder="Course Code (e.g. CS 3110)"
              />
              <input
                value={syllabus.course_name}
                onChange={(e) => setSyllabus({ ...syllabus, course_name: e.target.value })}
                className="w-full bg-transparent text-xs text-slate-600 focus:outline-none px-1"
                placeholder="Course Title"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-emerald-600" /> Instructor & Office Hours
              </label>
              <input
                value={syllabus.instructor.name}
                onChange={(e) =>
                  setSyllabus({
                    ...syllabus,
                    instructor: { ...syllabus.instructor, name: e.target.value }
                  })
                }
                className="w-full bg-white font-bold text-sm text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
                placeholder="Professor Name"
              />
              <div className="flex items-center space-x-2 pt-0.5">
                <input
                  value={syllabus.instructor.email}
                  onChange={(e) =>
                    setSyllabus({
                      ...syllabus,
                      instructor: { ...syllabus.instructor, email: e.target.value }
                    })
                  }
                  className="w-1/2 bg-transparent text-xs text-slate-600 focus:outline-none px-1"
                  placeholder="Email"
                />
                <input
                  value={syllabus.instructor.office_hours}
                  onChange={(e) =>
                    setSyllabus({
                      ...syllabus,
                      instructor: { ...syllabus.instructor, office_hours: e.target.value }
                    })
                  }
                  className="w-1/2 bg-transparent text-xs text-slate-600 focus:outline-none px-1"
                  placeholder="Office Hours"
                />
              </div>
            </div>
          </div>

          {/* Weight Breakdown */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Grade Weight Breakdown
              </h4>
              <span className="text-xs font-semibold text-slate-700">
                Total:{" "}
                <strong className="text-blue-700 font-bold">
                  {syllabus.weight_distribution.reduce((acc, w) => acc + (w.percentage || 0), 0)}%
                </strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {syllabus.weight_distribution.map((w, idx) => (
                <div
                  key={idx}
                  className="bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="text-slate-700 font-medium">{w.category}</span>
                  <span className="font-extrabold text-blue-600">{w.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Tasks Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Extracted Tasks ({syllabus.items.length})
              </h4>
              <button
                onClick={addNewTask}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {syllabus.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="space-y-1 w-full sm:w-[62%]">
                    <div className="flex items-center gap-2">
                      <select
                        value={item.type}
                        onChange={(e) => updateTask(index, "type", e.target.value)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border-0 cursor-pointer ${
                          item.type === "exam"
                            ? "bg-red-100 text-red-700"
                            : item.type === "project"
                            ? "bg-purple-100 text-purple-700"
                            : item.type === "quiz"
                            ? "bg-amber-100 text-amber-700"
                            : item.type === "reading"
                            ? "bg-cyan-100 text-cyan-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <option value="assignment">ASSIGNMENT</option>
                        <option value="exam">EXAM</option>
                        <option value="quiz">QUIZ</option>
                        <option value="project">PROJECT</option>
                        <option value="reading">READING</option>
                      </select>
                      <input
                        value={item.title}
                        onChange={(e) => updateTask(index, "title", e.target.value)}
                        className="text-xs font-bold text-slate-900 bg-transparent border-0 focus:outline-none w-full truncate"
                      />
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-blue-600" />
                        <input
                          type="datetime-local"
                          value={new Date(item.due_date).toISOString().slice(0, 16)}
                          onChange={(e) => updateTask(index, "due_date", new Date(e.target.value).toISOString())}
                          className="bg-transparent text-[11px] text-slate-700 font-medium focus:outline-none cursor-pointer"
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.weight_percent}
                        onChange={(e) => updateTask(index, "weight_percent", parseFloat(e.target.value) || 0)}
                        className="w-12 bg-slate-50 rounded px-1.5 py-0.5 text-right text-xs font-bold text-slate-900 border border-slate-300 focus:outline-none"
                      />
                      <span className="text-xs text-slate-500 font-medium">%</span>
                    </div>

                    <button
                      onClick={() => removeTask(index)}
                      className="text-slate-400 hover:text-red-500 transition p-1 cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={isCommitting}
            onClick={handleCommit}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isCommitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Syncing to Google Calendar...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" /> Approve & Sync Everywhere
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
