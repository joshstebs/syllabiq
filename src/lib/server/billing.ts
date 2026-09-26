import Stripe from "stripe";
import type { User } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Per-user Stripe billing helpers.
 *
 * Pro status is derived ONLY from the user's own record, which is written
 * exclusively from verified Stripe webhook events (or the post-checkout
 * session verification in GET /api/stripe/checkout). The shared demo-store
 * subscription is never touched by billing — it stays FREE for logged-out
 * visitors.
 */

export type SubscriptionTier = "FREE" | "PRO";

export interface EffectiveSubscription {
  tier: SubscriptionTier;
  status: string; // TRIALING | ACTIVE | PAST_DUE | CANCELLED | ...
  isPro: boolean;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  monthlyPrice: number;
}

const PRO_STATUSES = new Set(["TRIALING", "ACTIVE", "PAST_DUE"]);

type BillingUser = Pick<
  User,
  | "id"
  | "email"
  | "name"
  | "stripeCustomerId"
  | "stripeSubscriptionId"
  | "subscriptionTier"
  | "subscriptionStatus"
  | "trialEndsAt"
  | "currentPeriodEnd"
>;

export function effectiveSubscription(user: BillingUser): EffectiveSubscription {
  const tier: SubscriptionTier = user.subscriptionTier === "PRO" ? "PRO" : "FREE";
  const status = user.subscriptionStatus ?? "NONE";
  return {
    tier,
    status,
    isPro: tier === "PRO" && PRO_STATUSES.has(status),
    trialEndsAt: user.trialEndsAt ? user.trialEndsAt.toISOString() : null,
    currentPeriodEnd: user.currentPeriodEnd ? user.currentPeriodEnd.toISOString() : null,
    stripeCustomerId: user.stripeCustomerId ?? null,
    stripeSubscriptionId: user.stripeSubscriptionId ?? null,
    monthlyPrice: 5.0
  };
}

/** Real Stripe client, or null when STRIPE_SECRET_KEY is not configured. */
export function stripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
}

/** Pro price ID. Josh must create the $5/mo price in the Stripe dashboard. */
export function billingPriceId(): string | null {
  return process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID || null;
}

export function siteUrl(req?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  if (req) return new URL(req.url).origin;
  return "https://syllabiq.ca";
}

export function isBillingConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY) && Boolean(billingPriceId());
}

/** Reuse the user's Stripe customer, creating (and persisting) one if needed. */
export async function getOrCreateStripeCustomer(user: BillingUser): Promise<string> {
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const stripe = stripeClient();
  if (!stripe) throw new Error("Billing is not configured");
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name ?? undefined,
    metadata: { userId: user.id }
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id }
  });
  return customer.id;
}

function periodEndOf(sub: Stripe.Subscription): Date | null {
  // current_period_end moved from the subscription root to the subscription
  // item in newer Stripe API versions — support both shapes.
  const root = (sub as unknown as { current_period_end?: number | null }).current_period_end;
  const firstItem = sub.items?.data?.[0] as unknown as
    | { current_period_end?: number | null }
    | undefined;
  const ts = root ?? firstItem?.current_period_end;
  return typeof ts === "number" && ts > 0 ? new Date(ts * 1000) : null;
}

function subscriptionPatch(sub: Stripe.Subscription) {
  const status = sub.status.toUpperCase();
  const pro = PRO_STATUSES.has(status);
  return {
    stripeSubscriptionId: sub.id,
    subscriptionTier: pro ? "PRO" : "FREE",
    subscriptionStatus: status,
    trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
    currentPeriodEnd: periodEndOf(sub)
  };
}

/** Apply a verified subscription object to the owning user (by customer id). */
export async function applyVerifiedSubscription(sub: Stripe.Subscription) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (!customerId) return null;
  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  if (!user) return null;
  return prisma.user.update({
    where: { id: user.id },
    data: subscriptionPatch(sub)
  });
}

async function subscriptionFromSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<Stripe.Subscription | null> {
  const sub = session.subscription;
  if (sub && typeof sub !== "string") return sub;
  if (typeof sub === "string") return stripe.subscriptions.retrieve(sub);
  // Fallback: latest subscription for the customer
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (!customerId) return null;
  const list = await stripe.subscriptions.list({ customer: customerId, limit: 1 });
  return list.data[0] ?? null;
}

/**
 * Activate Pro for the checkout owner from a verified Checkout Session.
 * Used ONLY by the signature-verified checkout.session.completed webhook —
 * never from a client-reachable endpoint — so Pro status is driven by
 * verified webhook events only.
 */
export async function activateFromCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<EffectiveSubscription | null> {
  const stripe = stripeClient();
  if (!stripe) return null;

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const refUserId = session.client_reference_id || session.metadata?.userId || null;

  let user = refUserId ? await prisma.user.findUnique({ where: { id: refUserId } }) : null;
  if (!user && customerId) {
    user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
  }
  if (!user) return null;

  if (customerId && !user.stripeCustomerId) {
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const sub = await subscriptionFromSession(stripe, session);
  if (!sub) {
    // Session completed but no subscription object yet — mark trialing from metadata.
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeCustomerId: customerId ?? user.stripeCustomerId,
        subscriptionTier: "PRO",
        subscriptionStatus: "TRIALING",
        trialEndsAt: new Date(Date.now() + 30 * 86400000)
      }
    });
    return effectiveSubscription(updated);
  }

  const updated = await applyVerifiedSubscription(sub);
  if (updated) return effectiveSubscription(updated);

  // Customer not yet linked (race) — link then apply.
  if (customerId) {
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    const retry = await applyVerifiedSubscription(sub);
    if (retry) return effectiveSubscription(retry);
  }
  return effectiveSubscription(user);
}

/** Mark the user's subscription cancelled (at period end) in Stripe. */
export async function cancelStripeSubscription(user: BillingUser): Promise<EffectiveSubscription | null> {
  const stripe = stripeClient();
  if (!stripe || !user.stripeSubscriptionId) return null;
  const sub = await stripe.subscriptions.update(user.stripeSubscriptionId, {
    cancel_at_period_end: true
  });
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: subscriptionPatch(sub)
  });
  return effectiveSubscription(updated);
}
