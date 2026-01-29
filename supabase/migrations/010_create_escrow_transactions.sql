-- =============================================
-- Migration 010: Create escrow_transactions table
-- =============================================

CREATE TABLE escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    talent_id UUID NOT NULL REFERENCES talents(id),
    amount BIGINT NOT NULL,
    talent_payout BIGINT NOT NULL,
    platform_fee BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'held'
        CHECK (status IN ('held', 'released', 'refunded', 'disputed')),
    held_at TIMESTAMPTZ DEFAULT NOW(),
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_escrow_booking ON escrow_transactions(booking_id);
CREATE INDEX idx_escrow_talent ON escrow_transactions(talent_id);
CREATE INDEX idx_escrow_status ON escrow_transactions(status);

COMMENT ON TABLE escrow_transactions IS 'Escrow records for holding payment until job completion';
