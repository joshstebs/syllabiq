"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, RefreshCw, Link as LinkIcon, Unlink, CheckCircle2, AlertCircle, LayoutGrid, CalendarDays } from "lucide-react";

interface SyncStatus {
  connected: boolean;
  calendarSyncEnabled?: boolean;
  calendarMode?: "per-course" | "combined";
  lastSyncedAt?: string | null;
  reason?: string;
}

export function GoogleCalendarSettings() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [switchingMode, setSwitchingMode] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/google/sync");
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({ connected: false, reason: "fetch_failed" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleConnect = () => {
    window.location.href = "/api/auth/google";
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/google/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setMessage({
        kind: "ok",
        text: `Synced ${data.pushed ?? 0} new and ${data.updated ?? 0} updated deadlines to Google Calendar.`
      });
      await loadStatus();
    } catch (err: any) {
      setMessage({ kind: "error", text: err.message || "Sync failed" });
    } finally {
      setSyncing(false);
    }
  };

  const handleModeChange = async (mode: "per-course" | "combined") => {
    if (mode === status?.calendarMode) return;
    setSwitchingMode(true);
    setMessage(null);
    try {
      const res = await fetch("/api/google/calendar-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not change calendar mode");
      setMessage({
        kind: "ok",
        text: `Switched to ${mode === "combined" ? "one combined calendar" : "one calendar per course"}. ${data.clearedEvents ?? 0} old events cleared.`
      });
      await loadStatus();
    } catch (err: any) {
      setMessage({ kind: "error", text: err.message || "Could not change calendar mode" });
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect Google Calendar? Your calendars stay in Google, but SyllabiQ will stop syncing.")) return;
    setDisconnecting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/google/disconnect", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Disconnect failed");
      setMessage({ kind: "ok", text: "Google Calendar disconnected." });
      await loadStatus();
    } catch (err: any) {
      setMessage({ kind: "error", text: err.message || "Disconnect failed" });
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-slate-500">
        <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Checking Google Calendar status
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in text-xs">
      {/* Status card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-extrabold text-slate-900 dark:text-white">Google Calendar</span>
          </div>
          {status?.connected ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" /> Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              <AlertCircle className="h-3.5 w-3.5" /> Not connected
            </span>
          )}
        </div>

        {!status?.connected ? (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Connect your Google account to push every dated task to Google Calendar and pull changes back. SyllabiQ requests calendar access only, and you can disconnect anytime.
            </p>
            <button
              type="button"
              onClick={handleConnect}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 transition cursor-pointer"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Connect Google Calendar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[11px] text-slate-500">
              {status.lastSyncedAt
                ? `Last synced ${new Date(status.lastSyncedAt).toLocaleString()}`
                : "Connected. Run your first sync below."}
            </p>

            {/* Calendar mode toggle */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Calendar layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={switchingMode}
                  onClick={() => handleModeChange("per-course")}
                  className={`rounded-xl p-3 text-left border transition text-[11px] font-bold cursor-pointer flex items-start gap-2 ${
                    status.calendarMode === "per-course"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Per course
                    <span className="block font-medium opacity-70 mt-0.5">One calendar per class, toggle each in Google</span>
                  </span>
                </button>
                <button
                  type="button"
                  disabled={switchingMode}
                  onClick={() => handleModeChange("combined")}
                  className={`rounded-xl p-3 text-left border transition text-[11px] font-bold cursor-pointer flex items-start gap-2 ${
                    status.calendarMode === "combined"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <CalendarDays className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Combined
                    <span className="block font-medium opacity-70 mt-0.5">All deadlines in one SyllabiQ calendar</span>
                  </span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Switching layouts clears SyllabiQ events from the old calendars and re-syncs into the new one. Your tasks are never deleted.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={syncing}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-4 py-2 transition cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "Syncing" : "Sync now"}</span>
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                <Unlink className="h-3.5 w-3.5" />
                <span>{disconnecting ? "Disconnecting" : "Disconnect"}</span>
              </button>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`rounded-xl px-3 py-2 text-[11px] font-semibold ${
              message.kind === "ok"
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed">
        SyllabiQ accesses your Google Calendar only to create and update deadline events in calendars it manages. Tokens are encrypted and stored securely. Disconnect anytime from this panel or from your Google account settings.
      </p>
    </div>
  );
}
