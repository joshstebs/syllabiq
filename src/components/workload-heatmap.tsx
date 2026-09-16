"use client";

import React, { useState } from "react";
import { AlertTriangle, TrendingUp, Info, CheckCircle2 } from "lucide-react";
import { TaskItem } from "@/lib/types";
import { analyzeWorkloadCrunch, WeekLoad } from "@/lib/intelligence/crunch-detector";

interface Props {
  tasks: TaskItem[];
}

export function WorkloadHeatmap({ tasks }: Props) {
  const analysis = analyzeWorkloadCrunch(tasks);
  const [selectedWeek, setSelectedWeek] = useState<WeekLoad | null>(analysis.highestRiskWeek);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Workload Density Analyzer
            </span>
            {analysis.totalCrunchWeeks > 0 ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 flex items-center gap-1 border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> {analysis.totalCrunchWeeks} Crunch Weeks Detected
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Balanced Schedule
              </span>
            )}
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">Semester Workload Heatmap & Crunch Detector</h2>
          <p className="text-xs text-slate-500">Flags weeks where &gt;25% of your final grades are due so you can start preparing early.</p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-sm bg-slate-200" />
            <span className="text-slate-600">&lt;10%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-sm bg-blue-500" />
            <span className="text-slate-600">10-24%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-sm bg-amber-500 animate-pulse" />
            <span className="text-amber-700 font-bold">&ge;25% Crunch</span>
          </div>
        </div>
      </div>

      {/* Week Bars Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2 pt-2">
        {analysis.weeks.map((week) => {
          const isSelected = selectedWeek?.weekNumber === week.weekNumber;
          const heightPercent = Math.min(100, Math.max(15, week.totalWeightPercent * 2.5));

          return (
            <button
              key={week.weekNumber}
              onClick={() => setSelectedWeek(week)}
              className={`group flex flex-col items-center justify-end rounded-xl p-2 transition text-left cursor-pointer border ${
                isSelected
                  ? "border-blue-600 bg-blue-50/80 shadow-sm"
                  : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              {/* Bar */}
              <div className="w-full h-20 flex items-end justify-center rounded-lg overflow-hidden bg-slate-200/60 p-1">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded transition-all duration-300 ${
                    week.isCrunchWeek
                      ? "bg-gradient-to-t from-amber-500 to-amber-400"
                      : week.totalWeightPercent >= 10
                      ? "bg-gradient-to-t from-blue-600 to-indigo-500"
                      : "bg-slate-300"
                  }`}
                />
              </div>

              {/* Label */}
              <div className="mt-2 text-center w-full">
                <span className="block text-[11px] font-bold text-slate-800">W{week.weekNumber}</span>
                <span className={`block text-[10px] font-semibold ${week.isCrunchWeek ? "text-amber-700 font-bold" : "text-slate-500"}`}>
                  {week.totalWeightPercent}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail / Recommendation Box */}
      {selectedWeek && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">Week {selectedWeek.weekNumber} Breakdown</span>
              <span className="text-xs text-slate-500">
                ({new Date(selectedWeek.startDate).toLocaleDateString([], { month: "short", day: "numeric" })} -{" "}
                {new Date(selectedWeek.endDate).toLocaleDateString([], { month: "short", day: "numeric" })})
              </span>
              {selectedWeek.isCrunchWeek && (
                <span className="text-[10px] uppercase font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Critical Bottleneck
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600">
              Grade Weight Due: <strong className="text-blue-700 font-bold">{selectedWeek.totalWeightPercent}%</strong> • Estimated Study Time:{" "}
              <strong className="text-emerald-700 font-bold">{selectedWeek.totalEstHours} hours</strong> ({selectedWeek.tasks.length} tasks)
            </p>

            {selectedWeek.recommendation && (
              <p className="text-xs text-amber-800 font-medium flex items-center gap-1.5 pt-1">
                <Info className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                <span>{selectedWeek.recommendation}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {selectedWeek.tasks.map((t) => (
              <span
                key={t.id}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white text-slate-800 border border-slate-200 font-bold shadow-2xs"
                title={`${t.courseCode}: ${t.title} (${t.weightPercent}%)`}
              >
                {t.courseCode}: {t.weightPercent}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
