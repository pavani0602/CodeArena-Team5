import { useState, useEffect, Fragment } from 'react'; 
import './ProblemDescription.css';
import { 
    FaFileAlt, 
    FaHistory, 
    FaLightbulb, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaStickyNote, 
    FaChevronDown, 
    FaChevronUp, 
    FaExclamationTriangle, 
    FaClock, 
    FaMemory, 
    FaBug 
} from 'react-icons/fa';

import ReactMarkdown from 'react-markdown';
import HintsAndEditorial from './HintsAndEditorial'; 

// Helper function to handle verdict states
const getVerdictDetails = (status) => {
    switch (status?.toLowerCase()) {
        case 'accepted':
            return { icon: <FaCheckCircle />, className: 'accepted', label: 'Accepted' };
        case 'wrong answer':
            return { icon: <FaTimesCircle />, className: 'wrong-answer', label: 'Wrong Answer' };
        case 'time limit exceeded':
        case 'tle':
            return { icon: <FaClock />, className: 'time-limit-exceeded', label: 'Time Limit Exceeded' };
        case 'memory limit exceeded':
        case 'mle':
            return { icon: <FaMemory />, className: 'memory-limit-exceeded', label: 'Memory Limit Exceeded' };
        case 'runtime error':
        case 're':
            return { icon: <FaBug />, className: 'runtime-error', label: 'Runtime Error' };
        default:
            return { icon: <FaExclamationTriangle />, className: 'unknown', label: status || 'Pending' };
    }
};

const INITIAL_SUBMISSIONS = [];

function ProblemDescription({ problem, submissionHistory = [] }) {
    const [activeTab, setActiveTab] = useState('description'); 
    const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
    const [expandedRowId, setExpandedRowId] = useState(null);

    // Synchronize external live submission array changes with this internal rendering state
    useEffect(() => {
        if (submissionHistory.length > 0) {
            const formattedLiveItems = submissionHistory.map((item, idx) => ({
                id: `live-${idx}-${item.timeSubmitted}`,
                status: item.status,
                lang: item.language,
                runtime: item.runtime,
                date: item.timeSubmitted,
                notes: "",
                testCasesBreakdown: item.testCasesBreakdown || []
            }));

            setSubmissions(formattedLiveItems);
        } else {
            setSubmissions(INITIAL_SUBMISSIONS);
        }
    }, [submissionHistory]);

    // Toggle expand/collapse when clicking a row
    const toggleRow = (id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    // Update the note field inside state
    const handleNoteChange = (id, text) => {
        setSubmissions(prev => prev.map(sub => 
            sub.id === id ? { ...sub, notes: text } : sub
        ));
    };

    // Calculate failed attempts dynamically from the submissions state to feed the gated editorial lock
    const failedAttemptsCount = submissions.filter(
        sub => sub.status?.toLowerCase() !== 'accepted'
    ).length;

    return (
        <section className="panel description-panel">
            <div className="panel-tabs">
                <button 
                    className={`tab-item ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                >
                    <FaFileAlt size={13} /> Description
                </button>
                <button 
                    className={`tab-item ${activeTab === 'hints' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hints')}
                >
                    <FaLightbulb size={13} /> Hints & Editorial
                </button>
                <button 
                    className={`tab-item ${activeTab === 'submissions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('submissions')}
                >
                    <FaHistory size={13} /> Submissions
                </button>
            </div>
            
            <div className="panel-content">
                {activeTab === 'description' && (
                    <div className="tab-view-container animate-fade-in">
                        <h2>{problem.title}</h2>
                        <div className="meta-tags">
                            <span className={`badge ${problem.difficulty?.toLowerCase() || 'easy'}`}>
                                {problem.difficulty || 'Easy'}
                            </span>
                            {(typeof problem.tags === 'string' ? problem.tags.split(',') : (problem.tags || [])).map(tag => (
                                <span key={tag.trim()} className="tag">{tag.trim()}</span>
                            ))}
                        </div>
                        
                        <div className="description-text">
                            <ReactMarkdown>{problem.description}</ReactMarkdown>
                        </div>

                    </div>
                )}

                {/* Integrated Hints and Gated Editorial Component View */}
                {activeTab === 'hints' && (
                    <div className="tab-view-container animate-fade-in">
                        <HintsAndEditorial 
                            problem={problem}
                            failedAttempts={failedAttemptsCount} 
                            requiredAttempts={3} 
                        />
                    </div>
                )}

                {activeTab === 'submissions' && (
                    <div className="tab-view-container animate-fade-in">
                        <h3 className="submissions-heading">Past Submissions</h3>
                        <p className="submissions-subtitle">Click on a row to view or add notes</p>
                        
                        <div className="submissions-table-wrapper">
                            <table className="submissions-table">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Language</th>
                                        <th>Runtime</th>
                                        <th>Time Submitted</th>
                                        <th style={{ width: '40px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub) => (
                                        <Fragment key={sub.id}> 
                                            <tr 
                                                className={`submission-row ${expandedRowId === sub.id ? 'is-expanded' : ''}`}
                                                onClick={() => toggleRow(sub.id)}
                                            >
                                                {(() => {
                                                    const verdict = getVerdictDetails(sub.status);
                                                    return (
                                                        <td className={`status-cell ${verdict.className}`}>
                                                            {verdict.icon}
                                                            <span>{verdict.label}</span>
                                                            {sub.notes && <FaStickyNote className="has-note-icon" title="Has notes" />}
                                                        </td>
                                                    );
                                                })()}
                                                <td><span className="lang-cell-badge">{sub.lang}</span></td>
                                                <td>{sub.runtime}</td>
                                                <td className="date-cell">{sub.date}</td>
                                                <td className="arrow-cell">
                                                    {expandedRowId === sub.id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                                </td>
                                            </tr>

                                            {expandedRowId === sub.id && (
                                                <tr className="notes-expansion-row">
                                                    <td colSpan="5">
                                                        <div className="notes-container animate-slide-down">
                                                            {sub.testCasesBreakdown && (
                                                                <div className="test-cases-breakdown-wrapper" style={{ marginBottom: '15px' }}>
                                                                    <div className="notes-header" style={{ marginBottom: '8px' }}>
                                                                        <span>Test Case Execution Breakdown</span>
                                                                    </div>
                                                                    <div className="tc-mini-grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                                        {sub.testCasesBreakdown.map((tc) => (
                                                                            <div key={tc.id} style={{ 
                                                                                background: tc.status === 'Passed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                                                                                border: `1px solid ${tc.status === 'Passed' ? '#10b981' : '#ef4444'}`,
                                                                                padding: '8px 12px', 
                                                                                borderRadius: '6px',
                                                                                fontSize: '12px',
                                                                                minWidth: '110px'
                                                                            }}>
                                                                                <div style={{ fontWeight: 'bold', color: tc.status === 'Passed' ? '#10b981' : '#ef4444' }}>
                                                                                    Test #{tc.id}: {tc.status}
                                                                                </div>
                                                                                <div style={{ color: '#94a3b8', marginTop: '2px' }}>
                                                                                    {tc.runtime} | {tc.memory}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="notes-header">
                                                                <FaStickyNote size={12} />
                                                                <span>Submission Notes</span>
                                                            </div>
                                                            <textarea
                                                                className="notes-textarea"
                                                                placeholder="Type your notes here (e.g., edge cases, approach details, complexity updates)..."
                                                                value={sub.notes}
                                                                onClick={(e) => e.stopPropagation()} 
                                                                onChange={(e) => handleNoteChange(sub.id, e.target.value)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default ProblemDescription;