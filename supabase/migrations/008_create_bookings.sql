-- =============================================
-- Migration 008: Create bookings table
-- =============================================

-- Function: Generate booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_code = 'TLNT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
        UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 4));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    job_id UUID NOT NULL REFERENCES jobs(id),
    talent_id UUID NOT NULL REFERENCES talents(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    daily_rate BIGINT NOT NULL,
    talent_fee BIGINT NOT NULL,
    talent_commission BIGINT NOT NULL,
    client_commission BIGINT NOT NULL,
    platform_revenue BIGINT NOT NULL,
    total_amount BIGINT NOT NULL,
    talent_payout BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'in_progress', 'completed', 'confirmed', 'cancelled', 'disputed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_talent ON bookings(talent_id);
CREATE INDEX idx_bookings_company ON bookings(company_id);
CREATE INDEX idx_bookings_job ON bookings(job_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_code ON bookings(booking_code);

-- Triggers
CREATE TRIGGER tr_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_booking_code
    BEFORE INSERT ON bookings
    FOR EACH ROW EXECUTE FUNCTION generate_booking_code();

COMMENT ON TABLE bookings IS 'Booking records between talents and companies';
