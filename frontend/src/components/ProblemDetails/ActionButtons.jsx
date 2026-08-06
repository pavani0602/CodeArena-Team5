import './ActionButtons.css';
import { FaPlay, FaCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function ActionButtons({ onRun, onSubmit }) {
    const { t } = useTranslation();

    return (
        <div className="header-actions">
            <button className="run-action-btn" onClick={onRun}>
                <FaPlay size={11} /> {t('problemDetails.actionButtons.run')}
            </button>
            <button className="submit-action-btn" onClick={onSubmit}>
                <FaCheck size={11} /> {t('problemDetails.actionButtons.submit')}
            </button>
        </div>
    );
}

export default ActionButtons;