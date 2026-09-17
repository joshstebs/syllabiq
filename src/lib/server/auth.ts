import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "syllabiq_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function configuredAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name ?? user.email.split("@")[0],
    email: user.email,
    role: user.role,
    avatar: user.avatarUrl ?? "🎓",
    photoUrl: user.avatarUrl ?? undefined,
    school: undefined,
    major: undefined,
    graduationYear: undefined,
    isPro: true,
    provider: "email" as const,
    timeZone: user.timezone,
    timeZoneMode: "auto" as const,
    defaultDueTime: "23:59",
    weekStartDay: "sunday" as const,
    prepBufferDays: 5
  };
}

export async function getCurrentUser() {
  if (!isDatabaseConfigured()) return null;

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true }
  });

  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }

  return session.user;
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt }
  });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token && isDatabaseConfigured()) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}
