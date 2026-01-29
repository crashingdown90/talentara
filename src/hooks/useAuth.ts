"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { createClient } from "@/lib/supabase/client";

/**
 * Hook to manage authentication state.
 * Auto-fetches user profile on mount and listens for auth changes.
 */
export function useAuth() {
  const router = useRouter();
  const { user, isLoading, isInitialized, setUser, setLoading, setInitialized, logout: clearUser } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;

    const supabase = createClient();

    // Fetch initial user
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const result = await response.json();
            setUser(result.data);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_IN") {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const result = await response.json();
            setUser(result.data);
          }
        } else if (event === "SIGNED_OUT") {
          clearUser();
          router.push("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialized, setUser, setLoading, setInitialized, clearUser, router]);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login gagal");
    }

    // Refresh to let middleware set cookies
    router.refresh();
    return result;
  };

  const register = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
    full_name: string;
    phone: string;
    role: "talent" | "client";
  }) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registrasi gagal");
    }

    return result;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    router.push("/login");
  };

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
