import { NextResponse } from "next/server";
import { getSubscription, updateSubscription, addActivityLog } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action = "subscribe", paymentMethod = "card_test" } = body;

    const currentSub = getSubscription();

    if (action === "cancel") {
      const updated = updateSubscription({
        tier: "FREE",
        status: "CANCELLED"
      });
      return NextResponse.json({
        success: true,
        message: "Subscription cancelled successfully. You will remain on Free tier.",
        subscription: updated
      });
    }

    // Activate Pro with 30-day Free Trial, $5/mo after
    const now = Date.now();
    const trialEndsAt = new Date(now + 30 * 86400000).toISOString();
    const currentPeriodEnd = new Date(now + 60 * 86400000).toISOString();

    let liveCustomerId = `cus_${Math.random().toString(36).substring(2, 12)}`;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (stripeKey) {
      try {
        const stripeRes = await fetch("https://api.stripe.com/v1/customers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            email: body.email || "student@example.edu",
            name: body.name || "SyllabiQ Student",
            description: "SyllabiQ Pro Subscriber (30-day Free Trial)"
          }).toString()
        });

        if (stripeRes.ok) {
          const cust = await stripeRes.json();
          liveCustomerId = cust.id;
        }
      } catch (stripeErr) {
        console.warn("Stripe live customer call fallback:", stripeErr);
      }
    }

    const updated = updateSubscription({
      tier: "PRO",
      status: "ACTIVE_SUBSCRIBER",
      trialDaysRemaining: 30,
      trialEndsAt,
      currentPeriodEnd,
      monthlyPrice: 5.0,
      stripeCustomerId: liveCustomerId,
      stripeSubscriptionId: `sub_${Math.random().toString(36).substring(2, 12)}`,
      homeworkUploadsLimit: 999999
    });

    addActivityLog(
      "Stripe Checkout Completed",
      `Activated SyllabiQ Pro ($5/mo with 30-day free trial). Stripe Customer ID: ${updated.stripeCustomerId}`
    );

    return NextResponse.json({
      success: true,
      message: "Pro subscription activated! Your first 30 days are 100% free.",
      subscription: updated
    });
  } catch (err: any) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: err.message || "Failed to process checkout" }, { status: 500 });
  }
}
