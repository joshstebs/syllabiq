"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Flame,
  BookOpen,
  ArrowRight,
  Filter,
  CheckSquare,
  Square,
  ChevronDown,
  Info,
  CalendarCheck,
  Users
} from "lucide-react";
import confetti from "canvas-confetti";
import { Course, TaskItem, TaskType } from "@/lib/types";

interface Props {
  tasks: TaskItem[];
  courses: Course[];
  onUpdateTask: (taskId: string, patch: any) => Promise<void>;
  onDeconstructTask: (taskId: string) => Promise<void>;
  onOpenGradeModal: () => void;
  onOpenStoryModal?: (task?: TaskItem) => void;
  onOpenClassGroupsModal?: () => void;
}

export function SemesterTimelineView({
  tasks,
  courses,
  onUpdateTask,
  onDeconstructTask,
  onOpenGradeModal,
  onOpenStoryModal,
  onOpenClassGroupsModal
}: Props) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"DATE" | "WEIGHT">("DATE");

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedCourseId !== "ALL" && t.courseId !== selectedCourseId) return false;
      if (selectedType !== "ALL" && t.type.toLowerCase() !== selectedType.toLowerCase()) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "WEIGHT") {
        return (b.weightPercent || 0) - (a.weightPercent || 0);
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, selectedCourseId, selectedType, sortBy]);

  // Group into DormWay-style milestone buckets
  const groupedTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const buckets: {
      id: string;
      title: string;
      subtitle: string;
      tagColor: string;
      tasks: TaskItem[];
    }[] = [
      {
        id: "today",
        title: "Today & Tonight",
        subtitle: "Immediate priorities requiring action before midnight",
        tagColor: "bg-rose-100 text-rose-800 border-rose-200",
        tasks: []
      },
      {
        id: "tomorrow",
        title: "Tomorrow",
        subtitle: "Prepare drafts and complete review today",
        tagColor: "bg-amber-100 text-amber-800 border-amber-200",
        tasks: []
      },
      {
        id: "this_week",
        title: "This Week",
        subtitle: "Upcoming milestones within the next 7 days",
        tagColor: "bg-blue-100 text-blue-800 border-blue-200",
        tasks: []
      },
      {
        id: "next_week",
        title: "Next Week",
        subtitle: "Start early study buffers to avoid crunch",
        tagColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
        tasks: []
      },
      {
        id: "later",
        title: "Midterms & Final Term Projects",
        subtitle: "Major grade weight items across the remaining semester",
        tagColor: "bg-purple-100 text-purple-800 border-purple-200",
        tasks: []
      }
    ];

    filteredTasks.forEach((task) => {
      const dueTime = new Date(task.dueDate).getTime();
      const diffDays = Math.floor((dueTime - today) / 86400000);

      if (diffDays <= 0) {
        buckets[0].tasks.push(task);
      } else if (diffDays === 1) {
        buckets[1].tasks.push(task);
      } else if (diffDays <= 7) {
        buckets[2].tasks.push(task);
      } else if (diffDays <= 14) {
        buckets[3].tasks.push(task);
      } else {
        buckets[4].tasks.push(task);
      }
    });

    return buckets.filter((b) => b.tasks.length > 0);
  }, [filteredTasks]);

  const totalDeadlines = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const highStakesCount = tasks.filter((t) => (t.weightPercent || 0) >= 20).length;

  const handleToggleDone = async (t: TaskItem) => {
    const newStatus = t.status === "DONE" ? "TODO" : "DONE";
    if (newStatus === "DONE") {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    await onUpdateTask(t.id, { status: newStatus });
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* DormWay Header & Tagline Banner */}
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-4 sm:p-8 shadow-xs w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
              <CalendarCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>DormWay Automated Semester Timeline</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900 break-words">
              Never wonder what&apos;s due.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed break-words">
              Every assignment, exam, paper, and reading organized in chronological order with smart urgency countdowns and AI prep buffers.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 min-w-[75px] sm:min-w-[110px] text-center shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Due
              </span>
              <span className="text-lg sm:text-2xl font-black text-slate-900">
                {totalDeadlines}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block">
                {completedCount} done
              </span>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 min-w-[75px] sm:min-w-[110px] text-center shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
                High Stakes
              </span>
              <span className="text-lg sm:text-2xl font-black text-amber-600">
                {highStakesCount}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block">
                &ge; 20%
              </span>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3.5 min-w-[75px] sm:min-w-[110px] text-center shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                Safety Net
              </span>
              <span className="text-lg sm:text-2xl font-black text-emerald-600">
                100%
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block">
                Read-only
              </span>
            </div>
          </div>
        </div>

        {/* Quick Social Virality & Study Group Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenStoryModal?.()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-xs font-black shadow-xs hover:opacity-95 transition cursor-pointer"
              title="Generate 9:16 Instagram or Snapchat Story Card"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Share Milestone Story (IG/Snap)</span>
            </button>

            <button
              onClick={onOpenClassGroupsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
              title="Open Class Study Group Chats (Discord, FB, WhatsApp)"
            >
              <Users className="h-3.5 w-3.5 text-blue-600" />
              <span>Class Study Groups</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Export milestone cards or sync schedules with classmates
          </span>
        </div>

        {/* FILTERS & CONTROLS ROW */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Course filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1">Filter Class:</span>
            <button
              onClick={() => setSelectedCourseId("ALL")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCourseId === "ALL"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              All Classes ({tasks.length})
            </button>

            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCourseId === c.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: c.colorHex || "#3B82F6" }}
                />
                <span>{c.emoji || "📚"}</span>
                <span>{c.code}</span>
              </button>
            ))}

            {/* Linked Class Group Chat Quick Pill */}
            {selectedCourseId !== "ALL" && (() => {
              const activeC = courses.find((c) => c.id === selectedCourseId);
              if (!activeC?.groupChat) return null;
              return (
                <a
                  href={activeC.groupChat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition shadow-2xs ml-1"
                >
                  <span>💬</span>
                  <span>{activeC.groupChat.name}</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              );
            })()}
          </div>

          {/* Type and sort toggles */}
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by type"
              className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-1.5 shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="assignment">📝 Assignments</option>
              <option value="exam">🎯 Exams &amp; Midterms</option>
              <option value="quiz">⚡ Quizzes</option>
              <option value="reading">📚 Readings</option>
              <option value="project">🚀 Projects</option>
            </select>

            <button
              onClick={() => setSortBy(sortBy === "DATE" ? "WEIGHT" : "DATE")}
              className="flex items-center gap-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-1.5 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <span>{sortBy === "DATE" ? "By Due Date" : "By Grade Weight %"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TIMELINE MILESTONE SECTIONS */}
      <div className="space-y-8">
        {groupedTasks.map((group) => (
          <div key={group.id} className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center gap-3 border-b border-slate-200/80 pb-2">
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${group.tagColor}`}>
                {group.title}
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {group.subtitle}
              </span>
              <span className="ml-auto text-xs font-bold text-slate-400">
                {group.tasks.length} {group.tasks.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* List of Tasks in this Milestone Bucket */}
            <div className="grid gap-3">
              {group.tasks.map((task) => {
                const isDone = task.status === "DONE";
                const isHighStakes = (task.weightPercent || 0) >= 20;
                const dueDateObj = new Date(task.dueDate);
                const formattedDate = dueDateObj.toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric"
                });
                const formattedTime = dueDateObj.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit"
                });

                return (
                  <div
                    key={task.id}
                    className={`group rounded-2xl border transition p-4 sm:p-5 ${
                      isDone
                        ? "bg-slate-50/80 border-slate-200/60 opacity-65"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Left: Checkbox + Title + Metadata */}
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleToggleDone(task)}
                          className="mt-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                          title={isDone ? "Mark as Incomplete" : "Mark as Done"}
                        >
                          {isDone ? (
                            <CheckSquare className="h-5 w-5 text-emerald-600 stroke-[2.5]" />
                          ) : (
                            <Square className="h-5 w-5 text-slate-300 hover:text-blue-600 stroke-[2]" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Course Pill with Custom Emoji */}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-black border border-slate-200">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: task.courseColor || "#3B82F6" }}
                              />
                              <span>
                                {courses.find((c) => c.id === task.courseId)?.emoji || task.emoji || "📚"}
                              </span>
                              <span>{task.courseCode || task.courseName}</span>
                            </span>

                            {/* Type Pill */}
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                task.type === "exam"
                                  ? "bg-rose-100 text-rose-800"
                                  : task.type === "reading"
                                  ? "bg-amber-100 text-amber-800"
                                  : task.type === "quiz"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {task.type}
                            </span>

                            {/* Grade Weight Badge */}
                            {task.weightPercent && task.weightPercent > 0 && (
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                  isHighStakes
                                    ? "bg-rose-50 text-rose-700 border-rose-200 font-black"
                                    : "bg-slate-50 text-slate-700 border-slate-200"
                                }`}
                              >
                                {isHighStakes && "🔥 "}
                                {task.weightPercent}% of Final Grade
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-base font-extrabold text-slate-900 leading-snug ${
                              isDone ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Due Date & Time Badge + Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 self-end sm:self-auto shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900">
                            {formattedDate}
                          </div>
                          <div className="text-[11px] font-bold text-slate-500">
                            {formattedTime}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => onDeconstructTask(task.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 text-[11px] font-bold text-indigo-700 transition cursor-pointer"
                            title="Generate 5-step milestone breakdown"
                          >
                            <Sparkles className="h-3 w-3 text-indigo-600" />
                            <span>AI Milestones</span>
                          </button>

                          <button
                            onClick={onOpenGradeModal}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700 transition cursor-pointer"
                            title="Simulate grade impact"
                          >
                            <span>What-If</span>
                          </button>

                          <button
                            onClick={() => onOpenStoryModal?.(task)}
                            className="inline-flex items-center gap-1 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 px-2 py-1 text-[11px] font-bold text-pink-700 transition cursor-pointer"
                            title="Share Instagram & Snapchat Story Card"
                          >
                            <Sparkles className="h-3 w-3 text-pink-600" />
                            <span>Story</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AI Prep Buffer or Policy Caution Strip */}
                    {isHighStakes && !isDone && (
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-amber-700 font-semibold bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/80">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>
                            ⚡ <strong>AI Prep Buffer:</strong> High-impact item ({task.weightPercent}%). Start study plan 5 days early to prevent crunch.
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 italic">
                          Extracted from official syllabus
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {groupedTasks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="text-3xl">🎉</div>
            <h3 className="text-lg font-bold text-slate-800">No deadlines match this filter</h3>
            <p className="text-xs text-slate-500">
              You&apos;re completely caught up, or try selecting &quot;All Classes&quot; above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
