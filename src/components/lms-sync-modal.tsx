"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Link as LinkIcon, ShieldCheck, ArrowLeft, Upload } from "lucide-react";
import { LMSProvider } from "@/lib/types";

interface Props {
  onClose: () => void;
  onSyncComplete: () => void;
}

const PROVIDERS: { id: LMSProvider; name: string; emoji: string; generic?: boolean }[] = [
  { id: "CANVAS", name: "Canvas", emoji: "🔴" },
  { id: "BLACKBOARD", name: "Blackboard", emoji: "🟡" },
  { id: "BRIGHTSPACE", name: "Brightspace", emoji: "🟠" },
  { id: "MOODLE", name: "Moodle", emoji: "🟧" },
  { id: "ICAL_FEED", name: "Other .ics feed", emoji: "📅", generic: true }
];

const FEED_INSTRUCTIONS: Record<LMSProvider, string> = {
  CANVAS: "In Canvas, open Calendar, then click Calendar Feed in the sidebar and copy the feed URL.",
  BLACKBOARD: "In Blackboard, open Calendar and look for a share or export option that gives you an iCal link. If your school only offers a file download, save the .ics file and upload it below.",
  BRIGHTSPACE: "In Brightspace, open Calendar, go to Settings, turn on Enable Calendar Feeds, then copy the feed URL for your calendars.",
  MOODLE: "In Moodle, open the calendar, choose Export calendar, and copy the generated URL.",
  ICAL_FEED: "Paste any iCalendar (.ics) feed URL from your school or planner, or upload an .ics file."
};

export function LMSSyncModal({ onClose, onSyncComplete }: Props) {
  const [provider, setProvider] = useState<LMSProvider | null>(null);
  const [feedUrl, setFeedUrl] = useState("");
  const [rawIcs, setRawIcs] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState<any | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    setRawIcs(text);
    setFileName(file.name);
    setFeedUrl("");
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/lms/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, feedUrl: feedUrl.trim() || undefined, rawIcs: rawIcs || undefined })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");

      setSyncReport(data);
      onSyncComplete();
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const selected = PROVIDERS.find((p) => p.id === provider);

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
        className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 border border-blue-200 text-xl shadow-xs">
              🎓
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Import From Your LMS</h3>
              <p className="text-xs text-slate-500 font-medium">Bring in dated assignments, quizzes, and exams</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer">✕</button>
        </div>

        {/* Honest capability note */}
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-2">
          <p className="text-xs font-bold text-blue-900">How this works</p>
          <p className="text-xs text-blue-800 leading-relaxed">
            Direct API sync with Canvas, Blackboard, Brightspace, and Moodle is not available. Import works
            through each school&apos;s calendar feed, which brings in your dated coursework. Re-importing the same
            feed never creates duplicates.
          </p>
        </div>

        {!provider ? (
          /* Step 1: pick your LMS */
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Where is your coursework?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setProvider(p.id); setSyncReport(null); }}
                  className="rounded-2xl p-3 text-left border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 transition text-xs font-bold cursor-pointer flex items-center space-x-2"
                >
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Step 2: instructions + feed input */
          <div className="space-y-4">
            <button
              onClick={() => { setProvider(null); setSyncReport(null); }}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Choose a different source
            </button>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>{selected?.name} calendar feed</span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> Saved to your account
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">{FEED_INSTRUCTIONS[provider]}</p>

              <div className="flex items-center space-x-2 bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 focus-within:border-blue-500 shadow-2xs">
                <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  value={feedUrl}
                  onChange={(e) => { setFeedUrl(e.target.value); if (e.target.value) { setRawIcs(""); setFileName(""); } }}
                  placeholder="https://your-school.edu/feeds/calendar.ics"
                  className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">or upload a file</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3.5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                <Upload className="h-4 w-4 text-slate-400" />
                {fileName ? fileName : "Choose an .ics file"}
                <input
                  type="file"
                  accept=".ics,text/calendar"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
        )}

        {/* Sync Report */}
        {syncReport && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-extrabold text-blue-800">
              <span>Import Complete</span>
              <span>{syncReport.totalFound} Processed</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] font-bold">New Tasks Added:</span>
                <span className="text-base font-extrabold text-slate-900">{syncReport.syncedNew}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] font-bold">Duplicates Prevented:</span>
                <span className="text-base font-extrabold text-emerald-600">{syncReport.deduplicated}</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 max-h-24 overflow-y-auto space-y-1 pt-1 font-medium">
              {syncReport.details?.map((d: string, i: number) => (
                <div key={i}>• {d}</div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button onClick={onClose} className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
            Close
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing || !provider || (!feedUrl.trim() && !rawIcs)}
            className="flex items-center space-x-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Importing..." : "Import Calendar"}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
