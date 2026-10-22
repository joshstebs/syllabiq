import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { prisma } from "./prisma";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const hex = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  if (!hex || !/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(
      "GOOGLE_TOKEN_ENCRYPTION_KEY is not configured (expected 64 hex chars)"
    );
  }
  return Buffer.from(hex, "hex");
}

export function encryptToken(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${ciphertext.toString("hex")}`;
}

export function decryptToken(payload: string): string {
  const key = getKey();
  const parts = payload.split(":");
  if (parts.length !== 3) throw new Error("Malformed encrypted token payload");
  const [ivHex, tagHex, dataHex] = parts;
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final()
  ]).toString("utf8");
}

interface TokenBundle {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number | null;
}

export async function saveGoogleTokens(userId: string, bundle: TokenBundle): Promise<void> {
  if (!bundle.accessToken) throw new Error("Cannot save Google tokens without an access token");
  const existing = await prisma.googleSyncState.findUnique({ where: { userId } });

  // Google only returns a refresh token on first consent (or with prompt=consent).
  // On re-consent without one, keep the stored refresh token.
  const refreshToken =
    bundle.refreshToken || (existing ? decryptToken(existing.refreshToken) : null);
  if (!refreshToken) {
    throw new Error("No Google refresh token available; please reconnect with consent");
  }

  const tokenExpiry = new Date(
    Date.now() + (bundle.expiresIn && bundle.expiresIn > 0 ? bundle.expiresIn : 3600) * 1000
  );

  const data = {
    accessToken: encryptToken(bundle.accessToken),
    refreshToken: encryptToken(refreshToken),
    tokenExpiry
  };

  if (existing) {
    await prisma.googleSyncState.update({ where: { userId }, data });
  } else {
    await prisma.googleSyncState.create({ data: { userId, ...data } });
  }
}

async function refreshAccessToken(userId: string, refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Google OAuth is not configured");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    }).toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Google token refresh failed");
    throw new Error(`Google token refresh failed: ${errText.slice(0, 200)}`);
  }

  const tokens = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!tokens.access_token) throw new Error("Google did not return an access token");
  return { accessToken: tokens.access_token, expiresIn: tokens.expires_in ?? 3600 };
}

export async function getValidAccessToken(userId: string): Promise<string> {
  const state = await prisma.googleSyncState.findUnique({ where: { userId } });
  if (!state) throw new Error("Google Calendar is not connected for this user");

  const refreshToken = decryptToken(state.refreshToken);
  const skewMs = 60 * 1000;

  if (state.tokenExpiry.getTime() - Date.now() > skewMs) {
    return decryptToken(state.accessToken);
  }

  const { accessToken, expiresIn } = await refreshAccessToken(userId, refreshToken);
  await prisma.googleSyncState.update({
    where: { userId },
    data: {
      accessToken: encryptToken(accessToken),
      tokenExpiry: new Date(Date.now() + expiresIn * 1000)
    }
  });
  return accessToken;
}

export async function getGoogleSyncState(userId: string) {
  return prisma.googleSyncState.findUnique({ where: { userId } });
}

export async function revokeGoogleTokens(userId: string): Promise<void> {
  const state = await prisma.googleSyncState.findUnique({ where: { userId } });
  if (state) {
    try {
      // Revoke the refresh token (long-lived) so Google invalidates the grant.
      const refreshToken = decryptToken(state.refreshToken);
      await fetch("https://oauth2.googleapis.com/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token: refreshToken }).toString()
      });
    } catch {
      // Best effort: still clear local state even if revocation fails.
    }
    await prisma.googleSyncState.delete({ where: { userId } });
  }
}
