import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/talent/applications
 * Get my job applications with job and company details
 */
export async function GET(request: NextRequest) {
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

    // Get talent record
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

    // Parse filters
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("job_applications")
      .select(
        `*, job:jobs(id, title, category, job_type, location_city, start_date, end_date, daily_rate, total_slots, filled_slots, status, company:companies(id, company_name, company_logo_url))`,
        { count: "exact" }
      )
      .eq("talent_id", talent.id);

    if (status) {
      query = query.eq("status", status);
    }

    query = query
      .order("applied_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: applications, error, count } = await query;

    if (error) {
      console.error("List applications error:", error);
      return NextResponse.json(
        { success: false, error: "FETCH_ERROR", message: "Gagal memuat lamaran" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("List applications error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
