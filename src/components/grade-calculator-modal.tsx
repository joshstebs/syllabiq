"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Target } from "lucide-react";
import { Course, TaskItem } from "@/lib/types";
import { calculateCourseGrade, simulateTargetExamScore } from "@/lib/intelligence/grade-calculator";

interface Props {
  courses: Course[];
  tasks: TaskItem[];
  onClose: () => void;
}

export function GradeCalculatorModal({ courses, tasks, onClose }: Props) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [targetGrade, setTargetGrade] = useState<number>(93); // A
  const [examWeight, setExamWeight] = useState<number>(20);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const gradeSummary = currentCourse ? calculateCourseGrade(currentCourse, tasks) : null;

  const simulation =
    gradeSummary && gradeSummary.currentGradePercentage !== null
      ? simulateTargetExamScore(
          gradeSummary.currentGradePercentage,
          gradeSummary.completedWeight || 40,
          targetGrade,
          examWeight
        )
      : null;

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
        className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 text-xl shadow-xs">
              🎯
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Dynamic Syllabus Grade Calculator</h3>
              <p className="text-xs text-slate-500 font-medium">Syllabus weight projections and final exam what-if calculator</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer">✕</button>
        </div>

        {/* Course Select */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition border cursor-pointer ${
                selectedCourseId === c.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {c.code}: {c.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {gradeSummary && (
          <div className="space-y-5">
            {/* Grade Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Current Standing</span>
                <h4 className="text-xl font-black text-slate-900">{gradeSummary.courseCode} - {gradeSummary.courseName}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {gradeSummary.completedWeight}% of semester grade recorded ({gradeSummary.remainingWeight}% remaining)
                </p>
              </div>

              <div className="flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-bold">Running Score</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {gradeSummary.currentGradePercentage !== null ? `${gradeSummary.currentGradePercentage}%` : "No scores"}
                  </span>
                </div>
                <div className="h-11 w-11 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center border border-emerald-200">
                  {gradeSummary.letterGrade}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">Grade Category Weights</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gradeSummary.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs shadow-2xs">
                    <div className="flex justify-between items-center text-slate-800">
                      <span className="font-bold">{cat.category}</span>
                      <span className="text-blue-700 font-extrabold">{cat.weightPercentage}%</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 text-[11px]">
                      <span>Average score:</span>
                      <span className="text-slate-900 font-semibold">
                        {cat.pointsEarned !== null ? `${cat.pointsEarned}%` : "In Progress"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What-If Simulator */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 text-xs font-extrabold">
                <Target className="h-4 w-4 text-amber-600" />
                <span>What-If Final Exam Projection</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Target Desired Grade (%):</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 90)}
                    className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 font-bold border border-slate-300 focus:outline-none shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-bold block mb-1">Final Exam Weight (%):</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={examWeight}
                    onChange={(e) => setExamWeight(parseFloat(e.target.value) || 20)}
                    className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 font-bold border border-slate-300 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>

              {simulation && (
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between text-xs shadow-2xs">
                  <span className="text-slate-700 font-medium">
                    To secure a <strong>{targetGrade}%</strong> overall, you need at least:
                  </span>
                  <span className={`text-base font-black px-3 py-1 rounded-full ${
                    simulation.requiredScore <= 85 ? "bg-emerald-100 text-emerald-800" :
                    simulation.requiredScore <= 95 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                  }`}>
                    {simulation.requiredScore}% on Final
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
