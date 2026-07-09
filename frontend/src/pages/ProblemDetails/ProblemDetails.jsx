import "./ProblemDetails.css";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
    FaSpinner,
    FaCheckCircle,
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
        pass`;
        }
        if (title.includes("longest substring")) {
            return `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your Python code here
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
            return `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your Java code here
        return new int[]{};
    }
}`;
        }
        return BOILERPLATES.JAVA;
    }

    if (lang === "CPP") {
        if (title.includes("reverse string")) {
            return `#include <vector>
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

    useEffect(() => {
        fetchProblem();
    }, [problemId]);

    const fetchProblem = async () => {
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
    };

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
        } catch (err) {
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
        } catch (err) {
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
                                {loadingSubmissions ? (
                                    <p style={{ color: "#94A3B8" }}>Loading history...</p>
                                ) : submissionsList.length === 0 ? (
                                    <p style={{ color: "#94A3B8" }}>You haven't submitted any solutions for this problem yet.</p>
                                ) : (
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
                                                <tr key={sub.id}>
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
                            <div className="console-output">
                                <div className="console-header">
                                    <h4>Submission Verdict</h4>
                                    <span className={`status-badge ${submissionResult.status === "ACCEPTED" ? "accepted" : "wrong"}`}>
                                        {submissionResult.status}
                                    </span>
                                </div>
                                <div className="console-text" style={{ color: submissionResult.status === "ACCEPTED" ? "#10B981" : "#EF4444" }}>
                                    {submissionResult.status === "ACCEPTED" ? (
                                        "ACCEPTED 🎉 All test cases passed successfully! Your accuracy has been recorded on the leaderboard."
                                    ) : (
                                        `${submissionResult.status || "WRONG ANSWER"} ❌ Your code did not pass all hidden test cases.`
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </section>
    );
}

export default ProblemDetails;