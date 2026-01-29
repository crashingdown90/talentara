import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * DELETE /api/talent/applications/[id]
 * Withdraw a pending job application
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check application exists and belongs to talent
    const { data: application, error: fetchError } = await supabase
      .from("job_applications")
      .select("id, status")
      .eq("id", id)
      .eq("talent_id", talent.id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { success: false, error: "NOT_FOUND", message: "Lamaran tidak ditemukan" },
        { status: 404 }
      );
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "CANNOT_WITHDRAW", message: "Hanya lamaran dengan status pending yang bisa ditarik" },
        { status: 400 }
      );
    }

    // Update status to withdrawn
    const { error: updateError } = await supabase
      .from("job_applications")
      .update({ status: "withdrawn", responded_at: new Date().toISOString() })
      .eq("id", id)
      .eq("talent_id", talent.id);

    if (updateError) {
      console.error("Withdraw application error:", updateError);
      return NextResponse.json(
        { success: false, error: "UPDATE_ERROR", message: "Gagal menarik lamaran" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lamaran berhasil ditarik",
    });
  } catch (error) {
    console.error("Withdraw application error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
