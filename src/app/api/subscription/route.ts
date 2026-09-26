import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { effectiveSubscription } from "@/lib/server/billing";
import { getSubscription } from "@/lib/storage";

/**
 * Current subscription state.
 * Logged in  -> the user's own record (driven by verified Stripe events).
 * Logged out -> the shared demo-store subscription (always FREE).
 */
export async function GET() {
  const user = await getCurrentUser();
  if (user) {
    return NextResponse.json(effectiveSubscription(user));
  }
  return NextResponse.json(getSubscription());
}

/**
 * Direct subscription edits are disabled — billing is managed through
 * Stripe Checkout / the customer portal, with status driven by webhooks.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Subscriptions are managed through Stripe billing, not direct edits." },
    { status: 405 }
  );
}
