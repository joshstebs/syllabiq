"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  ArrowRight,
  Sparkles,
  Monitor,
  TrendingUp,
  MapPin,
  Users,
  Copy,
  Check,
  CheckCircle2,
  Mail,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import confetti from "canvas-confetti";
import { HarbourMainLogo } from "@/components/harbour-main-logo";
import { Footer } from "@/components/footer";
import { ContactModal } from "@/components/contact-modal";

export default function HarbourAndMainBrandingPage() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim() || undefined,
          category: "harbour_and_main_inquiry",
          message: message.trim()
        })
      });
      setSubmitted(true);
      confetti({ particleCount: 70, spread: 60 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const BRAND_COLORS = [
    {
      name: "Deep Navy",
      hex: "#0E2F49",
      bgClass: "bg-[#0E2F49]",
      textClass: "text-white",
      description: "Primary foundation color signifying strength, trust, and timeless maritime dependability."
    },
    {
      name: "Coastal Teal",
      hex: "#4E8D8F",
      bgClass: "bg-[#4E8D8F]",
      textClass: "text-white",
      description: "Signature accent color embodying Atlantic tides, fresh energy, and modern digital craft."
    },
    {
      name: "Sand",
      hex: "#DCC9A8",
      bgClass: "bg-[#DCC9A8]",
      textClass: "text-slate-900",
      description: "Warm coastal sun tone representing natural warmth, community optimism, and welcoming clarity."
    },
    {
      name: "Warm Off-White",
      hex: "#F8F6F2",
      bgClass: "bg-[#F8F6F2]",
      textClass: "text-slate-900 border border-slate-300",
      description: "Clean canvas background reflecting tactile paper, morning coastal light, and effortless reading."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] dark:bg-[#0B0F19] text-[#0E2F49] dark:text-[#F8FAFC] flex flex-col selection:bg-[#DCC9A8] selection:text-[#0E2F49] transition-colors duration-200">
      {/* Top Banner with Motto */}
      <div className="bg-[#0E2F49] text-white py-2 px-4 text-center text-xs tracking-widest uppercase font-extrabold flex items-center justify-center space-x-2 border-b border-[#0E2F49]/40">
        <span className="text-[#DCC9A8]">●</span>
        <span>Local Businesses. Brighter Tomorrows.</span>
        <span className="text-[#DCC9A8]">●</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-[#F8F6F2]/90 dark:bg-[#0E1526]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <ArrowLeft className="h-4 w-4 text-[#4E8D8F] group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Back to SyllabiQ</span>
          </Link>

          {/* Logo Mark */}
          <div className="flex items-center">
            <HarbourMainLogo variant="horizontal" size="sm" showTagline={false} />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowContactModal(true)}
              className="rounded-full bg-[#0E2F49] dark:bg-white text-white dark:text-[#0E2F49] hover:bg-[#4E8D8F] dark:hover:bg-slate-200 px-5 py-2 text-xs font-black transition cursor-pointer shadow-xs"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20 w-full">
        {/* Brand Hero Box */}
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Large Primary Brand Lockup */}
          <div className="bg-white dark:bg-[#131B2E] p-8 sm:p-14 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex justify-center">
              <HarbourMainLogo variant="horizontal" size="xl" showTagline={true} />
            </div>

            <div className="h-[1px] w-24 bg-[#4E8D8F]/30 mx-auto" />

            <h1 className="text-2xl sm:text-4xl font-black text-[#0E2F49] dark:text-white tracking-tight">
              Websites built to bring local businesses more business.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              At Harbour &amp; Main, we craft ultra-high-performance web software, community-focused applications, and bespoke digital experiences designed to empower local economies and students for brighter tomorrows.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowContactModal(true)}
                className="rounded-full bg-[#0E2F49] hover:bg-[#4E8D8F] dark:bg-white dark:text-[#0E2F49] px-7 py-3 text-xs font-black text-white shadow-md transition cursor-pointer"
              >
                Work With Harbour &amp; Main &rarr;
              </button>
              <Link
                href="/"
                className="rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-7 py-3 text-xs font-black text-[#0E2F49] dark:text-white transition cursor-pointer"
              >
                Launch SyllabiQ Platform
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: OFFICIAL BRAND IDENTITY & LOGO VARIATIONS */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#4E8D8F]">
              Visual Identity &amp; System
            </span>
            <h2 className="text-3xl font-black text-[#0E2F49] dark:text-white">
              Logo Suite &amp; Marks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium">
              A distinctive maritime monogram where the coastal teal wave connects the &ldquo;H&rdquo; and &ldquo;M&rdquo; beneath the golden morning sun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Variation 1: Stacked Logo */}
            <div className="bg-white dark:bg-[#131B2E] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm flex flex-col items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Stacked Logo
              </span>
              <div className="py-6">
                <HarbourMainLogo variant="stacked" size="lg" showTagline={true} />
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Primary editorial &amp; print mark
              </span>
            </div>

            {/* Variation 2: Standalone Monogram / Icon */}
            <div className="bg-white dark:bg-[#131B2E] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm flex flex-col items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Icon / Monogram
              </span>
              <div className="py-6 flex justify-center">
                <HarbourMainLogo variant="icon" size="xl" />
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Favicon, app icon &amp; avatar
              </span>
            </div>

            {/* Variation 3: Coastal Ridge Motto */}
            <div className="bg-white dark:bg-[#131B2E] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm flex flex-col items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Brand Horizon
              </span>
              <div className="py-4 space-y-3">
                <div className="text-xs font-black tracking-widest text-[#0E2F49] dark:text-white uppercase">
                  Good Businesses Belong Here.
                </div>
                {/* Coastal Ridge Silhouette Vector */}
                <svg
                  viewBox="0 0 200 40"
                  fill="none"
                  className="w-full max-w-[200px] mx-auto text-[#4E8D8F]/60 dark:text-[#4E8D8F]/40"
                >
                  <path
                    d="M0 35C30 30 60 15 90 22C120 28 150 18 200 35V40H0V35Z"
                    fill="currentColor"
                  />
                  <path
                    d="M0 37C40 33 70 25 110 28C150 32 175 22 200 37V40H0V37Z"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />
                </svg>
                <div className="text-[10px] font-extrabold tracking-widest text-[#4E8D8F] uppercase">
                  A Stronger Local Tomorrow.
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Brand ethos seal
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: OFFICIAL COLOUR PALETTE */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#4E8D8F]">
              Specification
            </span>
            <h2 className="text-3xl font-black text-[#0E2F49] dark:text-white">
              Official Colour Palette
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any color swatch to copy its exact hex code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BRAND_COLORS.map((col) => {
              const isCopied = copiedHex === col.hex;
              return (
                <div
                  key={col.hex}
                  onClick={() => handleCopyHex(col.hex)}
                  className="bg-white dark:bg-[#131B2E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
                >
                  <div className={`h-28 w-full ${col.bgClass} flex items-end justify-end p-3 relative`}>
                    <div className="bg-black/40 text-white rounded-lg px-2.5 py-1 text-xs font-mono font-bold flex items-center space-x-1.5 backdrop-blur-xs">
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-300" />
                          <span className="text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 opacity-70 group-hover:opacity-100" />
                          <span>{col.hex}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <h3 className="text-sm font-black text-[#0E2F49] dark:text-white">
                      {col.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {col.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: THE FOUR CORE PILLARS */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#4E8D8F]">
              Mission &amp; Values
            </span>
            <h2 className="text-3xl font-black text-[#0E2F49] dark:text-white">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Websites */}
            <div className="bg-white dark:bg-[#131B2E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="h-12 w-12 rounded-2xl bg-[#0E2F49]/10 dark:bg-white/10 text-[#0E2F49] dark:text-[#4E8D8F] flex items-center justify-center text-xl">
                <Monitor className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-[#0E2F49] dark:text-white uppercase tracking-wider text-xs">
                1. Websites
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                High-performance, beautifully engineered websites and web applications built from scratch with modern technology. No cookie-cutter templates.
              </p>
            </div>

            {/* Pillar 2: Growth */}
            <div className="bg-white dark:bg-[#131B2E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="h-12 w-12 rounded-2xl bg-[#4E8D8F]/15 text-[#4E8D8F] flex items-center justify-center text-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-[#0E2F49] dark:text-white uppercase tracking-wider text-xs">
                2. Growth
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Every line of code is designed to drive measurable results, customer engagement, and long-term vitality for the businesses we serve.
              </p>
            </div>

            {/* Pillar 3: Local Focus */}
            <div className="bg-white dark:bg-[#131B2E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="h-12 w-12 rounded-2xl bg-[#DCC9A8]/30 text-[#0E2F49] dark:text-[#DCC9A8] flex items-center justify-center text-xl">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-[#0E2F49] dark:text-white uppercase tracking-wider text-xs">
                3. Local Focus
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                We believe the heart of every great economy is its local businesses, university towns, and hardworking community leaders.
              </p>
            </div>

            {/* Pillar 4: Real People */}
            <div className="bg-white dark:bg-[#131B2E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="h-12 w-12 rounded-2xl bg-[#0E2F49]/10 text-[#0E2F49] dark:text-white flex items-center justify-center text-xl">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-[#0E2F49] dark:text-white uppercase tracking-wider text-xs">
                4. Real People
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Direct access to the creators building your product. Transparent communication, honest timelines, and lifelong relationships.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: FLAGSHIP PRODUCT SHOWCASE */}
        <section className="bg-gradient-to-tr from-[#0E2F49] via-[#103859] to-[#0E2F49] text-white p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#4E8D8F]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="rounded-full bg-[#4E8D8F]/30 border border-[#4E8D8F]/50 px-3 py-1 text-[10px] font-extrabold text-[#DCC9A8] uppercase tracking-wider">
              Flagship Software Product
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              SyllabiQ by Harbour &amp; Main
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              SyllabiQ is our premier academic productivity operating system designed for college and graduate students. By synthesizing multimodal AI syllabus parsing, two-way Google Calendar/Sheets synchronization, and Google Cloud Storage document vaults, SyllabiQ ensures no student ever misses a deadline.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/"
                className="rounded-full bg-[#4E8D8F] hover:bg-[#3d7375] text-white px-6 py-2.5 text-xs font-black shadow-sm transition"
              >
                Launch SyllabiQ App &rarr;
              </Link>
              <Link
                href="/features"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 text-xs font-black transition"
              >
                View Features &amp; Tour
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6: DIRECT CONTACT WITH HARBOUR & MAIN */}
        <section className="bg-white dark:bg-[#131B2E] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 max-w-3xl mx-auto shadow-sm">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#4E8D8F]">
              Inquiries &amp; Partnerships
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0E2F49] dark:text-white">
              Connect With Harbour &amp; Main
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Have a web project, business partnership, or campus software initiative? Let&apos;s build something exceptional together.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="h-14 w-14 rounded-full bg-[#4E8D8F]/20 text-[#4E8D8F] flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-black text-[#0E2F49] dark:text-white">Message Dispatched</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>. The Harbour &amp; Main team will review your inquiry and reach out at <strong>{email}</strong> shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#0E2F49] dark:text-slate-300">
                    Your Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="w-full bg-[#F8F6F2] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#0E2F49] dark:text-white font-medium focus:outline-none focus:border-[#4E8D8F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#0E2F49] dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                    className="w-full bg-[#F8F6F2] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#0E2F49] dark:text-white font-medium focus:outline-none focus:border-[#4E8D8F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#0E2F49] dark:text-slate-300">
                  Business, School, or Organization
                </label>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Main Street Bakery / Cornell University"
                  className="w-full bg-[#F8F6F2] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-[#0E2F49] dark:text-white font-medium focus:outline-none focus:border-[#4E8D8F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#0E2F49] dark:text-slate-300">
                  Project Details or Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about what you're looking to build or how we can collaborate..."
                  rows={4}
                  required
                  className="w-full bg-[#F8F6F2] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-[#0E2F49] dark:text-white font-medium focus:outline-none focus:border-[#4E8D8F] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  We reply within 12 business hours.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 rounded-full bg-[#0E2F49] hover:bg-[#4E8D8F] dark:bg-white dark:text-[#0E2F49] dark:hover:bg-slate-200 px-6 py-2.5 text-xs font-black text-white shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  <Send className={`h-3.5 w-3.5 ${isSubmitting ? "animate-pulse" : ""}`} />
                  <span>{isSubmitting ? "Dispatching..." : "Send to Harbour & Main"}</span>
                </button>
              </div>
            </form>
          )}
        </section>

        {/* BOTTOM MOTTO */}
        <section className="text-center py-8 space-y-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
            Websites for the businesses that make our communities stronger.
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            © 2026 Harbour &amp; Main · All Rights Reserved
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenContactModal={() => setShowContactModal(true)} />
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}
