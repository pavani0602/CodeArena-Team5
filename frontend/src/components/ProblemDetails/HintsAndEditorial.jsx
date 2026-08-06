import { useState } from 'react';
import { FaLightbulb, FaLock, FaUnlock, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import './HintsAndEditorial.css';

function HintsAndEditorial({ problem, failedAttempts = 0, requiredAttempts = 3 }) {
    const { t } = useTranslation();
    // Track which hints have been revealed (by index)
    const [revealedHints, setRevealedHints] = useState({});
    
    // State to allow manual unlock override for testing purposes
    const [forceUnlocked, setForceUnlocked] = useState(false);

    // Progressive hints dataset
    const hints = problem?.hints ? [...problem.hints].sort((a, b) => a.hintNumber - b.hintNumber) : [];

    const toggleHint = (index) => {
        setRevealedHints(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Editorial unlocked check
    const isEditorialUnlocked = forceUnlocked || (failedAttempts >= requiredAttempts);
    const attemptsRemaining = Math.max(0, requiredAttempts - failedAttempts);

    return (
        <div className="hints-editorial-container">
            {/* Section 1: Step-by-Step Hints Accordion */}
            <div className="hints-section">
                <div className="section-header-title">
                    <FaLightbulb className="section-icon hints-glow" />
                    <h3>{t('problemDetails.hints.title')}</h3>
                </div>
                <p className="section-subtitle">
                    {t('problemDetails.hints.subtitle')}
                </p>

                <div className="hints-accordion-list">
                    {hints.length === 0 ? (
                        <p style={{ color: '#94a3b8', padding: '10px 20px' }}>{t('problemDetails.hints.empty')}</p>
                    ) : (
                        hints.map((hint, index) => {
                            const isRevealed = revealedHints[index];
                            return (
                                <div key={hint.id || index} className={`hint-card ${isRevealed ? 'revealed' : ''}`}>
                                    <button 
                                        className="hint-card-header" 
                                        onClick={() => toggleHint(index)}
                                    >
                                        <span className="hint-title-text">
                                            <span className="hint-badge">{t('problemDetails.hints.hintLabel', { number: index + 1 })}</span> 
                                            {isRevealed ? t('problemDetails.hints.hintLabel', { number: index + 1 }) : t('problemDetails.hints.unlock', { number: index + 1 })}
                                        </span>
                                        {isRevealed ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                    </button>
                                    
                                    {isRevealed && (
                                        <div className="hint-card-body animate-fadeIn">
                                            <ReactMarkdown>{hint.hintText}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="divider-line" />

            {/* Section 2: Gated Editorial Lock */}
            <div className="editorial-section">
                <div className="section-header-title">
                    {isEditorialUnlocked ? (
                        <FaUnlock className="section-icon unlocked-icon" />
                    ) : (
                        <FaLock className="section-icon locked-icon" />
                    )}
                    <h3>{t('problemDetails.hints.editorialTitle')}</h3>
                </div>

                {!isEditorialUnlocked ? (
                    <div className="editorial-lock-box animate-fadeIn">
                        <div className="lock-badge-container">
                            <FaLock size={24} />
                        </div>
                        <h4>{t('problemDetails.hints.editorialLocked')}</h4>
                        <p>
                            {t('problemDetails.hints.editorialBody', { count: requiredAttempts })}
                        </p>
                        
                        <div className="progress-status-pill">
                            <span>{t('problemDetails.hints.currentFailed', { current: failedAttempts, required: requiredAttempts })}</span>
                            {attemptsRemaining > 0 ? (
                                <span className="sub-text">({t('problemDetails.hints.remaining', { count: attemptsRemaining })})</span>
                            ) : (
                                <span className="success-sub-text">{t('problemDetails.hints.ready')}</span>
                            )}
                        </div>

                        <button 
                            className="override-unlock-btn"
                            onClick={() => setForceUnlocked(true)}
                        >
                            {t('problemDetails.hints.preview')}
                        </button>
                    </div>
                ) : (
                    <div className="editorial-content-box animate-fadeIn">
                        <div className="unlocked-banner">
                            <FaCheckCircle className="success-icon" />
                            <span>{t('problemDetails.hints.unlocked')}</span>
                        </div>

                        {problem?.editorialMd ? (
                            <div className="markdown-editorial">
                                <ReactMarkdown>{problem.editorialMd}</ReactMarkdown>
                            </div>
                        ) : (
                            <p style={{ color: '#94a3b8', padding: '10px 0' }}>{t('problemDetails.hints.emptyEditorial')}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HintsAndEditorial;