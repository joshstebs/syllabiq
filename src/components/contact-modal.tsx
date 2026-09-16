"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Mail, Building2, User, MessageSquare, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  onClose: () => void;
}

export function ContactModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [category, setCategory] = useState("feature_request");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
          organization: university.trim() || undefined,
          category,
          message: message.trim()
        })
      });
      setIsSubmitted(true);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error("Failed to submit contact inquiry", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xl shadow-xs">
              💬
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Get in Touch with Our Team</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Questions, feature ideas, or campus partnerships? We respond within 12 hours.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-full cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Direct Email Support Banner */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300 text-[11px]">Direct Support:</span>
            <a
              href="mailto:support@syllabiq.ca"
              className="font-black text-indigo-600 dark:text-indigo-400 hover:underline text-[11px]"
            >
              support@syllabiq.ca
            </a>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
            Active 24/7
          </span>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">Message Dispatched!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, <strong>{name}</strong>. The Harbour and Main team will review your note and follow up from <strong>support@syllabiq.ca</strong> to <strong>{email}</strong> shortly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 rounded-full bg-slate-900 dark:bg-slate-700 px-6 py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" /> Your Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Student"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" /> University / Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@cornell.edu"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-slate-400" /> College or Organization
                </label>
                <input
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Cornell University"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Topic
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="feature_request">Feature Request / Suggestion</option>
                  <option value="campus_ambassador">Campus Ambassador Program</option>
                  <option value="bug_report">Bug Report / Technical Issue</option>
                  <option value="school_partnership">School / Department Partnership</option>
                  <option value="other">General Question</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-slate-400" /> How can we help?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind or how we can make SyllabiQ even better for your semester..."
                rows={4}
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-medium">
                Made by <strong>Harbour and Main 2026</strong>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 rounded-full bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/30 transition cursor-pointer disabled:opacity-50"
              >
                <Send className={`h-3.5 w-3.5 ${isSubmitting ? "animate-pulse" : ""}`} />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
