import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession, isDatabaseConfigured, publicUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { checkRateLimit, getClientIp, rateLimitedResponse } from "@/lib/server/rate-limit";

export async function POST(req: Request) {
  const rl = checkRateLimit(`auth:login:${getClientIp(req)}`, 10, 60_000);
  if (!rl.allowed) return rateLimitedResponse(rl.retryAfterSec);

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Account services are not configured" }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!z.string().email().safeParse(email).success || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ user: publicUser(user) });
}
