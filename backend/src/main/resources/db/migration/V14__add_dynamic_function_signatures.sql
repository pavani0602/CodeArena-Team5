ALTER TABLE problems ADD COLUMN function_name VARCHAR(255) DEFAULT 'solve';
ALTER TABLE problems ADD COLUMN parameter_names TEXT DEFAULT 'input';
ALTER TABLE problems ADD COLUMN parameter_types TEXT DEFAULT 'string';
ALTER TABLE problems ADD COLUMN return_type VARCHAR(255) DEFAULT 'string';

-- Backfill data for existing problems
UPDATE problems SET function_name = 'twoSum', parameter_names = 'nums,target', parameter_types = 'int[],int', return_type = 'int[]' WHERE title ILIKE 'Two Sum';
UPDATE problems SET function_name = 'reverseString', parameter_names = 's', parameter_types = 'char[]', return_type = 'char[]' WHERE title ILIKE 'Reverse String';
UPDATE problems SET function_name = 'lengthOfLongestSubstring', parameter_names = 's', parameter_types = 'string', return_type = 'int' WHERE title ILIKE 'Longest Substring Without Repeating Characters';
UPDATE problems SET function_name = 'merge', parameter_names = 'intervals', parameter_types = 'int[][]', return_type = 'int[][]' WHERE title ILIKE 'Merge Intervals';
UPDATE problems SET function_name = 'isValid', parameter_names = 's', parameter_types = 'string', return_type = 'boolean' WHERE title ILIKE 'Valid Parentheses';
UPDATE problems SET function_name = 'maxSubArray', parameter_names = 'nums', parameter_types = 'int[]', return_type = 'int' WHERE title ILIKE 'Maximum Subarray';
UPDATE problems SET function_name = 'levelOrder', parameter_names = 'root', parameter_types = 'TreeNode', return_type = 'int[][]' WHERE title ILIKE 'Binary Tree Level Order Traversal';
UPDATE problems SET function_name = 'climbStairs', parameter_names = 'n', parameter_types = 'int', return_type = 'int' WHERE title ILIKE 'Climbing Stairs';
UPDATE problems SET function_name = 'findMedianSortedArrays', parameter_names = 'nums1,nums2', parameter_types = 'int[],int[]', return_type = 'double' WHERE title ILIKE 'Median of Two Sorted Arrays';
UPDATE problems SET function_name = 'solveNQueens', parameter_names = 'n', parameter_types = 'int', return_type = 'string[][]' WHERE title ILIKE 'N-Queens';
