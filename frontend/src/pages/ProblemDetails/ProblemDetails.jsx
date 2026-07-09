import "./ProblemDetails.css";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
    FaCode,
    FaPlay,
    FaPaperPlane,
    FaArrowLeft,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaSpinner
} from "react-icons/fa";

const BOILERPLATES = {
    JAVA: `public class Main {
    public static void main(String[] args) {
        // Write your Java solution here
        System.out.println("Hello, CodeArena!");
    }
}`,
    PYTHON: `# Write your Python solution here
def solve():
    print("Hello, CodeArena!")

if __name__ == "__main__":
    solve()`,
    CPP: `#include <iostream>
using namespace std;

int main() {
    // Write your C++ solution here
    cout << "Hello, CodeArena!" << endl;
    return 0;
}`
};

function ProblemDetails() {
    const { id: paramId } = useParams();
    const [searchParams] = useSearchParams();
    const problemId = paramId || searchParams.get("id") || "1";

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Editor state
    const [language, setLanguage] = useState("JAVA");
    const [code, setCode] = useState(BOILERPLATES.JAVA);
    const [customInput, setCustomInput] = useState("5 10");

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

    if (loading) {
        return (
            <div className="problem-details-page">
                <div className="solver-container" style={{ textAlign: "center", padding: "80px 0" }}>
                    <FaSpinner className="spin" style={{ fontSize: "2rem", color: "#6366f1" }} />
                    <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.7)" }}>Loading coding challenge #{problemId}...</p>
                </div>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="problem-details-page">
                <div className="solver-container" style={{ textAlign: "center", padding: "80px 0" }}>
                    <FaTimesCircle style={{ fontSize: "3rem", color: "#ff4757" }} />
                    <h2>Problem Not Found</h2>
                    <p style={{ color: "rgba(255,255,255,0.7)", margin: "16px 0 24px 0" }}>{error || `We couldn't find problem #${problemId}`}</p>
                    <Link to="/problems" className="back-btn" style={{ display: "inline-flex" }}>
                        <FaArrowLeft /> Back to Problems List
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <section className="problem-details-page">
            <div className="solver-container">
                
                {/* Header */}
                <div className="solver-header">
                    <div className="solver-header-left">
                        <Link to="/problems" className="back-btn">
                            <FaArrowLeft /> Back
                        </Link>
                        <h1>{problem.id}. {problem.title}</h1>
                    </div>
                    <div className="problem-meta-bar" style={{ margin: 0 }}>
                        <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                            {problem.difficulty}
                        </span>
                        {problem.tags && problem.tags.split(",").map((tag, idx) => (
                            <span key={idx} className="tag-chip">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Split Grid */}
                <div className="solver-grid">
                    
                    {/* Left Pane: Problem Description & Submissions Tabs */}
                    <div className="problem-pane">
                        <div className="pane-tabs">
                            <button
                                type="button"
                                className={`pane-tab ${activeTab === "description" ? "active" : ""}`}
                                onClick={() => handleTabChange("description")}
                            >
                                📖 Description
                            </button>
                            <button
                                type="button"
                                className={`pane-tab ${activeTab === "submissions" ? "active" : ""}`}
                                onClick={() => handleTabChange("submissions")}
                            >
                                🕒 Submissions History
                            </button>
                        </div>

                        {activeTab === "description" ? (
                            <div>
                                <div className="problem-description">
                                    {problem.descriptionMd || problem.description || "No description provided for this problem."}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ marginBottom: "12px", fontSize: "1.1rem" }}>Your Submissions for #{problem.id}</h3>
                                {loadingSubmissions ? (
                                    <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading history...</p>
                                ) : submissionsList.length === 0 ? (
                                    <p style={{ color: "rgba(255,255,255,0.6)" }}>You haven't submitted any solutions for this problem yet.</p>
                                ) : (
                                    <table className="submissions-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Status</th>
                                                <th>Language</th>
                                                <th>Submitted At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissionsList.map((sub) => (
                                                <tr key={sub.id}>
                                                    <td>#{sub.id}</td>
                                                    <td>
                                                        <span className={`status-badge ${sub.status === "ACCEPTED" ? "accepted" : sub.status === "WRONG_ANSWER" ? "wrong" : "error"}`}>
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

                    {/* Right Pane: IDE & Code Execution */}
                    <div className="editor-pane">
                        
                        <div className="editor-toolbar">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Language:</span>
                                <select
                                    className="language-select"
                                    value={language}
                                    onChange={handleLanguageChange}
                                >
                                    <option value="JAVA">Java 17 (OpenJDK)</option>
                                    <option value="PYTHON">Python 3</option>
                                    <option value="CPP">C++ (GCC)</option>
                                </select>
                            </div>

                            <div className="editor-actions">
                                <button
                                    type="button"
                                    className="run-btn"
                                    onClick={handleRunCode}
                                    disabled={executing || submitting}
                                >
                                    {executing ? <FaSpinner className="spin" /> : <FaPlay style={{ fontSize: "0.8rem", color: "#2ed573" }} />}
                                    Run Code
                                </button>
                                <button
                                    type="button"
                                    className="submit-btn"
                                    onClick={handleSubmitSolution}
                                    disabled={executing || submitting}
                                >
                                    {submitting ? <FaSpinner className="spin" /> : <FaPaperPlane style={{ fontSize: "0.8rem" }} />}
                                    Submit Solution
                                </button>
                            </div>
                        </div>

                        {/* Code Editor Area */}
                        <textarea
                            className="code-textarea"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck="false"
                            placeholder="Type your solution code here..."
                        />

                        {/* Custom Input */}
                        <div className="testcase-section">
                            <label>Custom Test Case Input (stdin)</label>
                            <textarea
                                className="custom-input-box"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter input values to test your code..."
                            />
                        </div>

                        {/* Execution Results Banner / Console */}
                        {consoleOutput && (
                            <div className="console-output">
                                <div className="console-header">
                                    <h4>⚡ Execution Results</h4>
                                    <span className={`status-badge ${consoleOutput.status === "SUCCESS" ? "accepted" : "wrong"}`}>
                                        {consoleOutput.status}
                                    </span>
                                </div>
                                {consoleOutput.error ? (
                                    <div className="console-text" style={{ color: "#ff8888", border: "1px solid rgba(255, 85, 85, 0.3)" }}>
                                        {consoleOutput.error}
                                    </div>
                                ) : (
                                    <div className="console-text">
                                        {consoleOutput.output || "(Program produced no output)"}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submission Verdict Card */}
                        {submissionResult && (
                            <div className="console-output">
                                <div className="console-header">
                                    <h4>🏆 Evaluation Verdict</h4>
                                </div>
                                <div className={`result-banner ${submissionResult.status === "ACCEPTED" ? "success" : "fail"}`}>
                                    {submissionResult.status === "ACCEPTED" ? (
                                        <>
                                            <FaCheckCircle style={{ fontSize: "1.3rem" }} />
                                            <div>
                                                <div style={{ fontSize: "1.1rem" }}>ACCEPTED 🎉</div>
                                                <div style={{ fontSize: "0.85rem", fontWeight: "normal", opacity: 0.9 }}>
                                                    All test cases passed successfully! Your accuracy score has been updated on the Leaderboard.
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <FaTimesCircle style={{ fontSize: "1.3rem" }} />
                                            <div>
                                                <div style={{ fontSize: "1.1rem" }}>{submissionResult.status || "WRONG ANSWER"}</div>
                                                <div style={{ fontSize: "0.85rem", fontWeight: "normal", opacity: 0.9 }}>
                                                    Your solution did not pass all hidden test cases. Double check your algorithm or edge cases!
                                                </div>
                                            </div>
                                        </>
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