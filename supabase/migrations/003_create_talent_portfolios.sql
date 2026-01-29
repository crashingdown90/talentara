-- =============================================
-- Migration 003: Create talent_portfolios table
-- =============================================

CREATE TABLE talent_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_id UUID NOT NULL REFERENCES talents(id) ON DELETE CASCADE,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    event_name VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_portfolios_talent ON talent_portfolios(talent_id);

COMMENT ON TABLE talent_portfolios IS 'Talent portfolio media (photos/videos from previous events)';
