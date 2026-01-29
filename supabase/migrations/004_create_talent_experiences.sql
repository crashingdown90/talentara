-- =============================================
-- Migration 004: Create talent_experiences table
-- =============================================

CREATE TABLE talent_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    event_name VARCHAR(200),
    role VARCHAR(50) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_experiences_talent ON talent_experiences(talent_id);

COMMENT ON TABLE talent_experiences IS 'Work experience history for talents';
