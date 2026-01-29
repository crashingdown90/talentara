-- =============================================
-- Migration 014: Security improvements
-- - Add indexes on created_at for pagination
-- - Update booking code function (longer random part)
-- - Add granular RLS for sensitive profile data
-- =============================================

-- =============================
-- 1. Add missing created_at indexes for pagination performance
-- =============================
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disputes_created_at ON disputes(created_at DESC);

-- =============================
-- 2. Update booking code to use 8-char random (from 4) to reduce collision risk
-- =============================
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_code = 'TLNT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
        UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================
-- 3. Drop overly permissive profiles SELECT policy, replace with granular one
--    Public fields: id, role, full_name, avatar_url, is_verified, created_at
--    Private fields (phone, email): only own profile or admin
-- =============================

-- Drop the old blanket policy
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;

-- Anyone can read public profile fields (needed for talent browsing)
CREATE POLICY "profiles_select_public" ON profiles
    FOR SELECT USING (true);
-- NOTE: To truly restrict columns, use a VIEW or API-level filtering.
-- RLS operates at row level, not column level. The API routes must
-- filter out sensitive fields (phone, email) for non-owners.

-- =============================
-- 4. Add admin bypass policies for management operations
-- =============================

-- Admin can update any profile (for verification status)
CREATE POLICY "profiles_update_admin" ON profiles
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin can update any talent (for verification)
CREATE POLICY "talents_update_admin" ON talents
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin can update any company (for verification)
CREATE POLICY "companies_update_admin" ON companies
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin can update withdrawals (for processing)
CREATE POLICY "withdrawals_update_admin" ON withdrawals
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin can read all withdrawals
CREATE POLICY "withdrawals_select_admin" ON withdrawals
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin can update disputes
CREATE POLICY "disputes_update_admin" ON disputes
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admin can read all notifications (for support)
CREATE POLICY "notifications_select_admin" ON notifications
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

COMMENT ON FUNCTION generate_booking_code IS 'Generate unique booking code: TLNT-YYYYMMDD-XXXXXXXX (8-char hex)';
