import "./ProblemTable.css";
import { useState, useEffect } from "react";
import ProblemRow from "./ProblemRow";

const normalizeProblemStatus = (status) => {
    if (!status) return "";
    const value = String(status).toUpperCase();

    if (value === "COMPLETED" || value === "SOLVED" || value === "ACCEPTED") {
        return "Completed";
    }

    if (value === "IN PROGRESS" || value === "ATTEMPTED" || value === "WRONG_ANSWER" || value === "RUNTIME_ERROR" || value === "COMPILATION_ERROR" || value === "TIME_LIMIT_EXCEEDED") {
        return "In Progress";
    }

    return status;
};

function ProblemTable({ searchQuery, difficultyFilter, refreshKey }) {
    const [problems, setProblems] = useState([]);
    const [problemStatuses, setProblemStatuses] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch("/api/problems");
                if (!res.ok) throw new Error("Failed to load problems");
                const data = await res.json();
                setProblems(data);
            } catch {
                setProblems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, [refreshKey]);

    useEffect(() => {
        const fetchProblemStatuses = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await fetch("/api/submissions/statuses", { headers });
                if (!res.ok) throw new Error("Failed to load statuses");
                const data = await res.json();
                setProblemStatuses(Object.fromEntries(
                    Object.entries(data).map(([problemId, status]) => [String(problemId), normalizeProblemStatus(status)])
                ));
            } catch {
                setProblemStatuses({});
            }
        };

        fetchProblemStatuses();
        const intervalId = window.setInterval(fetchProblemStatuses, 5000);
        const refreshHandler = () => fetchProblemStatuses();
        window.addEventListener("codearena:submission-updated", refreshHandler);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("codearena:submission-updated", refreshHandler);
        };
    }, [refreshKey]);

    const filtered = problems.filter((p) => {
        const matchSearch = searchQuery
            ? p.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchDifficulty = difficultyFilter && difficultyFilter !== "All"
            ? p.difficulty.toUpperCase() === difficultyFilter.toUpperCase()
            : true;
        return matchSearch && matchDifficulty;
    }).sort((left, right) => {
        const leftStatus = normalizeProblemStatus(problemStatuses[String(left.id)] || left.status);
        const rightStatus = normalizeProblemStatus(problemStatuses[String(right.id)] || right.status);
        const leftCompleted = leftStatus === "Completed";
        const rightCompleted = rightStatus === "Completed";

        if (leftCompleted !== rightCompleted) {
            return leftCompleted ? 1 : -1;
        }

        return left.id - right.id;
    });

    if (loading) {
        return (
            <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading problems...</p>
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="table-empty">
                <p>No problems found. Try a different search or filter.</p>
            </div>
        );
    }

    return (
        <table className="problem-table">

            <thead>
                <tr>
                    <th>#</th>
                    <th>Problem</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {filtered.map((problem, index) => (
                    <ProblemRow
                        key={problem.id}
                        problem={{
                            ...problem,
                            index: index + 1,
                            difficulty: problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1).toLowerCase(),
                            status: normalizeProblemStatus(problemStatuses[String(problem.id)] || problem.status)
                        }}
                    />
                ))}
            </tbody>

        </table>
    );
}

export default ProblemTable;
