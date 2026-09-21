"use client";

import React from "react";
import Link from "next/link";
import { Send, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/25">
              <Send className="h-4 w-4 fill-white stroke-none" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Syllabi<span className="text-blue-600 dark:text-blue-400">Q</span>
            </span>
          </Link>

          <nav className="flex items-center space-x-4 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Terms of Service
            </Link>
            <Link href="/" className="rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2 text-white shadow-sm shadow-blue-500/25 transition">
              Back to Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-4 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Your Privacy Matters
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            SyllabiQ is committed to protecting your academic data and personal information. This policy explains what we collect, how we use it, and your rights.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: September 21, 2026
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Information We Collect</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p><strong>Account Information:</strong> When you register, we collect your name, email address, school affiliation (optional), major (optional), and graduation year (optional).</p>
              <p><strong>Course and Assignment Data:</strong> Syllabus files you upload, course names, assignment titles, due dates, and task status (completed/pending).</p>
              <p><strong>Calendar Integration:</strong> If you connect Google Calendar or import an iCal feed, we temporarily process calendar event data to sync deadlines. We do not store your full Google credentials.</p>
              <p><strong>Usage Analytics:</strong> We collect anonymized usage metrics (feature clicks, page views) to improve the product experience.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">How We Use Your Information</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>We use your data to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide core features (syllabus parsing, deadline tracking, calendar sync)</li>
                <li>Process subscription payments via Stripe (we do not store payment card details)</li>
                <li>Send account notifications and service announcements</li>
                <li>Improve product features and fix bugs</li>
              </ul>
              <p className="font-bold text-slate-900 dark:text-white">We never sell your data to third parties. We never share your syllabus content or assignment data with advertisers.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Third-Party Services</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p><strong>Stripe:</strong> Payment processing. Stripe handles credit card data securely; we never see your full card number.</p>
              <p><strong>Google OAuth:</strong> If you connect Google Calendar or Google Sheets, we use OAuth tokens with limited scopes. You can revoke access anytime from your Google account settings.</p>
              <p><strong>Hosting:</strong> SyllabiQ is hosted on Vercel with data stored in secure cloud infrastructure.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Data Retention and Deletion</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>We retain your account and course data as long as your account is active. If you delete your account, we permanently remove your personal data and syllabus content within 30 days.</p>
              <p>Anonymized usage analytics may be retained indefinitely for product improvement purposes.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Rights</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your data by exporting it from your account settings</li>
                <li>Correct inaccurate information in your profile</li>
                <li>Delete your account and all associated data</li>
                <li>Opt out of marketing emails (you'll still receive essential service notifications)</li>
              </ul>
              <p>For data requests or questions, email us at <a href="mailto:support@syllabiq.ca" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">support@syllabiq.ca</a>.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Academic Integrity</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p className="font-bold text-slate-900 dark:text-white">SyllabiQ is strictly an organizational and scheduling tool. We do not write essays, solve homework problems, or submit work on your behalf.</p>
              <p>All content you upload remains private and is never used to train AI models or shared with other students without your explicit consent.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Changes to This Policy</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>We may update this Privacy Policy periodically. We'll notify you of material changes via email or an in-app banner.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-6 sm:p-8">
            <h2 className="text-xl font-black text-blue-900 dark:text-blue-100">Questions or Concerns?</h2>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
              <p>If you have questions about this Privacy Policy or how we handle your data, please contact us:</p>
              <p className="font-bold">
                Email: <a href="mailto:support@syllabiq.ca" className="underline">support@syllabiq.ca</a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer
        onOpenContactModal={() => {}}
        onOpenCloudVault={() => {}}
        onOpenWallpaper={() => {}}
        onOpenCalendarSync={() => {}}
        onOpenSheetsModal={() => {}}
        onOpenHomeworkModal={() => {}}
        onOpenSettings={() => {}}
      />
    </div>
  );
}
