-- =============================================================
-- V1: Create users table
-- =============================================================

-- Custom PostgreSQL enum for user roles
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    email           VARCHAR(100)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    role            user_role       NOT NULL DEFAULT 'USER',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP
);
