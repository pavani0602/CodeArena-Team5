import { useState, Fragment } from 'react'; // 💡 Explicitly import Fragment here
import './ProblemDescription.css';
import { FaFileAlt, FaHistory, FaCheckCircle, FaTimesCircle, FaStickyNote, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const INITIAL_SUBMISSIONS = [
    { id: 1, status: "Accepted", lang: "Python", runtime: "45 ms", date: "Just now", notes: "Optimized sliding window approach. Space complexity is O(1)." },
    { id: 2, status: "Wrong Answer", lang: "Python", runtime: "N/A", date: "2 mins ago", notes: "Forgot to handle negative integers." },
    { id: 3, status: "Time Limit Exceeded", lang: "Java", runtime: "N/A", date: "1 day ago", notes: "" },
    { id: 4, status: "Accepted", lang: "JavaScript", runtime: "68 ms", date: "3 days ago", notes: "" },
];

function ProblemDescription({ problem }) {
    const [activeTab, setActiveTab] = useState('submissions'); 
    const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
    const [expandedRowId, setExpandedRowId] = useState(null);

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
                    /* --- FULL DESCRIPTION VIEW REINSTATED --- */
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
                    /* --- SUBMISSIONS VIEW WITH ACCORDION NOTES --- */
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
                                                <td className={`status-cell ${sub.status.toLowerCase().replace(/ /g, '-')}`}>
                                                    {sub.status === "Accepted" ? <FaCheckCircle /> : <FaTimesCircle />}
                                                    {sub.status}
                                                    {sub.notes && <FaStickyNote className="has-note-icon" title="Has notes" />}
                                                </td>
                                                <td><span className="lang-cell-badge">{sub.lang}</span></td>
                                                <td>{sub.runtime}</td>
                                                <td className="date-cell">{sub.date}</td>
                                                <td className="arrow-cell">
                                                    {expandedRowId === sub.id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                                </td>
                                            </tr>

                                            {/* Expandable Notes Section Row */}
                                            {expandedRowId === sub.id && (
                                                <tr className="notes-expansion-row">
                                                    <td colSpan="5">
                                                        <div className="notes-container animate-slide-down">
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