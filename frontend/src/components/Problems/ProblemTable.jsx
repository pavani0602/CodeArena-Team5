import "./ProblemTable.css";
import ProblemRow from "./ProblemRow";

function ProblemTable({ searchQuery, difficulty, selectedTopic, sortBy, onRowClick }) {
    const problems = [
        { id: 1, title: "Two Sum", difficulty: "Easy", status: "Solved", topic: "Array" },
        { id: 2, title: "Valid Parentheses", difficulty: "Easy", status: "Solved", topic: "Stack" },
        { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", status: "Attempted", topic: "String" },
        { id: 4, title: "Merge Intervals", difficulty: "Medium", status: "Unsolved", topic: "Array" },
        { id: 5, title: "Binary Tree Inorder Traversal", difficulty: "Easy", status: "Solved", topic: "Tree" },
        { id: 6, title: "Course Schedule", difficulty: "Medium", status: "Unsolved", topic: "Graph" },
        { id: 7, title: "Number of Islands", difficulty: "Medium", status: "Attempted", topic: "Graph" },
        { id: 8, title: "Word Ladder", difficulty: "Hard", status: "Unsolved", topic: "Graph" },
        { id: 9, title: "LRU Cache", difficulty: "Hard", status: "Unsolved", topic: "Design" },
        { id: 10, title: "Kth Largest Element", difficulty: "Medium", status: "Solved", topic: "Sorting" },
        { id: 11, title: "Climbing Stairs", difficulty: "Easy", status: "Solved", topic: "Dynamic Programming" },
        { id: 12, title: "Search in Rotated Sorted Array", difficulty: "Medium", status: "Attempted", topic: "Binary Search" }
    ];

    // 1. Filter the problems by search query, difficulty, and topic tag
    const filteredProblems = problems.filter((prob) => {
        const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficulty === "All" || prob.difficulty === difficulty;
        const matchesTopic = !selectedTopic || selectedTopic === "All" || prob.topic === selectedTopic;
        return matchesSearch && matchesDifficulty && matchesTopic;
    });

    // 2. Sort the filtered array dynamically
    const sortedProblems = [...filteredProblems].sort((a, b) => {
        if (sortBy === "name") {
            return a.title.localeCompare(b.title); // Sort alphabetically A-Z
        }
        if (sortBy === "difficulty") {
            const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
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