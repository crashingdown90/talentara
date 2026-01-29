"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Undo2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { TALENT_CATEGORIES } from "@/lib/utils/constants";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils/format";
import type { Job, JobApplication, Company } from "@/types";

interface ApplicationWithJob extends Omit<JobApplication, "job"> {
  job: Pick<Job, "id" | "title" | "category" | "job_type" | "location_city" | "start_date" | "end_date" | "daily_rate" | "total_slots" | "filled_slots" | "status"> & {
    company: Pick<Company, "id" | "company_name" | "company_logo_url">;
  };
}

const APPLICATION_STATUS = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  accepted: { label: "Diterima", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-800", icon: XCircle },
  withdrawn: { label: "Ditarik", color: "bg-gray-100 text-gray-800", icon: Undo2 },
} as const;

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.set("status", statusFilter);

        const response = await fetch(`/api/talent/applications${params.toString() ? `?${params}` : ""}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal memuat lamaran");
        }

        setApplications(result.data || []);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal memuat lamaran");
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, [statusFilter]);

  const handleWithdraw = async (applicationId: string) => {
    setWithdrawingId(applicationId);
    try {
      const response = await fetch(`/api/talent/applications/${applicationId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menarik lamaran");
      }

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: "withdrawn" as const } : app
        )
      );
      toast.success("Lamaran berhasil ditarik");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/jobs" className="mb-2 inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali ke Lowongan
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Lamaran Saya</h1>
          <p className="text-sm text-muted-foreground">
            Lihat dan kelola semua lamaran Anda
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="accepted">Diterima</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
            <SelectItem value="withdrawn">Ditarik</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <LoadingSpinner size="lg" text="Memuat lamaran..." />
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">Belum ada lamaran</p>
            <p className="mb-4 text-xs text-gray-400">
              Cari dan lamar lowongan yang sesuai dengan Anda
            </p>
            <Link href="/jobs">
              <Button variant="outline" size="sm">
                Cari Lowongan
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => {
            const status = APPLICATION_STATUS[app.status];
            const StatusIcon = status.icon;
            const categoryLabel =
              TALENT_CATEGORIES.find((c) => c.value === app.job?.category)?.label || "";

            return (
              <Card key={app.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      {/* Job Info */}
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {app.job?.title}
                        </h3>
                        <Badge className={status.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{app.job?.company?.company_name}</p>

                      {/* Job Meta */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {categoryLabel && <Badge variant="secondary" className="text-xs">{categoryLabel}</Badge>}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {app.job?.location_city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {app.job?.start_date ? formatDate(app.job.start_date) : "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          {app.job?.daily_rate ? formatCurrency(app.job.daily_rate) : "-"}/hari
                        </span>
                      </div>

                      {/* Cover Message */}
                      {app.cover_message && (
                        <div className="mt-3 rounded-md bg-gray-50 p-2">
                          <p className="text-xs text-gray-500">Cover message:</p>
                          <p className="text-xs text-gray-700">{app.cover_message}</p>
                        </div>
                      )}

                      {/* Applied Time */}
                      <p className="mt-2 text-xs text-gray-400">
                        Dilamar {formatRelativeTime(app.applied_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col gap-2">
                      <Link href={`/jobs/${app.job_id}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-1 h-3.5 w-3.5" />
                          Detail
                        </Button>
                      </Link>
                      {app.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawingId === app.id}
                        >
                          <Undo2 className="mr-1 h-3.5 w-3.5" />
                          {withdrawingId === app.id ? "..." : "Tarik"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
