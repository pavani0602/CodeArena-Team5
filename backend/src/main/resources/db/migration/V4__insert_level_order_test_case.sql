INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, time_limit_override)
SELECT p.id, '3 9 20 null null 15 7', '[[3],[9,20],[15,7]]', FALSE, 1500
FROM problems p
WHERE p.title = 'Binary Tree Level Order Traversal'
AND NOT EXISTS (
    SELECT 1 FROM test_cases tc WHERE tc.problem_id = p.id
);
