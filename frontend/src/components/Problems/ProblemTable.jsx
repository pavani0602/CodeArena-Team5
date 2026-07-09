import "./ProblemTable.css";
import { useState, useEffect } from "react";
import ProblemRow from "./ProblemRow";

function ProblemTable({ searchQuery, difficultyFilter }) {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await fetch("/api/problems");
                if (!res.ok) throw new Error("Failed to load problems");
                const data = await res.json();
                setProblems(data);
            } catch (err) {
                // Backend not running or no data yet — fall back to sample data
                setProblems([
                    { id: 1, title: "Two Sum", difficulty: "EASY" },
                    { id: 2, title: "Reverse String", difficulty: "EASY" },
                    { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "MEDIUM" },
                    { id: 4, title: "Merge Intervals", difficulty: "MEDIUM" },
                    { id: 5, title: "N Queens", difficulty: "HARD" },
                    { id: 6, title: "Binary Tree Level Order Traversal", difficulty: "MEDIUM" },
                    { id: 7, title: "Valid Parentheses", difficulty: "EASY" },
                    { id: 8, title: "Maximum Subarray", difficulty: "MEDIUM" },
                    { id: 9, title: "Climbing Stairs", difficulty: "EASY" },
                    { id: 10, title: "Median of Two Sorted Arrays", difficulty: "HARD" },
                ]);
                setError(""); // No error shown, sample data used
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    const filtered = problems.filter((p) => {
        const matchSearch = searchQuery
            ? p.title.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchDifficulty = difficultyFilter && difficultyFilter !== "All"
            ? p.difficulty.toUpperCase() === difficultyFilter.toUpperCase()
            : true;
        return matchSearch && matchDifficulty;
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
                        problem={{ ...problem, index: index + 1, difficulty: problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1).toLowerCase() }}
                    />
                ))}
            </tbody>

        </table>
    );
}

export default ProblemTable;