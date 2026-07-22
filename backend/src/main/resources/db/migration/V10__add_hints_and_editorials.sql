-- V10__add_hints_and_editorials.sql
-- Add hints and editorials for the sample problems

-- 1. Two Sum
UPDATE problems SET editorial_md = '### Approach: Hash Map\n\nThe most efficient way to solve this problem is using a Hash Map.\n\n1. Create a hash map to store the value and its index.\n2. Iterate through the array `nums`.\n3. For each element `nums[i]`, calculate the `complement = target - nums[i]`.\n4. Check if `complement` exists in the hash map.\n5. If it does, you have found the two numbers. Return their indices.\n6. If it does not, add `nums[i]` and its index `i` to the hash map.\n\n**Time Complexity:** O(N)\n**Space Complexity:** O(N)' WHERE title = 'Two Sum';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it''s best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.' FROM problems p WHERE title = 'Two Sum' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'So, if we fix one of the numbers, say `x`, we have to scan the entire array to find the next number `y` which is `value - x` where value is the input parameter. Can we change our array keeping so that this search becomes faster?' FROM problems p WHERE title = 'Two Sum' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 3, 'The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?' FROM problems p WHERE title = 'Two Sum' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 3);


-- 2. Reverse String
UPDATE problems SET editorial_md = '### Approach: Two Pointers\n\n1. Initialize two pointers: `left` at the beginning of the string (index 0) and `right` at the end of the string (index `s.length - 1`).\n2. While `left < right`:\n   - Swap the characters at `s[left]` and `s[right]`.\n   - Increment `left` by 1.\n   - Decrement `right` by 1.\n\n**Time Complexity:** O(N)\n**Space Complexity:** O(1)' WHERE title = 'Reverse String';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'The entire logic for reversing a string is based on using the opposite directional two-pointer approach!' FROM problems p WHERE title = 'Reverse String' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);


-- 3. Longest Substring Without Repeating Characters
UPDATE problems SET editorial_md = '### Approach: Sliding Window\n\n1. Use a hash set to store the characters in current window `[left, right]`.\n2. Iterate `right` from 0 to `s.length - 1`.\n3. If `s[right]` is already in the hash set, remove `s[left]` from the hash set and increment `left` until `s[right]` is no longer in the hash set.\n4. Add `s[right]` to the hash set.\n5. Update the maximum length found so far.\n\n**Time Complexity:** O(N)\n**Space Complexity:** O(min(M, N))' WHERE title = 'Longest Substring Without Repeating Characters';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'Think about a sliding window. As you iterate through the string, you can keep a window `[left, right]` that contains only unique characters.' FROM problems p WHERE title = 'Longest Substring Without Repeating Characters' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'If you see a character that is already in your window, what should you do? You need to shrink the window from the left until that duplicate character is gone.' FROM problems p WHERE title = 'Longest Substring Without Repeating Characters' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);


-- 4. Merge Intervals
UPDATE problems SET editorial_md = '### Approach: Sorting\n\n1. Sort the intervals by their start time.\n2. Initialize an empty list `merged`.\n3. Iterate through the intervals.\n4. If `merged` is empty or the current interval''s start time is greater than the last interval''s end time in `merged`, append the current interval to `merged`.\n5. Otherwise, there is an overlap. Update the last interval''s end time in `merged` to be the maximum of its end time and the current interval''s end time.\n\n**Time Complexity:** O(N log N)\n**Space Complexity:** O(log N) or O(N)' WHERE title = 'Merge Intervals';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'Sort the intervals by their start value.' FROM problems p WHERE title = 'Merge Intervals' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'If you sort the intervals by their start value, then you only need to check if the current interval overlaps with the previous one.' FROM problems p WHERE title = 'Merge Intervals' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);


-- 5. Valid Parentheses
UPDATE problems SET editorial_md = '### Approach: Stack\n\n1. Initialize an empty stack.\n2. Iterate through the string `s`.\n3. If the current character is an opening bracket (`''('', ''{'', ''[''`), push it onto the stack.\n4. If the current character is a closing bracket (`'')'', ''}'', '']''`):\n   - If the stack is empty, return `false`.\n   - Pop the top element from the stack.\n   - If the popped element does not match the corresponding opening bracket for the current closing bracket, return `false`.\n5. After iterating through the string, if the stack is empty, return `true`. Otherwise, return `false`.\n\n**Time Complexity:** O(N)\n**Space Complexity:** O(N)' WHERE title = 'Valid Parentheses';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'Use a stack of characters.' FROM problems p WHERE title = 'Valid Parentheses' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'When you encounter an opening bracket, push it to the top of the stack.' FROM problems p WHERE title = 'Valid Parentheses' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 3, 'When you encounter a closing bracket, check if the top of the stack was the opening for it. If yes, pop it from the stack. Otherwise, return false.' FROM problems p WHERE title = 'Valid Parentheses' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 3);


-- 6. Maximum Subarray
UPDATE problems SET editorial_md = '### Approach: Kadane''s Algorithm\n\n1. Initialize `currentSum` and `maxSum` with `nums[0]`.\n2. Iterate through the array starting from index 1.\n3. For each element `nums[i]`, update `currentSum` to be the maximum of `nums[i]` and `currentSum + nums[i]`.\n4. Update `maxSum` to be the maximum of `maxSum` and `currentSum`.\n5. Return `maxSum`.\n\n**Time Complexity:** O(N)\n**Space Complexity:** O(1)' WHERE title = 'Maximum Subarray';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'If the sum of a subarray is positive, it has possible to make the next value bigger, so we keep do it until it turn to negative.' FROM problems p WHERE title = 'Maximum Subarray' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'If the sum is negative, it has no use to the next element, so we break.' FROM problems p WHERE title = 'Maximum Subarray' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 3, 'This is a classic dynamic programming problem known as Kadane''s algorithm.' FROM problems p WHERE title = 'Maximum Subarray' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 3);


-- 7. Binary Tree Level Order Traversal
UPDATE problems SET editorial_md = '### Approach: Breadth-First Search (BFS)\n\n1. If the root is null, return an empty list.\n2. Initialize a queue and push the root node.\n3. Initialize a result list.\n4. While the queue is not empty:\n   - Get the number of nodes in the current level (`levelSize = queue.size()`).\n   - Initialize a list for the current level.\n   - Iterate `levelSize` times:\n     - Pop a node from the queue.\n     - Add its value to the current level list.\n     - Push its left and right children (if they exist) to the queue.\n   - Add the current level list to the result list.\n5. Return the result list.\n\n**Time Complexity:** O(N)\n**Space Complexity:** O(N)' WHERE title = 'Binary Tree Level Order Traversal';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'Use a queue to keep track of the nodes.' FROM problems p WHERE title = 'Binary Tree Level Order Traversal' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'At each step, keep track of how many elements are currently in the queue. This is the number of elements at the current level.' FROM problems p WHERE title = 'Binary Tree Level Order Traversal' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);


-- 8. Climbing Stairs
UPDATE problems SET editorial_md = '### Approach: Dynamic Programming\n\nThis is a classic Fibonacci sequence problem.\n1. If `n` is 1, return 1.\n2. Initialize `first` to 1 and `second` to 2.\n3. Iterate from 3 to `n`:\n   - Calculate `third = first + second`.\n   - Update `first = second` and `second = third`.\n4. Return `second`.\n\n**Time Complexity:** O(N)\n**Space Complexity:** O(1)' WHERE title = 'Climbing Stairs';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'To reach nth step, what could have been your previous steps? (Think about the step sizes)' FROM problems p WHERE title = 'Climbing Stairs' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'You could have come from either (n-1)th step or (n-2)th step.' FROM problems p WHERE title = 'Climbing Stairs' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);


-- 9. Median of Two Sorted Arrays
UPDATE problems SET editorial_md = '### Approach: Binary Search\n\n1. Ensure `nums1` is the smaller array. If not, swap them.\n2. Use binary search on the smaller array `nums1` to find a partition such that the left half of both arrays combined has the same number of elements as the right half.\n3. Check if the maximum element on the left is less than or equal to the minimum element on the right.\n4. If yes, the partition is correct. Calculate the median based on whether the total length is even or odd.\n5. If not, adjust the partition using binary search.\n\n**Time Complexity:** O(log(min(M,N)))\n**Space Complexity:** O(1)' WHERE title = 'Median of Two Sorted Arrays';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'Can you find the median of the two sorted arrays by doing a binary search on the smaller array?' FROM problems p WHERE title = 'Median of Two Sorted Arrays' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'You need to partition both arrays such that the total number of elements on the left side is equal to the total number of elements on the right side.' FROM problems p WHERE title = 'Median of Two Sorted Arrays' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);


-- 10. N-Queens
UPDATE problems SET editorial_md = '### Approach: Backtracking\n\n1. Initialize an empty board.\n2. Use three sets to keep track of columns and the two diagonals (`positiveDiagonals` and `negativeDiagonals`) that are under attack.\n3. Create a recursive `backtrack(row)` function:\n   - If `row == n`, a valid solution is found. Add it to the result.\n   - Iterate through each column `c` from 0 to `n-1`.\n   - Check if `c` is in `cols`, `row + c` is in `positiveDiagonals`, or `row - c` is in `negativeDiagonals`.\n   - If not, place the queen, add the constraints to the sets, and recursively call `backtrack(row + 1)`.\n   - Remove the queen and constraints (backtrack) before moving to the next column.\n\n**Time Complexity:** O(N!)\n**Space Complexity:** O(N^2)' WHERE title = 'N-Queens';

INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 1, 'Use backtracking to place a queen row by row.' FROM problems p WHERE title = 'N-Queens' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 1);
INSERT INTO problem_hints (problem_id, hint_number, hint_text) SELECT id, 2, 'You need to efficiently check if a column or a diagonal is already occupied. How can you map the diagonals to an array or set?' FROM problems p WHERE title = 'N-Queens' AND NOT EXISTS (SELECT 1 FROM problem_hints ph WHERE ph.problem_id = p.id AND ph.hint_number = 2);
