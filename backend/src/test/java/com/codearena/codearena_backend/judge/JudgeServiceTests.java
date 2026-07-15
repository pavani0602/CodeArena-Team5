package com.codearena.codearena_backend.judge;

import com.codearena.codearena_backend.entity.Problem;
import com.codearena.codearena_backend.entity.TestCase;
import com.codearena.codearena_backend.enumtype.DifficultyLevel;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

@SpringBootTest
class JudgeServiceTests {

    @Autowired
    private JudgeService judgeService;

    @Test
    void pythonCorrectSolutionsPassEverySeededProblem() {
        assertAccepted("Two Sum", "PYTHON", "2 7 11 15\n9", "0 1", """
                class Solution:
                    def twoSum(self, nums, target):
                        seen = {}
                        for i, num in enumerate(nums):
                            if target - num in seen:
                                return [seen[target - num], i]
                            seen[num] = i
                """);
        assertAccepted("Reverse String", "PYTHON", "hello", "olleh", """
                class Solution:
                    def reverseString(self, s):
                        s.reverse()
                """);
        assertAccepted("Longest Substring Without Repeating Characters", "PYTHON", "abcabcbb", "3", """
                class Solution:
                    def lengthOfLongestSubstring(self, s):
                        seen = set()
                        left = 0
                        best = 0
                        for right, ch in enumerate(s):
                            while ch in seen:
                                seen.remove(s[left])
                                left += 1
                            seen.add(ch)
                            best = max(best, right - left + 1)
                        return best
                """);
        assertAccepted("Merge Intervals", "PYTHON", "1 3\n2 6\n8 10\n15 18", "1 6\n8 10\n15 18", """
                class Solution:
                    def merge(self, intervals):
                        intervals.sort()
                        ans = []
                        for start, end in intervals:
                            if not ans or start > ans[-1][1]:
                                ans.append([start, end])
                            else:
                                ans[-1][1] = max(ans[-1][1], end)
                        return ans
                """);
        assertAccepted("Valid Parentheses", "PYTHON", "()[]{}", "true", """
                class Solution:
                    def isValid(self, s):
                        stack = []
                        pairs = {')': '(', ']': '[', '}': '{'}
                        for ch in s:
                            if ch in pairs:
                                if not stack or stack.pop() != pairs[ch]:
                                    return False
                            else:
                                stack.append(ch)
                        return not stack
                """);
        assertAccepted("Maximum Subarray", "PYTHON", "-2 1 -3 4 -1 2 1 -5 4", "6", """
                class Solution:
                    def maxSubArray(self, nums):
                        best = cur = nums[0]
                        for n in nums[1:]:
                            cur = max(n, cur + n)
                            best = max(best, cur)
                        return best
                """);
        assertAccepted("Binary Tree Level Order Traversal", "PYTHON", "3 9 20 null null 15 7", "[[3],[9,20],[15,7]]", """
                class Solution:
                    def levelOrder(self, root):
                        if not root:
                            return []
                        q = [root]
                        ans = []
                        while q:
                            level = []
                            nxt = []
                            for node in q:
                                level.append(node.val)
                                if node.left:
                                    nxt.append(node.left)
                                if node.right:
                                    nxt.append(node.right)
                            ans.append(level)
                            q = nxt
                        return ans
                """);
        assertAccepted("Climbing Stairs", "PYTHON", "4", "5", """
                class Solution:
                    def climbStairs(self, n):
                        a, b = 1, 1
                        for _ in range(n):
                            a, b = b, a + b
                        return a
                """);
        assertAccepted("Median of Two Sorted Arrays", "PYTHON", "1 2\n3 4", "2.5", """
                class Solution:
                    def findMedianSortedArrays(self, nums1, nums2):
                        nums = sorted(nums1 + nums2)
                        n = len(nums)
                        if n % 2:
                            return nums[n // 2]
                        return (nums[n // 2 - 1] + nums[n // 2]) / 2
                """);
        assertAccepted("N-Queens", "PYTHON", "4", ".Q..\n...Q\nQ...\n..Q.\n\n..Q.\nQ...\n...Q\n.Q..", """
                class Solution:
                    def solveNQueens(self, n):
                        ans = []
                        board = [['.'] * n for _ in range(n)]
                        cols, diag1, diag2 = set(), set(), set()
                        def backtrack(r):
                            if r == n:
                                ans.append([''.join(row) for row in board])
                                return
                            for c in range(n):
                                if c in cols or r + c in diag1 or r - c in diag2:
                                    continue
                                cols.add(c); diag1.add(r + c); diag2.add(r - c); board[r][c] = 'Q'
                                backtrack(r + 1)
                                cols.remove(c); diag1.remove(r + c); diag2.remove(r - c); board[r][c] = '.'
                        backtrack(0)
                        return ans
                """);
    }

    @Test
    void pythonIncorrectSolutionReturnsWrongAnswerNotRuntimeError() {
        JudgeResult result = judge("Maximum Subarray", "PYTHON", "5 4 -1 7 8", "23", """
                class Solution:
                    def maxSubArray(self, nums):
                        return 0
                """);

        assertEquals(JudgeVerdict.WRONG_ANSWER, result.getVerdict());
        assertFalse(result.isPassed());
    }

    @Test
    void javaFunctionDriverCallsSolutionMethod() {
        assertAccepted("Two Sum", "JAVA", "3 2 4\n6", "1 2", """
                import java.util.*;
                class Solution {
                    public int[] twoSum(int[] nums, int target) {
                        Map<Integer, Integer> seen = new HashMap<>();
                        for (int i = 0; i < nums.length; i++) {
                            int need = target - nums[i];
                            if (seen.containsKey(need)) return new int[]{seen.get(need), i};
                            seen.put(nums[i], i);
                        }
                        return new int[]{};
                    }
                }
                """);
        assertAccepted("Reverse String", "JAVA", "a b c d", "d c b a", """
                class Solution {
                    public void reverseString(char[] s) {
                        int l = 0, r = s.length - 1;
                        while (l < r) {
                            char tmp = s[l];
                            s[l++] = s[r];
                            s[r--] = tmp;
                        }
                    }
                }
                """);
    }

    @Test
    void cppFunctionDriverCallsSolutionMethod() {
        assumeTrue(canRunCpp(), "C++ compiler not available on this machine");

        assertAccepted("Two Sum", "CPP", "3 2 4\n6", "1 2", """
                class Solution {
                public:
                    vector<int> twoSum(vector<int>& nums, int target) {
                        unordered_map<int, int> seen;
                        for (int i = 0; i < nums.size(); i++) {
                            int need = target - nums[i];
                            if (seen.count(need)) return {seen[need], i};
                            seen[nums[i]] = i;
                        }
                        return {};
                    }
                };
                """);
        assertAccepted("Maximum Subarray", "CPP", "5 4 -1 7 8", "23", """
                class Solution {
                public:
                    int maxSubArray(vector<int>& nums) {
                        int best = nums[0], cur = nums[0];
                        for (int i = 1; i < nums.size(); i++) {
                            cur = max(nums[i], cur + nums[i]);
                            best = max(best, cur);
                        }
                        return best;
                    }
                };
                """);
    }

    private void assertAccepted(String title, String language, String input, String expected, String code) {
        JudgeResult result = judge(title, language, input, expected, code);
        assertEquals(JudgeVerdict.ACCEPTED, result.getVerdict(), result.getErrorMessage());
        assertTrue(result.isPassed(), result.getErrorMessage());
    }

    private JudgeResult judge(String title, String language, String input, String expected, String code) {
        Problem problem = new Problem();
        problem.setTitle(title);
        problem.setDescription("test");
        problem.setDifficulty(DifficultyLevel.EASY);

        TestCase testCase = new TestCase();
        testCase.setProblem(problem);
        testCase.setInputData(input);
        testCase.setExpectedOutput(expected);

        return judgeService.judge(problem, testCase, language, code);
    }

    private boolean canRunCpp() {
        if (Files.exists(Path.of("C:\\mingw64\\bin\\g++.exe"))) {
            return true;
        }
        try {
            Process process = new ProcessBuilder("g++", "--version").start();
            boolean finished = process.waitFor(3, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return false;
            }
            return process.exitValue() == 0;
        } catch (Exception e) {
            return false;
        }
    }
}
