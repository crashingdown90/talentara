import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format number to Indonesian Rupiah currency
 * @example formatCurrency(1500000) => "Rp 1.500.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian locale
 * @example formatDate("2024-01-15") => "15 Januari 2024"
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), "d MMMM yyyy", { locale: id });
}

/**
 * Format date with time
 * @example formatDateTime("2024-01-15T10:30:00") => "15 Jan 2024, 10:30"
 */
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "d MMM yyyy, HH:mm", { locale: id });
}

/**
 * Format relative time
 * @example formatRelativeTime("2024-01-15T10:30:00") => "2 jam yang lalu"
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
}

/**
 * Format phone number to Indonesian format
 * @example formatPhone("081234567890") => "+62 812-3456-7890"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  let normalized = cleaned;

  if (normalized.startsWith("0")) {
    normalized = "62" + normalized.slice(1);
  } else if (!normalized.startsWith("62")) {
    normalized = "62" + normalized;
  }

  const match = normalized.match(/^(\d{2})(\d{3})(\d{4})(\d+)$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
  }

  return phone;
}

/**
 * Format rating number
 * @example formatRating(4.5) => "4.5"
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Format compact number
 * @example formatCompactNumber(1500) => "1,5rb"
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(".", ",") + "jt";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(".", ",") + "rb";
  }
  return num.toString();
}

/**
 * Truncate text with ellipsis
 * @example truncateText("Hello World", 5) => "Hello..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
