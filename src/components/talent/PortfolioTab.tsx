"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Image as ImageIcon, Video, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { portfolioSchema, type PortfolioInput } from "@/lib/validations/talent";
import type { TalentPortfolio } from "@/types";

interface PortfolioTabProps {
  portfolio: TalentPortfolio[];
  onAdd: (item: TalentPortfolio) => void;
  onDelete: (id: string) => void;
}

export function PortfolioTab({ portfolio, onAdd, onDelete }: PortfolioTabProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<TalentPortfolio | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/talent/portfolio/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus portfolio");
      }

      onDelete(id);
      toast.success("Portfolio berhasil dihapus");
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
          <CardTitle className="text-lg">Portfolio</CardTitle>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        </CardHeader>
        <CardContent>
          {portfolio.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="mb-3 h-12 w-12 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Belum ada portfolio</p>
              <p className="mb-4 text-xs text-gray-400">Tambahkan foto atau video dari event yang pernah Anda ikuti</p>
              <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Tambah Portfolio
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg border bg-gray-50"
                >
                  {/* Media Preview */}
                  <div
                    className="aspect-square cursor-pointer"
                    onClick={() => setPreviewItem(item)}
                  >
                    {item.media_type === "image" ? (
                      <img
                        src={item.media_url}
                        alt={item.caption || "Portfolio"}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <Video className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Overlay with info */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="p-2">
                      {item.event_name && (
                        <p className="text-xs font-medium text-white truncate">{item.event_name}</p>
                      )}
                      {item.caption && (
                        <p className="text-xs text-white/80 truncate">{item.caption}</p>
                      )}
                    </div>
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.media_type === "image" ? (
                        <><ImageIcon className="mr-1 h-3 w-3" />Foto</>
                      ) : (
                        <><Video className="mr-1 h-3 w-3" />Video</>
                      )}
                    </Badge>
                  </div>

                  {/* Delete button */}
                  <button
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    disabled={deletingId === item.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <AddPortfolioDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={onAdd}
      />

      {/* Preview Dialog */}
      {previewItem && (
        <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{previewItem.event_name || "Portfolio"}</DialogTitle>
              {previewItem.caption && (
                <DialogDescription>{previewItem.caption}</DialogDescription>
              )}
            </DialogHeader>
            <div className="overflow-hidden rounded-lg">
              {previewItem.media_type === "image" ? (
                <img
                  src={previewItem.media_url}
                  alt={previewItem.caption || "Portfolio"}
                  className="w-full object-contain max-h-[60vh]"
                />
              ) : (
                <video
                  src={previewItem.media_url}
                  controls
                  className="w-full max-h-[60vh]"
                />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" asChild>
                <a href={previewItem.media_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Buka di Tab Baru
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AddPortfolioDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: TalentPortfolio) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PortfolioInput>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      media_type: "image",
      media_url: "",
      caption: "",
      event_name: "",
    },
  });

  const watchMediaType = watch("media_type");

  const onSubmit = async (data: PortfolioInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/talent/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambah portfolio");
      }

      onAdd(result.data);
      reset();
      onClose();
      toast.success("Portfolio berhasil ditambahkan");
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
          <DialogTitle>Tambah Portfolio</DialogTitle>
          <DialogDescription>
            Tambahkan foto atau video dari event yang pernah Anda ikuti
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Media Type */}
          <div className="space-y-2">
            <Label>Tipe Media *</Label>
            <Select
              value={watchMediaType}
              onValueChange={(val) => setValue("media_type", val as PortfolioInput["media_type"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Foto</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Media URL */}
          <div className="space-y-2">
            <Label>URL Media *</Label>
            <Input
              placeholder="https://res.cloudinary.com/... atau URL lainnya"
              {...register("media_url")}
            />
            {errors.media_url && <p className="text-xs text-red-500">{errors.media_url.message}</p>}
            <p className="text-xs text-gray-400">Upload foto/video ke Cloudinary atau layanan hosting lain, lalu paste URL-nya di sini</p>
          </div>

          {/* Event Name */}
          <div className="space-y-2">
            <Label>Nama Event</Label>
            <Input
              placeholder="contoh: Jakarta Fashion Week 2024"
              {...register("event_name")}
            />
            {errors.event_name && <p className="text-xs text-red-500">{errors.event_name.message}</p>}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label>Caption</Label>
            <Input
              placeholder="Deskripsi singkat tentang foto/video ini"
              {...register("caption")}
            />
            {errors.caption && <p className="text-xs text-red-500">{errors.caption.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              <X className="mr-1 h-4 w-4" />
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Plus className="mr-1 h-4 w-4" />
              {isSubmitting ? "Menambahkan..." : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
