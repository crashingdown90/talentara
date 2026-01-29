"use client";

import { useAuthStore } from "@/stores/authStore";

/**
 * Hook to access the current user's data.
 * Returns role-specific properties for convenience.
 */
export function useUser() {
  const { user, isLoading } = useAuthStore();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isTalent: user?.role === "talent",
    isClient: user?.role === "client",
    isAdmin: user?.role === "admin",
    role: user?.role,
    fullName: user?.full_name ?? "",
    email: user?.email ?? "",
    avatarUrl: user?.avatar_url,
    talent: user?.talent,
    company: user?.company,
  };
}
