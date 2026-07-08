-- =============================================================
-- V5: Create submission_results table
-- =============================================================

CREATE TABLE submission_results (
    id              BIGSERIAL   PRIMARY KEY,
    submission_id   BIGINT      NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    test_case_id    BIGINT      NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    passed          BOOLEAN     NOT NULL,
    actual_output   TEXT,
    exec_time_ms    BIGINT,
    memory_kb       BIGINT,
    error_message   TEXT
);
