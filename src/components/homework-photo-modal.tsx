"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  ListOrdered,
  Zap,
  Lock
} from "lucide-react";
import confetti from "canvas-confetti";
import { Course, SubscriptionState, HomeworkUpload } from "@/lib/types";

interface Props {
  courses: Course[];
  onClose: () => void;
  onOpenPaywall: () => void;
  onHomeworkAdded: () => Promise<void>;
}

export function HomeworkPhotoModal({
  courses,
  onClose,
  onOpenPaywall,
  onHomeworkAdded
}: Props) {
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id || "course-cs3110"
  );
  const [title, setTitle] = useState("Problem Set 2 Handout");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [recentUploads, setRecentUploads] = useState<HomeworkUpload[]>([]);

  const fetchUploadsAndSub = async () => {
    try {
      const res = await fetch("/api/homework/upload");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription);
        setRecentUploads(data.uploads || []);
        if (
          data.subscription.tier === "FREE" &&
          data.subscription.homeworkUploadsCount >= data.subscription.homeworkUploadsLimit
        ) {
          setQuotaExceeded(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUploadsAndSub();
  }, []);

  const handleProcessPhoto = async (samplePreset?: {
    courseId: string;
    courseCode: string;
    title: string;
    problems: any[];
  }) => {
    setIsScanning(true);
    setExtractedData(null);

    // Simulate scanning stages
    setScanStep("Enhancing image contrast & optical perspective...");
    await new Promise((r) => setTimeout(r, 600));

    setScanStep("Running Vision LLM OCR on handwriting & math formulas...");
    await new Promise((r) => setTimeout(r, 700));

    setScanStep("Structuring problem numbers, prompts & subtasks...");
    await new Promise((r) => setTimeout(r, 600));

    try {
      const course = courses.find((c) => c.id === (samplePreset?.courseId || selectedCourseId));

      const payload = samplePreset
        ? {
            courseId: samplePreset.courseId,
            courseCode: samplePreset.courseCode,
            title: samplePreset.title,
            extractedProblems: samplePreset.problems
          }
        : {
            courseId: selectedCourseId,
            courseCode: course?.code || "CS 3110",
            title,
            extractedProblems: [
              {
                problemNumber: "Problem 1",
                prompt: "Derive Euler-Lagrange optimization for utility under income constraints",
                subtasks: ["Set up Hamiltonian equations", "Evaluate first-order conditions", "Interpret Lagrange multiplier"]
              },
              {
                problemNumber: "Problem 2",
                prompt: "Calculate consumer surplus change under a $0.50 price subsidy",
                subtasks: ["Plot Marshallian demand curve", "Integrate price differential", "Identify deadweight loss"]
              }
            ]
          };

      const res = await fetch("/api/homework/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "QUOTA_EXCEEDED") {
          setQuotaExceeded(true);
        } else {
          alert(data.message || "Failed to process upload");
        }
        return;
      }

      setExtractedData(data.upload);
      setSubscription(data.subscription);
      confetti({ particleCount: 60, spread: 60 });
      await onHomeworkAdded();
    } finally {
      setIsScanning(false);
      setScanStep("");
    }
  };

  const isPro = subscription?.tier === "PRO";
  const usedCount = subscription?.homeworkUploadsCount || 0;
  const limitCount = subscription?.homeworkUploadsLimit || 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Camera className="h-3.5 w-3.5 text-indigo-600" />
              <span>Homework Photo Scanner (OCR)</span>
            </div>

            {/* Quota Badge */}
            <div className="flex items-center gap-2">
              {isPro ? (
                <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  Unlimited Pro Scans Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <span>
                    <strong>{usedCount}</strong> of {limitCount} Free Scans Used
                  </span>
                  {usedCount >= limitCount && (
                    <span className="text-rose-600 font-black ml-1">Limit Reached</span>
                  )}
                </span>
              )}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Snap a Photo of Your Homework Handout
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            AI extracts problem numbers, prompts, instructions, and adds actionable study steps directly to your schedule.
          </p>
        </div>

        {/* Quota Warning Banner if Free limit hit */}
        {quotaExceeded && !isPro && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-amber-900">
                  Monthly Free Limit Reached (3/3 Uploads)
                </h4>
                <p className="text-xs text-amber-800 font-medium">
                  Upgrade to SyllabiQ Pro for <strong>Unlimited</strong> homework photo uploads, SMS phone alerts, and custom colors!
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPaywall}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 shadow-sm transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Zap className="h-3.5 w-3.5 fill-white" />
              <span>Unlock Unlimited Pro ($0 First Month)</span>
            </button>
          </div>
        )}

        {/* Dropzone & Capture Area */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/70 p-6 sm:p-8 text-center space-y-4 transition">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-blue-600">
            <Upload className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">
              Drag and drop your worksheet photo, or browse file
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Supports JPEG, PNG, HEIC, and phone screenshots
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              aria-label="Select course"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleProcessPhoto()}
              disabled={isScanning || (quotaExceeded && !isPro)}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>{isScanning ? "Scanning with Vision OCR..." : "Process Photo Upload"}</span>
            </button>
          </div>

          {isScanning && (
            <div className="pt-3 space-y-2 max-w-sm mx-auto animate-fade-in">
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-xs font-bold text-blue-700">{scanStep}</p>
            </div>
          )}
        </div>

        {/* 1-Click Sample Homework Scans for Instant Testing */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Or try with sample worksheets:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() =>
                handleProcessPhoto({
                  courseId: "course-cs3110",
                  courseCode: "CS 3110",
                  title: "CS 3110 PSet 2: OCaml Higher-Order Trees",
                  problems: [
                    {
                      problemNumber: "Problem 1",
                      prompt: "Implement balanced binary search tree folding function",
                      subtasks: ["Define fold_tree recursive case", "Check leaf boundary", "Ensure tail recursion"]
                    },
                    {
                      problemNumber: "Problem 2",
                      prompt: "Verify Red-Black tree insertion height invariant <= 2*log(n+1)",
                      subtasks: ["Write invariant checker", "Profile memory usage"]
                    }
                  ]
                })
              }
              disabled={isScanning || (quotaExceeded && !isPro)}
              className="text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-blue-300 hover:bg-blue-50/40 transition cursor-pointer shadow-2xs disabled:opacity-50 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-700">CS 3110 PSet 2</span>
                <span className="text-[10px] text-slate-400 font-bold">2 Problems</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                OCaml trees, tail-recursion, and red-black tree height proof.
              </p>
            </button>

            <button
              onClick={() =>
                handleProcessPhoto({
                  courseId: "course-econ1010",
                  courseCode: "ECON 1010",
                  title: "ECON 1010 Problem Set 3: Utility & Lagrangians",
                  problems: [
                    {
                      problemNumber: "Question 1",
                      prompt: "Calculate consumer utility maximization under budget constraint M = PxX + PyY",
                      subtasks: ["Find marginal rate of substitution", "Equate MRS to price ratio", "Solve for optimal bundle"]
                    },
                    {
                      problemNumber: "Question 2",
                      prompt: "Graph indifference curve shifts under income shock",
                      subtasks: ["Plot budget line", "Compute income elasticity"]
                    }
                  ]
                })
              }
              disabled={isScanning || (quotaExceeded && !isPro)}
              className="text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer shadow-2xs disabled:opacity-50 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700">ECON 1010 PSet 3</span>
                <span className="text-[10px] text-slate-400 font-bold">2 Problems</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                Utility maximization, Lagrange multipliers, and elasticity graphs.
              </p>
            </button>

            <button
              onClick={() =>
                handleProcessPhoto({
                  courseId: "course-bio1500",
                  courseCode: "BIO 1500",
                  title: "BIO 1500 Lab 4 Handout: Gel Electrophoresis",
                  problems: [
                    {
                      problemNumber: "Part A",
                      prompt: "Measure DNA band migration distances from agarose gel image",
                      subtasks: ["Measure migration in mm", "Plot semi-log standard curve", "Interpolate unknown fragment sizes"]
                    },
                    {
                      problemNumber: "Part B",
                      prompt: "Analyze restriction enzyme digestion fragments",
                      subtasks: ["Confirm EcoRI cut sites", "Write discussion conclusion"]
                    }
                  ]
                })
              }
              disabled={isScanning || (quotaExceeded && !isPro)}
              className="text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-amber-300 hover:bg-amber-50/40 transition cursor-pointer shadow-2xs disabled:opacity-50 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-700">BIO 1500 Lab 4</span>
                <span className="text-[10px] text-slate-400 font-bold">2 Parts</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                Agarose gel band measurements, standard curve plotting, and digestion analysis.
              </p>
            </button>
          </div>
        </div>

        {/* Extracted Breakdown Preview */}
        {extractedData && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h4 className="text-sm font-black text-emerald-950">
                  {extractedData.title} Added to Your Schedule!
                </h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {extractedData.courseCode}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {extractedData.extractedProblems?.map((prob: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs font-black text-slate-900">
                    <span>{prob.problemNumber}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      {prob.subtasks?.length} study steps generated
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{prob.prompt}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prob.subtasks?.map((st: string, stIdx: number) => (
                      <span
                        key={stIdx}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        ✓ {st}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
