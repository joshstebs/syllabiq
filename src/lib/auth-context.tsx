"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  id: "user-admin-01",
  name: "Josh Stebs",
  email: "support@syllabiq.ca",
  role: "ADMIN",
  avatar: "👨‍💼",
  school: "Cornell University",
  major: "Computer Science & Economics",
  graduationYear: "2027",
  timeZone: "America/New_York",
  timeZoneMode: "auto",
  defaultDueTime: "23:59",
  weekStartDay: "sunday",
  prepBufferDays: 5,
  isPro: true,
  provider: "email",
  trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  monthlyPrice: 5.0
};

export const TESTER_USER: UserProfile = {
  id: "user-tester-02",
  name: "Alex Cornell",
  email: "tester@syllabiq.ca",
  role: "TESTER",
  avatar: "🧑‍🎓",
  school: "Cornell University",
  major: "Applied Economics & Management",
  graduationYear: "2026",
  timeZone: "America/New_York",
  timeZoneMode: "auto",
  defaultDueTime: "23:59",
  weekStartDay: "sunday",
  prepBufferDays: 5,
  isPro: true,
  provider: "email",
  trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  monthlyPrice: 5.0
};

export const FREE_VISITOR: UserProfile = {
  id: "guest-visitor",
  name: "Guest Student",
  email: "student@syllabiq.ca",
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
  loginWithCredentials: (email: string, pass: string) => boolean;
  loginWithGoogle: (email?: string, name?: string, useRealOAuth?: boolean) => void;
  loginWithAdminPreset: () => void;
  loginWithTesterPreset: () => void;
  loginWithNetID: (netId: string) => void;
  logout: () => void;
  updateUserProStatus: (isPro: boolean) => void;
  updateUserProfile: (patch: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(FREE_VISITOR);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("google_auth") === "success") {
          const gEmail = params.get("email") || "josh.stebs@gmail.com";
          const gName = params.get("name") || "Josh Stebs (Google)";
          const googleUser: UserProfile = {
            id: `user-google-${Date.now()}`,
            name: gName,
            email: gEmail,
            role: gEmail.toLowerCase().includes("stebs") || gEmail.includes("admin") ? "ADMIN" : "STUDENT",
            avatar: "🌐",
            isPro: true,
            provider: "google",
            trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
            monthlyPrice: 5.0
          };
          localStorage.setItem("syllabiq_explicit_session", "true");
          saveUser(googleUser);
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }
      }

      const hasExplicitSession = localStorage.getItem("syllabiq_explicit_session");
      const stored = localStorage.getItem("syllabiq_auth_user");
      if (hasExplicitSession && stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(FREE_VISITOR);
        localStorage.setItem("syllabiq_auth_user", JSON.stringify(FREE_VISITOR));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("syllabiq_auth_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("syllabiq_auth_user");
    }
  };

  const loginWithCredentials = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (
      cleanEmail === "support@syllabiq.ca" ||
      cleanEmail === "admin@syllabiq.ca" ||
      cleanEmail === "admin@syllabiq.app" ||
      cleanEmail === "josh.stebs@gmail.com"
    ) {
      localStorage.setItem("syllabiq_explicit_session", "true");
      saveUser(ADMIN_USER);
      return true;
    }
    if (cleanEmail === "tester@syllabiq.ca" || cleanEmail === "tester@syllabiq.app") {
      localStorage.setItem("syllabiq_explicit_session", "true");
      saveUser(TESTER_USER);
      return true;
    }
    // Generic email user
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0].replace(/[._]/g, " "),
      email: cleanEmail,
      role: "STUDENT",
      avatar: "🧑‍🎓",
      isPro: false,
      provider: "email"
    };
    localStorage.setItem("syllabiq_explicit_session", "true");
    saveUser(newUser);
    return true;
  };

  const loginWithGoogle = (customEmail?: string, customName?: string, useRealOAuth = false) => {
    if (useRealOAuth && typeof window !== "undefined") {
      window.location.href = "/api/auth/google";
      return;
    }
    const googleUser: UserProfile = {
      id: "user-google-" + Date.now(),
      name: customName || "Josh Stebs (Google)",
      email: customEmail || "josh.stebs@gmail.com",
      role: "ADMIN",
      avatar: "🌐",
      isPro: true,
      provider: "google",
      trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      monthlyPrice: 5.0
    };
    localStorage.setItem("syllabiq_explicit_session", "true");
    saveUser(googleUser);
  };

  const loginWithAdminPreset = () => {
    localStorage.setItem("syllabiq_explicit_session", "true");
    saveUser(ADMIN_USER);
  };

  const loginWithTesterPreset = () => {
    localStorage.setItem("syllabiq_explicit_session", "true");
    saveUser(TESTER_USER);
  };

  const loginWithNetID = (netId: string) => {
    const netUser: UserProfile = {
      id: `user-${netId}`,
      name: `${netId.toUpperCase()} (Cornell NetID)`,
      email: `${netId}@cornell.edu`,
      role: "STUDENT",
      avatar: "🏛️",
      isPro: true,
      provider: "cornell",
      trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      monthlyPrice: 5.0
    };
    localStorage.setItem("syllabiq_explicit_session", "true");
    saveUser(netUser);
  };

  const logout = () => {
    localStorage.removeItem("syllabiq_explicit_session");
    saveUser(FREE_VISITOR);
  };

  const updateUserProStatus = (isPro: boolean) => {
    const baseUser = user && user.id !== "guest-visitor" ? user : FREE_VISITOR;
    const updated: UserProfile = {
      ...baseUser,
      id: isPro && baseUser.id === "guest-visitor" ? `user-pro-${Date.now()}` : baseUser.id,
      name: isPro && baseUser.id === "guest-visitor" ? "Pro Student" : baseUser.name,
      isPro,
      trialEndsAt: isPro ? new Date(Date.now() + 30 * 86400000).toISOString() : undefined,
      monthlyPrice: isPro ? 5.0 : 0
    };
    if (isPro) {
      localStorage.setItem("syllabiq_explicit_session", "true");
    }
    saveUser(updated);
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    const baseUser = user && user.id !== "guest-visitor" ? user : FREE_VISITOR;
    const updated: UserProfile = {
      ...baseUser,
      ...patch
    };
    localStorage.setItem("syllabiq_explicit_session", "true");
    saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithCredentials,
        loginWithGoogle,
        loginWithAdminPreset,
        loginWithTesterPreset,
        loginWithNetID,
        logout,
        updateUserProStatus,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
