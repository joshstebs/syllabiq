"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "ADMIN" | "TESTER" | "STUDENT";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  isPro: boolean;
  provider: "email" | "google" | "apple" | "cornell";
  trialEndsAt?: string;
  monthlyPrice?: number;
}

export const ADMIN_USER: UserProfile = {
  id: "user-admin-01",
  name: "Josh Stebs",
  email: "admin@syllabiq.app",
  role: "ADMIN",
  avatar: "👨‍💼",
  isPro: true,
  provider: "email",
  trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  monthlyPrice: 5.0
};

export const TESTER_USER: UserProfile = {
  id: "user-tester-02",
  name: "Alex Cornell",
  email: "tester@syllabiq.app",
  role: "TESTER",
  avatar: "🧑‍🎓",
  isPro: true,
  provider: "email",
  trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  monthlyPrice: 5.0
};

interface AuthContextType {
  user: UserProfile | null;
  loginWithCredentials: (email: string, pass: string) => boolean;
  loginWithGoogle: (email?: string, name?: string) => void;
  loginWithAdminPreset: () => void;
  loginWithTesterPreset: () => void;
  loginWithNetID: (netId: string) => void;
  logout: () => void;
  updateUserProStatus: (isPro: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(TESTER_USER);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("syllabiq_auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(TESTER_USER);
        localStorage.setItem("syllabiq_auth_user", JSON.stringify(TESTER_USER));
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
    if (cleanEmail === "admin@syllabiq.app" || cleanEmail === "josh.stebs@gmail.com") {
      saveUser(ADMIN_USER);
      return true;
    }
    if (cleanEmail === "tester@syllabiq.app") {
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
    saveUser(newUser);
    return true;
  };

  const loginWithGoogle = (customEmail?: string, customName?: string) => {
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
    saveUser(googleUser);
  };

  const loginWithAdminPreset = () => {
    saveUser(ADMIN_USER);
  };

  const loginWithTesterPreset = () => {
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
    saveUser(netUser);
  };

  const logout = () => {
    saveUser(null);
  };

  const updateUserProStatus = (isPro: boolean) => {
    if (!user) return;
    const updated = {
      ...user,
      isPro,
      trialEndsAt: isPro ? new Date(Date.now() + 30 * 86400000).toISOString() : undefined,
      monthlyPrice: isPro ? 5.0 : 0
    };
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
        updateUserProStatus
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
