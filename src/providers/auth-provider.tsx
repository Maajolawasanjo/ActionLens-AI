"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const json = await res.json();
        setUser(json.data.user);
        setError(null);
      } else {
        setUser(null);
      }
    } catch {
      setError("Failed to load user session");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
