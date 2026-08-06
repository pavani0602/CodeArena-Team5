import { useState, useEffect } from "react";
import "./ProblemTable.css";
import ProblemRow from "./ProblemRow";
import { fetchApi } from "../../services/api";

function ProblemTable({ searchQuery, difficulty, selectedTopic, sortBy, onRowClick }) {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProblems = async () => {
            try {
                const [problemsRes, statusesRes] = await Promise.all([
                    fetchApi('/api/problems'),
                    fetchApi('/api/submissions/statuses')
                ]);

                if (!problemsRes.ok) throw new Error("Failed to fetch problems");
                
                const data = await problemsRes.json();
                let statuses = {};
                
                // If user is logged out, this might return 401 or 403, which is fine to ignore
                if (statusesRes.ok) {
                    statuses = await statusesRes.json();
                }
                
                const mappedData = data.map(p => {
                    let firstTopic = "General";
                    if (p.tags) {
                        if (Array.isArray(p.tags) && p.tags.length > 0) {
                            firstTopic = p.tags[0];
                        } else if (typeof p.tags === 'string' && p.tags.length > 0) {
                            firstTopic = p.tags.split(',')[0].trim();
                        }
                    }
                    return {
                        id: p.id,
                        title: p.title,
                        difficulty: p.difficulty,
                        topic: firstTopic,
                        status: statuses[p.id] || "Unsolved"
                    };
                });
                
                setProblems(mappedData);
            } catch (err) {
                console.error(err);
                setError("Failed to load problems from the server.");
            } finally {
                setLoading(false);
            }
        };

        loadProblems();
    }, []);

    // 1. Filter the problems by search query, difficulty, and topic tag
    const filteredProblems = problems.filter((prob) => {
        const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficulty === "All" || (prob.difficulty && prob.difficulty.toLowerCase() === difficulty.toLowerCase());
        const matchesTopic = !selectedTopic || selectedTopic === "All" || (prob.topic && prob.topic.toLowerCase() === selectedTopic.toLowerCase());
        return matchesSearch && matchesDifficulty && matchesTopic;
    });

    // 2. Sort the filtered array dynamically
    const sortedProblems = [...filteredProblems].sort((a, b) => {
        if (sortBy === "name") {
            return a.title.localeCompare(b.title); // Sort alphabetically A-Z
        }
        if (sortBy === "difficulty") {
            const difficultyOrder = { "EASY": 1, "Easy": 1, "easy": 1, "MEDIUM": 2, "Medium": 2, "medium": 2, "HARD": 3, "Hard": 3, "hard": 3 };
            return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
        }
        return a.id - b.id; 
    });

    if (loading) return <div style={{ textAlign: "center", padding: "30px" }}>Loading problems...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "30px", color: "red" }}>{error}</div>;

    return (
        <div className="problem-table-container">
            <table className="problem-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Problem</th>
                        <th>Difficulty</th>
                        <th>Topic</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProblems.length > 0 ? (
                        sortedProblems.map((problem) => (
                            <ProblemRow
                                key={problem.id}
                                problem={problem}
                                onRowClick={onRowClick}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)" }}>
                                No problems found matching your criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ProblemTable;
