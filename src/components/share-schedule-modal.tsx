"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, CheckCircle2, Calendar, Users, Globe, Shield } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  onClose: () => void;
}

export function ShareScheduleModal({ onClose }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const publicUrl = "https://syllabiq.ca/p/alex-cornell-fall2026";
  const gcalShareUrl = "https://calendar.google.com/calendar/r?cid=" + encodeURIComponent("https://syllabiq.ca/api/calendar/feed");
  const icalSubscribeUrl = "webcal://syllabiq.ca/api/calendar/feed";

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setCopiedKey(null), 2500);
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
        className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 border border-blue-200 text-xl shadow-xs">
              🔗
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Share Calendar & Schedule</h3>
              <p className="text-xs text-slate-500 font-medium">Share with roommates, study buddies, or family</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer">✕</button>
        </div>

        {/* Share Options */}
        <div className="space-y-3.5">
          {/* Public Web View */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-blue-600" /> Public Schedule Link
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                Web View
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Friends can view your upcoming exam dates and deadlines without an account.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <input
                readOnly
                value={publicUrl}
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-700 border border-slate-300 font-mono select-all shadow-2xs"
              />
              <button
                onClick={() => copyToClipboard(publicUrl, "public")}
                className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition shrink-0 cursor-pointer"
              >
                {copiedKey === "public" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "public" ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Google Calendar Direct Sync */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-emerald-600" /> 1-Click Google Calendar 2-Way Sync
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Google Cal
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Sync color-coded semester deadlines &amp; AI milestone prep buffers directly into Google Calendar.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pt-1">
              <input
                readOnly
                value={gcalShareUrl}
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-700 border border-slate-300 font-mono select-all shadow-2xs"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={gcalShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow transition cursor-pointer"
                  title="Open in Google Calendar"
                >
                  <span>Add to Google Cal ↗</span>
                </a>
                <button
                  onClick={() => copyToClipboard(gcalShareUrl, "gcal")}
                  className="flex items-center space-x-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  {copiedKey === "gcal" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === "gcal" ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Apple Calendar / iPhone iCal Subscription */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-purple-600" /> iPhone / Outlook Feed (.ics)
              </span>
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <input
                readOnly
                value={icalSubscribeUrl}
                className="w-full bg-white rounded-xl px-3 py-2 text-xs text-slate-700 border border-slate-300 font-mono select-all shadow-2xs"
              />
              <button
                onClick={() => copyToClipboard(icalSubscribeUrl, "ical")}
                className="flex items-center space-x-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-purple-700 transition shrink-0 cursor-pointer"
              >
                {copiedKey === "ical" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "ical" ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-slate-400" /> Private grades are never shared
          </span>
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
