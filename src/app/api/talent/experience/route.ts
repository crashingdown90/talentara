import { createClient } from "@/lib/supabase/server";
import { experienceSchema } from "@/lib/validations/talent";
import { NextResponse } from "next/server";

/**
 * POST /api/talent/experience
 * Add a new experience entry
 */
export async function POST(request: Request) {
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

    // Insert experience
    const { data: experience, error: insertError } = await supabase
      .from("talent_experiences")
      .insert({
        talent_id: talent.id,
        company_name: validated.company_name,
        event_name: validated.event_name || null,
        role: validated.role,
        description: validated.description || null,
        start_date: validated.start_date || null,
        end_date: validated.end_date || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert experience error:", insertError);
      return NextResponse.json(
        { success: false, error: "INSERT_ERROR", message: "Gagal menambah pengalaman" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: experience,
        message: "Pengalaman berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add experience error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
