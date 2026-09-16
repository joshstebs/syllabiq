"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Sparkles, Loader2, ArrowRight, Wand2, CheckCircle2 } from "lucide-react";
import { ParsedSyllabus } from "@/lib/types";
import { SAMPLE_SYLLABI } from "@/lib/ai/sample-syllabi";
import { ReviewDrawer } from "./review-drawer";

interface Props {
  onCommitSuccess?: (courseCode: string) => void;
}

export function SyllabusDropzone({ onCommitSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState("");
  const [extractedData, setExtractedData] = useState<ParsedSyllabus | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const processTextOrSample = async (sampleId?: string, uploadedFile?: File) => {
    setIsProcessing(true);
    try {
      setCurrentStage("1/4: Analyzing document layout & reading tables...");
      await new Promise((r) => setTimeout(r, 650));

      setCurrentStage("2/4: Extracting course metadata, instructor, and grade weighting...");
      await new Promise((r) => setTimeout(r, 750));

      setCurrentStage("3/4: Parsing scheduled deadlines and normalizing timestamps...");
      let res;
      if (sampleId) {
        res = await fetch("/api/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sampleId })
        });
      } else if (uploadedFile) {
        const formData = new FormData();
        formData.append("syllabus", uploadedFile);
        res = await fetch("/api/ingest", {
          method: "POST",
          body: formData
        });
      } else {
        throw new Error("No syllabus content to process");
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Parsing failed");

      setCurrentStage("4/4: Populating Review & Approve drawer...");
      await new Promise((r) => setTimeout(r, 450));

      setExtractedData(json.data);
      setIsDrawerOpen(true);
    } catch (err: any) {
      console.error(err);
      alert(`Parsing failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const f = acceptedFiles[0];
    setFile(f);
    await processTextOrSample(undefined, f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "text/plain": [".txt"]
    },
    maxFiles: 1
  });

  return (
    <div className="w-full space-y-4">
      {/* Friendly Light Dropzone Card */}
      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer bg-white shadow-sm hover:shadow-md ${
          isDragActive
            ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
            : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/50"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 border border-blue-200 shadow-inner">
            {isProcessing ? (
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            ) : (
              <UploadCloud className="h-8 w-8 text-blue-600" />
            )}
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-500 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              {isDragActive ? "Drop your syllabus here!" : "Drag & Drop Your Syllabus (PDF, DOCX, or Photo)"}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our AI automatically extracts assignments, midterms, grading weights, and syncs them straight to your Google Calendar.
            </p>
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="w-full max-w-sm pt-2">
              <p className="text-xs font-bold text-blue-600 mb-2 animate-pulse">{currentStage}</p>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400"
                  initial={{ width: "15%" }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </div>
            </div>
          )}

          {file && !isProcessing && (
            <div className="inline-flex items-center space-x-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs text-slate-700 border border-slate-200">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{file.name}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          )}
        </div>
      </div>

      {/* Real Pre-loaded Syllabus Samples */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center space-x-1.5">
          <Wand2 className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-slate-600">Or test right now with sample syllabi:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_SYLLABI.map((sample) => (
            <button
              key={sample.id}
              disabled={isProcessing}
              onClick={() => processTextOrSample(sample.id)}
              className="flex items-center space-x-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 shadow-2xs transition disabled:opacity-50 cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>{sample.courseCode}: {sample.courseName.split(" ")[0]}</span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Review Drawer */}
      <AnimatePresence>
        {isDrawerOpen && extractedData && (
          <ReviewDrawer
            data={extractedData}
            onClose={() => setIsDrawerOpen(false)}
            onCommitSuccess={(code) => {
              setIsDrawerOpen(false);
              onCommitSuccess?.(code);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
