import "./ProblemDetails.css";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
    FaSpinner,
    FaTimesCircle
} from "react-icons/fa";

const BOILERPLATES = {
    JAVA: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your Java code here
        return new int[]{};
    }
}`,
    PYTHON: `class Solution:
    def twoSum(self, nums, target):
        # Write your Python code here
        pass`,
    CPP: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your C++ code here
        return {};
    }
};`
};

const getDefaultInput = (problem) => {
    if (!problem) return "2 7 11 15\n9";
    const title = (problem.title || "").toLowerCase();
    if (title.includes("two sum")) return "2 7 11 15\n9";
    if (title.includes("reverse string")) return "hello";
    if (title.includes("longest substring")) return "abcabcbb";
    if (title.includes("merge intervals")) return "1 3\n2 6\n8 10\n15 18";
    if (title.includes("valid parentheses")) return "()[]{}";
    if (title.includes("maximum subarray")) return "-2 1 -3 4 -1 2 1 -5 4";
    if (title.includes("level order") || title.includes("binary tree")) return "3 9 20 null null 15 7";
    if (title.includes("climbing stairs")) return "3";
    if (title.includes("median")) return "1 3\n2";
    if (title.includes("queens")) return "4";
    return "2 7 11 15\n9";
};

const getProblemBoilerplate = (problem, lang) => {
    if (!problem) return BOILERPLATES[lang] || "";
    const title = (problem.title || "").toLowerCase();

    if (lang === "PYTHON") {
        if (title.includes("reverse string")) {
            return `class Solution:
    def reverseString(self, s):
        """
        Do not return anything, modify s in-place instead.
        """
        left = 0
        right = len(s) - 1
        while left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1`;
        }
        if (title.includes("two sum")) {
            return `class Solution:
    def twoSum(self, nums, target):
        # Write your Python code here
        # Return indices of the two numbers
        num_map = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in num_map:
                return [num_map[diff], i]
            num_map[num] = i
        return []`;
        }
        if (title.includes("longest substring")) {
            return `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_set = set()
        left = 0
        max_len = 0
        for right in range(len(s)):
            while s[right] in char_set:
                char_set.remove(s[left])
                left += 1
            char_set.add(s[right])
            max_len = max(max_len, right - left + 1)
        return max_len`;
        }
        if (title.includes("merge intervals")) {
            return `class Solution:
    def merge(self, intervals):
        if not intervals:
            return []
        intervals.sort(key=lambda x: x[0])
        merged = [intervals[0]]
        for curr in intervals[1:]:
            prev = merged[-1]
            if curr[0] <= prev[1]:
                prev[1] = max(prev[1], curr[1])
            else:
                merged.append(curr)
        return merged`;
        }
        if (title.includes("valid parentheses")) {
            return `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            else:
                stack.append(char)
        return not stack`;
        }
        if (title.includes("maximum subarray")) {
            return `class Solution:
    def maxSubArray(self, nums) -> int:
        max_sub = nums[0]
        curr_sum = 0
        for n in nums:
            if curr_sum < 0:
                curr_sum = 0
            curr_sum += n
            max_sub = max(max_sub, curr_sum)
        return max_sub`;
        }
        if (title.includes("level order") || title.includes("binary tree")) {
            return `# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def levelOrder(self, root):
        if not root:
            return []
        res = []
        queue = [root]
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.pop(0)
                level.append(node.val)
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
            res.append(level)
        return res`;
        }
        if (title.includes("climbing stairs")) {
            return `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b`;
        }
        if (title.includes("median")) {
            return `class Solution:
    def findMedianSortedArrays(self, nums1, nums2) -> float:
        merged = sorted(nums1 + nums2)
        n = len(merged)
        if n % 2 == 1:
            return float(merged[n // 2])
        return (merged[n // 2 - 1] + merged[n // 2]) / 2.0`;
        }
        if (title.includes("queens")) {
            return `class Solution:
    def solveNQueens(self, n: int):
        res = []
        board = [["."] * n for _ in range(n)]
        def backtrack(r, cols, posDiag, negDiag):
            if r == n:
                copy = ["".join(row) for row in board]
                res.append(copy)
                return
            for c in range(n):
                if c in cols or (r + c) in posDiag or (r - c) in negDiag:
                    continue
                cols.add(c)
                posDiag.add(r + c)
                negDiag.add(r - c)
                board[r][c] = "Q"
                backtrack(r + 1, cols, posDiag, negDiag)
                cols.remove(c)
                posDiag.remove(r + c)
                negDiag.remove(r - c)
                board[r][c] = "."
        backtrack(0, set(), set(), set())
        return res`;
        }
        return `class Solution:
    def solve(self, *args):
        # Write your Python solution here
        pass`;
    }

    if (lang === "JAVA") {
        if (title.includes("reverse string")) {
            return `class Solution {
    public void reverseString(char[] s) {
        int left = 0, right = s.length - 1;
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }
}`;
        }
        if (title.includes("two sum")) {
            return `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[]{map.get(diff), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`;
        }
        if (title.includes("longest substring")) {
            return `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            while (set.contains(s.charAt(right))) {
                set.remove(s.charAt(left++));
            }
            set.add(s.charAt(right));
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`;
        }
        if (title.includes("merge intervals")) {
            return `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> result = new ArrayList<>();
        int[] current = intervals[0];
        result.add(current);
        for (int[] interval : intervals) {
            if (interval[0] <= current[1]) {
                current[1] = Math.max(current[1], interval[1]);
            } else {
                current = interval;
                result.add(current);
            }
        }
        return result.toArray(new int[result.size()][]);
    }
}`;
        }
        if (title.includes("valid parentheses")) {
            return `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`;
        }
        if (title.includes("maximum subarray")) {
            return `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSub = nums[0], curSum = 0;
        for (int n : nums) {
            if (curSum < 0) curSum = 0;
            curSum += n;
            maxSub = Math.max(maxSub, curSum);
        }
        return maxSub;
    }
}`;
        }
        if (title.includes("level order") || title.includes("binary tree")) {
            return `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode cur = q.poll();
                level.add(cur.val);
                if (cur.left != null) q.add(cur.left);
                if (cur.right != null) q.add(cur.right);
            }
            res.add(level);
        }
        return res;
    }
}`;
        }
        if (title.includes("climbing stairs")) {
            return `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`;
        }
        if (title.includes("median")) {
            return `import java.util.*;

class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int[] merged = new int[nums1.length + nums2.length];
        System.arraycopy(nums1, 0, merged, 0, nums1.length);
        System.arraycopy(nums2, 0, merged, nums1.length, nums2.length);
        Arrays.sort(merged);
        int n = merged.length;
        if (n % 2 != 0) return (double) merged[n / 2];
        return (double) (merged[(n - 1) / 2] + merged[n / 2]) / 2.0;
    }
}`;
        }
        if (title.includes("queens")) {
            return `import java.util.*;

class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        backtrack(res, board, 0, n);
        return res;
    }
    private void backtrack(List<List<String>> res, char[][] board, int row, int n) {
        if (row == n) {
            List<String> list = new ArrayList<>();
            for (char[] r : board) list.add(new String(r));
            res.add(list);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (isValid(board, row, col, n)) {
                board[row][col] = 'Q';
                backtrack(res, board, row + 1, n);
                board[row][col] = '.';
            }
        }
    }
    private boolean isValid(char[][] board, int r, int c, int n) {
        for (int i = 0; i < r; i++) if (board[i][c] == 'Q') return false;
        for (int i = r - 1, j = c - 1; i >= 0 && j >= 0; i--, j--) if (board[i][j] == 'Q') return false;
        for (int i = r - 1, j = c + 1; i >= 0 && j < n; i--, j++) if (board[i][j] == 'Q') return false;
        return true;
    }
}`;
        }
        return BOILERPLATES.JAVA;
    }

    if (lang === "CPP") {
        if (title.includes("reverse string")) {
            return `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        int left = 0, right = s.size() - 1;
        while (left < right) {
            swap(s[left], s[right]);
            left++;
            right--;
        }
    }
};`;
        }
        if (title.includes("two sum")) {
            return `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (map.count(diff)) return {map[diff], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`;
        }
        if (title.includes("longest substring")) {
            return `#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> set;
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            while (set.count(s[right])) {
                set.erase(s[left++]);
            }
            set.insert(s[right]);
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`;
        }
        if (title.includes("merge intervals")) {
            return `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> res = {intervals[0]};
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] <= res.back()[1]) {
                res.back()[1] = max(res.back()[1], intervals[i][1]);
            } else {
                res.push_back(intervals[i]);
            }
        }
        return res;
    }
};`;
        }
        if (title.includes("valid parentheses")) {
            return `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else if (st.empty() || st.top() != c) return false;
            else st.pop();
        }
        return st.empty();
    }
};`;
        }
        if (title.includes("maximum subarray")) {
            return `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSub = nums[0], curSum = 0;
        for (int n : nums) {
            if (curSum < 0) curSum = 0;
            curSum += n;
            maxSub = max(maxSub, curSum);
        }
        return maxSub;
    }
};`;
        }
        if (title.includes("level order") || title.includes("binary tree")) {
            return `#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> res;
        if (!root) return res;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            vector<int> level;
            for (int i = 0; i < size; i++) {
                TreeNode* cur = q.front(); q.pop();
                level.push_back(cur->val);
                if (cur->left) q.push(cur->left);
                if (cur->right) q.push(cur->right);
            }
            res.push_back(level);
        }
        return res;
    }
};`;
        }
        if (title.includes("climbing stairs")) {
            return `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};`;
        }
        if (title.includes("median")) {
            return `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        vector<int> merged = nums1;
        merged.insert(merged.end(), nums2.begin(), nums2.end());
        sort(merged.begin(), merged.end());
        int n = merged.size();
        if (n % 2 != 0) return (double) merged[n / 2];
        return (double) (merged[(n - 1) / 2] + merged[n / 2]) / 2.0;
    }
};`;
        }
        if (title.includes("queens")) {
            return `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> res;
        vector<string> board(n, string(n, '.'));
        backtrack(res, board, 0, n);
        return res;
    }
    void backtrack(vector<vector<string>>& res, vector<string>& board, int row, int n) {
        if (row == n) {
            res.push_back(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (isValid(board, row, col, n)) {
                board[row][col] = 'Q';
                backtrack(res, board, row + 1, n);
                board[row][col] = '.';
            }
        }
    }
    bool isValid(vector<string>& board, int r, int c, int n) {
        for (int i = 0; i < r; i++) if (board[i][c] == 'Q') return false;
        for (int i = r - 1, j = c - 1; i >= 0 && j >= 0; i--, j--) if (board[i][j] == 'Q') return false;
        for (int i = r - 1, j = c + 1; i >= 0 && j < n; i--, j++) if (board[i][j] == 'Q') return false;
        return true;
    }
};`;
        }
        return BOILERPLATES.CPP;
    }

    return BOILERPLATES[lang] || "";
};

function ProblemDetails() {
    const { id: paramId } = useParams();
    const [searchParams] = useSearchParams();
    const problemId = paramId || searchParams.get("id") || "1";

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Editor state
    const [language, setLanguage] = useState("PYTHON");
    const [code, setCode] = useState(BOILERPLATES.PYTHON);
    const [customInput, setCustomInput] = useState("2 7 11 15\n9");
    const [showCustomInput, setShowCustomInput] = useState(false);

    // Execution & Submission state
    const [executing, setExecuting] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState(null);
    const [submissionResult, setSubmissionResult] = useState(null);

    // Tabs & Submissions list
    const [activeTab, setActiveTab] = useState("description");
    const [submissionsList, setSubmissionsList] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [selectedHistorySub, setSelectedHistorySub] = useState(null);

    const fetchProblem = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/problems/${problemId}`);
            if (!res.ok) {
                throw new Error("Failed to load problem details");
            }
            const data = await res.json();
            setProblem(data);
            setCode(getProblemBoilerplate(data, language));
            setCustomInput(getDefaultInput(data));
        } catch (err) {
            setError(err.message || "Error loading problem");
        } finally {
            setLoading(false);
        }
    }, [language, problemId]);

    useEffect(() => {
        const timeoutId = window.setTimeout(fetchProblem, 0);
        return () => window.clearTimeout(timeoutId);
    }, [fetchProblem]);

    const fetchSubmissions = async () => {
        setLoadingSubmissions(true);
        try {
            const res = await fetch(`/api/submissions/problem/${problemId}`);
            if (res.ok) {
                const data = await res.json();
                setSubmissionsList(data);
            }
        } catch (err) {
            console.error("Error fetching submissions:", err);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedHistorySub(null);
        if (tab === "submissions") {
            fetchSubmissions();
        }
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (problem) {
            setCode(getProblemBoilerplate(problem, newLang));
        } else {
            setCode(BOILERPLATES[newLang] || "");
        }
    };

    const handleRunCode = async () => {
        setExecuting(true);
        setConsoleOutput(null);
        setSubmissionResult(null);

        try {
            const res = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: language,
                    code: code,
                    input: customInput
                })
            });
            const data = await res.json();
            setConsoleOutput(data);
        } catch {
            setConsoleOutput({
                status: "ERROR",
                error: "Network failure: Could not connect to backend execution server."
            });
        } finally {
            setExecuting(false);
        }
    };

    const handleSubmitSolution = async () => {
        setSubmitting(true);
        setConsoleOutput(null);
        setSubmissionResult(null);

        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`/api/submissions/problem/${problemId}`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    language: language,
                    code: code
                })
            });
            const data = await res.json();
            setSubmissionResult(data);
            if (activeTab === "submissions") {
                fetchSubmissions();
            }
        } catch {
            setSubmissionResult({
                status: "RUNTIME_ERROR",
                message: "Error submitting code. Check backend connection."
            });
        } finally {
            setSubmitting(false);
        }
    };

    const getFileName = () => {
        if (language === "PYTHON") return "solution.py";
        if (language === "JAVA") return "Solution.java";
        if (language === "CPP") return "solution.cpp";
        return "solution.txt";
    };

    // Helper to format/render description cleanly into statement and examples box
    const renderFormattedDescription = (descText) => {
        if (!descText) return "No description provided for this problem.";

        let cleaned = descText.replace(/###\s*Problem Statement/i, "").trim();

        const exampleIndex = cleaned.search(/####?\s*Example\s*1:/i);
        if (exampleIndex !== -1) {
            const statement = cleaned.substring(0, exampleIndex).trim();
            const afterExample = cleaned.substring(exampleIndex);

            const exampleContent = afterExample.replace(/####?\s*Example\s*1:/i, "").replace(/```/g, "").replace(/####?\s*Constraints:.*/is, "").trim();

            return (
                <>
                    <div className="problem-description">{statement}</div>
                    <div className="example-title">Example 1</div>
                    <div className="example-box">
                        {exampleContent.split("\n").map((line, idx) => (
                            <div key={idx} style={{ marginBottom: line.toLowerCase().includes("input:") || line.toLowerCase().includes("output:") ? "6px" : "0" }}>
                                {line}
                            </div>
                        ))}
                    </div>
                </>
            );
        }

        return <div className="problem-description">{cleaned}</div>;
    };

    const renderTestCasesList = (resultsList) => {
        if (!resultsList || !Array.isArray(resultsList) || resultsList.length === 0) {
            return null;
        }
        return (
            <div className="testcases-container">
                {resultsList.map((res, index) => {
                    const isHidden = res.testCase && (res.testCase.hidden || res.testCase.isHidden);
                    return (
                        <div key={index} className={`testcase-card ${res.passed ? "passed" : "failed"}`}>
                            <div className="testcase-header">
                                <span>
                                    Test Case #{index + 1} {isHidden ? "🔒 [Hidden]" : "📖 [Public]"}
                                </span>
                                <span className={`status-badge ${res.passed ? "accepted" : "wrong"}`} style={{ fontSize: "0.75rem" }}>
                                    {res.passed ? "PASSED ✅" : "FAILED ❌"}
                                </span>
                            </div>

                            <div className="testcase-body">
                                {!isHidden ? (
                                    <>
                                        <div className="testcase-field">
                                            <div className="testcase-field-label">Input</div>
                                            <div className="testcase-field-val">{res.inputData || "(No input)"}</div>
                                        </div>
                                        <div className="testcase-field">
                                            <div className="testcase-field-label">Expected Output</div>
                                            <div className="testcase-field-val expected">{res.expectedOutput}</div>
                                        </div>
                                        <div className="testcase-field">
                                            <div className="testcase-field-label">Your Actual Output</div>
                                            <div className={`testcase-field-val ${!res.passed ? "actual-wrong" : ""}`}>
                                                {res.actualOutput || "(No output produced)"}
                                            </div>
                                        </div>
                                        {!res.passed && (
                                            <div className="failure-highlight-box">
                                                <strong>⚠️ Why it failed:</strong>{" "}
                                                {res.errorMessage ? (
                                                    <span>Runtime/Compilation Error: {res.errorMessage}</span>
                                                ) : (
                                                    <span>Expected <code>{res.expectedOutput}</code> but your code output <code>{res.actualOutput}</code>. Check your logic for input <code>{res.inputData}</code>.</span>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ color: "#94A3B8", fontStyle: "italic" }}>
                                        {res.passed ? (
                                            "Your code successfully passed this hidden edge/performance test case."
                                        ) : (
                                            <div className="failure-highlight-box">
                                                <strong>⚠️ Hidden Test Case Failed:</strong> Your solution produced an incorrect result or encountered an error on a hidden verification test case. Check boundary conditions and edge cases!
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="problem-details-page">
                <div className="solver-container" style={{ textAlign: "center", padding: "100px 0" }}>
                    <FaSpinner className="spin" style={{ fontSize: "2.5rem", color: "#10B981" }} />
                    <p style={{ marginTop: "16px", color: "#94A3B8" }}>Loading problem #{problemId}...</p>
                </div>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="problem-details-page">
                <div className="solver-container" style={{ textAlign: "center", padding: "100px 0" }}>
                    <FaTimesCircle style={{ fontSize: "3rem", color: "#EF4444" }} />
                    <h2 style={{ marginTop: "16px", color: "#fff" }}>Problem Not Found</h2>
                    <p style={{ color: "#94A3B8", margin: "12px 0 24px 0" }}>{error || `We couldn't find problem #${problemId}`}</p>
                    <Link to="/problems" className="back-link">
                        ← Back to Problems
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <section className="problem-details-page">
            <div className="solver-container">
                
                {/* Back Link */}
                <div className="back-link-wrapper">
                    <Link to="/problems" className="back-link">
                        ← Back to Problems
                    </Link>
                </div>

                {/* 2-Column Split Grid */}
                <div className="solver-grid">
                    
                    {/* Left Pane: Problem Statement */}
                    <div className="problem-pane">
                        <div className="pane-tabs">
                            <button
                                type="button"
                                className={`pane-tab ${activeTab === "description" ? "active" : ""}`}
                                onClick={() => handleTabChange("description")}
                            >
                                Problem
                            </button>
                            <button
                                type="button"
                                className={`pane-tab ${activeTab === "submissions" ? "active" : ""}`}
                                onClick={() => handleTabChange("submissions")}
                            >
                                Submissions
                            </button>
                        </div>

                        {activeTab === "description" ? (
                            <div>
                                <h1 className="problem-title">{problem.title}</h1>

                                <div className="problem-meta-bar">
                                    <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                                        {problem.difficulty}
                                    </span>
                                    {problem.tags && problem.tags.split(",").map((tag, idx) => (
                                        <span key={idx} className="tag-chip">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>

                                {renderFormattedDescription(problem.descriptionMd || problem.description)}
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ marginBottom: "16px", fontSize: "1.1rem", color: "#fff" }}>Submissions History</h3>
                                <p style={{ fontSize: "0.85rem", color: "#94A3B8", marginBottom: "12px" }}>Click any submission row below to inspect its detailed test cases and failure points.</p>
                                {loadingSubmissions ? (
                                    <p style={{ color: "#94A3B8" }}>Loading history...</p>
                                ) : submissionsList.length === 0 ? (
                                    <p style={{ color: "#94A3B8" }}>You haven't submitted any solutions for this problem yet.</p>
                                ) : (
                                    <>
                                        <table className="submissions-table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Status</th>
                                                    <th>Language</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {submissionsList.map((sub) => (
                                                    <tr 
                                                        key={sub.id} 
                                                        onClick={() => setSelectedHistorySub(selectedHistorySub?.id === sub.id ? null : sub)}
                                                        style={{ cursor: "pointer", background: selectedHistorySub?.id === sub.id ? "rgba(16, 185, 129, 0.1)" : "transparent" }}
                                                        title="Click to view test case results"
                                                    >
                                                        <td>#{sub.id}</td>
                                                        <td>
                                                            <span className={`status-badge ${sub.status === "ACCEPTED" ? "accepted" : "wrong"}`}>
                                                                {sub.status}
                                                            </span>
                                                        </td>
                                                        <td>{sub.language}</td>
                                                        <td>{sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString() : "Just now"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {selectedHistorySub && (
                                            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #1E2E48" }}>
                                                <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span>Submission #{selectedHistorySub.id} Test Cases</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setSelectedHistorySub(null)}
                                                        style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "0.8rem" }}
                                                    >
                                                        ✕ Close Details
                                                    </button>
                                                </h4>
                                                {renderTestCasesList(selectedHistorySub.results)}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Pane: Code Editor & Buttons Row */}
                    <div className="editor-container-right">
                        
                        {/* Editor Card */}
                        <div className="editor-card">
                            <div className="editor-header-bar">
                                <span className="editor-file-name">{getFileName()}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setCode(getProblemBoilerplate(problem, language))}
                                        style={{
                                            background: "transparent",
                                            border: "1px solid #1E2E48",
                                            color: "#94A3B8",
                                            padding: "5px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "0.85rem",
                                            transition: "all 0.2s"
                                        }}
                                        title="Reset code to initial boilerplate"
                                    >
                                        🔄 Reset
                                    </button>
                                    <select
                                        className="language-select"
                                        value={language}
                                        onChange={handleLanguageChange}
                                    >
                                        <option value="PYTHON">Python</option>
                                        <option value="JAVA">Java</option>
                                        <option value="CPP">C++</option>
                                    </select>
                                </div>
                            </div>

                            <textarea
                                className="code-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                spellCheck="false"
                                placeholder="Type your code solution here..."
                            />
                        </div>

                        {/* Buttons Row exactly below the code editor card */}
                        <div className="editor-buttons-row">
                            <button
                                type="button"
                                className="run-code-btn"
                                onClick={handleRunCode}
                                disabled={executing || submitting}
                            >
                                {executing ? <FaSpinner className="spin" /> : "Run Code"}
                            </button>
                            <button
                                type="button"
                                className="submit-code-btn"
                                onClick={handleSubmitSolution}
                                disabled={executing || submitting}
                            >
                                {submitting ? <FaSpinner className="spin" /> : "Submit Code"}
                            </button>
                        </div>

                        {/* Custom Input Toggle */}
                        <button
                            type="button"
                            className="custom-input-toggle"
                            onClick={() => setShowCustomInput(!showCustomInput)}
                        >
                            {showCustomInput ? "▲ Hide Custom Test Case Input" : "▼ Test against custom input"}
                        </button>
                        {showCustomInput && (
                            <textarea
                                className="custom-input-box"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter custom stdin test values..."
                            />
                        )}

                        {/* Execution Results Console */}
                        {consoleOutput && (
                            <div className="console-output">
                                <div className="console-header">
                                    <h4>Execution Output</h4>
                                    <span className={`status-badge ${consoleOutput.status === "SUCCESS" ? "accepted" : "wrong"}`}>
                                        {consoleOutput.status}
                                    </span>
                                </div>
                                {consoleOutput.error ? (
                                    <div className="console-text" style={{ color: "#EF4444" }}>
                                        {consoleOutput.error}
                                    </div>
                                ) : (
                                    <div className="console-text">
                                        {consoleOutput.output || "(No output produced)"}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submission Verdict Card */}
                        {submissionResult && (
                            <div className="console-output" style={{ borderLeft: submissionResult.status === "ACCEPTED" ? "4px solid #10B981" : "4px solid #EF4444" }}>
                                <div className="console-header">
                                    <h4>
                                        Submission Verdict
                                        {submissionResult.results && Array.isArray(submissionResult.results) && (
                                            <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "#94A3B8", marginLeft: "10px" }}>
                                                (Passed {submissionResult.results.filter(r => r.passed).length} / {submissionResult.results.length} Test Cases)
                                            </span>
                                        )}
                                    </h4>
                                    <span className={`status-badge ${submissionResult.status === "ACCEPTED" ? "accepted" : "wrong"}`}>
                                        {submissionResult.status}
                                    </span>
                                </div>
                                <div className="console-text" style={{ color: submissionResult.status === "ACCEPTED" ? "#10B981" : "#EF4444", marginBottom: "14px" }}>
                                    {submissionResult.status === "ACCEPTED" ? (
                                        "ACCEPTED 🎉 All test cases passed successfully! Your accuracy has been recorded on the leaderboard."
                                    ) : (
                                        `${submissionResult.status || "WRONG ANSWER"} ❌ Your code did not pass all test cases. See exact failure details below:`
                                    )}
                                </div>

                                {renderTestCasesList(submissionResult.results)}
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </section>
    );
}

export default ProblemDetails;
