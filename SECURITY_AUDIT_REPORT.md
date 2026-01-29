# TALENTARA - Security & Code Audit Report

**Date:** 2026-01-29
**Scope:** Full codebase audit - Sprint 1 (Foundation & MVP)
**Auditor:** Automated Code Audit

---

## Executive Summary

The TALENTARA codebase was audited across security, code quality, database design, API routes, frontend components, and configuration. **1 CRITICAL**, **4 HIGH**, and **several MEDIUM/LOW** severity issues were identified. All CRITICAL and HIGH issues have been fixed in this commit.

---

## Findings Summary

| Severity | Count | Fixed |
|----------|-------|-------|
| CRITICAL | 1 | 1 |
| HIGH | 4 | 4 |
| MEDIUM | 5 | 2 |
| LOW | 8 | 0 |

---

## CRITICAL Issues

### C1. Hardcoded Database Credentials in Git [FIXED]
- **File:** `scripts/run-migrations.mjs:14-15`
- **Description:** Production PostgreSQL connection string with plaintext password (`GunungAgung13$$`) was hardcoded and committed to version control.
- **Impact:** Anyone with repository access gets full database access. If the repo becomes public, the database is immediately compromised.
- **Fix Applied:** Replaced hardcoded string with `process.env.DATABASE_URL` with validation. Added `DATABASE_URL` to `.env.example`.
- **Additional Action Required:** **Immediately rotate the database password** since it has been committed to git history. Use `git filter-branch` or BFG Repo-Cleaner to remove it from history.

---

## HIGH Issues

### H1. Open Redirect Vulnerability in Auth Callback [FIXED]
- **File:** `src/app/api/auth/callback/route.ts:11,33`
- **Description:** The `next` query parameter was used directly in a redirect without validation. An attacker could craft `?next=//evil.com` or `?next=javascript:...` to redirect users to a malicious site.
- **Fix Applied:** Added validation to ensure `next` starts with `/`, does not start with `//`, and contains no `:` character.

### H2. No Rate Limiting on Auth Endpoints [FIXED]
- **Files:** `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts`
- **Description:** Login and registration endpoints had no rate limiting, allowing brute force attacks on passwords and registration spam.
- **Fix Applied:** Created `src/lib/utils/rate-limit.ts` with in-memory rate limiter. Login: 5 attempts/15min per IP. Register: 3 attempts/15min per IP. Returns HTTP 429 with `Retry-After` header.
- **Recommendation:** For production, replace in-memory store with Redis-based rate limiting (e.g., `@upstash/ratelimit`).

### H3. Registration Transaction Not Atomic [FIXED]
- **File:** `src/app/api/auth/register/route.ts:76-92`
- **Description:** When creating role-specific records (talent/company) failed, the error was only logged. This left the database in an inconsistent state: auth user + profile exists, but no talent/company record.
- **Fix Applied:** Added cleanup logic to delete the profile record on role-specific record failure and return an error response.

### H4. Middleware Route Bypass Vulnerabilities [FIXED]
- **File:** `src/middleware.ts:33-39`
- **Description:** Two bypass vectors:
  1. `pathname.startsWith("/api/auth")` allowed ALL auth API routes (including `/api/auth/me` and `/api/auth/logout`) without authentication.
  2. `pathname.includes(".")` for "static files" could bypass auth with URLs like `/admin/page.html`.
- **Fix Applied:** Replaced blanket `/api/auth` allow with specific route matching. Removed the `pathname.includes(".")` check since the matcher config already handles static file exclusion.

---

## MEDIUM Issues

### M1. Wallet Balance Has No Non-Negative Constraint [FIXED]
- **File:** `supabase/migrations/002_create_talents.sql:25`
- **Description:** The `wallet_balance` column had no `CHECK` constraint, allowing negative balances through race conditions or bugs.
- **Fix Applied:** Added `CHECK (wallet_balance >= 0)` constraint.

### M2. Commission Rates Exposed via NEXT_PUBLIC_ Variables [FIXED]
- **File:** `src/lib/utils/constants.ts:13-16`
- **Description:** Commission rates were read from `NEXT_PUBLIC_COMMISSION_TALENT` and `NEXT_PUBLIC_COMMISSION_CLIENT` environment variables. The `NEXT_PUBLIC_` prefix exposes these to the browser bundle, and using env vars means they could be accidentally misconfigured.
- **Fix Applied:** Hardcoded commission rates as constants. Removed `NEXT_PUBLIC_` env vars from `.env.example`.

### M3. SSL Certificate Verification Disabled
- **File:** `scripts/run-migrations.mjs:22`
- **Description:** `ssl: { rejectUnauthorized: false }` disables SSL certificate verification for database connections, making it vulnerable to MITM attacks.
- **Recommendation:** Remove `rejectUnauthorized: false` or set it to `true` for production.

### M4. KTP Number and Bank Account Stored in Plaintext
- **Files:** `supabase/migrations/002_create_talents.sql:17` (ktp_number), `supabase/migrations/012_*.sql:26` (bank_account_number)
- **Description:** Indonesian National ID (KTP) numbers and bank account numbers are stored as plain text. These are sensitive PII/financial data.
- **Recommendation:** Encrypt sensitive fields at the application level before storing, or use PostgreSQL's `pgcrypto` extension for column-level encryption.

### M5. No Content Security Policy (CSP) Headers
- **Files:** `src/middleware.ts`, `next.config.ts`
- **Description:** No CSP headers are configured. This leaves the application vulnerable to XSS attacks that could inject malicious scripts.
- **Recommendation:** Add CSP headers in `next.config.ts` via the `headers()` configuration or in the middleware.

---

## LOW Issues

### L1. select("*") Used in API Routes
- **Files:** `src/app/api/auth/login/route.ts:49`, `src/app/api/auth/me/route.ts:23`
- **Description:** Using `select("*")` fetches all columns including sensitive data that may not be needed.
- **Status:** Partially fixed in login route. The `/api/auth/me` route still uses `select("*")` but returns a filtered response.

### L2. Database Types Not Auto-Generated
- **File:** `src/types/database.ts`
- **Description:** The database types file is a placeholder with only `profiles` and `talents` tables defined. The comment says to replace with auto-generated types, but this hasn't been done.
- **Recommendation:** Run `npx supabase gen types typescript` to generate accurate types.

### L3. No React Error Boundary
- **Description:** No error boundary components exist. Unhandled runtime errors in React components will crash the entire application.
- **Recommendation:** Add `error.tsx` files in route segments using Next.js App Router error handling.

### L4. RLS Policies Allow Public Read on Sensitive Data
- **File:** `supabase/migrations/013_create_rls_policies.sql`
- **Description:** `profiles`, `talents`, `companies`, `jobs`, and `reviews` tables have `FOR SELECT USING (true)` which allows anyone (including unauthenticated users with the anon key) to read all data. While some public data is expected for a marketplace, profile phone numbers and addresses may be sensitive.
- **Recommendation:** Add more granular SELECT policies, especially for fields like phone, address, and KTP data.

### L5. Admin Client at Module Scope
- **File:** `src/lib/supabase/admin.ts`
- **Description:** The Supabase admin client (which bypasses RLS) is instantiated at module scope. If accidentally imported in a client-side component, the service role key could leak.
- **Recommendation:** Use a factory function pattern and add a runtime check for server-side execution.

### L6. Account Enumeration via Registration Error
- **File:** `src/app/api/auth/register/route.ts:39-43`
- **Description:** The specific "Email sudah terdaftar" (Email already registered) error response allows attackers to enumerate which email addresses have accounts.
- **Recommendation:** Return a generic message like "Registrasi gagal" for all auth errors, or implement a consistent timing response.

### L7. Missing Indexes on created_at Columns
- **Files:** Multiple migration files
- **Description:** Several tables lack indexes on `created_at` which are needed for efficient pagination and sorting by date.
- **Recommendation:** Add indexes on `created_at` for tables that will be paginated (e.g., jobs, bookings, notifications).

### L8. Booking Code Collision Risk
- **File:** `supabase/migrations/008_create_bookings.sql:6-13`
- **Description:** The `generate_booking_code()` function uses `SUBSTR(MD5(RANDOM()::TEXT), 1, 4)` (only 4 hex characters = 65,536 possibilities per day). While the `UNIQUE` constraint prevents duplicates, there's no retry logic, so inserts could fail.
- **Recommendation:** Increase the random portion length or implement a sequence-based booking code.

---

## Architecture Observations

### Positive Findings
1. **Input Validation:** Zod schemas are properly used for all auth endpoints
2. **Password Policy:** Requires 8+ chars, uppercase, and digit
3. **RLS Enabled:** Row Level Security is enabled on all tables
4. **Supabase SSR:** Proper cookie-based session management with `@supabase/ssr`
5. **TypeScript Strict Mode:** Enabled in `tsconfig.json`
6. **Role-Based Routing:** Middleware properly redirects users based on their role
7. **Proper UUID Usage:** All IDs use UUID with `gen_random_uuid()`
8. **Auto-Updated Timestamps:** All tables with `updated_at` have triggers
9. **Phone Number Validation:** Indonesian phone format regex validation
10. **Proper .gitignore:** Environment files are properly excluded

### Recommendations for Next Sprint
1. Implement Redis-based rate limiting for production
2. Add CSP and security headers
3. Generate proper Supabase database types
4. Add error boundary components
5. Implement CSRF protection tokens
6. Add audit logging for admin actions
7. Encrypt sensitive PII data (KTP, bank accounts)
8. Add request/response logging middleware
9. Consider adding `HttpOnly` and `Secure` cookie flags explicitly
10. Add automated security scanning in CI/CD pipeline

---

## Files Modified in This Audit

| File | Change |
|------|--------|
| `scripts/run-migrations.mjs` | Removed hardcoded DB credentials, use env var |
| `src/app/api/auth/callback/route.ts` | Added open redirect validation |
| `src/app/api/auth/login/route.ts` | Added rate limiting, selective column fetch |
| `src/app/api/auth/register/route.ts` | Added rate limiting, transaction cleanup |
| `src/middleware.ts` | Fixed auth bypass vulnerabilities |
| `src/lib/utils/rate-limit.ts` | New file: rate limiting utility |
| `src/lib/utils/constants.ts` | Hardcoded commission rates |
| `supabase/migrations/002_create_talents.sql` | Added wallet_balance >= 0 check |
| `.env.example` | Added DATABASE_URL, removed NEXT_PUBLIC_COMMISSION_* |
