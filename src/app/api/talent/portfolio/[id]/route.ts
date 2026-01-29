import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * DELETE /api/talent/portfolio/[id]
 * Delete a portfolio item
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

    // Check ownership and delete
    const { error: deleteError } = await supabase
      .from("talent_portfolios")
      .delete()
      .eq("id", id)
      .eq("talent_id", talent.id);

    if (deleteError) {
      console.error("Delete portfolio error:", deleteError);
      return NextResponse.json(
        { success: false, error: "DELETE_ERROR", message: "Gagal menghapus portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete portfolio error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
