import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

const STORAGE_KEY = "treelogy_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage and validate against Supabase
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed?.id) {
        localStorage.removeItem(STORAGE_KEY);
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured()) {
        // Fallback: trust localStorage if Supabase unavailable
        setUser(parsed);
        setLoading(false);
        return;
      }

      // Validate user still exists and is active
      supabase
        .from("faq_users")
        .select("id, name, username, role")
        .eq("id", parsed.id)
        .eq("is_active", true)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            localStorage.removeItem(STORAGE_KEY);
            setUser(null);
          } else {
            // Update localStorage with fresh data
            setUser(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          }
          setLoading(false);
        });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    if (!isSupabaseConfigured()) throw new Error("Database not configured");

    const { data, error } = await supabase.rpc("authenticate_user", {
      p_username: username.trim().toLowerCase(),
      p_password: password,
    });

    if (error) throw new Error("AUTH_ERROR");
    if (!data) throw new Error("INVALID_CREDENTIALS");

    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
