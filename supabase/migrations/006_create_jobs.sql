-- =============================================
-- Migration 006: Create jobs table
-- =============================================

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('spg', 'usher', 'both')),
    job_type VARCHAR(30) DEFAULT 'one_time'
        CHECK (job_type IN ('one_time', 'recurring', 'long_term')),
    location_city VARCHAR(100) NOT NULL,
    location_address TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    daily_rate BIGINT NOT NULL,
    total_slots INTEGER NOT NULL DEFAULT 1,
    filled_slots INTEGER DEFAULT 0,
    gender_requirement VARCHAR(10) CHECK (gender_requirement IN ('male', 'female', 'any')),
    min_height_cm INTEGER,
    min_age INTEGER,
    max_age INTEGER,
    dress_code TEXT,
    requirements TEXT,
    status VARCHAR(20) DEFAULT 'open'
        CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_city ON jobs(location_city);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_date ON jobs(start_date);

-- Trigger
CREATE TRIGGER tr_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE jobs IS 'Job listings posted by clients/companies';
