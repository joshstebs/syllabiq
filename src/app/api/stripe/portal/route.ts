import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { siteUrl, stripeClient } from "@/lib/server/billing";
import { checkRateLimit, getClientIp, rateLimitedResponse } from "@/lib/server/rate-limit";

/**
 * Stripe Customer Portal — lets the signed-in user manage or cancel
 * their subscription on Stripe-hosted pages. Returns { url } to redirect to.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to manage billing" }, { status: 401 });
  }

  const limited = checkRateLimit(`billing:${getClientIp(req)}`, 20, 60_000);
  if (!limited.allowed) return rateLimitedResponse(limited.retryAfterSec);

  const stripe = stripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Billing is not configured yet." }, { status: 503 });
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found. Start a Pro trial first." },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${siteUrl(req)}/?billing=portal`
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe portal error", err);
    return NextResponse.json({ error: "Couldn't open the billing portal" }, { status: 502 });
  }
}
