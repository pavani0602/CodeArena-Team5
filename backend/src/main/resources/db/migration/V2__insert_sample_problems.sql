-- Insert sample coding problems if the table is empty
INSERT INTO problems (title, description_md, difficulty, tags, created_at)
SELECT * FROM (
    VALUES 
    ('Two Sum', '### Problem Statement

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

#### Example 1:
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

#### Constraints:
* `2 <= nums.length <= 10^4`
* `-10^9 <= nums[i] <= 10^9`
* `-10^9 <= target <= 10^9`
* Only one valid answer exists.', 'EASY', 'Arrays, Hash Table', CURRENT_TIMESTAMP),

    ('Reverse String', '### Problem Statement

Write a function that reverses a string. The input string is given as an array of characters `s`.

You must do this by modifying the input array **in-place** with `O(1)` extra memory.

#### Example 1:
```
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```

#### Constraints:
* `1 <= s.length <= 10^5`
* `s[i]` is a printable ascii character.', 'EASY', 'Strings, Two Pointers', CURRENT_TIMESTAMP),

    ('Longest Substring Without Repeating Characters', '### Problem Statement

Given a string `s`, find the length of the **longest substring** without repeating characters.

#### Example 1:
```
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

#### Example 2:
```
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

#### Constraints:
* `0 <= s.length <= 5 * 10^4`
* `s` consists of English letters, digits, symbols and spaces.', 'MEDIUM', 'Hash Table, Sliding Window, Strings', CURRENT_TIMESTAMP),

    ('Merge Intervals', '### Problem Statement

Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

#### Example 1:
```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
```

#### Constraints:
* `1 <= intervals.length <= 10^4`
* `intervals[i].length == 2`
* `0 <= start_i <= end_i <= 10^4`', 'MEDIUM', 'Arrays, Sorting', CURRENT_TIMESTAMP),

    ('Valid Parentheses', '### Problem Statement

Given a string `s` containing just the characters `''('', '')'', ''{'', ''}'', ''['' and '']''`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

#### Example 1:
```
Input: s = "()[]{}"
Output: true
```

#### Constraints:
* `1 <= s.length <= 10^4`
* `s` consists of parentheses only `''()[]{}''`.', 'EASY', 'Stack, Strings', CURRENT_TIMESTAMP),

    ('Maximum Subarray', '### Problem Statement

Given an integer array `nums`, find the **subarray** with the largest sum, and return *its sum*.

#### Example 1:
```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
```

#### Constraints:
* `1 <= nums.length <= 10^5`
* `-10^4 <= nums[i] <= 10^4`', 'MEDIUM', 'Arrays, Dynamic Programming, Divide and Conquer', CURRENT_TIMESTAMP),

    ('Binary Tree Level Order Traversal', '### Problem Statement

Given the `root` of a binary tree, return *the level order traversal of its nodes'' values*. (i.e., from left to right, level by level).

#### Example 1:
```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
```

#### Constraints:
* The number of nodes in the tree is in the range `[0, 2000]`.
* `-1000 <= Node.val <= 1000`', 'MEDIUM', 'Breadth-First Search, Binary Tree', CURRENT_TIMESTAMP),

    ('Climbing Stairs', '### Problem Statement

You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?

#### Example 1:
```
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top:
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
```

#### Constraints:
* `1 <= n <= 45`', 'EASY', 'Dynamic Programming, Math', CURRENT_TIMESTAMP),

    ('Median of Two Sorted Arrays', '### Problem Statement

Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be `O(log (m+n))`.

#### Example 1:
```
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
```

#### Constraints:
* `nums1.length == m`
* `nums2.length == n`
* `0 <= m <= 1000`
* `0 <= n <= 1000`
* `1 <= m + n <= 2000`
* `-10^6 <= nums1[i], nums2[i] <= 10^6`', 'HARD', 'Arrays, Binary Search, Divide and Conquer', CURRENT_TIMESTAMP),

    ('N-Queens', '### Problem Statement

The **n-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.

Given an integer `n`, return *all distinct solutions to the **n-queens puzzle***. You may return the answer in **any order**.

Each solution contains a distinct board configuration of the n-queens'' placement, where `''Q''` and `''.''` both indicate a queen and an empty space, respectively.

#### Example 1:
```
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
```

#### Constraints:
* `1 <= n <= 9`', 'HARD', 'Backtracking', CURRENT_TIMESTAMP)
) AS t(title, description_md, difficulty, tags, created_at)
WHERE NOT EXISTS (SELECT 1 FROM problems);

-- Insert sample test cases for the problems
INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, time_limit_override)
SELECT p.id, tc.input, tc.expected_output, tc.is_hidden, tc.time_limit_override
FROM problems p
JOIN (
    VALUES
    ('Two Sum', '2 7 11 15\n9', '0 1', FALSE, 1000),
    ('Reverse String', 'hello', 'olleh', FALSE, 1000),
    ('Longest Substring Without Repeating Characters', 'abcabcbb', '3', FALSE, 1500),
    ('Merge Intervals', '1 3\n2 6\n8 10\n15 18', '1 6\n8 10\n15 18', FALSE, 1500),
    ('Valid Parentheses', '()[]{}', 'true', FALSE, 1000),
    ('Maximum Subarray', '-2 1 -3 4 -1 2 1 -5 4', '6', FALSE, 1000),
    ('Climbing Stairs', '3', '3', FALSE, 1000),
    ('Median of Two Sorted Arrays', '1 3\n2', '2.0', FALSE, 2000),
    ('N-Queens', '4', '.Q..\n...Q\nQ...\n..Q.\n\n..Q.\nQ...\n...Q\n.Q..', FALSE, 2000)
) AS tc(problem_title, input, expected_output, is_hidden, time_limit_override)
ON p.title = tc.problem_title
WHERE NOT EXISTS (SELECT 1 FROM test_cases);
