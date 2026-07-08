-- =============================================================
-- V3: Create test_cases table
-- =============================================================

CREATE TABLE test_cases (
    id                      BIGSERIAL   PRIMARY KEY,
    problem_id              BIGINT      NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    input                   TEXT        NOT NULL,
    expected_output         TEXT        NOT NULL,
    is_hidden               BOOLEAN     NOT NULL DEFAULT FALSE,
    time_limit_override     INT,
    order_index             INT
);
