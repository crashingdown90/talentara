import { createClient } from "@/lib/supabase/server";
import { jobApplicationSchema } from "@/lib/validations/job";
import { NextResponse } from "next/server";

/**
 * POST /api/jobs/[id]/apply
 * Talent applies to a job
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const supabase = await createClient();

    // Auth check
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

    // Check role is talent
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "talent") {
      return NextResponse.json(
        { success: false, error: "FORBIDDEN", message: "Hanya talent yang bisa melamar" },
        { status: 403 }
      );
    }

    // Get talent record
    const { data: talent, error: talentError } = await supabase
      .from("talents")
      .select("id, category, gender, height_cm, date_of_birth, city")
      .eq("profile_id", user.id)
      .single();

    if (talentError || !talent) {
      return NextResponse.json(
        { success: false, error: "TALENT_NOT_FOUND", message: "Data talent tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check job exists and is open
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, status, total_slots, filled_slots, category, gender_requirement, min_height_cm, min_age, max_age")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { success: false, error: "JOB_NOT_FOUND", message: "Lowongan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (job.status !== "open") {
      return NextResponse.json(
        { success: false, error: "JOB_CLOSED", message: "Lowongan sudah ditutup" },
        { status: 400 }
      );
    }

    if (job.filled_slots >= job.total_slots) {
      return NextResponse.json(
        { success: false, error: "JOB_FULL", message: "Slot lowongan sudah penuh" },
        { status: 400 }
      );
    }

    // Check gender requirement
    if (
      job.gender_requirement &&
      job.gender_requirement !== "any" &&
      talent.gender &&
      talent.gender !== job.gender_requirement
    ) {
      return NextResponse.json(
        { success: false, error: "GENDER_MISMATCH", message: "Jenis kelamin Anda tidak sesuai persyaratan" },
        { status: 400 }
      );
    }

    // Check height requirement
    if (job.min_height_cm && talent.height_cm && talent.height_cm < job.min_height_cm) {
      return NextResponse.json(
        { success: false, error: "HEIGHT_MISMATCH", message: `Tinggi badan minimal ${job.min_height_cm} cm` },
        { status: 400 }
      );
    }

    // Check age requirement
    if (talent.date_of_birth && (job.min_age || job.max_age)) {
      const birthDate = new Date(talent.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (job.min_age && age < job.min_age) {
        return NextResponse.json(
          { success: false, error: "AGE_MISMATCH", message: `Usia minimal ${job.min_age} tahun` },
          { status: 400 }
        );
      }
      if (job.max_age && age > job.max_age) {
        return NextResponse.json(
          { success: false, error: "AGE_MISMATCH", message: `Usia maksimal ${job.max_age} tahun` },
          { status: 400 }
        );
      }
    }

    // Check already applied
    const { data: existing } = await supabase
      .from("job_applications")
      .select("id, status")
      .eq("job_id", jobId)
      .eq("talent_id", talent.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "ALREADY_APPLIED", message: "Anda sudah melamar lowongan ini" },
        { status: 409 }
      );
    }

    // Validate body
    const body = await request.json();
    const result = jobApplicationSchema.safeParse(body);
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

    // Create application
    const { data: application, error: insertError } = await supabase
      .from("job_applications")
      .insert({
        job_id: jobId,
        talent_id: talent.id,
        cover_message: result.data.cover_message || null,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Apply job error:", insertError);
      if (insertError.code === "23505") {
        return NextResponse.json(
          { success: false, error: "ALREADY_APPLIED", message: "Anda sudah melamar lowongan ini" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: "INSERT_ERROR", message: "Gagal mengirim lamaran" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: application,
        message: "Lamaran berhasil dikirim",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply job error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
