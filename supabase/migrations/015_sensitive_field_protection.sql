-- =============================================
-- Migration 015: Sensitive field protection
-- - Create secure views that exclude PII columns for public browsing
-- - Tighten RLS SELECT policies to require authentication
-- =============================================

-- =============================
-- 1. Tighten RLS SELECT policies
--    Change from public (true) to authenticated-only where appropriate
-- =============================

-- Profiles: require authentication to browse
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;

CREATE POLICY "profiles_select_authenticated" ON profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Talents: require authentication to browse
DROP POLICY IF EXISTS "talents_select_all" ON talents;

CREATE POLICY "talents_select_authenticated" ON talents
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Companies: require authentication to browse
DROP POLICY IF EXISTS "companies_select_all" ON companies;

CREATE POLICY "companies_select_authenticated" ON companies
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Jobs: require authentication to browse (marketplace listings)
DROP POLICY IF EXISTS "jobs_select_all" ON jobs;

CREATE POLICY "jobs_select_authenticated" ON jobs
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Reviews: require authentication to read
DROP POLICY IF EXISTS "reviews_select_all" ON reviews;

CREATE POLICY "reviews_select_authenticated" ON reviews
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Portfolios: require authentication to browse
DROP POLICY IF EXISTS "portfolios_select_all" ON talent_portfolios;

CREATE POLICY "portfolios_select_authenticated" ON talent_portfolios
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Experiences: require authentication to browse
DROP POLICY IF EXISTS "experiences_select_all" ON talent_experiences;

CREATE POLICY "experiences_select_authenticated" ON talent_experiences
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- =============================
-- 2. Create secure views for data access
--    These views exclude sensitive PII columns so API routes
--    can safely query them without leaking private data.
-- =============================

-- Public profile view: excludes phone, email
CREATE OR REPLACE VIEW public_profiles AS
SELECT
    id,
    role,
    full_name,
    avatar_url,
    is_verified,
    is_active,
    created_at
FROM profiles;

-- Public talent view: excludes ktp_number, ktp_photo_url, selfie_photo_url, address
CREATE OR REPLACE VIEW public_talents AS
SELECT
    t.id,
    t.profile_id,
    t.category,
    t.gender,
    t.date_of_birth,
    t.height_cm,
    t.weight_kg,
    t.city,
    t.province,
    t.bio,
    t.verification_status,
    t.rating_avg,
    t.rating_count,
    t.total_jobs_completed,
    t.daily_rate,
    t.is_available,
    t.created_at,
    t.updated_at,
    p.full_name,
    p.avatar_url
FROM talents t
JOIN profiles p ON t.profile_id = p.id;

-- Public company view: excludes npwp, nib, address, legal_doc_url
CREATE OR REPLACE VIEW public_companies AS
SELECT
    c.id,
    c.profile_id,
    c.company_name,
    c.company_type,
    c.industry,
    c.city,
    c.province,
    c.website,
    c.company_logo_url,
    c.verification_status,
    c.created_at,
    c.updated_at
FROM companies c;

-- Grant authenticated users access to the views
GRANT SELECT ON public_profiles TO authenticated;
GRANT SELECT ON public_talents TO authenticated;
GRANT SELECT ON public_companies TO authenticated;

COMMENT ON VIEW public_profiles IS 'Safe profile view excluding phone and email. Use this for public listings.';
COMMENT ON VIEW public_talents IS 'Safe talent view excluding KTP, address, and verification docs. Use this for talent browsing.';
COMMENT ON VIEW public_companies IS 'Safe company view excluding NPWP, NIB, address, and legal docs. Use this for company listings.';
