import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client — ONLY use in server-side code (API routes, server actions).
 * This client bypasses Row Level Security (RLS) policies.
 *
 * Uses a factory function to prevent accidental client-side instantiation
 * and to ensure the service role key is never leaked to the browser.
 */

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "getSupabaseAdmin() must only be called from server-side code. " +
      "Never import this module in client components."
    );
  }

  if (!_adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
      );
    }

    _adminClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return _adminClient;
}

/**
 * @deprecated Use getSupabaseAdmin() instead for safer server-only access.
 */
export const supabaseAdmin = typeof window === "undefined"
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : (null as unknown as SupabaseClient);
