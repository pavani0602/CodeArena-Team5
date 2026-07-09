import "./ProblemRow.css";
import { FaCheckCircle, FaRegCircle, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProblemRow({ problem }) {

    const getStatusIcon = () => {
        switch (problem.status) {
            case "Solved":
                return <FaCheckCircle className="status solved" />;

            case "Attempted":
                return <FaClock className="status attempted" />;

            default:
                return <FaRegCircle className="status unsolved" />;
        }
    };

    return (
        <tr>

            <td>{problem.id}</td>

            <td>
                <Link to={`/problems/${problem.id}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: '600' }}>
                    {problem.title}
                </Link>
            </td>

            <td>
                <span
                    className={`difficulty ${problem.difficulty.toLowerCase()}`}
                >
                    {problem.difficulty}
                </span>
            </td>

            <td>
                {getStatusIcon()}
            </td>

            <td>
                <Link to={`/problems/${problem.id}`} style={{ textDecoration: 'none' }}>
                    <button className="solve-btn" style={{ cursor: 'pointer' }}>
                        Solve →
                    </button>
                </Link>
            </td>

        </tr>
    );
}

export default ProblemRow;