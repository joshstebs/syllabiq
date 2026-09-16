"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Smartphone,
  Send,
  CheckCircle2,
  ExternalLink,
  CloudRain,
  X,
  BellRing
} from "lucide-react";
import confetti from "canvas-confetti";
import { TaskItem } from "@/lib/types";
import { generateDailyMorningDispatch, formatWhatsAppMessage, formatDiscordDispatchPayload } from "@/lib/intelligence/morning-dispatch";

interface Props {
  tasks: TaskItem[];
  onClose: () => void;
}

export function MorningDispatchModal({ tasks, onClose }: Props) {
  const [channel, setChannel] = useState<"PUSH" | "DISCORD" | "WHATSAPP">("DISCORD");
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("+16075550199");
  const [isSending, setIsSending] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const dispatch = generateDailyMorningDispatch(tasks, "Alex");

  const handleSendDiscord = async () => {
    setIsSending(true);
    setStatusNote(null);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "discord_dispatch",
          webhookUrl: discordWebhookUrl.trim(),
          userName: "Alex"
        })
      });
      const data = await res.json();
      if (res.ok) {
        confetti({ particleCount: 40, spread: 50 });
        setStatusNote(data.message || "Discord dispatch sent successfully!");
        setTimeout(() => setStatusNote(null), 5000);
      }
    } catch (e: any) {
      setStatusNote(`Error: ${e.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = formatWhatsAppMessage(dispatch);
    const encoded = encodeURIComponent(text);
    const cleanPhone = whatsappPhone.replace(/[^\d]/g, "");
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, "_blank");
    confetti({ particleCount: 30, spread: 40 });
    setStatusNote("Opening WhatsApp with formatted 7:00 AM briefing!");
    setTimeout(() => setStatusNote(null), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl space-y-5 max-h-[85dvh] sm:max-h-[90vh] overflow-y-auto pb-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xl shadow-xs">
              ☀️
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Daily Morning Dispatch</span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  7:00 AM Alert
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Automated daily briefing with upcoming deadlines &amp; commute weather buffers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status Toast */}
        {statusNote && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{statusNote}</span>
          </div>
        )}

        {/* Channel Selector */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setChannel("DISCORD")}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              channel === "DISCORD"
                ? "bg-white dark:bg-[#1E1F22] text-[#5865F2] shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord Webhook</span>
          </button>

          <button
            onClick={() => setChannel("WHATSAPP")}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              channel === "WHATSAPP"
                ? "bg-white dark:bg-[#1E1F22] text-[#25D366] shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>WhatsApp Bot</span>
          </button>

          <button
            onClick={() => setChannel("PUSH")}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              channel === "PUSH"
                ? "bg-white dark:bg-[#1E1F22] text-blue-600 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-blue-600" />
            <span>Mobile Push</span>
          </button>
        </div>

        {/* Channel Specific Inputs & Live Previews */}
        {channel === "DISCORD" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Your Discord Channel Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discordWebhookUrl}
                  onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                />
                <button
                  onClick={handleSendDiscord}
                  disabled={isSending}
                  className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-black transition cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSending ? "Sending..." : "Test Webhook"}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: In Discord, go to Channel Settings &gt; Integrations &gt; Webhooks &gt; New Webhook &gt; Copy Webhook URL.
              </p>
            </div>

            {/* Discord Embed Preview */}
            <div className="bg-[#2B2D31] rounded-2xl p-4 border border-[#1E1F22] space-y-3 font-sans text-white">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  SQ
                </div>
                <div>
                  <span className="text-xs font-bold text-white">SyllabiQ Dispatch</span>
                  <span className="text-[9px] bg-[#5865F2] text-white px-1.5 py-0.2 rounded ml-1.5 font-bold">BOT</span>
                  <span className="text-[10px] text-slate-400 ml-2">Today at 7:00 AM</span>
                </div>
              </div>

              <div className="border-l-4 border-[#5865F2] bg-[#313338] p-3.5 rounded-r-xl space-y-2.5 text-xs text-slate-200">
                <div className="font-bold text-sm text-white">📚 Morning Academic Briefing • {dispatch.date}</div>
                <p className="text-xs text-slate-300">{dispatch.greeting}</p>

                {dispatch.tasksDueNext24h.length > 0 && (
                  <div className="space-y-1">
                    <div className="font-bold text-blue-300">🚨 Due in Next 24 Hours:</div>
                    {dispatch.tasksDueNext24h.map((t) => (
                      <div key={t.id} className="text-[11px] text-slate-300 pl-2">
                        • <strong>{t.courseCode}</strong>: {t.title} ({t.weightPercent}% grade)
                      </div>
                    ))}
                  </div>
                )}

                {dispatch.weatherAlert && (
                  <div className="text-[11px] text-amber-300 pt-1 border-t border-slate-700">
                    🌧️ {dispatch.weatherAlert.summary} (+15m transit buffer added to calendar)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {channel === "WHATSAPP" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Your Mobile WhatsApp Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+1 (607) 555-0199"
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                />
                <button
                  onClick={handleOpenWhatsApp}
                  className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open WhatsApp</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                1-tap opens WhatsApp with your pre-formatted morning briefing ready to send or review.
              </p>
            </div>

            {/* WhatsApp Chat Bubble Preview */}
            <div className="bg-[#EFEAE2] dark:bg-[#121B22] rounded-2xl p-4 border border-slate-300 dark:border-slate-800 space-y-2">
              <div className="bg-white dark:bg-[#1F2C34] p-3.5 rounded-xl text-xs text-slate-900 dark:text-slate-100 whitespace-pre-wrap font-sans leading-relaxed shadow-xs">
                {formatWhatsAppMessage(dispatch)}
              </div>
            </div>
          </div>
        )}

        {channel === "PUSH" && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 pb-1 border-b border-slate-200 dark:border-slate-700">
              <div className="h-5 w-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                SQ
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">SyllabiQ Morning Brief</span>
              <span>• Now</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">☀️ Good morning, Alex! 2 Tasks Due Soon</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {dispatch.tasksDueNext24h.length > 0
                  ? `Due in 24h: ${dispatch.tasksDueNext24h.map((t) => `${t.courseCode} ${t.title}`).join(", ")}.`
                  : "No imminent hard deadlines today."}{" "}
                {dispatch.milestonesStartingToday.length > 0 &&
                  `Start early prep on ${dispatch.milestonesStartingToday.map((t) => t.courseCode).join(", ")}.`}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CloudRain className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Rain expected (+15m transit buffer added to calendar)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Daily morning briefing delivers automatically at 7:00 AM</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
