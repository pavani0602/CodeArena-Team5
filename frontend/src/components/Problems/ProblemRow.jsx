import "./ProblemRow.css";
import { FaCheckCircle, FaRegCircle, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProblemRow({ problem, onRowClick }) {
    // Helper function to render the correct icon with specific styling classes
    const renderStatus = (status) => {
        switch (status) {
            case "Solved":
                return <FaCheckCircle className="status-icon solved" title="Solved" />;
            case "Attempted":
                return <FaClock className="status-icon attempted" title="Attempted" />;
            default: // "Unsolved"
                return <FaRegCircle className="status-icon unsolved" title="Unsolved" />;
        }
    };

    return (
        <tr className="table-row-item" onClick={() => onRowClick && onRowClick(problem.id)}>
            <td className="row-id">{problem.id}</td>
            <td className="problem-title">{problem.title}</td>
            <td>
                <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                </span>
            </td>
            <td className="status-cell">{renderStatus(problem.status)}</td>
            <td>
                <Link to={`/problems/${problem.id}`} onClick={(e) => e.stopPropagation()}>
                    <button className="solve-btn">
                        Solve →
                    </button>
                </Link>
            </td>
        </tr>
    );
}

export default ProblemRow;