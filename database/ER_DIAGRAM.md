# CodeArena — Entity-Relationship Diagram

## ER Diagram

```mermaid
erDiagram
    users {
        BIGINT id PK "AUTO_INCREMENT"
        VARCHAR_50 username UK "NOT NULL"
        VARCHAR_100 email UK "NOT NULL"
        VARCHAR_255 password_hash "NOT NULL"
        ENUM role "USER | ADMIN"
        TIMESTAMP created_at "DEFAULT NOW()"
        TIMESTAMP updated_at
    }

    problems {
        BIGINT id PK "AUTO_INCREMENT"
        VARCHAR_200 title "NOT NULL"
        TEXT description_md "NOT NULL"
        ENUM difficulty "EASY | MEDIUM | HARD"
        VARCHAR_500 tags "comma-separated"
        TEXT starter_code_java
        TEXT starter_code_python
        TEXT starter_code_cpp
        TEXT starter_code_js
        TEXT hints "JSON array"
        TEXT editorial_md
        INT editorial_unlock_after "DEFAULT 3"
        BIGINT created_by FK "→ users.id"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    test_cases {
        BIGINT id PK "AUTO_INCREMENT"
        BIGINT problem_id FK "→ problems.id"
        TEXT input "NOT NULL"
        TEXT expected_output "NOT NULL"
        BOOLEAN is_hidden "DEFAULT FALSE"
        INT time_limit_override "nullable, in ms"
        INT order_index
    }

    submissions {
        BIGINT id PK "AUTO_INCREMENT"
        BIGINT user_id FK "→ users.id"
        BIGINT problem_id FK "→ problems.id"
        VARCHAR_20 language "JAVA | PYTHON | CPP | JS"
        TEXT source_code "NOT NULL"
        ENUM status "PENDING → ACCEPTED etc."
        TIMESTAMP submitted_at "DEFAULT NOW()"
        BIGINT total_exec_time_ms
        BIGINT total_memory_kb
    }

    submission_results {
        BIGINT id PK "AUTO_INCREMENT"
        BIGINT submission_id FK "→ submissions.id"
        BIGINT test_case_id FK "→ test_cases.id"
        BOOLEAN passed "NOT NULL"
        TEXT actual_output
        BIGINT exec_time_ms
        BIGINT memory_kb
        TEXT error_message
    }

    leaderboard_entries {
        BIGINT id PK "AUTO_INCREMENT"
        BIGINT user_id FK "→ users.id (UNIQUE)"
        INT problems_solved "DEFAULT 0"
        INT easy_solved "DEFAULT 0"
        INT medium_solved "DEFAULT 0"
        INT hard_solved "DEFAULT 0"
        INT total_submissions "DEFAULT 0"
        DOUBLE accuracy "DEFAULT 0.0"
        INT total_score "weighted score"
        BIGINT fastest_avg_time_ms
        INT rank
        TIMESTAMP last_updated
    }

    users ||--o{ problems : "creates (admin)"
    users ||--o{ submissions : "submits"
    users ||--|| leaderboard_entries : "has ranking"
    problems ||--o{ test_cases : "has"
    problems ||--o{ submissions : "receives"
    submissions ||--o{ submission_results : "produces"
    test_cases ||--o{ submission_results : "evaluated against"
```

## Enum Types

| Enum Name | Values | Used In |
|-----------|--------|---------|
| `user_role` | `USER`, `ADMIN` | `users.role` |
| `difficulty_level` | `EASY`, `MEDIUM`, `HARD` | `problems.difficulty` |
| `submission_status` | `PENDING`, `RUNNING`, `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `MEMORY_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILATION_ERROR` | `submissions.status` |
| `language` | `JAVA`, `PYTHON`, `CPP`, `JAVASCRIPT` | `submissions.language` |

## Relationship Summary

| Relationship | Type | Constraint |
|-------------|------|------------|
| `users` → `problems` | One-to-Many | `problems.created_by` FK → `users.id` |
| `users` → `submissions` | One-to-Many | `submissions.user_id` FK → `users.id` |
| `users` → `leaderboard_entries` | One-to-One | `leaderboard_entries.user_id` FK → `users.id` (UNIQUE) |
| `problems` → `test_cases` | One-to-Many | `test_cases.problem_id` FK → `problems.id` (CASCADE DELETE) |
| `problems` → `submissions` | One-to-Many | `submissions.problem_id` FK → `problems.id` |
| `submissions` → `submission_results` | One-to-Many | `submission_results.submission_id` FK → `submissions.id` (CASCADE DELETE) |
| `test_cases` → `submission_results` | One-to-Many | `submission_results.test_case_id` FK → `test_cases.id` |
