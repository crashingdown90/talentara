import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Auth callback handler for email verification and OAuth redirects.
 * Supabase Auth redirects here after email verification or OAuth login.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Validate redirect path to prevent open redirect attacks
  const isValidRedirect = next.startsWith("/") && !next.startsWith("//") && !next.includes(":");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get user to determine redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // Redirect based on role
        const redirectPath =
          profile?.role === "client" ? "/company/dashboard" : "/dashboard";
        const safePath = (isValidRedirect && next !== "/") ? next : redirectPath;
        return NextResponse.redirect(`${origin}${safePath}`);
      }
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
