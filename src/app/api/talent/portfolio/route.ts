import { createClient } from "@/lib/supabase/server";
import { portfolioSchema } from "@/lib/validations/talent";
import { NextResponse } from "next/server";

/**
 * POST /api/talent/portfolio
 * Add a new portfolio item
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
    const result = portfolioSchema.safeParse(body);
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

    // Get current max sort_order
    const { data: lastItem } = await supabase
      .from("talent_portfolios")
      .select("sort_order")
      .eq("talent_id", talent.id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (lastItem?.sort_order ?? -1) + 1;

    // Insert portfolio item
    const { data: portfolio, error: insertError } = await supabase
      .from("talent_portfolios")
      .insert({
        talent_id: talent.id,
        media_type: validated.media_type,
        media_url: validated.media_url,
        thumbnail_url: validated.thumbnail_url || null,
        caption: validated.caption || null,
        event_name: validated.event_name || null,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert portfolio error:", insertError);
      return NextResponse.json(
        { success: false, error: "INSERT_ERROR", message: "Gagal menambah portfolio" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: portfolio,
        message: "Portfolio berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add portfolio error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
