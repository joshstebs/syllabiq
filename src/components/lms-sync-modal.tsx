"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, RefreshCw, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { LMSProvider } from "@/lib/types";

interface Props {
  onClose: () => void;
  onSyncComplete: () => void;
}

export function LMSSyncModal({ onClose, onSyncComplete }: Props) {
  const [provider, setProvider] = useState<LMSProvider>("ICAL_FEED");
  const [feedUrl, setFeedUrl] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState<any | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/lms/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          feedUrl: provider === "ICAL_FEED" ? feedUrl : undefined
        })
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
              <h3 className="text-lg font-black text-slate-900">LMS Calendar Import (iCal Preview)</h3>
              <p className="text-xs text-slate-500 font-medium">Canvas, Blackboard, Brightspace, Moodle iCal feeds supported</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer">✕</button>
        </div>

        {/* Provider Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Your Learning Management System
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: "CANVAS", name: "Canvas LMS", emoji: "🔴" },
              { id: "BLACKBOARD", name: "Blackboard", emoji: "🟡" },
              { id: "BRIGHTSPACE", name: "D2L Brightspace", emoji: "🟠" },
              { id: "MOODLE", name: "Moodle Web", emoji: "🟧" },
              { id: "ICAL_FEED", name: "Private .ics Feed", emoji: "📅" }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id as LMSProvider)}
                className={`rounded-2xl p-3 text-left border transition text-xs font-bold cursor-pointer flex items-center space-x-2 ${
                  provider === p.id
                    ? "border-blue-600 bg-blue-50 text-blue-800 shadow-xs"
                    : "border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{p.emoji}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 space-y-2">
          <p className="text-xs font-bold text-blue-900">📅 iCal Snapshot Import Ready</p>
          <p className="text-xs text-blue-800 leading-relaxed">
            Paste your LMS private calendar feed URL below to import deadlines as a one-time snapshot. Direct Canvas/Blackboard OAuth integrations are on the roadmap once production persistence is configured.
          </p>
        </div>

        {/* Credentials / Feed */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>{provider === "ICAL_FEED" ? "Calendar Feed URL" : "Provider connection"}</span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> {provider === "ICAL_FEED" ? "Persistence setup required" : "OAuth/API setup pending"}
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 focus-within:border-blue-500 shadow-2xs">
            <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              placeholder={provider === "ICAL_FEED" ? "webcal://university.edu/feeds/calendar.ics" : "Institution connection coming soon"}
              disabled={provider !== "ICAL_FEED"}
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Current status:</strong> Calendar feeds can be fetched as a one-time snapshot. Canvas, Blackboard, Brightspace, and Moodle require an institution-approved OAuth/API connection and are not enabled by this button yet.
          </p>
        </div>

        {/* Sync Report */}
        {syncReport && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-extrabold text-blue-800">
              <span>Sync & Deduplication Complete</span>
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
            disabled={isSyncing}
            className="flex items-center space-x-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Fetching..." : provider === "ICAL_FEED" ? "Import Calendar Snapshot" : "Provider Setup Pending"}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
