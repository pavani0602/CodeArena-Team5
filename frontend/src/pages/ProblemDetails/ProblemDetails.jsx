import "./ProblemDetails.css";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
    FaPlay,
    FaCheckCircle,
    FaTimesCircle,
    FaSpinner
} from "react-icons/fa";

const BOILERPLATES = {
    JAVA: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your Java code here
        return new int[]{};
    }
}`,
    PYTHON: `def twoSum(nums, target):
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
        setCode(BOILERPLATES[newLang] || "");
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

        // Clean markdown headers if present
        let cleaned = descText.replace(/###\s*Problem Statement/i, "").trim();

        // Check if there is an example block
        const exampleIndex = cleaned.search(/####?\s*Example\s*1:/i);
        if (exampleIndex !== -1) {
            const statement = cleaned.substring(0, exampleIndex).trim();
            const afterExample = cleaned.substring(exampleIndex);

            // Extract example content
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