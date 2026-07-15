DELETE FROM submission_results
WHERE submission_id IN (
    SELECT id
    FROM submissions
    WHERE user_id IN (
        SELECT id
        FROM users
        WHERE username LIKE 'com.codearena.codearena_backend.entity.User@%'
    )
);

DELETE FROM leaderboard_entries
WHERE user_id IN (
    SELECT id
    FROM users
    WHERE username LIKE 'com.codearena.codearena_backend.entity.User@%'
);

DELETE FROM submissions
WHERE user_id IN (
    SELECT id
    FROM users
    WHERE username LIKE 'com.codearena.codearena_backend.entity.User@%'
);

DELETE FROM users
WHERE username LIKE 'com.codearena.codearena_backend.entity.User@%';
