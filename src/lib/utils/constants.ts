// =============================
// App Constants
// =============================

export const APP_NAME = "TALENTARA";
export const APP_DESCRIPTION = "Platform marketplace talent digital yang menghubungkan perusahaan dengan talent profesional (SPG & Usher)";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// =============================
// Commission Rates
// =============================

export const COMMISSION_RATES = {
  TALENT: Number(process.env.NEXT_PUBLIC_COMMISSION_TALENT) || 0.10, // 10%
  CLIENT: Number(process.env.NEXT_PUBLIC_COMMISSION_CLIENT) || 0.05, // 5%
} as const;

// =============================
// Talent Categories
// =============================

export const TALENT_CATEGORIES = [
  { value: "spg", label: "SPG (Sales Promotion Girl/Guy)" },
  { value: "usher", label: "Usher" },
  { value: "both", label: "SPG & Usher" },
] as const;

export type TalentCategory = (typeof TALENT_CATEGORIES)[number]["value"];

// =============================
// Gender Options
// =============================

export const GENDER_OPTIONS = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
] as const;

export type Gender = (typeof GENDER_OPTIONS)[number]["value"];

// =============================
// User Roles
// =============================

export const USER_ROLES = [
  { value: "talent", label: "Talent", description: "Saya ingin bekerja sebagai SPG/Usher" },
  { value: "client", label: "Client", description: "Saya ingin mencari talent untuk event/project" },
] as const;

export type UserRole = "talent" | "client" | "admin";

// =============================
// Status Labels & Colors
// =============================

export const BOOKING_STATUS = {
  pending: { label: "Menunggu Pembayaran", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Dibayar", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "Sedang Berjalan", color: "bg-indigo-100 text-indigo-800" },
  completed: { label: "Selesai", color: "bg-green-100 text-green-800" },
  confirmed: { label: "Dikonfirmasi", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
  disputed: { label: "Dispute", color: "bg-orange-100 text-orange-800" },
} as const;

export const VERIFICATION_STATUS = {
  pending: { label: "Menunggu Verifikasi", color: "bg-yellow-100 text-yellow-800" },
  verified: { label: "Terverifikasi", color: "bg-green-100 text-green-800" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-800" },
} as const;

export const JOB_STATUS = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  open: { label: "Terbuka", color: "bg-green-100 text-green-800" },
  in_progress: { label: "Sedang Berjalan", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Selesai", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
} as const;

export const JOB_TYPES = [
  { value: "one_time", label: "Sekali" },
  { value: "recurring", label: "Berulang" },
  { value: "long_term", label: "Jangka Panjang" },
] as const;

// =============================
// Provinces in Indonesia (Major cities)
// =============================

export const CITIES = [
  "Semarang", "Jakarta", "Surabaya", "Bandung", "Medan",
  "Makassar", "Palembang", "Tangerang", "Depok", "Bekasi",
  "Solo", "Yogyakarta", "Malang", "Denpasar", "Pontianak",
  "Balikpapan", "Manado", "Padang", "Pekanbaru", "Batam",
] as const;

// =============================
// Pagination
// =============================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// =============================
// File Upload Limits
// =============================

export const FILE_LIMITS = {
  AVATAR: { maxSize: 5 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
  PORTFOLIO_IMAGE: { maxSize: 10 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
  PORTFOLIO_VIDEO: { maxSize: 50 * 1024 * 1024, types: ["video/mp4", "video/webm"] },
  DOCUMENT: { maxSize: 10 * 1024 * 1024, types: ["image/jpeg", "image/png", "application/pdf"] },
} as const;
