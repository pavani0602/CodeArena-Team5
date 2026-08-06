import "./ProblemRow.css";
import { FaCheckCircle, FaRegCircle, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function ProblemRow({ problem, onRowClick }) {
    const { t } = useTranslation();
    // Helper function to render the correct icon with specific styling classes
    const renderStatus = (status) => {
        switch (status) {
            case "Solved":
                return <FaCheckCircle className="status-icon solved" title={t('problems.status.solved')} />;
            case "Attempted":
                return <FaClock className="status-icon attempted" title={t('problems.status.attempted')} />;
            default: // "Unsolved"
                return <FaRegCircle className="status-icon unsolved" title={t('problems.status.unsolved')} />;
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
                        {t('problems.table.button')}
                    </button>
                </Link>
            </td>
        </tr>
    );
}

export default ProblemRow;