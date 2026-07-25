import { useState } from 'react';
import { FaLightbulb, FaLock, FaUnlock, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import './HintsAndEditorial.css';

function HintsAndEditorial({ problem, failedAttempts = 0, requiredAttempts = 3 }) {
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
                    <h3>Step-by-Step Hints</h3>
                </div>
                <p className="section-subtitle">
                    Stuck? Reveal hints one by one to guide your thought process without spoiling the complete answer.
                </p>

                <div className="hints-accordion-list">
                    {hints.length === 0 ? (
                        <p style={{ color: '#94a3b8', padding: '10px 20px' }}>No hints available for this problem.</p>
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
                                            <span className="hint-badge">Hint {index + 1}</span> 
                                            {isRevealed ? `Hint ${index + 1}` : `Unlock Hint ${index + 1}...`}
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
                    <h3>Official Solution & Editorial</h3>
                </div>

                {!isEditorialUnlocked ? (
                    <div className="editorial-lock-box animate-fadeIn">
                        <div className="lock-badge-container">
                            <FaLock size={24} />
                        </div>
                        <h4>Editorial is Gated</h4>
                        <p>
                            To encourage independent problem-solving and critical thinking, the editorial unlocks automatically after 
                            making <strong className="highlight-text">{requiredAttempts} failed submission attempts</strong>.
                        </p>
                        
                        <div className="progress-status-pill">
                            <span>Current Failed Attempts: <strong>{failedAttempts} / {requiredAttempts}</strong></span>
                            {attemptsRemaining > 0 ? (
                                <span className="sub-text">({attemptsRemaining} more needed)</span>
                            ) : (
                                <span className="success-sub-text">Ready to unlock!</span>
                            )}
                        </div>

                        <button 
                            className="override-unlock-btn"
                            onClick={() => setForceUnlocked(true)}
                        >
                            🔓 Preview Editorial Anyway (Testing Override)
                        </button>
                    </div>
                ) : (
                    <div className="editorial-content-box animate-fadeIn">
                        <div className="unlocked-banner">
                            <FaCheckCircle className="success-icon" />
                            <span>Editorial Unlocked! Great persistence in working through the problem.</span>
                        </div>

                        {problem?.editorialMd ? (
                            <div className="markdown-editorial">
                                <ReactMarkdown>{problem.editorialMd}</ReactMarkdown>
                            </div>
                        ) : (
                            <p style={{ color: '#94a3b8', padding: '10px 0' }}>An editorial has not been written for this problem yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HintsAndEditorial;