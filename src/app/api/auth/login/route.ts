import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";
import { checkRateLimit, LOGIN_RATE_LIMIT } from "@/lib/utils/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `login:${ip}`;
    const rateLimit = await checkRateLimit(rateLimitKey, LOGIN_RATE_LIMIT);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "RATE_LIMIT", message: "Terlalu banyak percobaan login. Silakan coba lagi nanti." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();

    // Validate input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { success: false, error: "VALIDATION_ERROR", message: "Data tidak valid", errors },
        { status: 422 }
      );
    }

    const validated = result.data;
    const supabase = await createClient();

    // Sign in with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: "INVALID_CREDENTIALS", message: "Email atau password salah" },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: "AUTH_ERROR", message: "Gagal login" },
        { status: 500 }
      );
    }

    // Fetch user profile (select only needed fields)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, avatar_url, is_verified")
      .eq("id", authData.user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: profile?.role || "talent",
          full_name: profile?.full_name || "",
          avatar_url: profile?.avatar_url || null,
          is_verified: profile?.is_verified || false,
        },
      },
      message: "Login berhasil",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
