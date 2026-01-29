import { createClient } from "@/lib/supabase/server";
import { experienceSchema } from "@/lib/validations/talent";
import { NextResponse } from "next/server";

/**
 * PUT /api/talent/experience/[id]
 * Update an experience entry
 */
export async function PUT(
  request: Request,
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

    const body = await request.json();

    // Validate input
    const result = experienceSchema.safeParse(body);
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

    // Update experience (ownership enforced by talent_id check)
    const { data: experience, error: updateError } = await supabase
      .from("talent_experiences")
      .update({
        company_name: validated.company_name,
        event_name: validated.event_name || null,
        role: validated.role,
        description: validated.description || null,
        start_date: validated.start_date || null,
        end_date: validated.end_date || null,
      })
      .eq("id", id)
      .eq("talent_id", talent.id)
      .select()
      .single();

    if (updateError) {
      console.error("Update experience error:", updateError);
      return NextResponse.json(
        { success: false, error: "UPDATE_ERROR", message: "Gagal memperbarui pengalaman" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
      message: "Pengalaman berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update experience error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/talent/experience/[id]
 * Delete an experience entry
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

    // Delete with ownership check
    const { error: deleteError } = await supabase
      .from("talent_experiences")
      .delete()
      .eq("id", id)
      .eq("talent_id", talent.id);

    if (deleteError) {
      console.error("Delete experience error:", deleteError);
      return NextResponse.json(
        { success: false, error: "DELETE_ERROR", message: "Gagal menghapus pengalaman" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pengalaman berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
