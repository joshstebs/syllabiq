"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ExternalLink,
  Plus,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Link as LinkIcon,
  MessageCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { Course, ClassGroupChat, ClassGroupType } from "@/lib/types";

interface Props {
  courses: Course[];
  onClose: () => void;
  onUpdateCourseGroup?: (courseId: string, groupChat: ClassGroupChat) => Promise<void>;
}

export function ClassGroupsModal({ courses, onClose, onUpdateCourseGroup }: Props) {
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [groupType, setGroupType] = useState<ClassGroupType>("DISCORD");
  const [groupName, setGroupName] = useState("");
  const [groupUrl, setGroupUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const getPlatformIcon = (type: ClassGroupType) => {
    switch (type) {
      case "DISCORD":
        return (
          <div className="h-8 w-8 rounded-xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center shrink-0 border border-[#5865F2]/20">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
        );
      case "FACEBOOK":
        return (
          <div className="h-8 w-8 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shrink-0 border border-[#1877F2]/20">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case "WHATSAPP":
        return (
          <div className="h-8 w-8 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 border border-[#25D366]/20">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/20">
            <MessageCircle className="w-4 h-4" />
          </div>
        );
    }
  };

  const handleSaveGroupLink = async () => {
    if (!editingCourseId || !groupUrl.trim()) return;
    setIsSaving(true);
    try {
      const payload: ClassGroupChat = {
        type: groupType,
        name: groupName.trim() || `${groupType} Study Group`,
        url: groupUrl.trim(),
        memberCount: Math.floor(Math.random() * 80) + 40
      };

      const res = await fetch("/api/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: editingCourseId,
          groupChat: payload
        })
      });

      if (res.ok) {
        if (onUpdateCourseGroup) {
          await onUpdateCourseGroup(editingCourseId, payload);
        }
        confetti({ particleCount: 40, spread: 50 });
        setStatusMessage("Class study group link saved successfully!");
        setEditingCourseId(null);
        setGroupName("");
        setGroupUrl("");
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } finally {
      setIsSaving(false);
    }
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
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xl shadow-xs">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Class Study Groups &amp; Links</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Facebook · Discord · WhatsApp
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Connect your courses to student-led Discord servers, Facebook Groups, or GroupMe chats
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

        {/* Status Message */}
        {statusMessage && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Value Prop Alert */}
        <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/80 bg-blue-50/60 dark:bg-blue-950/30 p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-extrabold text-blue-900 dark:text-blue-200">
              Zero Clutter • 100% Student Led
            </h4>
            <p className="text-blue-800/80 dark:text-blue-300/80 leading-relaxed font-medium">
              Instead of forcing students into another proprietary campus chat app, SyllabiQ links directly to where your classmates already hang out: Discord channels, student Facebook Groups, and WhatsApp group circles.
            </p>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Enrolled Courses ({courses.length})</span>
            <span>Study Group Link</span>
          </div>

          {courses.map((c) => {
            const isEditingThis = editingCourseId === c.id;

            return (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#131B2E]/60 p-4 space-y-3 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: c.colorHex }}
                    >
                      {c.code.split(" ")[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {c.code}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {c.term}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold truncate max-w-xs sm:max-w-md">
                        {c.name}
                      </div>
                    </div>
                  </div>

                  {/* Group Action or Link */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {c.groupChat ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={c.groupChat.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white hover:border-blue-400 shadow-2xs transition group cursor-pointer"
                        >
                          {getPlatformIcon(c.groupChat.type)}
                          <div className="text-left">
                            <span className="block text-[11px] font-black group-hover:text-blue-600 transition">
                              {c.groupChat.type}
                            </span>
                            {c.groupChat.memberCount && (
                              <span className="block text-[9px] text-slate-400 font-medium">
                                {c.groupChat.memberCount} classmates
                              </span>
                            )}
                          </div>
                          <ExternalLink className="h-3 w-3 text-slate-400 ml-1 group-hover:text-blue-600" />
                        </a>

                        <button
                          onClick={() => {
                            setEditingCourseId(isEditingThis ? null : c.id);
                            if (!isEditingThis) {
                              setGroupType(c.groupChat?.type || "DISCORD");
                              setGroupName(c.groupChat?.name || "");
                              setGroupUrl(c.groupChat?.url || "");
                            }
                          }}
                          className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg transition"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCourseId(isEditingThis ? null : c.id);
                          setGroupType("DISCORD");
                          setGroupName(`${c.code} Study Chat`);
                          setGroupUrl("");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition cursor-pointer shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Link Class Chat</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Edit Form */}
                {isEditingThis && (
                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-3 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                          Platform
                        </label>
                        <select
                          value={groupType}
                          onChange={(e) => setGroupType(e.target.value as any)}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                        >
                          <option value="DISCORD">Discord Server</option>
                          <option value="FACEBOOK">Facebook Group</option>
                          <option value="WHATSAPP">WhatsApp Study Circle</option>
                          <option value="GROUPME">GroupMe Chat</option>
                          <option value="TELEGRAM">Telegram Channel</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                          Group Display Name
                        </label>
                        <input
                          type="text"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          placeholder="e.g. CS 3110 Fall Study Hub"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                          Invite URL / Web Link
                        </label>
                        <input
                          type="text"
                          value={groupUrl}
                          onChange={(e) => setGroupUrl(e.target.value)}
                          placeholder="https://discord.gg/... or facebook.com/groups/..."
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingCourseId(null)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveGroupLink}
                        disabled={isSaving || !groupUrl.trim()}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Class Link"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            Class group chats help students synchronize exam study sessions.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
