import { NextResponse } from "next/server";
import { updateSubscription, addActivityLog } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const eventType = body.type || "customer.subscription.created";

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
