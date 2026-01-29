"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Building,
  Ruler,
  User,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { TALENT_CATEGORIES, JOB_TYPES, JOB_STATUS } from "@/lib/utils/constants";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Job, Company, JobApplication } from "@/types";

interface JobDetail extends Omit<Job, "company"> {
  company: Pick<Company, "id" | "company_name" | "company_logo_url" | "city" | "industry">;
  my_application: Pick<JobApplication, "id" | "status" | "cover_message" | "applied_at"> | null;
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplyDialog, setShowApplyDialog] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal memuat lowongan");
        }

        setJob(result.data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal memuat lowongan");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat detail lowongan..." />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <Briefcase className="mb-3 h-12 w-12 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">Lowongan tidak ditemukan</p>
        <Link href="/jobs" className="mt-3">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali ke Lowongan
          </Button>
        </Link>
      </div>
    );
  }

  const slotsLeft = job.total_slots - job.filled_slots;
  const categoryLabel = TALENT_CATEGORIES.find((c) => c.value === job.category)?.label || job.category;
  const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.job_type)?.label || job.job_type;
  const statusInfo = JOB_STATUS[job.status];

  const handleApplied = (application: JobDetail["my_application"]) => {
    setJob((prev) => (prev ? { ...prev, my_application: application } : prev));
    setShowApplyDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/jobs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Kembali ke Lowongan
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Job Header */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                  <p className="mt-1 text-sm text-gray-600">
                    <Building className="mr-1 inline h-4 w-4" />
                    {job.company?.company_name}
                    {job.company?.industry && ` · ${job.company.industry}`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    <Badge variant="secondary">{categoryLabel}</Badge>
                    <Badge variant="outline">{jobTypeLabel}</Badge>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-brand-600">{formatCurrency(job.daily_rate)}</p>
                  <p className="text-xs text-gray-400">/hari</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {(job.requirements || job.dress_code) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Persyaratan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.requirements && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Persyaratan Tambahan</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{job.requirements}</p>
                  </div>
                )}
                {job.dress_code && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Dress Code</p>
                    <p className="text-sm text-gray-700">{job.dress_code}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Action */}
          <Card>
            <CardContent className="p-5">
              {job.my_application ? (
                <ApplicationStatus application={job.my_application} />
              ) : job.status === "open" && slotsLeft > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Tertarik dengan lowongan ini?</p>
                  <Button className="w-full" onClick={() => setShowApplyDialog(true)}>
                    <Send className="mr-1 h-4 w-4" />
                    Lamar Sekarang
                  </Button>
                  <p className="text-center text-xs text-gray-400">{slotsLeft} slot tersisa</p>
                </div>
              ) : (
                <div className="text-center">
                  <XCircle className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">Lowongan tidak tersedia</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DetailRow icon={<MapPin className="h-4 w-4" />} label="Lokasi" value={job.location_city} />
              {job.location_address && (
                <DetailRow icon={<MapPin className="h-4 w-4" />} label="Alamat" value={job.location_address} />
              )}
              <Separator />
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Tanggal"
                value={
                  job.start_date === job.end_date
                    ? formatDate(job.start_date)
                    : `${formatDate(job.start_date)} - ${formatDate(job.end_date)}`
                }
              />
              {(job.start_time || job.end_time) && (
                <DetailRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Jam"
                  value={`${job.start_time || "?"} - ${job.end_time || "?"}`}
                />
              )}
              <Separator />
              <DetailRow icon={<Users className="h-4 w-4" />} label="Slot" value={`${slotsLeft} / ${job.total_slots}`} />
              {job.gender_requirement && job.gender_requirement !== "any" && (
                <DetailRow
                  icon={<User className="h-4 w-4" />}
                  label="Gender"
                  value={job.gender_requirement === "male" ? "Pria" : "Wanita"}
                />
              )}
              {job.min_height_cm && (
                <DetailRow icon={<Ruler className="h-4 w-4" />} label="Min. Tinggi" value={`${job.min_height_cm} cm`} />
              )}
              {(job.min_age || job.max_age) && (
                <DetailRow
                  icon={<User className="h-4 w-4" />}
                  label="Usia"
                  value={
                    job.min_age && job.max_age
                      ? `${job.min_age} - ${job.max_age} tahun`
                      : job.min_age
                        ? `Min. ${job.min_age} tahun`
                        : `Max. ${job.max_age} tahun`
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply Dialog */}
      <ApplyDialog
        open={showApplyDialog}
        onClose={() => setShowApplyDialog(false)}
        jobId={job.id}
        jobTitle={job.title}
        onApplied={handleApplied}
      />
    </div>
  );
}

function ApplicationStatus({
  application,
}: {
  application: Pick<JobApplication, "id" | "status" | "cover_message" | "applied_at">;
}) {
  const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: {
      label: "Menunggu Respon",
      color: "text-yellow-600",
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
    },
    accepted: {
      label: "Diterima",
      color: "text-green-600",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    rejected: {
      label: "Ditolak",
      color: "text-red-600",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
    withdrawn: {
      label: "Ditarik",
      color: "text-gray-600",
      icon: <XCircle className="h-5 w-5 text-gray-400" />,
    },
  };

  const info = statusMap[application.status] || statusMap.pending;

  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center">{info.icon}</div>
      <p className={`text-sm font-semibold ${info.color}`}>Lamaran {info.label}</p>
      <p className="text-xs text-gray-400">
        Dilamar pada {formatDate(application.applied_at)}
      </p>
    </div>
  );
}

function ApplyDialog({
  open,
  onClose,
  jobId,
  jobTitle,
  onApplied,
}: {
  open: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  onApplied: (application: Pick<JobApplication, "id" | "status" | "cover_message" | "applied_at">) => void;
}) {
  const [coverMessage, setCoverMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cover_message: coverMessage }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengirim lamaran");
      }

      onApplied(result.data);
      toast.success("Lamaran berhasil dikirim!");
      setCoverMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lamar Lowongan</DialogTitle>
          <DialogDescription>
            Kirim lamaran Anda untuk &ldquo;{jobTitle}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Message (opsional)</label>
            <Textarea
              placeholder="Ceritakan mengapa Anda cocok untuk lowongan ini..."
              rows={4}
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-gray-400">{coverMessage.length}/500 karakter</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-1 h-4 w-4" />
                Kirim Lamaran
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
