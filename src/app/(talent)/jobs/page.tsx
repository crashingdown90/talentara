"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { TALENT_CATEGORIES, JOB_TYPES, CITIES, JOB_STATUS } from "@/lib/utils/constants";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Job, Company } from "@/types";

interface JobWithCompany extends Omit<Job, "company"> {
  company: Pick<Company, "id" | "company_name" | "company_logo_url" | "city">;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru" },
  { value: "rate_high", label: "Rate Tertinggi" },
  { value: "rate_low", label: "Rate Terendah" },
  { value: "deadline", label: "Deadline Terdekat" },
];

export default function JobListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state from URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [jobType, setJobType] = useState(searchParams.get("job_type") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    if (jobType) params.set("job_type", jobType);
    if (sort && sort !== "latest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    return params.toString();
  }, [search, category, city, jobType, sort, page]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const qs = buildQueryString();
      const response = await fetch(`/api/jobs${qs ? `?${qs}` : ""}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memuat lowongan");
      }

      setJobs(result.data || []);
      setPagination(result.pagination);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat lowongan");
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryString]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Sync URL with filters
  useEffect(() => {
    const qs = buildQueryString();
    const currentQs = searchParams.toString();
    if (qs !== currentQs) {
      router.replace(`/jobs${qs ? `?${qs}` : ""}`, { scroll: false });
    }
  }, [buildQueryString, router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCity("");
    setJobType("");
    setSort("latest");
    setPage(1);
  };

  const hasActiveFilters = category || city || jobType || search;

  const categoryLabel = (val: string) =>
    TALENT_CATEGORIES.find((c) => c.value === val)?.label || val;
  const jobTypeLabel = (val: string) =>
    JOB_TYPES.find((t) => t.value === val)?.label || val;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lowongan</h1>
          <p className="text-sm text-muted-foreground">
            Temukan lowongan SPG & Usher yang sesuai untuk Anda
          </p>
        </div>
        <Link href="/jobs/applications">
          <Button variant="outline" size="sm">
            <Briefcase className="mr-1 h-4 w-4" />
            Lamaran Saya
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari lowongan..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit">Cari</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </form>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Kategori</label>
                <Select value={category} onValueChange={(val) => { setCategory(val === "all" ? "" : val); setPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {TALENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Kota</label>
                <Select value={city} onValueChange={(val) => { setCity(val === "all" ? "" : val); setPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kota</SelectItem>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Tipe</label>
                <Select value={jobType} onValueChange={(val) => { setJobType(val === "all" ? "" : val); setPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {JOB_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Urutkan</label>
                <Select value={sort} onValueChange={(val) => { setSort(val); setPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-1 h-4 w-4" />
                    Reset Filter
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Memuat lowongan..." />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">Tidak ada lowongan ditemukan</p>
            <p className="mb-4 text-xs text-gray-400">
              {hasActiveFilters
                ? "Coba ubah filter pencarian Anda"
                : "Belum ada lowongan yang tersedia saat ini"}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Reset Filter
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Job Count */}
          <p className="text-sm text-gray-500">
            Menampilkan {jobs.length} dari {pagination.total} lowongan
          </p>

          {/* Job Cards */}
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Halaman {page} dari {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function JobCard({ job }: { job: JobWithCompany }) {
  const slotsLeft = job.total_slots - job.filled_slots;
  const categoryLabel =
    TALENT_CATEGORIES.find((c) => c.value === job.category)?.label || job.category;
  const jobTypeLabel =
    JOB_TYPES.find((t) => t.value === job.job_type)?.label || job.job_type;

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Title & Company */}
              <h3 className="text-base font-semibold text-gray-900 truncate">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company?.company_name}</p>

              {/* Badges */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs">{categoryLabel}</Badge>
                <Badge variant="outline" className="text-xs">{jobTypeLabel}</Badge>
                {job.gender_requirement && job.gender_requirement !== "any" && (
                  <Badge variant="outline" className="text-xs">
                    {job.gender_requirement === "male" ? "Pria" : "Wanita"}
                  </Badge>
                )}
                {job.min_height_cm && (
                  <Badge variant="outline" className="text-xs">Min {job.min_height_cm} cm</Badge>
                )}
              </div>

              {/* Details */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location_city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(job.start_date)}
                  {job.end_date !== job.start_date && ` - ${formatDate(job.end_date)}`}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {slotsLeft} slot tersisa
                </span>
              </div>
            </div>

            {/* Rate */}
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold text-brand-600">
                {formatCurrency(job.daily_rate)}
              </p>
              <p className="text-xs text-gray-400">/hari</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
