import "./ProblemRow.css";
import { FaCheckCircle, FaRegCircle, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProblemRow({ problem }) {
    // Helper function to render the correct icon and class based on status
    const renderStatus = (status) => {
        switch (status) {
            case "Solved":
                return <FaCheckCircle className="status-icon solved" />;
            case "Attempted":
                return <FaClock className="status-icon attempted" />;
            default: // "Unsolved"
                return <FaRegCircle className="status-icon unsolved" />;
        }
    };

    return (
        <tr>
            <td>{problem.id}</td>
            <td className="problem-title">{problem.title}</td>
            <td>
                <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                </span>
            </td>
            <td>{renderStatus(problem.status)}</td>
            <td>
                <Link to={`/problems/${problem.id}`}>
                    <button className="solve-btn">
                        Solve →
                    </button>
                </Link>
            </td>
        </tr>
    );
}

export default ProblemRow;