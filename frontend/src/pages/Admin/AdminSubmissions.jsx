import { useState, useEffect } from 'react';
import './Admin.css';
import { fetchApi } from '../../services/api';
import { FaHistory, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

function AdminSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubmissions = async () => {
        try {
            const res = await fetchApi('/api/admin/submissions');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);
            }
        } catch (e) {
            console.error("Failed to fetch admin submissions", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const getStatusBadge = (status) => {
        if (status === 'ACCEPTED') return <span className="badge easy"><FaCheckCircle size={10} /> Accepted</span>;
        if (status === 'PENDING') return <span className="badge medium"><FaClock size={10} /> Pending</span>;
        return <span className="badge hard"><FaTimesCircle size={10} /> {status}</span>;
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const d = new Date(isoString);
        return d.toLocaleString();
    };

    return (
        <div className="admin-dashboard-container animate-fade-in">
            <div className="admin-page-header">
                <h2>All User Submissions</h2>
                <p>Global feed of all problem attempts, languages used, and results across the platform.</p>
            </div>

            <div className="admin-panel-card animate-fade-in">
                <div className="card-header-accent">
                    <FaHistory /> <span>Global Execution Log</span>
                </div>
                
                {loading ? (
                    <div className="loader-container">
                        <div className="spinner"></div>
                        <p>Loading submissions log...</p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-problems-table">
                            <thead>
                                <tr>
                                    <th>Submission ID</th>
                                    <th>User</th>
                                    <th>Problem</th>
                                    <th>Language</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No submissions found.</td>
                                    </tr>
                                ) : (
                                    submissions.map((sub) => (
                                        <tr key={sub.submissionId} className="admin-table-row">
                                            <td>#{sub.submissionId}</td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <strong>{sub.username}</strong>
                                                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{sub.email}</span>
                                                </div>
                                            </td>
                                            <td className="prob-title-cell">{sub.problemTitle}</td>
                                            <td>
                                                <span className="lang-badge">
                                                    {sub.language === 'python' ? 'Python' : 
                                                     sub.language === 'cpp' ? 'C++' : 
                                                     sub.language === 'java' ? 'Java' : 
                                                     sub.language === 'javascript' ? 'JavaScript' : sub.language}
                                                </span>
                                            </td>
                                            <td>{getStatusBadge(sub.status)}</td>
                                            <td style={{ fontSize: '0.85rem' }}>{formatDate(sub.submittedAt)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminSubmissions;
