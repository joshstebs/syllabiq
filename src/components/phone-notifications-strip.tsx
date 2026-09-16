"use client";

import React, { useState } from "react";
import { Bell, Clock, CheckCircle2, AlertCircle, ChevronRight, Send, Sparkles } from "lucide-react";

interface NotificationCard {
  id: string;
  time: string;
  badgeEmoji: string;
  title: string;
  message: string;
  minutesAgo: string;
  actionText?: string;
  accent: "blue" | "amber" | "emerald" | "purple";
}

const PHONES_DATA = [
  {
    lockTime: "4:31",
    date: "Monday, September 15",
    notification: {
      id: "n1",
      badgeEmoji: "📝",
      title: "2 Things DUE TODAY",
      message: "• CS 3110: OCaml Warm-Up & Expressions\n• ECON 1010: Problem Set 2",
      minutesAgo: "now",
      accent: "blue" as const
    }
  },
  {
    lockTime: "4:34",
    date: "Monday, September 15",
    notification: {
      id: "n2",
      badgeEmoji: "⏰",
      title: "Assignment due in 30 minutes",
      message: "BIO 1500: Chapter Review 3 Quiz closes at 5:00 PM.",
      minutesAgo: "1m ago",
      accent: "amber" as const
    }
  },
  {
    lockTime: "4:32",
    date: "Monday, September 15",
    notification: {
      id: "n3",
      badgeEmoji: "🔔",
      title: "Class Starting Soon!",
      message: "Principles of Economics starts in 30 minutes at Uris Hall 468.",
      minutesAgo: "now",
      accent: "emerald" as const
    }
  },
  {
    lockTime: "4:28",
    date: "Monday, September 15",
    notification: {
      id: "n4",
      badgeEmoji: "⚡",
      title: "AI Prep Buffer Triggered",
      message: "Start drafting 10-page Research Paper (scheduled 5 days early).",
      minutesAgo: "3m ago",
      accent: "purple" as const
    }
  },
  {
    lockTime: "4:31",
    date: "Monday, September 15",
    notification: {
      id: "n5",
      badgeEmoji: "🌧️",
      title: "Transit & Weather Buffer",
      message: "Heavy rain on campus. +15 min walking buffer added to GCal.",
      minutesAgo: "now",
      accent: "blue" as const
    }
  },
  {
    lockTime: "4:40",
    date: "Monday, September 15",
    notification: {
      id: "n6",
      badgeEmoji: "📊",
      title: "Sheets 2-Way Sync Event",
      message: "Marked Problem Set 1 as DONE in Google Sheets. Calendar updated!",
      minutesAgo: "just now",
      accent: "emerald" as const
    }
  }
];

export function PhoneNotificationsStrip() {
  return (
    <div className="space-y-6 pt-4">
      {/* Floating badges from Due Gooder Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs">
          <span className="text-base">🔬</span>
          <span className="font-bold text-slate-700">Term Paper in 3 hours</span>
        </div>

        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs">
          <span className="text-base">🧠</span>
          <span className="font-serif italic font-bold text-slate-900 text-sm">
            4 Assignments Due TODAY
          </span>
        </div>

        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs">
          <span className="text-base">✨</span>
          <span className="font-bold text-blue-700">Auto-synced to Google Calendar</span>
        </div>
      </div>

      {/* Row of 6 sleek iPhone Lockscreen Mockups matching Screenshot 1 */}
      <div className="overflow-x-auto pb-4 pt-2 touch-pan-x scroll-smooth -webkit-overflow-scrolling-touch">
        <div className="flex items-center space-x-4 min-w-[1280px] justify-start sm:justify-center px-4">
          {PHONES_DATA.map((phone, idx) => (
            <div
              key={idx}
              className="w-[200px] h-[370px] rounded-[38px] border-[6px] border-slate-800 bg-white shadow-lg overflow-hidden flex flex-col justify-between p-3 relative shrink-0"
              style={{
                backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
                backgroundSize: "16px 16px"
              }}
            >
              {/* Dynamic Island Pill */}
              <div className="w-full flex justify-center pt-0.5">
                <div className="h-3.5 w-16 bg-black rounded-full" />
              </div>

              {/* Lockscreen Time & Date */}
              <div className="text-center space-y-0.5 pt-2">
                <span className="text-[10px] text-slate-500 font-semibold block">{phone.date}</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                  {phone.lockTime}
                </span>
              </div>

              {/* Push Notification Card (Screenshot 1 style) */}
              <div className="rounded-2xl bg-white/95 border border-slate-200/90 p-2.5 shadow-sm space-y-1 backdrop-blur-xs">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                  <div className="flex items-center space-x-1">
                    <div className="h-3.5 w-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[7px] text-white font-bold">
                      SQ
                    </div>
                    <span className="text-slate-800 font-extrabold">SyllabiQ</span>
                  </div>
                  <span>{phone.notification.minutesAgo}</span>
                </div>

                <div className="pt-0.5">
                  <div className="flex items-center space-x-1 text-[10px] font-black text-slate-900 leading-tight">
                    <span>{phone.notification.badgeEmoji}</span>
                    <span className="truncate">{phone.notification.title}</span>
                  </div>
                  <p className="text-[9px] text-slate-600 font-medium leading-tight mt-0.5 whitespace-pre-wrap">
                    {phone.notification.message}
                  </p>
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="w-full flex justify-center pb-0.5">
                <div className="h-1 w-12 bg-slate-300 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
