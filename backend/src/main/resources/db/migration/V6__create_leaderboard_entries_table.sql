-- =============================================================
-- V6: Create leaderboard_entries table
-- =============================================================

CREATE TABLE leaderboard_entries (
    id                      BIGSERIAL   PRIMARY KEY,
    user_id                 BIGINT      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    problems_solved         INT         NOT NULL DEFAULT 0,
    easy_solved             INT         NOT NULL DEFAULT 0,
    medium_solved           INT         NOT NULL DEFAULT 0,
    hard_solved             INT         NOT NULL DEFAULT 0,
    total_submissions       INT         NOT NULL DEFAULT 0,
    accuracy                DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    total_score             INT         NOT NULL DEFAULT 0,
    fastest_avg_time_ms     BIGINT,
    rank                    INT,
    last_updated            TIMESTAMP
);
