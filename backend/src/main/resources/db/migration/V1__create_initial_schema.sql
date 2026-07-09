
-- Drop existing types if they exist (safe re-run)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
        CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
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
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problems (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description_md TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_cases (
    id BIGSERIAL PRIMARY KEY,
    problem_id BIGINT NOT NULL,
    input TEXT,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    time_limit_override INT,
    CONSTRAINT fk_test_problem
        FOREIGN KEY (problem_id)
            REFERENCES problems(id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    problem_id BIGINT NOT NULL,
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_submission_user
        FOREIGN KEY (user_id)
            REFERENCES users(id),
    CONSTRAINT fk_submission_problem
        FOREIGN KEY (problem_id)
            REFERENCES problems(id)
);

CREATE TABLE IF NOT EXISTS submission_results (
    id BIGSERIAL PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    test_case_id BIGINT NOT NULL,
    passed BOOLEAN NOT NULL,
    exec_time_ms BIGINT,
    memory_kb BIGINT,
    actual_output TEXT,
    error_message TEXT,
    CONSTRAINT fk_result_submission
        FOREIGN KEY (submission_id)
            REFERENCES submissions(id)
            ON DELETE CASCADE,
    CONSTRAINT fk_result_test_case
        FOREIGN KEY (test_case_id)
            REFERENCES test_cases(id)
);

CREATE TABLE IF NOT EXISTS leaderboard_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    problems_solved INT DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0.00,
    rank INT,
    CONSTRAINT fk_leaderboard_user
        FOREIGN KEY (user_id)
            REFERENCES users(id)
);