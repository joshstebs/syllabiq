"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, ChevronDown, ChevronUp, Sparkles, HelpCircle, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { ContactModal } from "@/components/contact-modal";

export default function FAQPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showContactModal, setShowContactModal] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const FAQS = [
    {
      q: "What syllabus file formats does SyllabiQ support?",
      a: "SyllabiQ accepts PDF files (.pdf), Microsoft Word documents (.docx), plain text (.txt), Markdown (.md), and photo scans / phone screenshots (JPEG, PNG, HEIC). Our multimodal parser accurately identifies tabular grading breakdowns, weekly schedules, and policies."
    },
    {
      q: "How does the Google Cloud Storage (GCS) Paper Vault work?",
      a: "The Google Cloud Vault securely backs up your term papers, lab reports, homework drafts, and cheat sheets to enterprise Google Cloud Storage with 99.999999999% durability. You get versioning (v1.0 Draft to v2.0 Final), AI-generated abstracts, and 1-click links to open Word or text files directly in Google Docs."
    },
    {
      q: "Is SyllabiQ 100% compliant with my university's Academic Integrity Code?",
      a: "Yes, 100%. SyllabiQ does NOT write papers, solve exam problems, or provide ghostwriting services. In the Campus Peer Hub, shared hints are strictly conceptual and moderated. Our tool is purely an academic organization and scheduling assistant."
    },
    {
      q: "How does the $5/month subscription and 1st Month Free Trial work?",
      a: "You get full SyllabiQ Pro access 100% free for your first 30 days! After 30 days, Pro is just $5.00/month (billed securely through Stripe). You can cancel at any time with a single click in your settings with no hidden fees or commitments."
    },
    {
      q: "How does Google Calendar and Google Sheets sync work?",
      a: "SyllabiQ creates dedicated sub-calendars for each course with custom color coding and emojis. Any deadline added or edited in SyllabiQ immediately syncs to your Google Calendar on your phone. You can also export a live master tracker to Google Sheets."
    },
    {
      q: "Can I customize the background wallpaper and toggle dark mode?",
      a: "Yes! Use the theme toggle button in the top navbar to switch between crisp light mode and midnight dark mode. You can also click 'Wallpaper' to select from 10 aesthetic academic presets or upload your own custom photo with live blur and opacity controls."
    },
    {
      q: "Can I connect my Canvas or Blackboard account?",
      a: "Yes! Click the 'LMS' button in the navigation bar to connect Canvas LMS, Blackboard Learn, Brightspace D2L, or Moodle via API token or calendar feed URL to automatically pull all upcoming assignment due dates."
    },
    {
      q: "Who built SyllabiQ?",
      a: "SyllabiQ is engineered and maintained by Harbour and Main (2026). Our mission is to build beautiful, fast, student-first productivity software."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col transition-colors duration-200">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/25 rotate-[-8deg] group-hover:rotate-0 transition-transform">
              <Send className="h-5 w-5 fill-white stroke-none" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Syllabi<span className="text-blue-600 dark:text-blue-400">Q</span>
              </span>
              <span className="ml-2 rounded-full bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Q&amp;A &amp; FAQ
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/features"
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600"
            >
              All Features &rarr;
            </Link>
            <Link
              href="/"
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-extrabold text-white shadow-sm shadow-blue-500/25 transition"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-4 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions? We&apos;ve Got Answers</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Everything you need to know about syllabi parsing, cloud storage, privacy, and subscriptions.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="paper-card overflow-hidden border border-slate-200 dark:border-slate-800 transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/40 rounded-3xl border border-indigo-200 dark:border-indigo-800 text-center space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Still have a question?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Our engineering team at Harbour and Main is always happy to help. Email us anytime at{" "}
            <a href="mailto:support@syllabiq.ca" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              support@syllabiq.ca
            </a>{" "}
            or send a message below.
          </p>
          <button
            onClick={() => setShowContactModal(true)}
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-6 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
          >
            Contact Harbour and Main &rarr;
          </button>
        </div>
      </main>

      <Footer onOpenContactModal={() => setShowContactModal(true)} />
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}
