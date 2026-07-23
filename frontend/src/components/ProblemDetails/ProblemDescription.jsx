import { useState, useEffect, Fragment } from 'react'; 
import './ProblemDescription.css';
import { 
    FaFileAlt, 
    FaHistory, 
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


const INITIAL_SUBMISSIONS = [
    { 
        id: 'mock-1', 
        status: "Accepted", 
        lang: "Python", 
        runtime: "45 ms", 
        date: "2 mins ago", 
        notes: "Optimized sliding window approach.",
        testCasesBreakdown: [
            { id: 1, status: "Passed", runtime: "12 ms", memory: "12.1 MB" }
        ]
    },
    { 
        id: 'mock-2', 
        status: "Time Limit Exceeded", 
        lang: "Python", 
        runtime: "N/A", 
        date: "10 mins ago", 
        notes: "Loop is too slow, need O(n).",
        testCasesBreakdown: [
            { id: 1, status: "Passed", runtime: "10 ms", memory: "12.0 MB" },
            { id: 2, status: "Time Limit Exceeded", runtime: "5000 ms", memory: "14.1 MB" }
        ]
    },
    { 
        id: 'mock-3', 
        status: "Memory Limit Exceeded", 
        lang: "Java", 
        runtime: "N/A", 
        date: "1 day ago", 
        notes: "Using too much extra memory.",
        testCasesBreakdown: [
            { id: 1, status: "Memory Limit Exceeded", runtime: "150 ms", memory: "256.4 MB" }
        ]
    },
    { 
        id: 'mock-4', 
        status: "Runtime Error", 
        lang: "JavaScript", 
        runtime: "N/A", 
        date: "3 days ago", 
        notes: "Index out of bounds exception.",
        testCasesBreakdown: [
            { id: 1, status: "Runtime Error", runtime: "20 ms", memory: "15.1 MB" }
        ]
    },
];

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
                // Automatically attach breakdown details if missing from parent props
                testCasesBreakdown: item.testCasesBreakdown || [
                    { id: 1, status: "Passed", runtime: "12 ms", memory: "12.1 MB" },
                    { id: 2, status: "Passed", runtime: "15 ms", memory: "13.4 MB" },
                    { id: 3, status: "Passed", runtime: "18 ms", memory: "14.2 MB" }
                ]
            }));

            setSubmissions([...formattedLiveItems, ...INITIAL_SUBMISSIONS]);
            setActiveTab('submissions');
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
                    className={`tab-item ${activeTab === 'submissions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('submissions')}
                >
                    <FaHistory size={13} /> Submissions
                </button>
            </div>
            
            <div className="panel-content">
                {activeTab === 'description' ? (
                    <div className="tab-view-container animate-fade-in">
                        <h2>{problem.title}</h2>
                        <div className="meta-tags">
                            <span className={`badge ${problem.difficulty?.toLowerCase() || 'easy'}`}>
                                {problem.difficulty || 'Easy'}
                            </span>
                            {problem.tags?.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                        
                        <div className="description-text">
                            <p>{problem.description}</p>
                        </div>

                        <div className="example-block">
                            <h4>Example 1:</h4>
                            <pre>
                                <strong>Input:</strong> {problem.exampleInput}{"\n"}
                                <strong>Output:</strong> {problem.exampleOutput}{"\n"}
                                <strong>Explanation:</strong> {problem.explanation}
                            </pre>
                        </div>
                    </div>
                ) : (
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
                                            {/* Main Row */}
                                            <tr 
                                                className={`submission-row ${expandedRowId === sub.id ? 'is-expanded' : ''}`}
                                                onClick={() => toggleRow(sub.id)}
                                            >
                                                {/* <td className={`status-cell ${sub.status.toLowerCase().replace(/ /g, '-')}`}>
                                                    {sub.status === "Accepted" ? <FaCheckCircle /> : <FaTimesCircle />}
                                                    {sub.status}
                                                    {sub.notes && <FaStickyNote className="has-note-icon" title="Has notes" />}
                                                </td> */}
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

                                            {/* Expandable Notes and Test Cases Section Row */}
                                            {expandedRowId === sub.id && (
                                                <tr className="notes-expansion-row">
                                                    <td colSpan="5">
                                                        <div className="notes-container animate-slide-down">
                                                            
                                                            {/* Test Case Breakdown Sub-table / List */}
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