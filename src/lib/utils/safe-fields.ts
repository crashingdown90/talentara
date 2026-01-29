/**
 * Safe field definitions for API responses.
 *
 * When building API routes, use these field lists to ensure sensitive PII
 * is never accidentally exposed. For public-facing queries (talent browsing,
 * company listings), use the PUBLIC fields. For owner-only queries (own
 * profile, dashboard), the PRIVATE fields include additional data.
 *
 * Alternatively, query the secure views (public_profiles, public_talents,
 * public_companies) defined in migration 015 which enforce this at the DB level.
 */

/** Fields safe to expose in public profile listings */
export const PROFILE_PUBLIC_FIELDS =
  "id, role, full_name, avatar_url, is_verified, is_active, created_at" as const;

/** Fields returned to the profile owner (includes private data) */
export const PROFILE_OWNER_FIELDS =
  "id, role, full_name, email, phone, avatar_url, is_verified, is_active, created_at, updated_at" as const;

/** Fields safe to expose in public talent browsing */
export const TALENT_PUBLIC_FIELDS =
  "id, profile_id, category, gender, date_of_birth, height_cm, weight_kg, city, province, bio, verification_status, rating_avg, rating_count, total_jobs_completed, daily_rate, is_available, created_at, updated_at" as const;

/** Fields returned to the talent owner (includes sensitive data) */
export const TALENT_OWNER_FIELDS =
  "id, profile_id, category, gender, date_of_birth, height_cm, weight_kg, city, province, address, bio, ktp_number, ktp_photo_url, selfie_photo_url, verification_status, rating_avg, rating_count, total_jobs_completed, wallet_balance, daily_rate, is_available, created_at, updated_at" as const;

/** Fields safe to expose in public company listings */
export const COMPANY_PUBLIC_FIELDS =
  "id, profile_id, company_name, company_type, industry, city, province, website, company_logo_url, verification_status, created_at, updated_at" as const;

/** Fields returned to the company owner (includes sensitive data) */
export const COMPANY_OWNER_FIELDS =
  "id, profile_id, company_name, company_type, industry, npwp, nib, address, city, province, website, company_logo_url, legal_doc_url, verification_status, created_at, updated_at" as const;

/** Sensitive fields that must NEVER be included in public responses */
export const SENSITIVE_FIELDS = {
  profiles: ["phone", "email"],
  talents: ["ktp_number", "ktp_photo_url", "selfie_photo_url", "address", "wallet_balance"],
  companies: ["npwp", "nib", "address", "legal_doc_url"],
  withdrawals: ["bank_account_number", "bank_account_name", "bank_name"],
} as const;

/**
 * Strips sensitive fields from an object before returning it in an API response.
 * Use this as a safety net when you can't control the SELECT query.
 */
export function stripSensitiveFields<T extends Record<string, unknown>>(
  data: T,
  table: keyof typeof SENSITIVE_FIELDS
): Partial<T> {
  const fieldsToStrip = SENSITIVE_FIELDS[table] as readonly string[];
  const result = { ...data };
  for (const field of fieldsToStrip) {
    delete result[field];
  }
  return result;
}
