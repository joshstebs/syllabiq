import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updateSubscription, addActivityLog } from "@/lib/storage";

// constructEvent performs offline HMAC verification only, so the API key
// value is irrelevant here — but the constructor requires one.
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_unconfigured_webhook_verification",
  { apiVersion: "2026-08-26.dahlia" }
);

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
    const eventType = event.type;

    switch (eventType) {
      case "customer.subscription.created":
      case "checkout.session.completed":
        updateSubscription({
          tier: "PRO",
          status: "ACTIVE_SUBSCRIBER"
        });
        addActivityLog("Stripe Webhook", `Handled ${eventType}: Subscription active`);
        break;

      case "customer.subscription.deleted":
        updateSubscription({
          tier: "FREE",
          status: "CANCELLED"
        });
        addActivityLog("Stripe Webhook", "Subscription cancelled via Stripe dashboard");
        break;

      case "invoice.payment_succeeded":
        addActivityLog("Stripe Webhook", "Invoice payment succeeded: $5.00 billed");
        break;

      default:
        addActivityLog("Stripe Webhook", `Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
