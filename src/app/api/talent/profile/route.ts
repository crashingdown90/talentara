import { createClient } from "@/lib/supabase/server";
import { talentProfileSchema } from "@/lib/validations/talent";
import { NextResponse } from "next/server";

/**
 * GET /api/talent/profile
 * Fetch the current talent's full profile including portfolio and experiences
 */
export async function GET() {
  try {
    const supabase = await createClient();

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

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "PROFILE_NOT_FOUND", message: "Profil tidak ditemukan" },
        { status: 404 }
      );
    }

    if (profile.role !== "talent") {
      return NextResponse.json(
        { success: false, error: "FORBIDDEN", message: "Akses ditolak" },
        { status: 403 }
      );
    }

    // Fetch talent data
    const { data: talent, error: talentError } = await supabase
      .from("talents")
      .select("*")
      .eq("profile_id", user.id)
      .single();

    if (talentError || !talent) {
      return NextResponse.json(
        { success: false, error: "TALENT_NOT_FOUND", message: "Data talent tidak ditemukan" },
        { status: 404 }
      );
    }

    // Fetch portfolio
    const { data: portfolio } = await supabase
      .from("talent_portfolios")
      .select("*")
      .eq("talent_id", talent.id)
      .order("sort_order", { ascending: true });

    // Fetch experiences
    const { data: experiences } = await supabase
      .from("talent_experiences")
      .select("*")
      .eq("talent_id", talent.id)
      .order("start_date", { ascending: false });

    return NextResponse.json({
      success: true,
      data: {
        profile,
        talent,
        portfolio: portfolio || [],
        experiences: experiences || [],
      },
    });
  } catch (error) {
    console.error("Get talent profile error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/talent/profile
 * Update talent profile information
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

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

    const body = await request.json();

    // Validate input
    const result = talentProfileSchema.safeParse(body);
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

    // Check talent exists
    const { data: talent, error: talentError } = await supabase
      .from("talents")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (talentError || !talent) {
      return NextResponse.json(
        { success: false, error: "TALENT_NOT_FOUND", message: "Data talent tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update talent record
    const { data: updatedTalent, error: updateError } = await supabase
      .from("talents")
      .update({
        category: validated.category,
        gender: validated.gender,
        date_of_birth: validated.date_of_birth,
        height_cm: validated.height_cm,
        weight_kg: validated.weight_kg,
        city: validated.city,
        province: validated.province || null,
        address: validated.address || null,
        bio: validated.bio || null,
        daily_rate: validated.daily_rate,
        is_available: validated.is_available ?? true,
      })
      .eq("id", talent.id)
      .select()
      .single();

    if (updateError) {
      console.error("Update talent error:", updateError);
      return NextResponse.json(
        { success: false, error: "UPDATE_ERROR", message: "Gagal memperbarui profil" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTalent,
      message: "Profil berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update talent profile error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
