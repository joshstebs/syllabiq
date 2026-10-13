"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Download, Shield } from "lucide-react";

interface Props {
  onClose: () => void;
}

export function ShareScheduleModal({ onClose }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function downloadCalendar() {
    setDownloading(true);
    setError(null);
    try {
      const response = await fetch("/api/calendar/feed");
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Could not download your calendar. Please try again.");
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = "syllabiq-deadlines.ics";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Calendar download failed.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        role="dialog" aria-modal="true" aria-labelledby="calendar-export-title"
        className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-7 w-7 text-blue-600" />
            <div>
              <h3 id="calendar-export-title" className="text-lg font-black text-slate-900">Export Your Deadlines</h3>
              <p className="text-xs text-slate-500">Use your schedule in another calendar</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close calendar export" className="text-slate-500 hover:text-slate-900 p-2 rounded-full cursor-pointer">✕</button>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Download calendar (.ics)</h4>
          <p className="text-sm text-slate-600">Download the deadlines saved to your account, then import the file into Google Calendar, Apple Calendar, or Outlook.</p>
          <button onClick={downloadCalendar} disabled={downloading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-60 cursor-pointer">
            <Download className="h-4 w-4" />
            {downloading ? "Downloading…" : "Download my deadlines"}
          </button>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </div>
        <p className="text-sm text-slate-600">This is a snapshot of your current deadlines. Changes in either calendar do not sync automatically. Import into a separate calendar to keep repeat imports easy to manage.</p>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
          <span className="text-xs text-slate-500 flex items-center gap-1"><Shield className="h-4 w-4 shrink-0" /> Includes titles, course codes, and due dates. Review before sharing.</span>
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-700 cursor-pointer">Done</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
