"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Palette,
  Sparkles,
  Check,
  RefreshCw,
  Sliders,
  Smile,
  Eye
} from "lucide-react";
import confetti from "canvas-confetti";
import { Course, CustomColorPalette, TaskType } from "@/lib/types";

interface Props {
  courses: Course[];
  onClose: () => void;
  onColorsUpdated: () => Promise<void>;
}

const PRESET_PALETTES = [
  {
    name: "Coursicle Pastels",
    colors: ["#F472B6", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA", "#F87171"]
  },
  {
    name: "Neon Campus",
    colors: ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"]
  },
  {
    name: "Warm Academic",
    colors: ["#B45309", "#047857", "#1D4ED8", "#6D28D9", "#BE123C", "#374151"]
  },
  {
    name: "Nordic Minimal",
    colors: ["#475569", "#0284C7", "#059669", "#7C3AED", "#D97706", "#DC2626"]
  }
];

const POPULAR_EMOJIS = [
  "💻", "📈", "🧬", "🧠", "⚖️", "🎨", "🔬", "📚", "📐", "🌎", "🏛️", "⚙️", "🧪", "🎵", "🏥", "🚀", "💡", "📝", "🎯", "⚡"
];

const TASK_TYPE_EMOJI_OPTIONS: Record<TaskType, string[]> = {
  assignment: ["📝", "📄", "✏️", "📋"],
  quiz: ["⚡", "❓", "⏱️", "🧩"],
  exam: ["🎯", "🔥", "⚠️", "🚨"],
  reading: ["📚", "📖", "📰", "🔖"],
  project: ["🚀", "💻", "💡", "🛠️"],
  milestone: ["🏁", "🚩", "⭐", "🏆"],
  other: ["📌", "🔔", "📎", "🏷️"]
};

export function ColorCustomizerModal({ courses, onClose, onColorsUpdated }: Props) {
  const [palette, setPalette] = useState<CustomColorPalette>({
    courseColors: {},
    courseEmojis: {},
    taskTypeColors: {
      assignment: "#3B82F6",
      quiz: "#8B5CF6",
      exam: "#EF4444",
      reading: "#F59E0B",
      project: "#10B981",
      milestone: "#6366F1",
      other: "#64748B"
    },
    taskTypeEmojis: {
      assignment: "📝",
      quiz: "⚡",
      exam: "🎯",
      reading: "📚",
      project: "🚀",
      milestone: "🏁",
      other: "📌"
    },
    activePreset: "Coursicle Pastels"
  });

  const [activeTab, setActiveTab] = useState<"COURSES" | "TASK_TYPES">("COURSES");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/colors")
      .then((r) => r.json())
      .then((data) => {
        if (data.customColors) {
          setPalette(data.customColors);
        } else {
          // Initialize from current courses
          const cColors: Record<string, string> = {};
          const cEmojis: Record<string, string> = {};
          courses.forEach((c) => {
            cColors[c.id] = c.colorHex || "#6366F1";
            cEmojis[c.id] = c.emoji || "📚";
          });
          setPalette((prev) => ({
            ...prev,
            courseColors: cColors,
            courseEmojis: cEmojis
          }));
        }
      })
      .catch((e) => console.error(e));
  }, [courses]);

  const handleCourseColorChange = (courseId: string, color: string) => {
    setPalette((prev) => ({
      ...prev,
      courseColors: {
        ...prev.courseColors,
        [courseId]: color
      }
    }));
  };

  const handleCourseEmojiChange = (courseId: string, emoji: string) => {
    setPalette((prev) => ({
      ...prev,
      courseEmojis: {
        ...prev.courseEmojis,
        [courseId]: emoji
      }
    }));
  };

  const handleTaskTypeColorChange = (type: TaskType, color: string) => {
    setPalette((prev) => ({
      ...prev,
      taskTypeColors: {
        ...prev.taskTypeColors,
        [type]: color
      }
    }));
  };

  const handleTaskTypeEmojiChange = (type: TaskType, emoji: string) => {
    setPalette((prev) => ({
      ...prev,
      taskTypeEmojis: {
        ...prev.taskTypeEmojis,
        [type]: emoji
      }
    }));
  };

  const handleApplyPreset = (presetName: string, colors: string[]) => {
    const newCourseColors: Record<string, string> = {};
    courses.forEach((c, idx) => {
      newCourseColors[c.id] = colors[idx % colors.length];
    });

    setPalette((prev) => ({
      ...prev,
      activePreset: presetName,
      courseColors: newCourseColors
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(palette)
      });
      if (res.ok) {
        confetti({ particleCount: 50, spread: 60 });
        await onColorsUpdated();
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const previewCourse = courses[0];
  const previewColor = previewCourse
    ? palette.courseColors[previewCourse.id] || previewCourse.colorHex
    : "#6366F1";
  const previewEmoji = previewCourse
    ? palette.courseEmojis?.[previewCourse.id] || previewCourse.emoji || "💻"
    : "💻";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider">
            <Palette className="h-3.5 w-3.5 text-purple-600" />
            <span>Course &amp; Task Color &amp; Emoji Studio</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customize Colors &amp; Class Emojis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Personalize your schedule timetable, timeline milestones, and phone notification cards with custom colors and emojis.
          </p>
        </div>

        {/* Live Preview Bar */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              <span>Live Schedule Preview</span>
            </span>
            <span className="text-[11px] text-slate-400">Updates across all views</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Timetable Card Preview */}
            <div
              className="rounded-xl p-3 border text-white font-sans shadow-xs min-w-[200px]"
              style={{
                backgroundColor: previewColor,
                borderColor: previewColor
              }}
            >
              <div className="flex items-center gap-2 font-black text-xs">
                <span>{previewEmoji}</span>
                <span>{previewCourse ? previewCourse.code : "CS 3110"}</span>
              </div>
              <div className="text-[11px] opacity-90 truncate">
                {previewCourse ? previewCourse.name : "Functional Programming"}
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">8:30 AM - 9:45 AM</div>
            </div>

            {/* Task Type Badges Preview */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(Object.keys(palette.taskTypeColors) as TaskType[]).slice(0, 4).map((type) => (
                <span
                  key={type}
                  className="text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-2xs flex items-center gap-1"
                  style={{ backgroundColor: palette.taskTypeColors[type] }}
                >
                  <span>{palette.taskTypeEmojis?.[type] || "📌"}</span>
                  <span className="capitalize">{type}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-700 block uppercase tracking-wider">
            Quick Palette Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_PALETTES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset.name, preset.colors)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  palette.activePreset === preset.name
                    ? "border-blue-600 bg-blue-50/70 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-extrabold text-slate-800 truncate mb-1.5">
                  {preset.name}
                </div>
                <div className="flex items-center gap-1">
                  {preset.colors.slice(0, 5).map((color, i) => (
                    <span
                      key={i}
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Switcher: Course Swatches vs Task Types */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("COURSES")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "COURSES"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 bg-slate-100"
            }`}
          >
            Course Colors &amp; Emojis ({courses.length})
          </button>

          <button
            onClick={() => setActiveTab("TASK_TYPES")}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "TASK_TYPES"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 bg-slate-100"
            }`}
          >
            Assignment Type Badges
          </button>
        </div>

        {/* TAB 1: COURSES */}
        {activeTab === "COURSES" && (
          <div className="space-y-4">
            {courses.map((c) => {
              const currentColor = palette.courseColors[c.id] || c.colorHex;
              const currentEmoji = palette.courseEmojis?.[c.id] || c.emoji || "📚";

              return (
                <div
                  key={c.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-slate-100 rounded-xl">
                        {currentEmoji}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          {c.code}: {c.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {c.term} · {c.instructor?.name}
                        </p>
                      </div>
                    </div>

                    {/* Color Input & Swatch */}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentColor}
                        onChange={(e) => handleCourseColorChange(c.id, e.target.value)}
                        className="h-8 w-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input
                        type="text"
                        value={currentColor}
                        onChange={(e) => handleCourseColorChange(c.id, e.target.value)}
                        className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs font-mono font-bold text-slate-700 uppercase"
                      />
                    </div>
                  </div>

                  {/* Emoji Quick Selector for this Course */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Choose Course Emoji
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {POPULAR_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleCourseEmojiChange(c.id, emoji)}
                          className={`h-7 w-7 rounded-lg text-sm flex items-center justify-center transition cursor-pointer ${
                            currentEmoji === emoji
                              ? "bg-blue-100 border border-blue-300 shadow-2xs scale-110"
                              : "hover:bg-slate-100"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: TASK TYPES */}
        {activeTab === "TASK_TYPES" && (
          <div className="space-y-3">
            {(Object.keys(palette.taskTypeColors) as TaskType[]).map((type) => {
              const currentColor = palette.taskTypeColors[type];
              const currentEmoji = palette.taskTypeEmojis?.[type] || "📌";
              const emojiChoices = TASK_TYPE_EMOJI_OPTIONS[type] || ["📌", "⭐"];

              return (
                <div
                  key={type}
                  className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{currentEmoji}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 capitalize">
                        {type}
                      </h4>
                      <div className="flex items-center gap-1 pt-0.5">
                        {emojiChoices.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleTaskTypeEmojiChange(type, emoji)}
                            className={`h-6 w-6 rounded text-xs flex items-center justify-center transition cursor-pointer ${
                              currentEmoji === emoji
                                ? "bg-purple-100 border border-purple-300"
                                : "hover:bg-slate-100"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => handleTaskTypeColorChange(type, e.target.value)}
                      className="h-8 w-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={currentColor}
                      onChange={(e) => handleTaskTypeColorChange(type, e.target.value)}
                      className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs font-mono font-bold text-slate-700 uppercase"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-6 py-2.5 shadow-md shadow-purple-500/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check className="h-4 w-4" />
            <span>{isSaving ? "Saving Palette..." : "Apply Palette & Emojis"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
