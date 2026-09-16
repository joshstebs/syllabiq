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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 py-2.5 px-4 backdrop-blur-md shadow-lg">
      <div className="mx-auto max-w-lg flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-2xl transition cursor-pointer ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-extrabold shadow-2xs"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-600 stroke-[2.5]" : ""}`} />
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
