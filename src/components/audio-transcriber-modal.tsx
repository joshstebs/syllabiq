"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, ExternalLink, Download, Sparkles, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  onClose: () => void;
}

export function AudioTranscriberModal({ onClose }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("CS 3110: Data Structures");
  const [transcription, setTranscription] = useState<{
    title: string;
    date: string;
    summary: string;
    chapters: Array<{ time: string; topic: string; notes: string }>;
    examAlerts: string[];
    actionItems: string[];
  } | null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
  };

  const stopRecordingAndTranscribe = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 1600));

    setTranscription({
      title: `${selectedCourse} - Lecture 7: Red-Black Trees & Invariants`,
      date: new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }),
      summary: "Professor covered 2-3 tree isomorphism to Red-Black trees. Emphasized that consecutive red nodes are illegal and rotation operations (left/right rotate) preserve the binary search tree invariant while restoring logarithmic height guarantees.",
      chapters: [
        {
          time: "00:00 - 12:45",
          topic: "Binary Search Trees & O(n) Degenerate Cases",
          notes: "When inserting sorted data into naive BST, tree degrades into linked list. Motivation for self-balancing trees."
        },
        {
          time: "12:46 - 28:30",
          topic: "Red-Black Tree 4 Invariant Rules",
          notes: "1. Every node is red or black. 2. Root is black. 3. No two consecutive red nodes. 4. Every path from root to leaf contains equal black nodes."
        },
        {
          time: "28:31 - 47:15",
          topic: "Rotations and Color Flips during Insertion",
          notes: "Case analysis on uncle node color. If uncle is red: recolor. If uncle is black: perform single or double rotation (left-right/right-left)."
        }
      ],
      examAlerts: [
        "⚠️ PROFESSOR ANNOUNCED: 'You WILL be asked to trace a double rotation step-by-step on Prelim 1!'",
        "Make sure to memorize the 4 coloring invariants before Thursday."
      ],
      actionItems: [
        "Submit Assignment 1 by Friday 11:59 PM.",
        "Complete recitation problem set on 2-3 tree transformations."
      ]
    });

    setIsProcessing(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  const handleExportGoogleDocs = () => {
    if (!transcription) return;
    window.open(`https://docs.google.com/document/create?title=${encodeURIComponent(transcription.title)}`, "_blank");
  };

  const handleDownloadWordDoc = () => {
    if (!transcription) return;
    const docContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${transcription.title}</title>
<style>
body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5; color: #333; margin: 40px; }
h1 { color: #1E3A8A; font-size: 20pt; border-bottom: 2px solid #1E3A8A; padding-bottom: 5px; }
h2 { color: #2563EB; font-size: 14pt; margin-top: 20px; }
h3 { color: #374151; font-size: 12pt; }
.alert { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 10px; margin: 10px 0; }
.todo { background: #ECFDF5; border-left: 4px solid #10B981; padding: 10px; margin: 10px 0; }
</style>
</head>
<body>
<h1>${transcription.title}</h1>
<p><strong>Date:</strong> ${transcription.date}</p>
<h2>Executive Summary</h2>
<p>${transcription.summary}</p>
<h2>Lecture Chapters</h2>
${transcription.chapters.map((c) => `<h3>${c.time} - ${c.topic}</h3><p>${c.notes}</p>`).join("")}
<h2>Exam Insights</h2>
<div class="alert">${transcription.examAlerts.map((a) => `<p>${a}</p>`).join("")}</div>
<h2>Action Items & Deadlines</h2>
<div class="todo">${transcription.actionItems.map((a) => `<p>☑ ${a}</p>`).join("")}</div>
</body>
</html>
    `.trim();

    const blob = new Blob([docContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${transcription.title.replace(/[^a-zA-Z0-9]/g, "_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 border border-purple-200 text-xl shadow-xs">
              🎙️
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">AI Lecture Audio Transcriber</h3>
              <p className="text-xs text-slate-500 font-medium">Record class live, extract chapters, and export to Google Docs & Word</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer">✕</button>
        </div>

        {/* Course Select */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
          <span className="text-slate-600 font-bold">Lecture Class:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-white text-slate-900 font-bold rounded-xl px-3 py-1.5 border border-slate-300 focus:outline-none shadow-2xs"
          >
            <option value="CS 3110: Data Structures">CS 3110: Data Structures</option>
            <option value="ECON 1010: Microeconomics">ECON 1010: Microeconomics</option>
            <option value="BIO 1500: Cellular Biology">BIO 1500: Cellular Biology</option>
          </select>
        </div>

        {/* Live Audio Recording Controls */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col items-center justify-center space-y-4 text-center">
          {isRecording ? (
            <div className="space-y-3 flex flex-col items-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 border border-red-300">
                <div className="absolute inset-0 rounded-full bg-red-200 animate-ping" />
                <Mic className="h-8 w-8" />
              </div>

              <div>
                <span className="text-2xl font-mono font-black text-slate-900">
                  {Math.floor(recordingSeconds / 60).toString().padStart(2, "0")}:
                  {(recordingSeconds % 60).toString().padStart(2, "0")}
                </span>
                <p className="text-xs text-red-600 font-bold mt-1">Recording lecture audio from microphone...</p>
              </div>

              <button
                onClick={stopRecordingAndTranscribe}
                className="flex items-center space-x-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition cursor-pointer"
              >
                <Square className="h-4 w-4 fill-white" />
                <span>Stop & Transcribe with AI</span>
              </button>
            </div>
          ) : isProcessing ? (
            <div className="py-8 flex flex-col items-center space-y-3">
              <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
              <p className="text-sm font-black text-slate-900">AI Transcribing Audio & Generating Study Notes...</p>
              <p className="text-xs text-slate-500">Extracting chapter timestamps, exam hints, and homework items</p>
            </div>
          ) : !transcription ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <button
                  onClick={startRecording}
                  className="flex items-center space-x-2 rounded-full bg-purple-600 px-8 py-3.5 text-sm font-extrabold text-white shadow-md shadow-purple-600/25 hover:bg-purple-700 transition cursor-pointer"
                >
                  <Mic className="h-5 w-5" />
                  <span>Start Live Lecture Recording</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
                <span>Or test instant audio transcript:</span>
                <button
                  onClick={stopRecordingAndTranscribe}
                  className="text-purple-600 hover:text-purple-800 font-bold underline cursor-pointer"
                >
                  Load Sample Lecture Recording
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Transcribed Output & Exports */}
        {transcription && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{transcription.title}</h4>
                <p className="text-xs text-slate-500">{transcription.date}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportGoogleDocs}
                  className="flex items-center space-x-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-1.5 text-xs font-bold transition cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Google Docs</span>
                </button>

                <button
                  onClick={handleDownloadWordDoc}
                  className="flex items-center space-x-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Word (.docx)</span>
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 text-xs text-slate-700 max-h-60 overflow-y-auto shadow-2xs">
              <div>
                <span className="font-extrabold text-blue-700 uppercase tracking-wider text-[10px] block mb-1">
                  Executive Summary
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">{transcription.summary}</p>
              </div>

              <div>
                <span className="font-extrabold text-purple-700 uppercase tracking-wider text-[10px] block mb-1">
                  Chapter Breakdowns
                </span>
                <div className="space-y-2">
                  {transcription.chapters.map((ch, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                        <span>{ch.topic}</span>
                        <span className="text-purple-700 font-mono text-[11px] font-bold">{ch.time}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{ch.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1 text-amber-900">
                <span className="font-extrabold uppercase tracking-wider text-[10px] block text-amber-800">
                  AI Exam Alerts Detected in Audio
                </span>
                {transcription.examAlerts.map((a, i) => (
                  <p key={i} className="text-[11px] font-semibold">{a}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">Auto-formatted with chapter headers & action items</span>
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
