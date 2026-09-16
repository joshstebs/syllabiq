"use client";

import React, { useEffect } from "react";
import { X, Calendar, Layers } from "lucide-react";
import { SemesterTimelineView } from "./semester-timeline-view";
import { Course, TaskItem } from "@/lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  courses: Course[];
  onUpdateTask: (taskId: string, patch: any) => Promise<void>;
  onDeconstructTask: (taskId: string) => Promise<void>;
  onOpenGradeModal: () => void;
  onViewOnPage?: () => void;
}

export function SemesterTimelineModal({
  isOpen,
  onClose,
  tasks,
  courses,
  onUpdateTask,
  onDeconstructTask,
  onOpenGradeModal,
  onViewOnPage
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Semester Timeline (DormWay Engine)
                </h3>
                <span className="rounded-full bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Automated Schedule
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Chronological academic milestones, due dates, weight distributions, and exams.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onViewOnPage && (
              <button
                onClick={() => {
                  onClose();
                  onViewOnPage();
                }}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>View on Dashboard</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          <SemesterTimelineView
            tasks={tasks}
            courses={courses}
            onUpdateTask={onUpdateTask}
            onDeconstructTask={onDeconstructTask}
            onOpenGradeModal={onOpenGradeModal}
          />
        </div>
      </div>
    </div>
  );
}
