"use client";

import React from "react";
import Link from "next/link";
import { Send, FileText } from "lucide-react";
import { Footer } from "@/components/footer";

export default function TermsPage() {
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
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Privacy Policy
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
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-4 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <FileText className="h-3.5 w-3.5" />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Terms of Service
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            By using SyllabiQ, you agree to these terms. Please read them carefully.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: September 21, 2026
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>By accessing or using SyllabiQ ("the Service"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the Service.</p>
              <p>These terms apply to all users, including free trial users and paid subscribers.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">2. Service Description</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>SyllabiQ is an academic planning and organization tool that helps students:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Parse syllabus documents to extract deadlines and course information</li>
                <li>Track assignments and exams in a unified dashboard</li>
                <li>Sync deadlines with Google Calendar and Google Sheets</li>
                <li>Import calendar feeds from learning management systems (Canvas, Blackboard, etc.) as one-time snapshots</li>
              </ul>
              <p className="font-bold text-slate-900 dark:text-white">SyllabiQ is strictly an organizational tool. It does not write essays, solve homework problems, complete assignments, or communicate with instructors on your behalf.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">3. User Accounts and Eligibility</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>You must be at least 13 years old to use SyllabiQ. If you are under 18, you confirm you have parental or guardian consent.</p>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
              <p>You may not use the Service for any illegal purpose or in violation of your institution's academic integrity policies.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">4. Subscription and Payments</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p><strong>Free Trial:</strong> New users receive their first month free with full access to SyllabiQ Pro features. No payment is required to start the trial.</p>
              <p><strong>Paid Subscription:</strong> After the first free month, SyllabiQ Pro costs $5.00 USD per month, billed via Stripe. Subscriptions automatically renew monthly unless cancelled.</p>
              <p><strong>Cancellation:</strong> You may cancel your subscription at any time from your account settings. Cancellations take effect at the end of the current billing period. No refunds are provided for partial months.</p>
              <p><strong>Payment Disputes:</strong> For billing questions, contact us at <a href="mailto:support@syllabiq.ca" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">support@syllabiq.ca</a>.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">5. Acceptable Use</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service to violate academic integrity policies (e.g., sharing assignment solutions, submitting work on behalf of others)</li>
                <li>Upload malicious files or attempt to disrupt the Service</li>
                <li>Reverse-engineer, decompile, or attempt to extract source code</li>
                <li>Resell or redistribute access to SyllabiQ without authorization</li>
                <li>Scrape or harvest user data from the platform</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">6. Intellectual Property</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>All content, features, and functionality of SyllabiQ (including software, design, text, graphics, and logos) are owned by Harbour & Main and protected by copyright and trademark laws.</p>
              <p>You retain ownership of any content you upload (syllabi, assignments, notes). By using the Service, you grant us a limited license to process and display your content solely to provide the Service to you.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">7. Academic Integrity and Disclaimer</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p className="font-bold text-slate-900 dark:text-white">SyllabiQ is designed to help you organize and plan your academic workload. It is not a cheating tool.</p>
              <p>You are solely responsible for ensuring your use of SyllabiQ complies with your institution's honor code and academic policies. We disclaim any liability for academic misconduct arising from misuse of the Service.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">8. Data and Privacy</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>We collect and process your data as described in our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">Privacy Policy</Link>.</p>
              <p>We use industry-standard security measures to protect your data, but we cannot guarantee absolute security. You use the Service at your own risk.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">9. Disclaimers and Limitation of Liability</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE ERROR-FREE, UNINTERRUPTED, OR SECURE.</p>
              <p>TO THE FULLEST EXTENT PERMITTED BY LAW, HARBOUR & MAIN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING MISSED DEADLINES, LOST DATA, OR ACADEMIC PENALTIES.</p>
              <p>OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE PAST 12 MONTHS (OR $5.00 USD IF GREATER).</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">10. Termination</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>You may delete your account at any time from your account settings. Upon termination, your data will be permanently deleted within 30 days.</p>
              <p>We reserve the right to suspend or terminate your account if you violate these Terms or engage in conduct that harms the Service or other users.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">11. Changes to Terms</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>We may update these Terms from time to time. We'll notify you of material changes via email or an in-app notification. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E] p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">12. Governing Law and Disputes</h2>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p>These Terms are governed by the laws of Ontario, Canada. Any disputes will be resolved in the courts of Ontario.</p>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-6 sm:p-8">
            <h2 className="text-xl font-black text-indigo-900 dark:text-indigo-100">Questions About These Terms?</h2>
            <div className="text-sm text-indigo-800 dark:text-indigo-200 space-y-3">
              <p>If you have questions or concerns about these Terms of Service, please contact us:</p>
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
