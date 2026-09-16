"use client";

import React from "react";
import Link from "next/link";
import {
  Send,
  Calendar,
  Table2,
  Layers,
  Brain,
  Sun,
  Moon,
  Search,
  RefreshCw,
  Smartphone,
  Mic,
  Share2,
  Camera,
  Palette,
  Users,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Cloud,
  User,
  Shield,
  LogOut,
  ChevronDown,
  CheckCircle2
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
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-md transition-colors duration-200">
      {/* Top Banner with Pro Promotion & Classmate Sharing */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-1.5 px-4 text-center text-xs text-white flex items-center justify-center gap-2 shadow-2xs">
        <span className="text-sm">✨</span>
        <span className="font-extrabold">SyllabiQ Pro:</span>
        <span className="opacity-95 hidden sm:inline">1st Month 100% Free Trial ($5/mo after) · Unlimited Homework Photos, Cloud Papers Vault &amp; Phone Alerts</span>
        <button
          onClick={onOpenPaywallModal}
          className="ml-2 font-black bg-white text-indigo-700 px-2.5 py-0.5 rounded-full hover:bg-indigo-50 shadow-2xs cursor-pointer text-[11px]"
        >
          Try Free Trial &rarr;
        </button>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Logo with Folded Origami Paper Plane */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/25 rotate-[-8deg] group-hover:rotate-0 transition-transform">
              <Send className="h-5 w-5 fill-white stroke-none" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Syllabi<span className="text-blue-600 dark:text-blue-400">Q</span>
                </span>
                <span className="rounded-full bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  CAMPUS 2.0
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 hidden sm:block">Automate Your Study Schedule</p>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <div className="hidden xl:flex items-center space-x-2 pl-3 text-xs font-bold text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800">
            <Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Tour
            </Link>
            <span>•</span>
            <Link href="/harbour-and-main" className="hover:text-[#4E8D8F] dark:hover:text-[#DCC9A8] transition">
              Harbour &amp; Main
            </Link>
          </div>
        </div>

        {/* Action Tools Nav */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
          {/* Homework Photo Scanner */}
          <button
            onClick={onOpenHomeworkModal}
            className="flex items-center space-x-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition cursor-pointer"
            title="Snap Homework Photos (OCR Problem Extraction)"
          >
            <Camera className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden lg:inline">Snap HW</span>
          </button>

          {/* Google Cloud Paper Vault */}
          <button
            onClick={onOpenCloudVaultModal}
            className="flex items-center space-x-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition cursor-pointer"
            title="Save Papers & Work to Google Cloud Storage"
          >
            <Cloud className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline font-bold">Cloud Papers</span>
          </button>

          {/* Wallpaper / Background Customizer */}
          <button
            onClick={onOpenBackgroundModal}
            className="flex items-center space-x-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
            title="Custom Background Photos & Wallpapers"
          >
            <ImageIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xl:inline font-bold">Wallpaper</span>
          </button>

          {/* Custom Color & Emoji Studio */}
          <button
            onClick={onOpenColorModal}
            className="flex items-center space-x-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition cursor-pointer"
            title="Customize Course Colors & Emojis"
          >
            <Palette className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden lg:inline">Colors &amp; Emojis</span>
          </button>

          {/* Campus Peer Hub */}
          <button
            onClick={onOpenPeerModal}
            className="flex items-center space-x-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition cursor-pointer"
            title="Campus Peer Study Circles & Notes Sharing"
          >
            <Users className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">Peer Hub</span>
          </button>

          {/* LMS Sync */}
          <button
            onClick={onOpenLmsModal}
            className="flex items-center space-x-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Universal LMS Sync"
          >
            <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">LMS</span>
          </button>

          {/* Mobile App */}
          <button
            onClick={onOpenMobileModal}
            className="flex items-center space-x-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="View in Mobile & iPad Simulator"
          >
            <Smartphone className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
            <span className="hidden 2xl:inline">Mobile</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* LIGHT / DARK MODE TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 fill-amber-400 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 fill-slate-700 text-slate-700" />
            )}
          </button>

          {/* Pro Badge */}
          <button
            onClick={onOpenPaywallModal}
            className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 sm:px-3 py-1.5 text-xs font-black text-white shadow-xs hover:opacity-90 transition cursor-pointer"
            title="SyllabiQ Pro Subscription ($0 1st Month)"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            <span>PRO</span>
          </button>

          {/* Sync All Button */}
          <button
            onClick={onSyncAll}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 rounded-full bg-blue-600 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync"}</span>
          </button>

          {/* USER AUTH & PROFILE DROPDOWN */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                title="Account Menu"
              >
                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-sm flex items-center justify-center">
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
                className="flex items-center space-x-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 text-xs font-black shadow-xs hover:opacity-90 transition cursor-pointer"
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
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[9px] font-extrabold">
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
