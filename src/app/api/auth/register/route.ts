import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { configuredAdminEmails, createSession, isDatabaseConfigured, publicUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Account services are not configured" }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as { email?: unknown; password?: unknown; name?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : email.split("@")[0];
  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Use a valid email and a password of at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "An account already exists for that email" }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
      role: configuredAdminEmails().includes(email) ? "ADMIN" : "STUDENT"
    }
  });
  await createSession(user.id);
  return NextResponse.json({ user: publicUser(user) }, { status: 201 });
}
