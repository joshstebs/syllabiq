"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Smartphone,
  Clock,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Settings,
  AlertTriangle
} from "lucide-react";
import confetti from "canvas-confetti";
import { TaskItem, NotificationSettings } from "@/lib/types";

interface Props {
  tasks: TaskItem[];
  isPro?: boolean;
  onOpenPaywall?: () => void;
}

export function NotificationBar({ tasks, isPro = false, onOpenPaywall }: Props) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    phone: "+1 (607) 555-0199",
    smsEnabled: true,
    webPushEnabled: true,
    soundEnabled: true,
    leadTimesMinutes: [1440, 180, 60, 15]
  });
  const [testAlertPreview, setTestAlertPreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Find most urgent uncompleted task
  const now = Date.now();
  const upcomingTasks = tasks
    .filter((t) => t.status !== "DONE")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const mostUrgent = upcomingTasks[0] || null;

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch((e) => console.error(e));
  }, []);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("Audio context not allowed yet", e);
    }
  };

  const handleSendTestAlert = async () => {
    setIsSending(true);
    if (settings.soundEnabled) {
      playNotificationSound();
    }
    try {
      const taskTitle = mostUrgent ? mostUrgent.title : "CS 3110: Functional Programming Assignment";
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_dispatch",
          phone: settings.phone,
          taskTitle,
          dueString: "Tonight at 11:59 PM"
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTestAlertPreview(data.previewText);
        confetti({ particleCount: 40, spread: 50 });
        setTimeout(() => setTestAlertPreview(null), 6000);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveSettings = async () => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setShowSettings(false);
  };

  if (!mostUrgent && isDismissed) return null;

  const dueDateObj = mostUrgent ? new Date(mostUrgent.dueDate) : new Date();
  const diffHours = Math.max(0, Math.round((dueDateObj.getTime() - now) / 3600000));

  return (
    <div className="w-full relative z-30">
      {/* Test Alert Lockscreen Notification Popup (iOS Style) */}
      {testAlertPreview && (
        <div className="fixed top-5 right-5 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md animate-bounce">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>SyllabiQ Phone Notification</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">now</span>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {testAlertPreview}
          </p>
        </div>
      )}

      {/* Main Sticky Notification Bar */}
      {!isDismissed && (
        <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-white px-4 py-2.5 sm:px-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BellRing className="h-4 w-4 animate-pulse" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.2 rounded-full">
                  Upcoming Due Date
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {diffHours <= 24 ? `Due in ~${diffHours} hours` : "Upcoming"}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                <span className="text-blue-700">
                  [{mostUrgent ? mostUrgent.courseCode : "CS 3110"}]
                </span>{" "}
                {mostUrgent ? mostUrgent.title : "No immediate assignments due"}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                if (!isPro) {
                  onOpenPaywall?.();
                  return;
                }
                handleSendTestAlert();
              }}
              disabled={isSending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-3.5 py-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
              title="Test real SMS push alert to your phone"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>{isSending ? "Sending..." : "Send SMS Alert"}</span>
              {!isPro && (
                <span className="text-[9px] bg-slate-900 text-amber-300 font-extrabold px-1.5 py-0.2 rounded-md ml-1">
                  PRO
                </span>
              )}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center gap-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 transition cursor-pointer shadow-2xs"
            >
              <Settings className="h-3.5 w-3.5 text-slate-500" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="h-7 w-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              title="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 h-7 w-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                <Smartphone className="h-3 w-3" />
                <span>Phone Notification Preferences</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Never Miss an 11:59 PM Deadline
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Configure SMS text reminders, timing intervals, and audio alerts.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Phone Number (SMS)
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Delivery Channels
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer">
                  <span className="font-semibold text-slate-700">SMS Text Messages</span>
                  <input
                    type="checkbox"
                    checked={settings.smsEnabled}
                    onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer">
                  <span className="font-semibold text-slate-700">Web Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.webPushEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, webPushEnabled: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer">
                  <span className="font-semibold text-slate-700">Audio Chime Sound</span>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, soundEnabled: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alert Lead Times Before Deadlines
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[11px]">
                    24 Hours Prior
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[11px]">
                    3 Hours Prior
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[11px]">
                    1 Hour Prior
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[11px]">
                    15 Min Crunch Alert
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleSendTestAlert}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 transition cursor-pointer"
              >
                Send Test Alert
              </button>

              <button
                onClick={handleSaveSettings}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 transition cursor-pointer shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
