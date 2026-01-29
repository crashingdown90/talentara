-- =============================================
-- Migration 005: Create companies table
-- =============================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    company_type VARCHAR(50),
    industry VARCHAR(100),
    npwp VARCHAR(30),
    nib VARCHAR(30),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    website VARCHAR(255),
    company_logo_url TEXT,
    legal_doc_url TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_companies_city ON companies(city);
CREATE INDEX idx_companies_profile ON companies(profile_id);

-- Trigger
CREATE TRIGGER tr_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE companies IS 'Client company profiles';
