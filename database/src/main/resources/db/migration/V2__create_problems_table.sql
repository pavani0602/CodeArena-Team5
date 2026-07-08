-- =============================================================
-- V2: Create problems table
-- =============================================================

-- Custom PostgreSQL enum for problem difficulty
CREATE TYPE problem_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');

CREATE TABLE problems (
    id                      BIGSERIAL           PRIMARY KEY,
    title                   VARCHAR(200)        NOT NULL,
    description_md          TEXT                NOT NULL,
    difficulty              problem_difficulty  NOT NULL,
    tags                    VARCHAR(500),
    starter_code_java       TEXT,
    starter_code_python     TEXT,
    starter_code_cpp        TEXT,
    starter_code_js         TEXT,
    hints                   TEXT,
    editorial_md            TEXT,
    editorial_unlock_after  INT                 NOT NULL DEFAULT 3,
    created_by              BIGINT              REFERENCES users(id) ON DELETE SET NULL,
    created_at              TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP
);
