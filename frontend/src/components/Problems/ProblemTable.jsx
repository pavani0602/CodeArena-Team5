import "./ProblemTable.css";
import ProblemRow from "./ProblemRow";

function ProblemTable({ searchQuery, difficulty, sortBy, onRowClick }) {
    const problems = [
        { id: 1, title: "Two Sum", difficulty: "Easy", status: "Solved" },
        { id: 2, title: "Valid Parentheses", difficulty: "Easy", status: "Solved" },
        { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", status: "Attempted" },
        { id: 4, title: "Merge Intervals", difficulty: "Medium", status: "Unsolved" },
        { id: 5, title: "Binary Tree Inorder Traversal", difficulty: "Easy", status: "Solved" },
        { id: 6, title: "Course Schedule", difficulty: "Medium", status: "Unsolved" },
        { id: 7, title: "Number of Islands", difficulty: "Medium", status: "Attempted" },
        { id: 8, title: "Word Ladder", difficulty: "Hard", status: "Unsolved" },
        { id: 9, title: "LRU Cache", difficulty: "Hard", status: "Unsolved" },
        { id: 10, title: "Kth Largest Element", difficulty: "Medium", status: "Solved" },
        { id: 11, title: "Climbing Stairs", difficulty: "Easy", status: "Solved" },
        { id: 12, title: "Search in Rotated Sorted Array", difficulty: "Medium", status: "Attempted" }
    ];

    // 1. Filter the problems first
    const filteredProblems = problems.filter((prob) => {
        const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficulty === "All" || prob.difficulty === difficulty;
        return matchesSearch && matchesDifficulty;
    });

    // 2. Sort the filtered array dynamically
    const sortedProblems = [...filteredProblems].sort((a, b) => {
        if (sortBy === "name") {
            return a.title.localeCompare(b.title); // Sort alphabetically A-Z
        }
        if (sortBy === "difficulty") {
            // Mapping difficulties to values to sort easily (Easy -> Medium -> Hard)
            const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        // "latest" defaults to sorting by ID descending (highest/newest first)
        return a.id - b.id; 
    });

    return (
        <div className="problem-table-container">
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
                            <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)" }}>
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