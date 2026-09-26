import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { getSubscription, updateSubscription } from "@/lib/storage";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to view your subscription" }, { status: 401 });
  }
  const sub = getSubscription();
  return NextResponse.json(sub);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to manage your subscription" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const updated = updateSubscription(body);
  return NextResponse.json(updated);
}
