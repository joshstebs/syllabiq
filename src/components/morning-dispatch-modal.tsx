"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, MessageSquare, CloudRain, Smartphone } from "lucide-react";
import { TaskItem } from "@/lib/types";
import { generateDailyMorningDispatch, formatWhatsAppMessage } from "@/lib/intelligence/morning-dispatch";

interface Props {
  tasks: TaskItem[];
  onClose: () => void;
}

export function MorningDispatchModal({ tasks, onClose }: Props) {
  const [channel, setChannel] = useState<"PUSH" | "DISCORD" | "WHATSAPP">("PUSH");
  const dispatch = generateDailyMorningDispatch(tasks, "Alex");

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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 text-xl shadow-xs">
              ☀️
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Daily Morning Dispatch</h3>
              <p className="text-xs text-slate-500 font-medium">Delivered every morning at 7:00 AM with commute weather buffer</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-full cursor-pointer">✕</button>
        </div>

        {/* Channel Selector */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setChannel("PUSH")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              channel === "PUSH" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-blue-600" />
            <span>Mobile Push</span>
          </button>

          <button
            onClick={() => setChannel("DISCORD")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              channel === "DISCORD" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
            <span>Discord Webhook</span>
          </button>

          <button
            onClick={() => setChannel("WHATSAPP")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              channel === "WHATSAPP" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp Bot</span>
          </button>
        </div>

        {/* Content Preview */}
        {channel === "PUSH" && (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 pb-1 border-b border-slate-200">
              <div className="h-5 w-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                SQ
              </div>
              <span className="font-bold text-slate-800">SyllabiQ Morning Brief</span>
              <span>• Now</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-slate-900">☀️ Good morning, Alex! 2 Tasks Due Soon</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {dispatch.tasksDueNext24h.length > 0
                  ? `Due in 24h: ${dispatch.tasksDueNext24h.map((t) => `${t.courseCode} ${t.title}`).join(", ")}.`
                  : "No imminent hard deadlines today."}{" "}
                {dispatch.milestonesStartingToday.length > 0 &&
                  `Start early prep on ${dispatch.milestonesStartingToday.map((t) => t.courseCode).join(", ")}.`}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CloudRain className="h-4 w-4 text-amber-600" /> Rain expected (+15m transit buffer added to calendar)
                </span>
              </div>
            </div>
          </div>
        )}

        {channel === "DISCORD" && (
          <div className="bg-[#2B2D31] rounded-2xl p-4 border border-[#1E1F22] space-y-3 font-sans text-white">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                SQ
              </div>
              <div>
                <span className="text-xs font-bold text-white">SyllabiQ Dispatch</span>
                <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.2 rounded ml-1.5">BOT</span>
                <span className="text-[10px] text-slate-400 ml-2">Today at 7:00 AM</span>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 bg-[#313338] p-3.5 rounded-r-lg space-y-2.5 text-xs text-slate-200">
              <div className="font-bold text-sm text-white">📚 Morning Academic Briefing • {dispatch.date}</div>
              <p className="text-xs text-slate-300">{dispatch.greeting}</p>

              {dispatch.tasksDueNext24h.length > 0 && (
                <div className="space-y-1">
                  <div className="font-bold text-blue-300">🚨 Due in Next 24 Hours:</div>
                  {dispatch.tasksDueNext24h.map((t) => (
                    <div key={t.id} className="text-[11px] text-slate-300 pl-2">
                      • <strong>{t.courseCode}</strong>: {t.title} ({t.weightPercent}%)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {channel === "WHATSAPP" && (
          <div className="bg-[#EFEAE2] rounded-2xl p-4 border border-slate-300 space-y-2">
            <div className="bg-white p-3.5 rounded-xl text-xs text-slate-900 whitespace-pre-wrap font-mono leading-relaxed shadow-xs">
              {formatWhatsAppMessage(dispatch)}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">Daily dispatch connects to your phone or Discord server</span>
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
