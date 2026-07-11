import './ActionButtons.css';
import { FaPlay, FaCheck } from 'react-icons/fa';

function ActionButtons({ onRun, onSubmit }) {
    return (
        <div className="header-actions">
            <button className="run-action-btn" onClick={onRun}>
                <FaPlay size={11} /> Run
            </button>
            <button className="submit-action-btn" onClick={onSubmit}>
                <FaCheck size={11} /> Submit
            </button>
        </div>
    );
}

export default ActionButtons;