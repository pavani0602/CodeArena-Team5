import { useState } from 'react';
import { FaLightbulb, FaLock, FaUnlock, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './HintsAndEditorial.css';

function HintsAndEditorial({ failedAttempts = 0, requiredAttempts = 3 }) {
    // Track which hints have been revealed (by index)
    const [revealedHints, setRevealedHints] = useState({});
    
    // State to allow manual unlock override for testing purposes
    const [forceUnlocked, setForceUnlocked] = useState(false);

    // Progressive hints dataset
    const hints = [
        {
            id: 1,
            title: "Hint 1: Understanding the data structure",
            content: "Think about what information you need to look up quickly. Can you store previously visited elements to avoid a nested loop?"
        },
        {
            id: 2,
            title: "Hint 2: Algorithmic approach",
            content: "As you iterate through the array, check if the complement of the current element (target - current element) already exists in your data structure."
        },
        {
            id: 3,
            title: "Hint 3: Optimization strategy",
            content: "A Hash Map (or dictionary) allows you to achieve O(1) lookups. Can you build this map in a single pass through the array?"
        }
    ];

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
                    {hints.map((hint, index) => {
                        const isRevealed = revealedHints[index];
                        return (
                            <div key={hint.id} className={`hint-card ${isRevealed ? 'revealed' : ''}`}>
                                <button 
                                    className="hint-card-header" 
                                    onClick={() => toggleHint(index)}
                                >
                                    <span className="hint-title-text">
                                        <span className="hint-badge">Hint {index + 1}</span> 
                                        {isRevealed ? hint.title : `Unlock Hint ${index + 1}...`}
                                    </span>
                                    {isRevealed ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                </button>
                                
                                {isRevealed && (
                                    <div className="hint-card-body animate-fadeIn">
                                        <p>{hint.content}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
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

                        <h4>Approach: Hash Map Single Pass</h4>
                        <p>
                            Instead of iterating through every element twice to find pairs, we can use a hash map to keep track of the numbers 
                            we've seen so far along with their indices.
                        </p>

                        <div className="code-snippet-box">
                            <pre><code>{`def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`}</code></pre>
                        </div>

                        <h5>Complexity Analysis</h5>
                        <ul className="complexity-list">
                            <li><strong>Time Complexity:</strong> $O(n)$ because we traverse the list containing $n$ elements only once. Each lookup in the hash map costs $O(1)$ time on average.</li>
                            <li><strong>Space Complexity:</strong> $O(n)$ because the extra space required depends on the number of items stored in the hash table, which stores at most $n$ elements.</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HintsAndEditorial;