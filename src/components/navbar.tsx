"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Sun,
  Moon,
  RefreshCw,
  Smartphone,
  Mic,
  Camera,
  Palette,
  Users,
  Zap,
  Image as ImageIcon,
  Cloud,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Archive,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useAuth } from "@/lib/auth-context";

interface Props {
  onOpenLmsModal: () => void;
  onOpenSheetsModal: () => void;
  onOpenGradeModal: () => void;
  onOpenDispatchModal: () => void;
  onOpenLockerModal: () => void;
  onOpenAudioModal: () => void;
  onOpenShareModal: () => void;
  onOpenMobileModal: () => void;
  onOpenHomeworkModal: () => void;
  onOpenColorModal: () => void;
  onOpenPeerModal: () => void;
  onOpenPaywallModal: () => void;
  onOpenBackgroundModal: () => void;
  onOpenCloudVaultModal: () => void;
  onOpenAuthModal?: () => void;
  onOpenAdminPanel?: () => void;
  onSyncAll: () => void;
  isSyncing: boolean;
}

export function Navbar({
  onOpenLmsModal,
  onOpenSheetsModal,
  onOpenGradeModal,
  onOpenDispatchModal,
  onOpenLockerModal,
  onOpenAudioModal,
  onOpenShareModal,
  onOpenMobileModal,
  onOpenHomeworkModal,
  onOpenColorModal,
  onOpenPeerModal,
  onOpenPaywallModal,
  onOpenBackgroundModal,
  onOpenCloudVaultModal,
  onOpenAuthModal,
  onOpenAdminPanel,
  onSyncAll,
  isSyncing
}: Props) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { user, logout, loginWithAdminPreset, loginWithTesterPreset } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setShowToolsMenu(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-md transition-colors duration-200">
      {/* Top Banner with Pro Promotion */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-1 px-3 text-center text-[11px] sm:text-xs text-white flex flex-wrap items-center justify-center gap-1.5 shadow-2xs overflow-hidden">
        <span className="text-sm">✨</span>
        <span className="font-extrabold">SyllabiQ Pro:</span>
        <span className="opacity-95 hidden sm:inline">
          1st Month 100% Free Trial ($5/mo after) · Homework Scanner, Cloud Papers Vault &amp; Phone Alerts
        </span>
        <button
          onClick={onOpenPaywallModal}
          className="ml-2 font-black bg-white text-indigo-700 px-2.5 py-0.5 rounded-full hover:bg-indigo-50 shadow-2xs cursor-pointer text-[11px]"
        >
          Try Free Trial &rarr;
        </button>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Official SyllabiQ Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            {/* Crisp Logo Container ensuring perfect contrast in light & dark modes */}
            <div className="flex items-center bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-xs border border-slate-200/80 hover:border-blue-400 transition-all">
              <img
                src="/images/syllabiq-logo.png"
                alt="SyllabiQ Logo"
                className="h-6 sm:h-8 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="rounded-full bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                CAMPUS 2.0
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <div className="hidden xl:flex items-center space-x-3 pl-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800">
            <Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Tour
            </Link>
            <span>•</span>
            <Link href="/harbour-and-main" className="hover:text-[#4E8D8F] dark:hover:text-[#DCC9A8] transition">
              Harbour &amp; Main
            </Link>
          </div>
        </div>

        {/* Spacious, Decompressed Action Tools Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
          {/* Quick Action: Homework Photo Scanner */}
          <button
            onClick={onOpenHomeworkModal}
            className="hidden sm:flex items-center space-x-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition cursor-pointer shadow-2xs"
            title="Snap Homework Photos (OCR Problem Extraction)"
          >
            <Camera className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline">Snap HW</span>
          </button>

          {/* Studio & Tools Dropdown Menu (Decompresses the navbar into an organized menu) */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-2 text-xs font-bold border transition cursor-pointer ${
                showToolsMenu
                  ? "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-xs"
                  : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200/80 dark:hover:bg-slate-700/80"
              }`}
              title="Open Campus Tools & Customization Studio"
            >
              <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-bold">Tools</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showToolsMenu ? "rotate-180" : ""}`} />
            </button>

            {/* Tools Dropdown Popover */}
            {showToolsMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 space-y-1.5 z-50 animate-fade-in">
                <div className="px-2.5 py-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Campus Studio &amp; Tools</span>
                  <Sparkles className="h-3 w-3 text-blue-500" />
                </div>

                <div className="space-y-0.5 max-h-[75vh] overflow-y-auto pr-1">
                  {/* Cloud Papers Vault */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      onOpenCloudVaultModal();
                    }}
                    className="w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 transition text-left cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Cloud className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Cloud Papers Vault</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Save syllabi &amp; work to Google Drive</div>
                    </div>
                  </button>

                  {/* Wallpaper / Background Customizer */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      onOpenBackgroundModal();
                    }}
                    className="w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition text-left cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Wallpaper Studio</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Campus aesthetic presets &amp; photos</div>
                    </div>
                  </button>

                  {/* Course Colors & Emojis */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      onOpenColorModal();
                    }}
                    className="w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 transition text-left cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                      <Palette className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Course Colors &amp; Emojis</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Color-code classes with custom tags</div>
                    </div>
                  </button>

                  {/* Universal LMS Sync */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      onOpenLmsModal();
                    }}
                    className="w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition text-left cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Universal LMS Sync</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Canvas, Blackboard, Brightspace</div>
                    </div>
                  </button>

                  {/* Campus Peer Hub */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      onOpenPeerModal();
                    }}
                    className="w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/50 transition text-left cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Campus Peer Study Hub</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Study circles &amp; shared notes</div>
                    </div>
                  </button>

                  {/* Lecture Audio Transcriber */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      onOpenAudioModal();
                    }}
                    className="w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 transition text-left cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                      <Mic className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Audio Transcriber</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Record &amp; transcribe class lectures</div>
                    </div>
                  </button>

                  {/* Mobile App Simulator */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      onOpenMobileModal();
                    }}
                    className="w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Mobile Simulator</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">iPhone &amp; iPad interactive view</div>
                    </div>
                  </button>

                  {/* Student Locker */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      onOpenLockerModal();
                    }}
                    className="w-full flex items-center space-x-3 px-2.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-left cursor-pointer group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:scale-105 transition-transform">
                      <Archive className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">Student Locker</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Course document &amp; file archive</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* LIGHT / DARK MODE TOGGLE */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 fill-amber-400 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 fill-slate-700 text-slate-700" />
            )}
          </button>

          {/* PRO BADGE / TRIAL */}
          <button
            onClick={onOpenPaywallModal}
            className="flex items-center space-x-1 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-3 py-2 text-xs font-black text-white shadow-xs hover:opacity-90 transition cursor-pointer"
            title="SyllabiQ Pro Subscription ($0 1st Month Free Trial)"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            <span>PRO</span>
          </button>

          {/* SYNC ALL BUTTON */}
          <button
            onClick={onSyncAll}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 rounded-xl bg-blue-600 p-2 sm:px-3.5 sm:py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            title="Sync all deadlines and calendar schedules"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync"}</span>
          </button>

          {/* USER AUTH & PROFILE DROPDOWN */}
          <div className="relative" ref={userRef}>
            {user ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                title="Account Menu"
              >
                <div className="h-6 w-6 rounded-lg bg-blue-100 dark:bg-blue-900 text-sm flex items-center justify-center">
                  {user.avatar}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">
                    {user.name.split(" ")[0]}
                  </div>
                  <div className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3.5 py-2 text-xs font-black shadow-xs hover:opacity-90 transition cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {showUserMenu && user && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 space-y-3 z-50 animate-fade-in">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-lg">
                    {user.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {user.email}
                    </div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[9px] font-extrabold">
                      {user.role} · 30-Day Pro Trial
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  {user.role === "ADMIN" && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAdminPanel?.();
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-bold transition text-left cursor-pointer"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Admin Diagnostic Center</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (user.role === "ADMIN") {
                        loginWithTesterPreset();
                      } else {
                        loginWithAdminPreset();
                      }
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition text-left cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>
                      Switch to {user.role === "ADMIN" ? "Tester (Alex)" : "Admin (Josh)"}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenPaywallModal();
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 font-semibold transition text-left cursor-pointer"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Manage Pro ($5/mo Trial)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuthModal?.();
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold transition text-left cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Switch or Sign In Other</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold transition text-left cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
