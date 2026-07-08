-- =============================================================
-- V8: Seed admin user
-- =============================================================
-- Password: admin123  (BCrypt hash — generate a real one for production)
-- The hash below corresponds to BCrypt('admin123') with strength 10.

INSERT INTO users (username, email, password_hash, role, created_at)
VALUES (
    'admin',
    'admin@codearena.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    CURRENT_TIMESTAMP
);

-- Initialise a leaderboard row for the admin user
INSERT INTO leaderboard_entries (user_id, last_updated)
VALUES (
    (SELECT id FROM users WHERE username = 'admin'),
    CURRENT_TIMESTAMP
);
