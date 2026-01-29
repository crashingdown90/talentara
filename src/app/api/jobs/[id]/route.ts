import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/jobs/[id]
 * Get job detail with company info and application status (if talent is logged in)
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch job with company info
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select(`*, company:companies(id, company_name, company_logo_url, city, industry)`)
      .eq("id", id)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "Lowongan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if current user (talent) has already applied
    let myApplication = null;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: talent } = await supabase
        .from("talents")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (talent) {
        const { data: application } = await supabase
          .from("job_applications")
          .select("id, status, cover_message, applied_at")
          .eq("job_id", id)
          .eq("talent_id", talent.id)
          .single();

        myApplication = application;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        my_application: myApplication,
      },
    });
  } catch (error) {
    console.error("Get job detail error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
