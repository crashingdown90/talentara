import { z } from "zod";

// =============================
// Talent Profile Schema
// =============================

export const talentProfileSchema = z.object({
  category: z.enum(["spg", "usher", "both"], {
    message: "Pilih kategori talent",
  }),
  gender: z.enum(["male", "female"], {
    message: "Pilih jenis kelamin",
  }),
  date_of_birth: z
    .string()
    .min(1, "Tanggal lahir wajib diisi")
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return age >= 17 && age <= 45;
    }, "Usia harus antara 17-45 tahun"),
  height_cm: z
    .number({ message: "Tinggi badan wajib diisi" })
    .min(140, "Tinggi badan minimal 140 cm")
    .max(210, "Tinggi badan maksimal 210 cm"),
  weight_kg: z
    .number({ message: "Berat badan wajib diisi" })
    .min(35, "Berat badan minimal 35 kg")
    .max(150, "Berat badan maksimal 150 kg"),
  city: z.string().min(1, "Kota wajib diisi"),
  province: z.string().optional(),
  address: z.string().optional(),
  bio: z
    .string()
    .max(500, "Bio maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  daily_rate: z
    .number({ message: "Rate harian wajib diisi" })
    .min(50000, "Rate minimal Rp 50.000")
    .max(10000000, "Rate maksimal Rp 10.000.000"),
  is_available: z.boolean().optional(),
});

export type TalentProfileInput = z.infer<typeof talentProfileSchema>;

// =============================
// Portfolio Schema
// =============================

export const portfolioSchema = z.object({
  media_type: z.enum(["image", "video"], {
    message: "Pilih tipe media",
  }),
  media_url: z.string().url("URL media tidak valid"),
  thumbnail_url: z.string().url("URL thumbnail tidak valid").optional().or(z.literal("")),
  caption: z
    .string()
    .max(200, "Caption maksimal 200 karakter")
    .optional()
    .or(z.literal("")),
  event_name: z
    .string()
    .max(100, "Nama event maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;

// =============================
// Experience Schema
// =============================

export const experienceSchema = z.object({
  company_name: z
    .string()
    .min(1, "Nama perusahaan wajib diisi")
    .max(100, "Nama perusahaan maksimal 100 karakter"),
  event_name: z
    .string()
    .max(100, "Nama event maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  role: z
    .string()
    .min(1, "Posisi/role wajib diisi")
    .max(100, "Posisi/role maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
