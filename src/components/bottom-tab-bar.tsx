"use client";

import React from "react";
import { Calendar, CheckSquare, Bell, Share2, MessageCircle, Brain } from "lucide-react";

export type TabMode = "TIMELINE" | "SCHEDULE" | "TASKS" | "FLASHCARDS" | "REMINDERS" | "SHARE" | "CHAT";

interface Props {
  activeTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
}

export function BottomTabBar({ activeTab, onSelectTab }: Props) {
  const tabs = [
    { id: "TIMELINE" as const, label: "Timeline", icon: Calendar },
    { id: "SCHEDULE" as const, label: "Coursicle", icon: Calendar },
    { id: "TASKS" as const, label: "Tasks", icon: CheckSquare },
    { id: "FLASHCARDS" as const, label: "Flashcards", icon: Brain },
    { id: "REMINDERS" as const, label: "Reminders", icon: Bell },
    { id: "CHAT" as const, label: "Syllabird", icon: MessageCircle }
  ];

  return (
    <nav
      aria-label="Bottom Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0E1526]/95 border-t border-slate-200 dark:border-slate-800 pt-2 pb-[max(0.75rem,calc(env(safe-area-inset-bottom,0px)+0.625rem))] px-1 sm:px-3 backdrop-blur-md shadow-2xl transition-colors"
    >
      <div className="mx-auto max-w-xl flex items-center justify-between gap-0.5 sm:gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 sm:px-1.5 rounded-xl transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                isActive
                  ? "bg-blue-50/90 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-black shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400 stroke-[2.5]" : ""}`} />
              <span className="text-[10px] sm:text-[11px] leading-tight truncate max-w-full text-center mt-0.5">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
