import { NextResponse } from "next/server";
import { getCurrentUser, isDatabaseConfigured, publicUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function PATCH(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Account services are not configured" }, { status: 503 });
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data: { name?: string; avatarUrl?: string; timezone?: string } = {};
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.photoUrl === "string") data.avatarUrl = body.photoUrl;
  if (typeof body.timeZone === "string" && body.timeZone.trim()) data.timezone = body.timeZone.trim();

  const user = await prisma.user.update({ where: { id: currentUser.id }, data });
  return NextResponse.json({ user: publicUser(user) });
}
