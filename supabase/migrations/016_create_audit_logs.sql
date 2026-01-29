-- =============================================
-- Migration 016: Audit Logs
-- Tracks admin and system actions for security and compliance
-- =============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Who performed the action
    actor_id UUID NOT NULL REFERENCES profiles(id),
    actor_role VARCHAR(20) NOT NULL,
    -- What happened
    action VARCHAR(100) NOT NULL,
    -- What was affected
    target_type VARCHAR(50) NOT NULL,
    target_id UUID,
    -- Details
    details JSONB DEFAULT '{}',
    -- Request context
    ip_address VARCHAR(45),
    user_agent TEXT,
    -- When
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "audit_logs_select_admin" ON audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Audit logs are insert-only (no updates or deletes)
-- Inserts are done via the admin client (bypasses RLS)

COMMENT ON TABLE audit_logs IS 'Immutable audit trail for admin and system actions';
