"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Save, X, User, MapPin, Ruler, Weight, Calendar, Tag, DollarSign } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { talentProfileSchema, type TalentProfileInput } from "@/lib/validations/talent";
import { TALENT_CATEGORIES, GENDER_OPTIONS, CITIES, VERIFICATION_STATUS } from "@/lib/utils/constants";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Talent, Profile } from "@/types";

interface ProfileInfoTabProps {
  profile: Profile;
  talent: Talent;
  onUpdate: (talent: Talent) => void;
}

export function ProfileInfoTab({ profile, talent, onUpdate }: ProfileInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TalentProfileInput>({
    resolver: zodResolver(talentProfileSchema),
    defaultValues: {
      category: talent.category,
      gender: talent.gender || undefined,
      date_of_birth: talent.date_of_birth || "",
      height_cm: talent.height_cm || undefined,
      weight_kg: talent.weight_kg || undefined,
      city: talent.city || "",
      province: talent.province || "",
      address: talent.address || "",
      bio: talent.bio || "",
      daily_rate: talent.daily_rate || undefined,
      is_available: talent.is_available,
    },
  });

  const watchCategory = watch("category");
  const watchGender = watch("gender");
  const watchCity = watch("city");

  const onSubmit = async (data: TalentProfileInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/talent/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal memperbarui profil");
      }

      onUpdate(result.data);
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset({
      category: talent.category,
      gender: talent.gender || undefined,
      date_of_birth: talent.date_of_birth || "",
      height_cm: talent.height_cm || undefined,
      weight_kg: talent.weight_kg || undefined,
      city: talent.city || "",
      province: talent.province || "",
      address: talent.address || "",
      bio: talent.bio || "",
      daily_rate: talent.daily_rate || undefined,
      is_available: talent.is_available,
    });
    setIsEditing(false);
  };

  const verificationStatus = VERIFICATION_STATUS[talent.verification_status];
  const categoryLabel = TALENT_CATEGORIES.find((c) => c.value === talent.category)?.label || talent.category;
  const genderLabel = GENDER_OPTIONS.find((g) => g.value === talent.gender)?.label || "-";

  // Calculate profile completion
  const fields = [
    talent.category,
    talent.gender,
    talent.date_of_birth,
    talent.height_cm,
    talent.weight_kg,
    talent.city,
    talent.bio,
    talent.daily_rate,
  ];
  const filledFields = fields.filter(Boolean).length;
  const completionPercentage = Math.round((filledFields / fields.length) * 100);

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Edit Profil</CardTitle>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting}>
                <X className="mr-1 h-4 w-4" />
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                <Save className="mr-1 h-4 w-4" />
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category & Gender */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Kategori Talent *</Label>
                <Select value={watchCategory} onValueChange={(val) => setValue("category", val as TalentProfileInput["category"])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {TALENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Jenis Kelamin *</Label>
                <Select value={watchGender} onValueChange={(val) => setValue("gender", val as TalentProfileInput["gender"])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label>Tanggal Lahir *</Label>
              <Input type="date" {...register("date_of_birth")} />
              {errors.date_of_birth && <p className="text-xs text-red-500">{errors.date_of_birth.message}</p>}
            </div>

            {/* Height & Weight */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tinggi Badan (cm) *</Label>
                <Input
                  type="number"
                  placeholder="contoh: 165"
                  {...register("height_cm", { valueAsNumber: true })}
                />
                {errors.height_cm && <p className="text-xs text-red-500">{errors.height_cm.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Berat Badan (kg) *</Label>
                <Input
                  type="number"
                  placeholder="contoh: 55"
                  {...register("weight_kg", { valueAsNumber: true })}
                />
                {errors.weight_kg && <p className="text-xs text-red-500">{errors.weight_kg.message}</p>}
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>Kota *</Label>
              <Select value={watchCity} onValueChange={(val) => setValue("city", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kota" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Alamat Lengkap</Label>
              <Textarea
                placeholder="Alamat lengkap (opsional)"
                {...register("address")}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Ceritakan tentang diri Anda, pengalaman, dan keahlian..."
                rows={4}
                {...register("bio")}
              />
              {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
            </div>

            {/* Daily Rate */}
            <div className="space-y-2">
              <Label>Rate Harian (Rp) *</Label>
              <Input
                type="number"
                placeholder="contoh: 500000"
                {...register("daily_rate", { valueAsNumber: true })}
              />
              {errors.daily_rate && <p className="text-xs text-red-500">{errors.daily_rate.message}</p>}
            </div>
          </CardContent>
        </Card>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      {completionPercentage < 100 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Profil Anda {completionPercentage}% lengkap
                </p>
                <p className="text-xs text-yellow-600">Lengkapi profil agar lebih mudah ditemukan oleh perusahaan</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Lengkapi
              </Button>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-yellow-200">
              <div
                className="h-2 rounded-full bg-yellow-500 transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Informasi Profil</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={<User className="h-4 w-4" />} label="Nama Lengkap" value={profile.full_name} />
            <InfoRow icon={<Tag className="h-4 w-4" />} label="Kategori" value={categoryLabel} />
            <InfoRow icon={<User className="h-4 w-4" />} label="Jenis Kelamin" value={genderLabel} />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Tanggal Lahir"
              value={talent.date_of_birth ? formatDate(talent.date_of_birth) : "-"}
            />
            <InfoRow icon={<Ruler className="h-4 w-4" />} label="Tinggi Badan" value={talent.height_cm ? `${talent.height_cm} cm` : "-"} />
            <InfoRow icon={<Weight className="h-4 w-4" />} label="Berat Badan" value={talent.weight_kg ? `${talent.weight_kg} kg` : "-"} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Kota" value={talent.city || "-"} />
            <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Rate Harian" value={talent.daily_rate ? formatCurrency(talent.daily_rate) : "-"} />
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Badge className={verificationStatus.color}>{verificationStatus.label}</Badge>
            <Badge variant={talent.is_available ? "default" : "secondary"}>
              {talent.is_available ? "Tersedia" : "Tidak Tersedia"}
            </Badge>
          </div>

          {/* Bio */}
          {talent.bio && (
            <div className="border-t pt-4">
              <p className="mb-1 text-sm font-medium text-gray-500">Bio</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{talent.bio}</p>
            </div>
          )}

          {/* Address */}
          {talent.address && (
            <div className="border-t pt-4">
              <p className="mb-1 text-sm font-medium text-gray-500">Alamat</p>
              <p className="text-sm text-gray-700">{talent.address}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatItem label="Rating" value={talent.rating_avg > 0 ? talent.rating_avg.toFixed(1) : "-"} />
            <StatItem label="Ulasan" value={talent.rating_count.toString()} />
            <StatItem label="Job Selesai" value={talent.total_jobs_completed.toString()} />
            <StatItem label="Saldo Wallet" value={formatCurrency(talent.wallet_balance)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
