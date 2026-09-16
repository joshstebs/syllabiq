import { NextResponse } from "next/server";
import { getSubscription, updateSubscription } from "@/lib/storage";

export async function GET() {
  const sub = getSubscription();
  return NextResponse.json(sub);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const updated = updateSubscription(body);
  return NextResponse.json(updated);
}
