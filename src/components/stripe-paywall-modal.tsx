"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Lock,
  Camera,
  Smartphone,
  Palette,
  Users,
  CheckCircle2
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "@/lib/auth-context";

interface BillingState {
  tier: string;
  status: string;
  isPro?: boolean;
  trialEndsAt?: string | null;
  currentPeriodEnd?: string | null;
  monthlyPrice?: number;
}

interface Props {
  onClose: () => void;
  onOpenAuthModal?: () => void;
  onSubscriptionUpdated?: (sub: BillingState) => void;
  notice?: string;
}

function trialDaysLeft(trialEndsAt?: string | null): number | null {
  if (!trialEndsAt) return null;
  const ms = new Date(trialEndsAt).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86400000));
}

export function StripePaywallModal({ onClose, onOpenAuthModal, onSubscriptionUpdated, notice }: Props) {
  const { user, updateUserProStatus } = useAuth();
  const [sub, setSub] = useState<BillingState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isGuest = !user || user.id === "guest-visitor";

  const fetchSub = async () => {
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setSub(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSub();
  }, []);

  const handleSubscribe = async () => {
    // Checkout is per-user: guests sign in first.
    if (isGuest) {
      onOpenAuthModal?.();
      return;
    }
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "subscribe" })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        // Hand off to Stripe-hosted secure checkout. Stripe redirects back
        // to /?checkout=success&session_id=... when done.
        window.location.assign(data.url);
        return;
      }
      setErrorMessage(data.error || "Couldn't start checkout. Please try again.");
    } catch (err) {
      console.error(err);
      setErrorMessage("Couldn't start checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageBilling = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setErrorMessage(data.error || "Couldn't open the billing portal.");
    } catch (err) {
      console.error(err);
      setErrorMessage("Couldn't open the billing portal.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel your Pro subscription? You'll keep Pro until the end of your billing period, then it won't renew.")) return;
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.subscription) {
        setSub(data.subscription);
        updateUserProStatus(data.subscription.isPro ?? data.subscription.tier === "PRO");
        onSubscriptionUpdated?.(data.subscription);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
        setSuccessMessage("Cancelled. You keep Pro until the end of your billing period.");
      } else {
        setErrorMessage(data.error || "Couldn't cancel. Try the billing portal instead.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Couldn't cancel. Try the billing portal instead.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isPro = sub?.isPro ?? sub?.tier === "PRO";
  const daysLeft = trialDaysLeft(sub?.trialEndsAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Ambient glow header */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-6">
          {/* Header Title & Pricing Hero */}
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>1st Month 100% Free · $5 / Month After</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Unlock Unlimited SyllabiQ Pro
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Everything you need to master your semester: unlimited homework photos, phone push notifications, custom colors, and campus study circle sharing.
            </p>
          </div>

          {/* Pricing Highlight Pill */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-black uppercase tracking-wider text-blue-700">
                Current Promotion
              </div>
              <div className="text-base sm:text-lg font-black text-slate-900">
                First month free, then $5/mo
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                No commitment. Cancel anytime in 1 click.
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-blue-600">
                $0<span className="text-xs text-slate-500 font-semibold">.00</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Due Today
              </div>
            </div>
          </div>

          {/* Success / Error / Notice Banners */}
          {notice && (
            <div className="rounded-xl border border-blue-300 bg-blue-50 p-3.5 flex items-center gap-2.5 text-xs font-bold text-blue-800">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
              <span>{notice}</span>
            </div>
          )}
          {successMessage && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3.5 flex items-center gap-2.5 text-xs font-bold text-rose-800">
              <X className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Features Comparison Matrix */}
          <div className="space-y-2.5 text-xs">
            <div className="grid grid-cols-12 font-bold text-slate-400 uppercase text-[10px] pb-1 border-b border-slate-100 px-2">
              <div className="col-span-8">Features</div>
              <div className="col-span-2 text-center">Starter / Trial</div>
              <div className="col-span-2 text-center text-blue-600 font-black">Pro</div>
            </div>

            <div className="grid grid-cols-12 items-center py-2 px-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
              <div className="col-span-8 flex items-center gap-2">
                <Camera className="h-3.5 w-3.5 text-indigo-500" />
                <span>Homework Photos &amp; Worksheet OCR</span>
              </div>
              <div className="col-span-2 text-center text-slate-400 font-semibold">3 / month</div>
              <div className="col-span-2 text-center text-blue-600 font-black">Unlimited</div>
            </div>

            <div className="grid grid-cols-12 items-center py-2 px-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
              <div className="col-span-8 flex items-center gap-2">
                <Smartphone className="h-3.5 w-3.5 text-blue-500" />
                <span>Phone SMS &amp; Mobile Push Alerts</span>
              </div>
              <div className="col-span-2 text-center text-slate-400">—</div>
              <div className="col-span-2 text-center text-blue-600 font-black">Instant</div>
            </div>

            <div className="grid grid-cols-12 items-center py-2 px-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
              <div className="col-span-8 flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-purple-500" />
                <span>Custom Course &amp; Task Color Palette</span>
              </div>
              <div className="col-span-2 text-center text-slate-400 font-semibold">Default</div>
              <div className="col-span-2 text-center text-blue-600 font-black">Full Studio</div>
            </div>

            <div className="grid grid-cols-12 items-center py-2 px-2 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
              <div className="col-span-8 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-emerald-500" />
                <span>Campus Peer Hub &amp; Shared Homework Notes</span>
              </div>
              <div className="col-span-2 text-center text-slate-400 font-semibold">Read Only</div>
              <div className="col-span-2 text-center text-blue-600 font-black">Unlimited</div>
            </div>
          </div>

          {/* Checkout Section */}
          {!isPro ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CreditCard className="h-4 w-4 text-slate-600" />
                  <span>Secure checkout via Stripe</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>Encrypted</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Your first month is free, then $5/month. Your card is collected securely by
                Stripe and <span className="font-bold text-slate-800">won&apos;t be charged until your 30-day trial ends</span>.
                Cancel anytime in 1 click.
              </p>

              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-3 shadow-md shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="h-4 w-4 fill-white" />
                <span>
                  {isProcessing
                    ? "Redirecting to Stripe…"
                    : isGuest
                      ? "Sign In to Start Your Free Month"
                      : "Start First Free Month ($0.00 Today)"}
                </span>
              </button>

              <p className="text-[10px] text-center text-slate-400 font-medium">
                By starting, you agree to $5/month after your first free month unless cancelled. Cancel anytime in 1 click from your settings or the billing portal.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-900">
                      You are on SyllabiQ Pro
                    </h4>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      {daysLeft !== null
                        ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining in your free trial.`
                        : "Your Pro subscription is active."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleManageBilling}
                  disabled={isProcessing}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? "Opening…" : "Manage Billing"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          )}

          {/* Footer Security Badges */}
          <div className="flex items-center justify-center gap-5 text-[11px] font-bold text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Stripe Verified
            </span>
            <span>•</span>
            <span>Cancel Anytime</span>
            <span>•</span>
            <span>Try It Free Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
