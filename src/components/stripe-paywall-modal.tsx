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
  CheckCircle2,
  Calendar
} from "lucide-react";
import confetti from "canvas-confetti";
import { SubscriptionState } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

interface Props {
  onClose: () => void;
  onSubscriptionUpdated?: (sub: SubscriptionState) => void;
}

export function StripePaywallModal({ onClose, onSubscriptionUpdated }: Props) {
  const { user, updateUserProStatus } = useAuth();
  const [sub, setSub] = useState<SubscriptionState | null>(null);
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    setIsProcessing(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "subscribe",
          email: user?.email || "student@syllabiq.ca",
          name: user?.name || "SyllabiQ Student"
        })
      });
      const data = await res.json();
      if (res.ok && data.subscription) {
        setSub(data.subscription);
        updateUserProStatus(true);
        onSubscriptionUpdated?.(data.subscription);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        setSuccessMessage("🎉 Welcome to SyllabiQ Pro! Your first month is 100% free. All features unlocked.");
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your Pro trial?")) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" })
      });
      const data = await res.json();
      if (res.ok && data.subscription) {
        setSub(data.subscription);
        updateUserProStatus(false);
        onSubscriptionUpdated?.(data.subscription);
        setSuccessMessage("Subscription cancelled. You remain on the Free plan.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isPro = sub?.tier === "PRO";

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

          {/* Success Banner */}
          {successMessage && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 flex items-center gap-2.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
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

          {/* Stripe Card Checkout Section */}
          {!isPro ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CreditCard className="h-4 w-4 text-slate-600" />
                  <span>Stripe Secure 256-Bit Checkout</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>Encrypted</span>
                </div>
              </div>

              {/* Card Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                      placeholder="4242 •••• •••• 4242"
                    />
                    <span className="absolute right-3 top-2 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Test Card
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      Expiration (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                      placeholder="CVC"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-3 shadow-md shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="h-4 w-4 fill-white" />
                <span>
                  {isProcessing ? "Processing via Stripe..." : "Start First Free Month ($0.00 Today)"}
                </span>
              </button>

              <p className="text-[10px] text-center text-slate-400 font-medium">
                By starting, you agree to $5/month after your first free month unless cancelled. Cancel anytime in 1 click from your settings.
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
                      {sub?.trialDaysRemaining || 30} days remaining in your free trial.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 transition cursor-pointer"
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
