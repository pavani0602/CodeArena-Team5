-- Insert additional test cases for richer submission feedback
INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, time_limit_override)
SELECT p.id, tc.input, tc.expected_output, tc.is_hidden, tc.time_limit_override
FROM problems p
JOIN (
    VALUES
    ('Two Sum', '3 2 4\n6', '1 2', FALSE, 1000),
    ('Two Sum', '3 3\n6', '0 1', TRUE, 1000),
    
    ('Reverse String', 'h a n n a h', 'h a n n a h', FALSE, 1000),
    ('Reverse String', 'a b c d', 'd c b a', TRUE, 1000),
    
    ('Longest Substring Without Repeating Characters', 'bbbbb', '1', FALSE, 1500),
    ('Longest Substring Without Repeating Characters', 'pwwkew', '3', TRUE, 1500),
    
    ('Merge Intervals', '1 4\n4 5', '1 5', FALSE, 1500),
    ('Merge Intervals', '1 4\n0 4', '0 4', TRUE, 1500),
    
    ('Valid Parentheses', '()', 'true', FALSE, 1000),
    ('Valid Parentheses', '(]', 'false', FALSE, 1000),
    ('Valid Parentheses', '([)]', 'false', TRUE, 1000),
    
    ('Maximum Subarray', '1', '1', FALSE, 1000),
    ('Maximum Subarray', '5 4 -1 7 8', '23', TRUE, 1000),
    
    ('Binary Tree Level Order Traversal', '1', '[[1]]', FALSE, 1500),
    ('Binary Tree Level Order Traversal', 'null', '[]', TRUE, 1500),
    
    ('Climbing Stairs', '2', '2', FALSE, 1000),
    ('Climbing Stairs', '4', '5', TRUE, 1000),
    
    ('Median of Two Sorted Arrays', '1 2\n3 4', '2.5', FALSE, 2000),
    ('Median of Two Sorted Arrays', '0 0\n0 0', '0.0', TRUE, 2000),
    
    ('N-Queens', '1', 'Q', FALSE, 2000)
) AS tc(problem_title, input, expected_output, is_hidden, time_limit_override)
ON p.title = tc.problem_title
WHERE NOT EXISTS (
    SELECT 1 FROM test_cases tc2 WHERE tc2.problem_id = p.id AND tc2.input = tc.input
);
