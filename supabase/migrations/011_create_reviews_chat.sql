-- =============================================
-- Migration 011: Create reviews, chat_rooms, chat_messages tables
-- =============================================

-- Table: reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id),
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    talent_id UUID NOT NULL REFERENCES talents(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
    punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
    appearance INTEGER CHECK (appearance >= 1 AND appearance <= 5),
    communication INTEGER CHECK (communication >= 1 AND communication <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_talent ON reviews(talent_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);

-- Function: Auto-update talent rating after review
CREATE OR REPLACE FUNCTION update_talent_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE talents SET
        rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE talent_id = NEW.talent_id),
        rating_count = (SELECT COUNT(*) FROM reviews WHERE talent_id = NEW.talent_id)
    WHERE id = NEW.talent_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_review_update_rating
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_talent_rating();

-- Table: chat_rooms
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    participant_1 UUID NOT NULL REFERENCES profiles(id),
    participant_2 UUID NOT NULL REFERENCES profiles(id),
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chatrooms_p1 ON chat_rooms(participant_1);
CREATE INDEX idx_chatrooms_p2 ON chat_rooms(participant_2);

-- Table: chat_messages
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text'
        CHECK (message_type IN ('text', 'image', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_room ON chat_messages(room_id, created_at DESC);
CREATE INDEX idx_messages_sender ON chat_messages(sender_id);

COMMENT ON TABLE reviews IS 'Client reviews and ratings for talents after booking completion';
COMMENT ON TABLE chat_rooms IS 'Chat rooms between booking participants';
COMMENT ON TABLE chat_messages IS 'Individual chat messages in rooms';
