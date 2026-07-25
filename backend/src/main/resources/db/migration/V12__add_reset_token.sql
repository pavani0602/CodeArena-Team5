-- Add password reset token infrastructure to the users table
ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP;
