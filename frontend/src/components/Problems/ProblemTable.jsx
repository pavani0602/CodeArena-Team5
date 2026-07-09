import "./ProblemTable.css";
import ProblemRow from "./ProblemRow";

function ProblemTable() {

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

                    {problems.map((problem) => (
                        <ProblemRow
                            key={problem.id}
                            problem={problem}
                        />
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ProblemTable;