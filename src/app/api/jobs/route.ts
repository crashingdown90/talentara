import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PAGE_SIZE = 20;

/**
 * GET /api/jobs
 * List open jobs with filters, search, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    // Parse query params
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const city = searchParams.get("city") || "";
    const jobType = searchParams.get("job_type") || "";
    const gender = searchParams.get("gender") || "";
    const minRate = searchParams.get("min_rate");
    const maxRate = searchParams.get("max_rate");
    const sort = searchParams.get("sort") || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_PAGE_SIZE), 10)));

    const offset = (page - 1) * limit;

    // Build query — only show open jobs
    let query = supabase
      .from("jobs")
      .select(
        `*, company:companies(id, company_name, company_logo_url, city)`,
        { count: "exact" }
      )
      .eq("status", "open");

    // Filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      // "both" matches spg, usher, or both
      if (category === "spg" || category === "usher") {
        query = query.in("category", [category, "both"]);
      } else {
        query = query.eq("category", category);
      }
    }

    if (city) {
      query = query.eq("location_city", city);
    }

    if (jobType) {
      query = query.eq("job_type", jobType);
    }

    if (gender) {
      if (gender === "male" || gender === "female") {
        query = query.in("gender_requirement", [gender, "any"]);
      }
    }

    if (minRate) {
      query = query.gte("daily_rate", parseInt(minRate, 10));
    }

    if (maxRate) {
      query = query.lte("daily_rate", parseInt(maxRate, 10));
    }

    // Only show jobs that haven't passed their start date
    const today = new Date().toISOString().split("T")[0];
    query = query.gte("start_date", today);

    // Sorting
    switch (sort) {
      case "rate_high":
        query = query.order("daily_rate", { ascending: false });
        break;
      case "rate_low":
        query = query.order("daily_rate", { ascending: true });
        break;
      case "deadline":
        query = query.order("start_date", { ascending: true });
        break;
      case "latest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error, count } = await query;

    if (error) {
      console.error("List jobs error:", error);
      return NextResponse.json(
        { success: false, error: "FETCH_ERROR", message: "Gagal memuat lowongan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("List jobs error:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
