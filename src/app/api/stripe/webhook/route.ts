import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  activateFromCheckoutSession,
  applyVerifiedSubscription
} from "@/lib/server/billing";
import { prisma } from "@/lib/server/prisma";

// constructEvent performs offline HMAC verification only, so the API key
// value is irrelevant here — but the constructor requires one.
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_unconfigured_webhook_verification",
  { apiVersion: "2026-08-26.dahlia" }
);

/**
 * Stripe webhook — the single source of truth for per-user Pro status.
 * Every handler is keyed by Stripe customer id and only ever writes to
 * that customer's own user record. The shared demo-store subscription is
 * intentionally never touched here (it stays FREE for logged-out visitors).
 */
export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Stripe webhook rejected: STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // The raw body is required — constructEvent validates the HMAC signature.
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const result = await activateFromCheckoutSession(session);
        if (!result) {
          console.warn(`Stripe webhook: checkout.session.completed for unknown customer (event ${event.id})`);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const result = await applyVerifiedSubscription(sub);
        if (!result) {
          console.warn(`Stripe webhook: ${event.type} for unknown customer (event ${event.id})`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        if (customerId) {
          const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                subscriptionTier: "FREE",
                subscriptionStatus: "CANCELLED",
                stripeSubscriptionId: null
              }
            });
          } else {
            console.warn(`Stripe webhook: customer.subscription.deleted for unknown customer (event ${event.id})`);
          }
        }
        break;
      }

      default:
        // Other events (invoices, payment intents, ...) don't change tier.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook handler error", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
