"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Briefcase, Calendar, X, Save, Building } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { experienceSchema, type ExperienceInput } from "@/lib/validations/talent";
import { formatDate } from "@/lib/utils/format";
import type { TalentExperience } from "@/types";

interface ExperienceTabProps {
  experiences: TalentExperience[];
  onAdd: (exp: TalentExperience) => void;
  onUpdate: (exp: TalentExperience) => void;
  onDelete: (id: string) => void;
}

export function ExperienceTab({ experiences, onAdd, onUpdate, onDelete }: ExperienceTabProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingExp, setEditingExp] = useState<TalentExperience | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/talent/experience/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus pengalaman");
      }

      onDelete(id);
      toast.success("Pengalaman berhasil dihapus");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Pengalaman Kerja</CardTitle>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        </CardHeader>
        <CardContent>
          {experiences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="mb-3 h-12 w-12 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Belum ada pengalaman</p>
              <p className="mb-4 text-xs text-gray-400">Tambahkan pengalaman kerja Anda sebagai SPG/Usher</p>
              <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Tambah Pengalaman
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="relative rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                        <Building className="h-5 w-5 text-brand-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{exp.role}</p>
                        <p className="text-sm text-gray-600">{exp.company_name}</p>
                        {exp.event_name && (
                          <p className="text-xs text-gray-500">{exp.event_name}</p>
                        )}
                        {(exp.start_date || exp.end_date) && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {exp.start_date ? formatDate(exp.start_date) : "?"}
                              {" - "}
                              {exp.end_date ? formatDate(exp.end_date) : "Sekarang"}
                            </span>
                          </div>
                        )}
                        {exp.description && (
                          <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingExp(exp)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(exp.id)}
                        disabled={deletingId === exp.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <ExperienceDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSave={(exp) => {
          onAdd(exp);
          setShowAddDialog(false);
        }}
      />

      {/* Edit Dialog */}
      {editingExp && (
        <ExperienceDialog
          open={!!editingExp}
          onClose={() => setEditingExp(null)}
          experience={editingExp}
          onSave={(exp) => {
            onUpdate(exp);
            setEditingExp(null);
          }}
        />
      )}
    </div>
  );
}

function ExperienceDialog({
  open,
  onClose,
  experience,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  experience?: TalentExperience;
  onSave: (exp: TalentExperience) => void;
}) {
  const isEdit = !!experience;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: experience?.company_name || "",
      event_name: experience?.event_name || "",
      role: experience?.role || "",
      description: experience?.description || "",
      start_date: experience?.start_date || "",
      end_date: experience?.end_date || "",
    },
  });

  const onSubmit = async (data: ExperienceInput) => {
    setIsSubmitting(true);
    try {
      const url = isEdit
        ? `/api/talent/experience/${experience.id}`
        : "/api/talent/experience";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan pengalaman");
      }

      onSave(result.data);
      reset();
      toast.success(isEdit ? "Pengalaman berhasil diperbarui" : "Pengalaman berhasil ditambahkan");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pengalaman" : "Tambah Pengalaman"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi pengalaman kerja Anda"
              : "Tambahkan pengalaman kerja baru"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role */}
          <div className="space-y-2">
            <Label>Posisi/Role *</Label>
            <Input
              placeholder="contoh: SPG, Usher, Brand Ambassador"
              {...register("role")}
            />
            {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label>Nama Perusahaan *</Label>
            <Input
              placeholder="contoh: PT Unilever Indonesia"
              {...register("company_name")}
            />
            {errors.company_name && <p className="text-xs text-red-500">{errors.company_name.message}</p>}
          </div>

          {/* Event Name */}
          <div className="space-y-2">
            <Label>Nama Event</Label>
            <Input
              placeholder="contoh: Jakarta Fair 2024"
              {...register("event_name")}
            />
            {errors.event_name && <p className="text-xs text-red-500">{errors.event_name.message}</p>}
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tanggal Mulai</Label>
              <Input type="date" {...register("start_date")} />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Selesai</Label>
              <Input type="date" {...register("end_date")} />
              <p className="text-xs text-gray-400">Kosongkan jika masih berjalan</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              placeholder="Jelaskan tugas dan tanggung jawab Anda..."
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              <X className="mr-1 h-4 w-4" />
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-1 h-4 w-4" />
              {isSubmitting ? "Menyimpan..." : isEdit ? "Perbarui" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
