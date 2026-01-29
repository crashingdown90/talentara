-- =============================================
-- Migration 002: Create talents table
-- =============================================

CREATE TABLE talents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL CHECK (category IN ('spg', 'usher', 'both')),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    date_of_birth DATE,
    height_cm INTEGER,
    weight_kg INTEGER,
    city VARCHAR(100),
    province VARCHAR(100),
    address TEXT,
    bio TEXT,
    ktp_number VARCHAR(20),
    ktp_photo_url TEXT,
    selfie_photo_url TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    wallet_balance BIGINT DEFAULT 0 CHECK (wallet_balance >= 0),
    daily_rate BIGINT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_talents_category ON talents(category);
CREATE INDEX idx_talents_city ON talents(city);
CREATE INDEX idx_talents_rating ON talents(rating_avg DESC);
CREATE INDEX idx_talents_available ON talents(is_available) WHERE is_available = TRUE;
CREATE INDEX idx_talents_profile ON talents(profile_id);

-- Trigger
CREATE TRIGGER tr_talents_updated_at
    BEFORE UPDATE ON talents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE talents IS 'Talent-specific details (SPG/Usher profile data)';
