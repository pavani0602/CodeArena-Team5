-- Fix: Add missing columns to leaderboard_entries table
-- The LeaderboardEntry entity has accepted_submissions, total_submissions columns
-- that were never added via migration

ALTER TABLE leaderboard_entries ADD COLUMN IF NOT EXISTS accepted_submissions INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leaderboard_entries ADD COLUMN IF NOT EXISTS total_submissions INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leaderboard_entries ADD COLUMN IF NOT EXISTS accuracy DOUBLE PRECISION DEFAULT 0.0;
