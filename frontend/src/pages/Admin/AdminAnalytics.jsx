import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaChartLine, FaServer, FaUsers, FaCode, FaCheckCircle } from 'react-icons/fa';
import { fetchApi } from '../../services/api';
import { useTranslation } from 'react-i18next';

function AdminAnalytics() {
    const { t } = useTranslation();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAnalytics = async () => {
            try {
                const response = await fetchApi('/api/admin/analytics');
                if (response.ok) {
                    const data = await response.json();
                    setAnalytics(data);
                } else {
                    setError(t('errors.adminAnalyticsError'));
                }
            } catch (err) {
                setError(t('errors.adminAnalyticsConnect'));
            } finally {
                setLoading(false);
            }
        };
        getAnalytics();
    }, []);

    const formatUptime = (seconds) => {
        if (!seconds) return "0s";
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor(seconds % (3600 * 24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        return `${d > 0 ? d + 'd ' : ''}${h}h ${m}m`;
    };

    return (
        <div className="admin-dashboard-container animate-fade-in">
            <div className="admin-page-header">
                <h2>{t('admin.analytics.title')}</h2>
                <p>{t('admin.analytics.subtitle')}</p>
            </div>

            <div className="admin-panel-card animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
                {loading ? (
                    <div style={{ padding: '40px' }}>{t('admin.analytics.loading')}</div>
                ) : error ? (
                    <div style={{ padding: '40px', color: 'red' }}>{error}</div>
                ) : (
                    <>
                        <FaServer size={48} style={{ color: 'var(--accent-primary)', marginBottom: '20px' }} />
                        <h3>{t('admin.analytics.status', { status: analytics?.status || 'Unknown' })}</h3>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                            gap: '20px', 
                            marginTop: '30px',
                            textAlign: 'left' 
                        }}>
                            <div className="streak-badge" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ color: 'var(--text-secondary)' }}><FaUsers /> {t('admin.analytics.totalUsers')}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics?.totalUsers || 0}</div>
                            </div>
                            <div className="streak-badge" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ color: 'var(--text-secondary)' }}><FaCode /> {t('admin.analytics.activeProblems')}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics?.totalProblems || 0}</div>
                            </div>
                            <div className="streak-badge" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ color: 'var(--text-secondary)' }}><FaCheckCircle /> {t('admin.analytics.processedSubmissions')}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics?.totalSubmissions || 0}</div>
                            </div>
                            <div className="streak-badge" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ color: 'var(--text-secondary)' }}><FaChartLine /> {t('admin.analytics.serverUptime')}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatUptime(analytics?.uptimeSeconds)}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminAnalytics;
