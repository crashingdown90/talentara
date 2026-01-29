import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validations/auth";
import { checkRateLimit, REGISTER_RATE_LIMIT } from "@/lib/utils/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `register:${ip}`;
    const rateLimit = await checkRateLimit(rateLimitKey, REGISTER_RATE_LIMIT);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "RATE_LIMIT", message: "Terlalu banyak percobaan registrasi. Silakan coba lagi nanti." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
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

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.full_name,
          role: validated.role,
        },
      },
    });

    if (authError) {
      // Use a generic message to prevent account enumeration.
      // Do not reveal whether a specific email is already registered.
      console.error("Auth signup error:", authError.message);
      return NextResponse.json(
        { success: false, error: "AUTH_ERROR", message: "Registrasi gagal. Silakan periksa data Anda dan coba lagi." },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: "AUTH_ERROR", message: "Gagal membuat akun" },
        { status: 500 }
      );
    }

    // 2. Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: validated.email,
      full_name: validated.full_name,
      phone: validated.phone,
      role: validated.role,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        { success: false, error: "PROFILE_ERROR", message: "Gagal membuat profil" },
        { status: 500 }
      );
    }

    // 3. Create role-specific record
    if (validated.role === "talent") {
      const { error: talentError } = await supabase.from("talents").insert({
        profile_id: authData.user.id,
        category: "spg", // Default category, can be updated later
      });
      if (talentError) {
        console.error("Talent creation error:", talentError);
        // Clean up: delete the profile to avoid inconsistent state
        await supabase.from("profiles").delete().eq("id", authData.user.id);
        return NextResponse.json(
          { success: false, error: "PROFILE_ERROR", message: "Gagal membuat profil talent" },
          { status: 500 }
        );
      }
    } else if (validated.role === "client") {
      const { error: companyError } = await supabase.from("companies").insert({
        profile_id: authData.user.id,
        company_name: validated.full_name, // Placeholder, updated in company profile
      });
      if (companyError) {
        console.error("Company creation error:", companyError);
        // Clean up: delete the profile to avoid inconsistent state
        await supabase.from("profiles").delete().eq("id", authData.user.id);
        return NextResponse.json(
          { success: false, error: "PROFILE_ERROR", message: "Gagal membuat profil perusahaan" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email,
          },
          profile: {
            id: authData.user.id,
            role: validated.role,
            full_name: validated.full_name,
          },
        },
        message: "Registrasi berhasil. Silakan cek email untuk verifikasi.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
