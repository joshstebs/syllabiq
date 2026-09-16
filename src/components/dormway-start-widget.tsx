"use client";

import React, { useState } from "react";
import {
  FileText,
  Calendar,
  Mail,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Upload,
  Globe,
  Zap,
  Clock
} from "lucide-react";
import confetti from "canvas-confetti";

type SourceType = "SYLLABUS" | "CANVAS" | "EMAIL" | "BLACKBOARD";

interface Props {
  onOpenUpload: () => void;
  onOpenCanvas: () => void;
}

export function DormwayStartWidget({ onOpenUpload, onOpenCanvas }: Props) {
  const [selectedSource, setSelectedSource] = useState<SourceType>("SYLLABUS");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("syllabus@syllabiq.app");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-w-0">
      <div className="rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-sm p-3.5 sm:p-6 shadow-sm hover:shadow-md transition w-full max-w-full min-w-0 overflow-hidden">
        {/* Top bar: Title & Source selector buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="h-3 w-3" />
              Choose How You Start
            </div>
            <h3 className="font-display text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              See your syllabus become a week you can use
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Pick an intake source below to see live extraction and instant schedule synthesis.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Intake sources">
            <button
              type="button"
              onClick={() => setSelectedSource("SYLLABUS")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                selectedSource === "SYLLABUS"
                  ? "border border-blue-500/40 bg-blue-50/80 text-blue-700 shadow-2xs"
                  : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>Syllabus</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSource("CANVAS")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                selectedSource === "CANVAS"
                  ? "border border-rose-500/40 bg-rose-50/80 text-rose-700 shadow-2xs"
                  : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-rose-600" />
              <span>Canvas</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSource("EMAIL")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                selectedSource === "EMAIL"
                  ? "border border-amber-500/40 bg-amber-50/80 text-amber-700 shadow-2xs"
                  : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <Mail className="h-3.5 w-3.5 text-amber-600" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSource("BLACKBOARD")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                selectedSource === "BLACKBOARD"
                  ? "border border-purple-500/40 bg-purple-50/80 text-purple-700 shadow-2xs"
                  : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-purple-600" />
              <span>Blackboard / iCal</span>
            </button>
          </div>
        </div>

        {/* Live Transformation Grid: Source Card -> Arrow -> Target Organized Week */}
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.3fr)] lg:items-center">
          {/* LEFT: SOURCE CARD */}
          <div className="rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50/60 to-white p-4 sm:p-5 shadow-xs">
            {selectedSource === "SYLLABUS" && (
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-700 border border-blue-200">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">ECON 301 Syllabus.pdf</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Processed in 48s
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">
                      12 deadlines, 4 policy rules, & 4-category grade weights extracted
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200/70">
                    <span className="font-semibold text-slate-700">Midterm Exam (25%)</span>
                    <span className="font-bold text-blue-600">Oct 12 · In-class</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200/70">
                    <span className="font-semibold text-slate-700">Final Term Paper (30%)</span>
                    <span className="font-bold text-rose-600">Dec 18 · 11:59 PM</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  “Drop your PDF or phone scan. SyllabiQ instantly normalizes dates into your master schedule.”
                </p>
              </div>
            )}

            {selectedSource === "CANVAS" && (
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100/70 text-rose-700 border border-rose-200">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">Direct Canvas LMS API</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Read-Only OAuth
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">
                      5 enrolled courses detected · 28 live assignments synced
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200/70">
                    <span className="font-semibold text-slate-700">MATH 201: Homework 7</span>
                    <span className="font-bold text-rose-600">Tonight · 11:59 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200/70">
                    <span className="font-semibold text-slate-700">Canvas Grade Sync</span>
                    <span className="font-bold text-emerald-600">Running GPA 3.86</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  “No campus IT approval needed. Generates your secure student token in under 30 seconds.”
                </p>
              </div>
            )}

            {selectedSource === "EMAIL" && (
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-amber-700 border border-amber-200">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">Email Forwarding Bridge</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Zero Friction
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">
                      Send to your unique address or syllabus@syllabiq.app
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-mono font-bold text-amber-950">
                      syllabus@syllabiq.app
                    </code>
                    <button
                      onClick={handleCopyEmail}
                      className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                    >
                      {copiedEmail ? "Copied! ✓" : "Copy Address"}
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Forward syllabus attachments or professor announcement emails directly from your phone.
                  </p>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  “Processed in background; your Google Calendar populates with zero clicks.”
                </p>
              </div>
            )}

            {selectedSource === "BLACKBOARD" && (
              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100/70 text-purple-700 border border-purple-200">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">Blackboard / Moodle Feed</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        iCal + REST
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">
                      Universal sync across Brightspace, Moodle, and Canvas
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200/70">
                    <span className="font-semibold text-slate-700">Fuzzy Deduplication</span>
                    <span className="font-bold text-purple-600">Levenshtein &gt; 0.85</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200/70">
                    <span className="font-semibold text-slate-700">Merged Deadlines</span>
                    <span className="font-bold text-emerald-600">0 Duplicates</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  “Never have duplicate entries even if a professor posts to both the syllabus and the LMS.”
                </p>
              </div>
            )}
          </div>

          {/* MIDDLE: TRANSFORMATION ARROW */}
          <div className="hidden lg:flex flex-col items-center justify-center px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-blue-600 shadow-2xs">
              <ArrowRight className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
              AI Sync
            </span>
          </div>

          {/* RIGHT: TARGET ORGANIZED WEEK IN SYLLABIQ */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">Your Week in SyllabiQ</p>
                <p className="text-xs text-slate-500 font-medium">Organized, prioritized & calendar-ready</p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Live Ready
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2.5 hover:bg-slate-50 transition">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black text-slate-900">ECON 301</p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-bold">
                      Exam
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-600 font-medium">Midterm review session</p>
                </div>
                <span className="text-xs font-bold text-slate-700 shrink-0 text-right">Tonight · 7:00 PM</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2.5 hover:bg-slate-50 transition min-w-0">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black text-slate-900">ENG 102</p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                      Paper
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-600 font-medium">Comparative essay first draft</p>
                </div>
                <span className="text-xs font-bold text-slate-700 shrink-0 text-right">Tomorrow · 5:00 PM</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2.5 hover:bg-slate-50 transition min-w-0">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black text-slate-900">BIO 210</p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold">
                      Lab
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-600 font-medium">Cellular respiration report</p>
                </div>
                <span className="text-xs font-bold text-slate-700 shrink-0 text-right">Fri · 11:59 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 min-w-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="break-words">Try it free today · 100% academic integrity safe · 30-day free trial</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedSource === "SYLLABUS" && (
              <button
                type="button"
                onClick={onOpenUpload}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload a Syllabus</span>
              </button>
            )}

            {selectedSource === "CANVAS" && (
              <button
                type="button"
                onClick={onOpenCanvas}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-rose-700 transition cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Connect Canvas API</span>
              </button>
            )}

            {selectedSource === "EMAIL" && (
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-amber-700 transition cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{copiedEmail ? "Address Copied! ✓" : "Copy Forward Address"}</span>
              </button>
            )}

            {selectedSource === "BLACKBOARD" && (
              <button
                type="button"
                onClick={onOpenCanvas}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-purple-700 transition cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Connect LMS Feed</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
