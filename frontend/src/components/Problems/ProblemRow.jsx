import "./ProblemRow.css";
import { FaCheckCircle, FaRegCircle, FaClock } from "react-icons/fa";

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

            <td>{problem.title}</td>

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
                <button className="solve-btn">
                    Solve →
                </button>
            </td>

        </tr>
    );
}

export default ProblemRow;