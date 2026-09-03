"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  product: string; // "premium" | "free"
  images?: { url: string }[];
}

interface SpotifyAuthContextType {
  user: SpotifyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;
  login: () => void;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextType | undefined>(
  undefined
);

export function SpotifyAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check active session on mount and URL query params
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/spotify/session");
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
      }
    } catch (err) {
      console.error("Failed to check Spotify session:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    // Check if auth_success or auth_error exists in URL and clean up
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth_success") || params.get("auth_error")) {
        checkSession();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [checkSession]);

  const login = useCallback(() => {
    window.location.href = "/api/auth/spotify/login";
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/spotify/logout", { method: "POST" });
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Failed to log out from Spotify:", err);
    }
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/spotify/token");
      if (res.ok) {
        const data = await res.json();
        return data.token || null;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const isPremium = user?.product === "premium";

  return (
    <SpotifyAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isPremium,
        login,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </SpotifyAuthContext.Provider>
  );
}

export function useSpotifyAuth() {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error(
      "useSpotifyAuth must be used within a SpotifyAuthProvider"
    );
  }
  return context;
}
