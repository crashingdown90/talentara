import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .max(255, "Email maksimal 255 karakter")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(128, "Password maksimal 128 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[0-9]/, "Password harus mengandung angka"),
  confirmPassword: z
    .string()
    .min(1, "Konfirmasi password wajib diisi")
    .max(128, "Password maksimal 128 karakter"),
  full_name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  phone: z
    .string()
    .regex(
      /^(\+62|62|0)8[0-9]{7,12}$/,
      "Format nomor HP tidak valid (contoh: 081234567890)"
    ),
  role: z.enum(["talent", "client"], {
    message: "Pilih tipe akun",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .max(255, "Email maksimal 255 karakter")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .max(128, "Password maksimal 128 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
