-- =============================================================
-- V7: Create performance indexes
-- =============================================================

-- Users
CREATE INDEX idx_users_username    ON users (username);
CREATE INDEX idx_users_email       ON users (email);

-- Problems
CREATE INDEX idx_problems_difficulty   ON problems (difficulty);
CREATE INDEX idx_problems_created_by   ON problems (created_by);
CREATE INDEX idx_problems_title        ON problems (title);

-- Test cases
CREATE INDEX idx_test_cases_problem_id             ON test_cases (problem_id);
CREATE INDEX idx_test_cases_problem_id_is_hidden    ON test_cases (problem_id, is_hidden);
CREATE INDEX idx_test_cases_order                  ON test_cases (problem_id, order_index);

-- Submissions
CREATE INDEX idx_submissions_user_id               ON submissions (user_id);
CREATE INDEX idx_submissions_problem_id            ON submissions (problem_id);
CREATE INDEX idx_submissions_user_problem           ON submissions (user_id, problem_id);
CREATE INDEX idx_submissions_status                ON submissions (status);
CREATE INDEX idx_submissions_submitted_at          ON submissions (submitted_at);
CREATE INDEX idx_submissions_user_problem_time     ON submissions (user_id, problem_id, submitted_at);

-- Submission results
CREATE INDEX idx_submission_results_submission_id  ON submission_results (submission_id);
CREATE INDEX idx_submission_results_test_case_id   ON submission_results (test_case_id);

-- Leaderboard
CREATE INDEX idx_leaderboard_total_score           ON leaderboard_entries (total_score DESC);
CREATE INDEX idx_leaderboard_score_accuracy        ON leaderboard_entries (total_score DESC, accuracy DESC);
CREATE INDEX idx_leaderboard_rank                  ON leaderboard_entries (rank);
CREATE INDEX idx_leaderboard_user_id               ON leaderboard_entries (user_id);
