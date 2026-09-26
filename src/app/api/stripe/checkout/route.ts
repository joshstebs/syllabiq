import { NextResponse } from "next/server";
import {
  billingPriceId,
  getOrCreateStripeCustomer,
  cancelStripeSubscription,
  isBillingConfigured,
  siteUrl,
  stripeClient
} from "@/lib/server/billing";
import { getCurrentUser } from "@/lib/server/auth";
import { checkRateLimit, getClientIp, rateLimitedResponse } from "@/lib/server/rate-limit";

/**
 * Real Stripe billing.
 *
 * POST (authed):
 *   { action: "subscribe" } -> creates a Stripe Checkout Session
 *     (subscription mode, 30-day trial, $5/mo price from STRIPE_PRICE_ID)
 *     and returns { url } for the client to redirect to.
 *   { action: "cancel" } -> cancels the Stripe subscription at period end.
 * GET ?session_id=... (authed):
 *   verifies a just-completed Checkout Session server-side (ownership +
 *   completion, read from Stripe's API). It does NOT mutate billing state —
 *   Pro status is driven by verified webhook events only. The client polls
 *   /api/subscription until the checkout.session.completed webhook lands.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to manage billing" }, { status: 401 });
  }

  const limited = checkRateLimit(`billing:${getClientIp(req)}`, 20, 60_000);
  if (!limited.allowed) return rateLimitedResponse(limited.retryAfterSec);

  const body = await req.json().catch(() => ({}));
  const action = body.action ?? "subscribe";

  if (action === "cancel") {
    try {
      const sub = await cancelStripeSubscription(user);
      if (!sub) {
        return NextResponse.json(
          { error: "No active Stripe subscription to cancel" },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Your Pro subscription will stay active until the end of the billing period, then won't renew.",
        subscription: sub
      });
    } catch (err: any) {
      console.error("Stripe cancel error", err);
      return NextResponse.json({ error: "Couldn't cancel right now — try the billing portal instead." }, { status: 502 });
    }
  }

  if (!isBillingConfigured()) {
    return NextResponse.json(
      { error: "Billing is not configured yet. The site owner needs to set STRIPE_SECRET_KEY and STRIPE_PRICE_ID." },
      { status: 503 }
    );
  }

  try {
    const stripe = stripeClient();
    const priceId = billingPriceId();
    if (!stripe || !priceId) {
      return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 });
    }

    const customerId = await getOrCreateStripeCustomer(user);
    const site = siteUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
        metadata: { userId: user.id }
      },
      metadata: { userId: user.id },
      success_url: `${site}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/?checkout=cancelled`
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe didn't return a checkout URL" }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error", err);
    return NextResponse.json(
      { error: "Couldn't start checkout. Please try again." },
      { status: 502 }
    );
  }
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to verify checkout" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing checkout session" }, { status: 400 });
  }

  const stripe = stripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // The session must belong to the caller — never activate someone else's.
    const ownerId = session.client_reference_id || session.metadata?.userId || null;
    const sessionCustomer = typeof session.customer === "string" ? session.customer : session.customer?.id;
    const ownsSession = ownerId === user.id || (sessionCustomer != null && sessionCustomer === user.stripeCustomerId);
    if (!ownsSession) {
      return NextResponse.json({ error: "This checkout doesn't belong to your account" }, { status: 403 });
    }

    if (session.status !== "complete") {
      return NextResponse.json({ error: "Checkout isn't complete yet" }, { status: 400 });
    }

    // Verified: this checkout is complete and belongs to the caller.
    // Billing state itself is applied by the verified
    // checkout.session.completed webhook — this endpoint never mutates it.
    return NextResponse.json({ success: true, checkoutComplete: true });
  } catch (err: any) {
    console.error("Stripe session verify error", err);
    return NextResponse.json({ error: "Couldn't verify checkout" }, { status: 502 });
  }
}
