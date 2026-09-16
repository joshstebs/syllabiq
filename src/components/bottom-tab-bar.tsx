"use client";

import React from "react";
import { Calendar, CheckSquare, Bell, Share2, MessageCircle } from "lucide-react";

export type TabMode = "TIMELINE" | "SCHEDULE" | "TASKS" | "REMINDERS" | "SHARE" | "CHAT";

interface Props {
  activeTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
}

export function BottomTabBar({ activeTab, onSelectTab }: Props) {
  const tabs = [
    { id: "TIMELINE" as const, label: "Timeline", icon: Calendar },
    { id: "SCHEDULE" as const, label: "Coursicle", icon: Calendar },
    { id: "TASKS" as const, label: "Tasks", icon: CheckSquare },
    { id: "REMINDERS" as const, label: "Reminders", icon: Bell },
    { id: "CHAT" as const, label: "Syllabird", icon: MessageCircle }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0E1526]/95 border-t border-slate-200 dark:border-slate-800 py-2 px-3 backdrop-blur-md shadow-2xl transition-colors">
      <div className="mx-auto max-w-lg flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center space-y-1 py-1.5 px-3 rounded-2xl transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-extrabold shadow-xs scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-600 dark:text-blue-400 stroke-[2.5]" : ""}`} />
              <span className="text-[11px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
