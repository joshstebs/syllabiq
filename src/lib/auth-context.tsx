"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "ADMIN" | "TESTER" | "STUDENT";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  photoUrl?: string;
  school?: string;
  major?: string;
  graduationYear?: string;
  isPro: boolean;
  provider: "email" | "google" | "apple" | "cornell";
  trialEndsAt?: string;
  monthlyPrice?: number;
  timeZone?: string;
  timeZoneMode?: "auto" | "manual";
  defaultDueTime?: string;
  weekStartDay?: "sunday" | "monday";
  prepBufferDays?: number;
}

export const ADMIN_USER: UserProfile = {
  id: "demo-admin",
  name: "Demo Admin",
  email: "admin@example.test",
  role: "ADMIN",
  avatar: "👨‍💼",
  isPro: true,
  provider: "email"
};

export const TESTER_USER: UserProfile = {
  id: "demo-tester",
  name: "Demo Tester",
  email: "tester@example.test",
  role: "TESTER",
  avatar: "🧑‍🎓",
  isPro: true,
  provider: "email"
};

export const FREE_VISITOR: UserProfile = {
  id: "guest-visitor",
  name: "Guest Student",
  email: "student@example.test",
  role: "STUDENT",
  avatar: "🎓",
  school: "College Campus",
  major: "Undeclared",
  graduationYear: "2028",
  timeZone: "America/New_York",
  timeZoneMode: "auto",
  defaultDueTime: "23:59",
  weekStartDay: "sunday",
  prepBufferDays: 5,
  isPro: false,
  provider: "email"
};

interface AuthContextType {
  user: UserProfile | null;
  loginWithCredentials: (email: string, pass: string) => Promise<boolean>;
  registerWithCredentials: (name: string, email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: (useRealOAuth?: boolean) => void;
  loginWithAdminPreset: () => void;
  loginWithTesterPreset: () => void;
  logout: () => Promise<void>;
  updateUserProStatus: (isPro: boolean) => void;
  updateUserProfile: (patch: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const demoAccountsEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO_ACCOUNTS === "true";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(FREE_VISITOR);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = (await response.json()) as { user?: UserProfile | null };
        return data.user ?? null;
      })
      .then((sessionUser) => {
        if (!cancelled && sessionUser) setUser(sessionUser);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { user?: UserProfile };
    if (!data.user) return false;
    setUser(data.user);
    return true;
  };

  const registerWithCredentials = async (name: string, email: string, password: string): Promise<boolean> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { user?: UserProfile };
    if (!data.user) return false;
    setUser(data.user);
    return true;
  };

  const loginWithGoogle = (useRealOAuth = true) => {
    if (useRealOAuth && typeof window !== "undefined") window.location.assign("/api/auth/google");
  };

  const loginWithAdminPreset = () => {
    if (demoAccountsEnabled) setUser(ADMIN_USER);
  };

  const loginWithTesterPreset = () => {
    if (demoAccountsEnabled) setUser(TESTER_USER);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    setUser(FREE_VISITOR);
  };

  const updateUserProStatus = (isPro: boolean) => {
    setUser((current) => (current ? { ...current, isPro } : current));
  };

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/session", { credentials: "same-origin" });
      if (!response.ok) return;
      const data = (await response.json()) as { user?: UserProfile | null };
      if (data.user) setUser(data.user);
    } catch {
      // keep current user on failure
    }
  };

  const updateUserProfile = async (patch: Partial<UserProfile>) => {
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(patch)
    });
    if (!response.ok) return;
    const data = (await response.json()) as { user?: UserProfile };
    if (data.user) setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithCredentials, registerWithCredentials, loginWithGoogle, loginWithAdminPreset, loginWithTesterPreset, logout, updateUserProStatus, updateUserProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
