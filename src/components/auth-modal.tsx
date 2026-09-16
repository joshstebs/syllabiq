"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  User,
  Zap,
  Globe,
  Key,
  Copy,
  Check
} from "lucide-react";
import { useAuth, ADMIN_USER, TESTER_USER } from "@/lib/auth-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminPanel?: () => void;
}

export function AuthModal({ isOpen, onClose, onOpenAdminPanel }: Props) {
  const {
    loginWithCredentials,
    loginWithGoogle,
    loginWithAdminPreset,
    loginWithTesterPreset,
    loginWithNetID
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"PRESETS" | "EMAIL" | "SSO">("PRESETS");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState("");

  if (!isOpen) return null;

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const success = loginWithCredentials(email, password);
    if (success) {
      setSuccessNotice(`Signed in successfully as ${email}!`);
      setTimeout(() => {
        onClose();
        setSuccessNotice("");
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Syllabi<span className="text-blue-600 dark:text-blue-400">Q</span> Access Portal
                </h3>
                <span className="rounded-full bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Secure Sign In
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Admin, Tester, and Student Single Sign-On.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("PRESETS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "PRESETS"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            ⚡ Fast 1-Click Login
          </button>
          <button
            onClick={() => setActiveTab("EMAIL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "EMAIL"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            ✉️ Email &amp; Password
          </button>
          <button
            onClick={() => setActiveTab("SSO")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === "SSO"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            🌐 Google &amp; NetID
          </button>
        </div>

        {/* Success Banner */}
        {successNotice && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* TAB 1: 1-CLICK PRESETS (ADMIN & TESTER) */}
          {activeTab === "PRESETS" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Choose a pre-configured account to test immediately with full privileges:
              </div>

              {/* Admin Card */}
              <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/70 bg-indigo-50/50 dark:bg-indigo-950/30 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-xs">
                      👨‍💼
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          Admin Account
                        </h4>
                        <span className="rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-[10px] font-black px-2 py-0.5">
                          SUPERUSER
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Josh Stebs · Full diagnostics, Stripe customer verification &amp; settings
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">admin@syllabiq.app</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">AdminPassword2026!</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      loginWithAdminPreset();
                      setSuccessNotice("Signed in as Admin (Josh Stebs)!");
                      setTimeout(() => {
                        onClose();
                        setSuccessNotice("");
                      }, 700);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>⚡ Sign in as Admin</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy("admin@syllabiq.app / AdminPassword2026!", "admin")}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                    title="Copy Credentials"
                  >
                    {copiedKey === "admin" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Tester Card */}
              <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs">
                      🧑‍🎓
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          Tester Account
                        </h4>
                        <span className="rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[10px] font-black px-2 py-0.5">
                          BETA TESTER
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Alex Cornell · Preloaded with 4 Ivy League Syllabi &amp; 30-day Free Trial
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-2.5 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">tester@syllabiq.app</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">TesterPassword2026!</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      loginWithTesterPreset();
                      setSuccessNotice("Signed in as Tester (Alex Cornell)!");
                      setTimeout(() => {
                        onClose();
                        setSuccessNotice("");
                      }, 700);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>🧪 Sign in as Tester</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy("tester@syllabiq.app / TesterPassword2026!", "tester")}
                    className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
                    title="Copy Credentials"
                  >
                    {copiedKey === "tester" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL FORM */}
          {activeTab === "EMAIL" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Stay logged in</span>
                </label>
                <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Sign In or Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                New accounts automatically receive a 30-day Free Trial of SyllabiQ Pro ($5/month after).
              </p>
            </form>
          )}

          {/* TAB 3: SOCIAL & SSO */}
          {activeTab === "SSO" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Authenticate with your verified student or developer provider:
              </div>

              {/* Live Google OAuth Consent Flow */}
              <button
                onClick={() => {
                  loginWithGoogle(undefined, undefined, true);
                }}
                className="w-full py-3 px-4 rounded-2xl border-2 border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/40 hover:bg-blue-50 dark:hover:bg-blue-950/70 text-xs font-black text-blue-900 dark:text-blue-200 shadow-xs transition flex items-center justify-center space-x-3 cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google (Live OAuth2 Screen)</span>
                <ArrowRight className="h-3.5 w-3.5 ml-auto text-blue-600" />
              </button>

              {/* Fast Simulated Google Button */}
              <button
                onClick={() => {
                  loginWithGoogle("josh.stebs@gmail.com", "Josh Stebs (Google)");
                  setSuccessNotice("Authenticated as Josh Stebs (Google Account)!");
                  setTimeout(() => {
                    onClose();
                    setSuccessNotice("");
                  }, 800);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>⚡ Instant Google 1-Click (josh.stebs@gmail.com)</span>
              </button>

              {/* Apple Button */}
              <button
                onClick={() => {
                  loginWithCredentials("josh.stebs@apple.com", "");
                  setSuccessNotice("Signed in with Apple ID!");
                  setTimeout(() => {
                    onClose();
                    setSuccessNotice("");
                  }, 800);
                }}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-2xs transition flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span> Sign in with Apple</span>
              </button>

              {/* Cornell NetID */}
              <button
                onClick={() => {
                  loginWithNetID("js3294");
                  setSuccessNotice("Authenticated via Cornell NetID (js3294@cornell.edu)!");
                  setTimeout(() => {
                    onClose();
                    setSuccessNotice("");
                  }, 800);
                }}
                className="w-full py-3 px-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-xs font-bold text-red-900 dark:text-red-200 shadow-2xs transition flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span>🏛️ Cornell University NetID Single Sign-On</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
