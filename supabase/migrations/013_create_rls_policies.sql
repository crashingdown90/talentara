-- =============================================
-- Migration 013: Row Level Security (RLS) Policies
-- =============================================

-- =============================
-- Enable RLS on all tables
-- =============================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- =============================
-- PROFILES Policies
-- =============================
CREATE POLICY "profiles_select_all" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- =============================
-- TALENTS Policies
-- =============================
CREATE POLICY "talents_select_all" ON talents
    FOR SELECT USING (true);

CREATE POLICY "talents_insert_own" ON talents
    FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "talents_update_own" ON talents
    FOR UPDATE USING (profile_id = auth.uid());

-- =============================
-- TALENT_PORTFOLIOS Policies
-- =============================
CREATE POLICY "portfolios_select_all" ON talent_portfolios
    FOR SELECT USING (true);

CREATE POLICY "portfolios_insert_own" ON talent_portfolios
    FOR INSERT WITH CHECK (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

CREATE POLICY "portfolios_update_own" ON talent_portfolios
    FOR UPDATE USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

CREATE POLICY "portfolios_delete_own" ON talent_portfolios
    FOR DELETE USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

-- =============================
-- TALENT_EXPERIENCES Policies
-- =============================
CREATE POLICY "experiences_select_all" ON talent_experiences
    FOR SELECT USING (true);

CREATE POLICY "experiences_insert_own" ON talent_experiences
    FOR INSERT WITH CHECK (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

CREATE POLICY "experiences_update_own" ON talent_experiences
    FOR UPDATE USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

CREATE POLICY "experiences_delete_own" ON talent_experiences
    FOR DELETE USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

-- =============================
-- COMPANIES Policies
-- =============================
CREATE POLICY "companies_select_all" ON companies
    FOR SELECT USING (true);

CREATE POLICY "companies_insert_own" ON companies
    FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "companies_update_own" ON companies
    FOR UPDATE USING (profile_id = auth.uid());

-- =============================
-- JOBS Policies
-- =============================
CREATE POLICY "jobs_select_all" ON jobs
    FOR SELECT USING (true);

CREATE POLICY "jobs_insert_own" ON jobs
    FOR INSERT WITH CHECK (
        company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
    );

CREATE POLICY "jobs_update_own" ON jobs
    FOR UPDATE USING (
        company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
    );

-- =============================
-- JOB_APPLICATIONS Policies
-- =============================
CREATE POLICY "applications_select_own" ON job_applications
    FOR SELECT USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
        OR job_id IN (
            SELECT j.id FROM jobs j
            JOIN companies c ON j.company_id = c.id
            WHERE c.profile_id = auth.uid()
        )
    );

CREATE POLICY "applications_insert_talent" ON job_applications
    FOR INSERT WITH CHECK (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

CREATE POLICY "applications_update_own" ON job_applications
    FOR UPDATE USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
        OR job_id IN (
            SELECT j.id FROM jobs j
            JOIN companies c ON j.company_id = c.id
            WHERE c.profile_id = auth.uid()
        )
    );

-- =============================
-- BOOKINGS Policies
-- =============================
CREATE POLICY "bookings_select_own" ON bookings
    FOR SELECT USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
        OR company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
    );

CREATE POLICY "bookings_insert_company" ON bookings
    FOR INSERT WITH CHECK (
        company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
    );

CREATE POLICY "bookings_update_participants" ON bookings
    FOR UPDATE USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
        OR company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
    );

-- =============================
-- PAYMENTS Policies
-- =============================
CREATE POLICY "payments_select_own" ON payments
    FOR SELECT USING (
        booking_id IN (
            SELECT id FROM bookings
            WHERE talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
            OR company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
        )
    );

CREATE POLICY "payments_insert_company" ON payments
    FOR INSERT WITH CHECK (
        booking_id IN (
            SELECT id FROM bookings
            WHERE company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
        )
    );

-- =============================
-- ESCROW_TRANSACTIONS Policies
-- =============================
CREATE POLICY "escrow_select_own" ON escrow_transactions
    FOR SELECT USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
        OR booking_id IN (
            SELECT id FROM bookings
            WHERE company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
        )
    );

-- =============================
-- REVIEWS Policies
-- =============================
CREATE POLICY "reviews_select_all" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "reviews_insert_client" ON reviews
    FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- =============================
-- CHAT_ROOMS Policies
-- =============================
CREATE POLICY "chatrooms_select_own" ON chat_rooms
    FOR SELECT USING (
        participant_1 = auth.uid() OR participant_2 = auth.uid()
    );

CREATE POLICY "chatrooms_insert_participant" ON chat_rooms
    FOR INSERT WITH CHECK (
        participant_1 = auth.uid() OR participant_2 = auth.uid()
    );

-- =============================
-- CHAT_MESSAGES Policies
-- =============================
CREATE POLICY "messages_select_own_room" ON chat_messages
    FOR SELECT USING (
        room_id IN (
            SELECT id FROM chat_rooms
            WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
        )
    );

CREATE POLICY "messages_insert_own" ON chat_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "messages_update_read" ON chat_messages
    FOR UPDATE USING (
        room_id IN (
            SELECT id FROM chat_rooms
            WHERE participant_1 = auth.uid() OR participant_2 = auth.uid()
        )
    );

-- =============================
-- NOTIFICATIONS Policies
-- =============================
CREATE POLICY "notifications_select_own" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- =============================
-- WITHDRAWALS Policies
-- =============================
CREATE POLICY "withdrawals_select_own" ON withdrawals
    FOR SELECT USING (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

CREATE POLICY "withdrawals_insert_own" ON withdrawals
    FOR INSERT WITH CHECK (
        talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
    );

-- =============================
-- DISPUTES Policies
-- =============================
CREATE POLICY "disputes_select_own" ON disputes
    FOR SELECT USING (
        raised_by = auth.uid()
        OR booking_id IN (
            SELECT id FROM bookings
            WHERE talent_id IN (SELECT id FROM talents WHERE profile_id = auth.uid())
            OR company_id IN (SELECT id FROM companies WHERE profile_id = auth.uid())
        )
    );

CREATE POLICY "disputes_insert_own" ON disputes
    FOR INSERT WITH CHECK (raised_by = auth.uid());
