-- =============================================================
-- V4: Create submissions table
-- =============================================================

-- Custom PostgreSQL enum for submission status
CREATE TYPE submission_status AS ENUM (
    'PENDING',
    'RUNNING',
    'ACCEPTED',
    'WRONG_ANSWER',
    'TIME_LIMIT_EXCEEDED',
    'MEMORY_LIMIT_EXCEEDED',
    'RUNTIME_ERROR',
    'COMPILATION_ERROR'
);

CREATE TABLE submissions (
    id                  BIGSERIAL           PRIMARY KEY,
    user_id             BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id          BIGINT              NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    language            VARCHAR(20)         NOT NULL,
    source_code         TEXT                NOT NULL,
    status              submission_status   NOT NULL DEFAULT 'PENDING',
    submitted_at        TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_exec_time_ms  BIGINT,
    total_memory_kb     BIGINT
);
