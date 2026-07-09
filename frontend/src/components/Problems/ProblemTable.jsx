import "./ProblemTable.css";
import ProblemRow from "./ProblemRow";

const problems = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        status: "Solved"
    },
    {
        id: 2,
        title: "Reverse String",
        difficulty: "Easy",
        status: "Attempted"
    },
    {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        status: "Unsolved"
    },
    {
        id: 4,
        title: "Merge Intervals",
        difficulty: "Medium",
        status: "Solved"
    },
    {
        id: 5,
        title: "N Queens",
        difficulty: "Hard",
        status: "Unsolved"
    }
];

function ProblemTable() {
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
                {problems.map((problem) => (
                    <ProblemRow
                        key={problem.id}
                        problem={problem}
                    />
                ))}
            </tbody>

        </table>
    );
}

export default ProblemTable;