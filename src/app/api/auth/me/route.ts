import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, API_RATE_LIMIT } from "@/lib/utils/rate-limit";
import { getClientIp } from "@/lib/utils/request";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`me:${ip}`, API_RATE_LIMIT);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "RATE_LIMIT", message: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
      );
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // Fetch profile (select only fields used in the response)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role, full_name, phone, avatar_url, is_verified")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "PROFILE_NOT_FOUND", message: "Profil tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch role-specific data
    let talent = null;
    let company = null;

    if (profile.role === "talent") {
      const { data } = await supabase
        .from("talents")
        .select("id, category, gender, date_of_birth, height_cm, weight_kg, city, province, bio, verification_status, rating_avg, rating_count, total_jobs_completed, wallet_balance, daily_rate, is_available")
        .eq("profile_id", user.id)
        .single();
      talent = data;
    } else if (profile.role === "client") {
      const { data } = await supabase
        .from("companies")
        .select("id, company_name, company_type, industry, city, province, website, company_logo_url, verification_status")
        .eq("profile_id", user.id)
        .single();
      company = data;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        is_verified: profile.is_verified,
        ...(talent && { talent }),
        ...(company && { company }),
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
