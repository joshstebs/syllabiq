"use client";

import React from "react";
import Link from "next/link";
import { Send, Heart, Mail, Sparkles, ShieldCheck, ExternalLink, Globe } from "lucide-react";
import { HarbourMainLogo } from "./harbour-main-logo";

interface Props {
  onOpenContactModal: () => void;
  onOpenCloudVault?: () => void;
  onOpenWallpaper?: () => void;
}

export function Footer({
  onOpenContactModal,
  onOpenCloudVault,
  onOpenWallpaper
}: Props) {
  return (
    <footer className="relative z-10 w-full border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0E1526]/90 backdrop-blur-md transition-colors duration-200 text-slate-600 dark:text-slate-400 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
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
            <ul className="space-y-2">
              {onOpenCloudVault && (
                <li>
                  <button
                    onClick={onOpenCloudVault}
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-left cursor-pointer"
                  >
                    Google Cloud Papers Vault
                  </button>
                </li>
              )}
              {onOpenWallpaper && (
                <li>
                  <button
                    onClick={onOpenWallpaper}
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition text-left cursor-pointer"
                  >
                    Custom Background Wallpapers
                  </button>
                </li>
              )}
              <li>
                <span className="text-slate-400">Google Calendar 2-Way Sync</span>
              </li>
              <li>
                <span className="text-slate-400">Google Sheets Tracker</span>
              </li>
              <li>
                <span className="text-slate-400">Vision OCR Homework Scanner</span>
              </li>
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

            <button
              onClick={onOpenContactModal}
              className="inline-flex items-center space-x-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/25 transition cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar with Harbour and Main Company Logo */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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

          {/* Quick legal/contact links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/harbour-and-main"
              className="hover:text-[#4E8D8F] dark:hover:text-[#DCC9A8] font-black transition text-[#0E2F49] dark:text-white"
            >
              Harbour &amp; Main
            </Link>
            <span>•</span>
            <button
              onClick={onOpenContactModal}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 underline font-bold cursor-pointer"
            >
              Contact Us
            </button>
            <span>•</span>
            <Link href="/features" className="hover:text-slate-900 dark:hover:text-white">
              Features
            </Link>
            <span>•</span>
            <Link href="/who-its-for" className="hover:text-slate-900 dark:hover:text-white">
              Who It&apos;s For
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-slate-900 dark:hover:text-white">
              Q&amp;A
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
