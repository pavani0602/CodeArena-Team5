import { useState, useEffect } from 'react';
import './Admin.css';
import { fetchApi } from '../../services/api';
import { FaHistory, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function AdminSubmissions() {
    const { t } = useTranslation();
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
        if (status === 'ACCEPTED') return <span className="badge easy"><FaCheckCircle size={10} /> {t('admin.submissions.accepted')}</span>;
        if (status === 'PENDING') return <span className="badge medium"><FaClock size={10} /> {t('admin.submissions.pending')}</span>;
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
                <h2>{t('admin.submissions.title')}</h2>
                <p>{t('admin.submissions.subtitle')}</p>
            </div>

            <div className="admin-panel-card animate-fade-in">
                <div className="card-header-accent">
                    <FaHistory /> <span>{t('admin.submissions.header')}</span>
                </div>
                
                {loading ? (
                    <div className="loader-container">
                        <div className="spinner"></div>
                        <p>{t('admin.submissions.loading')}</p>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-problems-table">
                            <thead>
                                <tr>
                                    <th>{t('admin.submissions.headers.submissionId')}</th>
                                    <th>{t('admin.submissions.headers.user')}</th>
                                    <th>{t('admin.submissions.headers.problem')}</th>
                                    <th>{t('admin.submissions.headers.language')}</th>
                                    <th>{t('admin.submissions.headers.status')}</th>
                                    <th>{t('admin.submissions.headers.time')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t('admin.submissions.empty')}</td>
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
