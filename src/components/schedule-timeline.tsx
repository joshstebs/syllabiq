"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  CheckSquare,
  Square,
  MoreVertical,
  Layers
} from "lucide-react";
import { TaskItem, TaskStatus } from "@/lib/types";

interface Props {
  tasks: TaskItem[];
  onUpdateTask: (taskId: string, patch: any) => Promise<void>;
  onDeconstructTask: (taskId: string) => Promise<void>;
}

export function ScheduleTimeline({ tasks, onUpdateTask, onDeconstructTask }: Props) {
  const [filter, setFilter] = useState<"ALL" | "TODAY" | "WEEK" | "EXAM" | "HIGH_WEIGHT" | "DONE">("ALL");
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});
  const [editingGrade, setEditingGrade] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<string>("");
  const [loadingDeconstruct, setLoadingDeconstruct] = useState<string | null>(null);

  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 3600 * 1000);
  const next7d = new Date(now.getTime() + 7 * 24 * 3600 * 1000);

  const filteredTasks = tasks.filter((t) => {
    const due = new Date(t.dueDate);
    if (filter === "TODAY") return due <= next24h && t.status !== "DONE";
    if (filter === "WEEK") return due <= next7d && t.status !== "DONE";
    if (filter === "EXAM") return t.type === "exam";
    if (filter === "HIGH_WEIGHT") return (t.weightPercent || 0) >= 10;
    if (filter === "DONE") return t.status === "DONE";
    return true;
  });

  const toggleExpand = (taskId: string) => {
    setExpandedSubtasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleDeconstruct = async (taskId: string) => {
    setLoadingDeconstruct(taskId);
    try {
      await onDeconstructTask(taskId);
      setExpandedSubtasks((prev) => ({ ...prev, [taskId]: true }));
    } finally {
      setLoadingDeconstruct(null);
    }
  };

  const cycleStatus = async (task: TaskItem) => {
    const sequence: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
    const nextIndex = (sequence.indexOf(task.status) + 1) % sequence.length;
    await onUpdateTask(task.id, { status: sequence[nextIndex] });
  };

  const saveGrade = async (taskId: string) => {
    const val = parseFloat(gradeInput);
    await onUpdateTask(taskId, { gradeReceived: !isNaN(val) ? val : null });
    setEditingGrade(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Academic To-Do & Deadlines</h3>
          <p className="text-xs text-slate-500">Pulled from your course syllabi, Canvas, and iCal feeds.</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["ALL", "TODAY", "WEEK", "EXAM", "HIGH_WEIGHT", "DONE"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                filter === mode
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {mode === "ALL" ? "All Tasks" :
               mode === "TODAY" ? "Due 24h" :
               mode === "WEEK" ? "This Week" :
               mode === "EXAM" ? "Exams" :
               mode === "HIGH_WEIGHT" ? "High Weight (≥10%)" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List matching Due Gooder Card style */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            No assignments or exams found matching this filter.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDueSoon = new Date(task.dueDate) <= next24h && task.status !== "DONE";
            const isExpanded = !!expandedSubtasks[task.id];

            return (
              <div
                key={task.id}
                className={`rounded-xl border p-3.5 transition-all ${
                  isDueSoon
                    ? "border-amber-300 bg-amber-50/50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Checkbox and Task Details */}
                  <div className="flex items-start space-x-3 max-w-xl">
                    <button
                      onClick={() => cycleStatus(task)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                      title="Click to toggle status"
                    >
                      {task.status === "DONE" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : task.status === "IN_PROGRESS" ? (
                        <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      ) : (
                        <div className="h-5 w-5 rounded-md border-2 border-slate-300 hover:border-blue-500 bg-white" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Course Badge */}
                        <span
                          style={{
                            backgroundColor: `${task.courseColor}15`,
                            color: task.courseColor,
                            borderColor: `${task.courseColor}30`
                          }}
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                        >
                          {task.courseCode}
                        </span>

                        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                          task.type === "exam" ? "bg-red-100 text-red-700" :
                          task.type === "project" ? "bg-purple-100 text-purple-700" :
                          task.type === "quiz" ? "bg-amber-100 text-amber-700" :
                          task.type === "reading" ? "bg-cyan-100 text-cyan-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {task.type}
                        </span>

                        <h4 className={`text-sm font-bold text-slate-900 ${task.status === "DONE" ? "line-through text-slate-400" : ""}`}>
                          {task.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className={`flex items-center gap-1 font-semibold ${isDueSoon ? "text-amber-700 font-bold" : "text-slate-600"}`}>
                          <Calendar className="h-3.5 w-3.5 text-blue-600" />
                          {new Date(task.dueDate).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          ~{task.estimatedHours}h effort
                        </span>

                        <span className="font-bold text-blue-700">
                          Weight: {task.weightPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Actions & Grade */}
                  <div className="flex items-center space-x-2 sm:self-center self-end">
                    {/* Due Gooder style Date Tag Pill */}
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {new Date(task.dueDate).toLocaleDateString([], { weekday: "short", month: "numeric", day: "numeric" })}
                    </span>

                    {/* Grade input */}
                    {editingGrade === task.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          placeholder="Score"
                          value={gradeInput}
                          onChange={(e) => setGradeInput(e.target.value)}
                          className="w-16 bg-white rounded px-2 py-1 text-xs text-slate-900 border border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => saveGrade(task.id)}
                          className="bg-blue-600 px-2 py-1 rounded text-xs font-bold text-white cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingGrade(task.id);
                          setGradeInput(task.gradeReceived !== null ? String(task.gradeReceived) : "");
                        }}
                        className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 cursor-pointer"
                        title="Click to record grade"
                      >
                        <Award className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{task.gradeReceived !== null ? `${task.gradeReceived}%` : "Grade"}</span>
                      </button>
                    )}

                    {/* AI Deconstruct Button */}
                    <button
                      onClick={() => handleDeconstruct(task.id)}
                      disabled={loadingDeconstruct === task.id}
                      className="flex items-center space-x-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 transition cursor-pointer"
                      title="Break down into actionable milestones with AI"
                    >
                      <Sparkles className={`h-3 w-3 ${loadingDeconstruct === task.id ? "animate-spin" : ""}`} />
                      <span>{task.subtasks?.length ? `Steps (${task.subtasks.length})` : "AI Steps"}</span>
                    </button>

                    {task.subtasks && task.subtasks.length > 0 && (
                      <button
                        onClick={() => toggleExpand(task.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtasks Accordion */}
                {isExpanded && task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 pl-6 bg-slate-50/70 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      <span>AI Task Breakdown Milestones</span>
                      <span className="text-emerald-700 font-bold">
                        {task.subtasks.filter((s) => s.isCompleted).length} / {task.subtasks.length} Completed
                      </span>
                    </div>

                    {task.subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => onUpdateTask(task.id, { subtaskId: sub.id, toggleSubtask: true })}
                        className="flex items-center space-x-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-0.5"
                      >
                        {sub.isCompleted ? (
                          <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                        <span className={sub.isCompleted ? "line-through text-slate-400" : "font-medium"}>{sub.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
