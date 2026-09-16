"use client";

import React from "react";
import Link from "next/link";
import { Send, Heart, Mail, Sparkles, ShieldCheck, ExternalLink, Globe } from "lucide-react";
import { HarbourMainLogo } from "./harbour-main-logo";

interface Props {
  onOpenContactModal: () => void;
  onOpenCloudVault?: () => void;
  onOpenWallpaper?: () => void;
  onOpenCalendarSync?: () => void;
  onOpenSheetsModal?: () => void;
  onOpenHomeworkModal?: () => void;
  onOpenSettings?: () => void;
}

export function Footer({
  onOpenContactModal,
  onOpenCloudVault,
  onOpenWallpaper,
  onOpenCalendarSync,
  onOpenSheetsModal,
  onOpenHomeworkModal,
  onOpenSettings
}: Props) {
  return (
    <footer className="relative z-10 w-full border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0E1526]/90 backdrop-blur-md transition-colors duration-200 text-slate-600 dark:text-slate-400 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-36 sm:pb-20 space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: SyllabiQ Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/25">
                <Send className="h-4 w-4 fill-white stroke-none" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Syllabi<span className="text-blue-600 dark:text-blue-400">Q</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The high-performance academic productivity operating system. Ingests syllabi, builds automated schedules, syncs to Google Calendar &amp; Sheets, and safeguards student success.
            </p>

            <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Academic Integrity Protected</span>
            </div>
          </div>

          {/* Col 2: Product & Features */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Explore Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                >
                  Features &amp; Functionality &rarr;
                </Link>
              </li>
              <li>
                <Link
                  href="/features#gallery"
                  className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                >
                  Pictures &amp; App Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/who-its-for"
                  className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                >
                  Who It&apos;s For (Majors &amp; Students)
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                >
                  Q&amp;A &amp; Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Cloud & Wallpapers */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Cloud &amp; Customization
            </h4>
            <ul className="space-y-2.5">
              {onOpenCloudVault && (
                <li>
                  <button
                    onClick={onOpenCloudVault}
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Google Cloud Papers Vault</span>
                  </button>
                </li>
              )}
              {onOpenWallpaper && (
                <li>
                  <button
                    onClick={onOpenWallpaper}
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Custom Background Wallpapers</span>
                  </button>
                </li>
              )}
              <li>
                {onOpenCalendarSync ? (
                  <button
                    onClick={onOpenCalendarSync}
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-left cursor-pointer flex items-center gap-2 group"
                  >
                    <span>Google Calendar 2-Way Sync</span>
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.2 rounded group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
                      LIVE
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/#schedule"
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-left cursor-pointer flex items-center gap-2"
                  >
                    <span>Google Calendar 2-Way Sync</span>
                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.2 rounded">
                      LIVE
                    </span>
                  </Link>
                )}
              </li>
              <li>
                {onOpenSheetsModal ? (
                  <button
                    onClick={onOpenSheetsModal}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition text-left cursor-pointer flex items-center gap-2 group"
                  >
                    <span>Google Sheets Tracker</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900 transition-colors">
                      NEW
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/#schedule"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition text-left cursor-pointer flex items-center gap-2"
                  >
                    <span>Google Sheets Tracker</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                      NEW
                    </span>
                  </Link>
                )}
              </li>
              <li>
                {onOpenHomeworkModal ? (
                  <button
                    onClick={onOpenHomeworkModal}
                    className="hover:text-purple-600 dark:hover:text-purple-400 font-medium transition text-left cursor-pointer flex items-center gap-2 group"
                  >
                    <span>Vision OCR Homework Scanner</span>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-1.5 py-0.2 rounded group-hover:bg-purple-200 dark:group-hover:bg-purple-900 transition-colors">
                      AI
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/#schedule"
                    className="hover:text-purple-600 dark:hover:text-purple-400 font-medium transition text-left cursor-pointer flex items-center gap-2"
                  >
                    <span>Vision OCR Homework Scanner</span>
                    <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-1.5 py-0.2 rounded">
                      AI
                    </span>
                  </Link>
                )}
              </li>
              {onOpenSettings && (
                <li>
                  <button
                    onClick={onOpenSettings}
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>App Settings (Profile &amp; Timezone)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Contact & Company */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Support &amp; Inquiries
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Have questions, feedback, or want to partner on your campus?
            </p>

            <div className="space-y-2">
              <a
                href="mailto:support@syllabiq.ca"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>support@syllabiq.ca</span>
              </a>

              <div>
                <button
                  onClick={onOpenContactModal}
                  className="inline-flex items-center space-x-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/25 transition cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Contact Us</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Harbour and Main Company Logo */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Harbour & Main Official Logo Lockup */}
          <Link
            href="/harbour-and-main"
            className="flex items-center space-x-3 group hover:opacity-90 transition cursor-pointer"
            title="Visit Harbour & Main Official Branding Page"
          >
            <div className="bg-white dark:bg-[#131B2E] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs group-hover:border-[#4E8D8F] transition">
              <HarbourMainLogo variant="horizontal" size="sm" showTagline={false} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#4E8D8F]">
                  Est. 2026
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  · Websites for local businesses
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Made by Harbour &amp; Main 2026 &rarr;
              </p>
            </div>
          </Link>

          {/* Quick legal/contact links with large touch tap targets */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Link
              href="/harbour-and-main"
              className="hover:text-[#4E8D8F] dark:hover:text-[#DCC9A8] font-black py-2 px-1 transition text-[#0E2F49] dark:text-white"
            >
              Harbour &amp; Main
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={onOpenContactModal}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 py-2 px-1 cursor-pointer transition underline font-bold"
            >
              Contact Us
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/features"
              className="hover:text-slate-900 dark:hover:text-white py-2 px-1 transition"
            >
              Features
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/who-its-for"
              className="hover:text-slate-900 dark:hover:text-white py-2 px-1 transition"
            >
              Who It&apos;s For
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/faq"
              className="hover:text-blue-600 dark:hover:text-blue-400 font-black py-2 px-1 transition text-blue-700 dark:text-blue-400"
            >
              Q&amp;A (FAQs)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
