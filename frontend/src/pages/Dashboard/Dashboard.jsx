import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCheckCircle, 
    FaFire, 
    FaTrophy, 
    FaCode,
    FaCalendarCheck,
    FaExternalLinkAlt,
    FaLightbulb,
    FaSpinner
} from 'react-icons/fa';
import './Dashboard.css';
import { fetchApi } from '../../services/api';
import { useTranslation } from 'react-i18next';

function Dashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('user');
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem('userEmail') || 'user@example.com';
        const role = localStorage.getItem('userRole') || 'user';
        setUserEmail(email);
        setUserRole(role);
        
        const loadDashboard = async () => {
            try {
                const response = await fetchApi('/api/submissions/dashboard');
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                } else {
                    setError(t('errors.dashboardLoad'));
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError(t('errors.dashboardError'));
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('token')) {
            loadDashboard();
        } else {
            // Guest mode dummy data or redirect
            navigate('/login');
        }
    }, [navigate]);

    if (loading) {
        return (
            <div className="dashboard-main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <FaSpinner className="animate-spin" size={40} style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="dashboard-main-content">
                <div style={{ color: '#ef4444', textAlign: 'center', padding: '2rem' }}>{error || t('errors.dashboardUnavailable')}</div>
            </div>
        );
    }

    const { stats, dsaProgress, languageUsage, heatmap, recentSubmissions } = dashboardData;

    // Group heatmap data into months for the GitHub-style display
    const processHeatmapMonths = (days) => {
        const months = [];
        let currentMonthDays = [];
        let currentMonthName = '';

        for (let i = 0; i < days.length; i++) {
            const dateObj = new Date(days[i].date);
            const monthName = dateObj.toLocaleString('default', { month: 'short' });
            
            if (monthName !== currentMonthName) {
                if (currentMonthName !== '') {
                    months.push({ name: currentMonthName, days: currentMonthDays });
                }
                currentMonthName = monthName;
                currentMonthDays = [];
            }
            currentMonthDays.push(days[i]);
        }
        if (currentMonthDays.length > 0) {
            months.push({ name: currentMonthName, days: currentMonthDays });
        }
        
        // Take the last 12 months roughly
        return months.slice(-12);
    };

    const monthsData = heatmap ? processHeatmapMonths(heatmap) : [];

    // Safe getters for language percentages
    const getTotalLanguageSubmissions = () => {
        return Object.values(languageUsage || {}).reduce((a, b) => a + b, 0) || 1;
    };
    const totalLangs = getTotalLanguageSubmissions();

    const getLangPercentage = (count) => Math.round((count / totalLangs) * 100) || 0;
    
    // Fallbacks for languages
    const jsCount = languageUsage?.javascript || 0;
    const pythonCount = languageUsage?.python || 0;
    const cppCount = languageUsage?.cpp || 0;
    const javaCount = languageUsage?.java || 0;

    return (
        <div className="dashboard-main-content animate-fade-in">
            {/* Top Welcome Banner */}
            <div className="dashboard-header glow-card">
                <div className="welcome-text">
                    <h1>{t('dashboard.welcome', { name: userEmail.split('@')[0] })}</h1>
                    <p className="daily-quote">
                        <FaLightbulb className="quote-icon" /> "{t('dashboard.quote')}"
                    </p>
                </div>
                <div className="user-profile-pill">
                    <span className={`role-badge ${userRole}`}>{userRole.toUpperCase()}</span>
                    <span className="user-email">{userEmail}</span>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
                <div className="stat-card glow-hover">
                    <div className="stat-icon problems">
                        <FaCheckCircle />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.problemsSolved || 0}</h3>
                        <p>{t('dashboard.stats.problemsSolved')}</p>
                    </div>
                </div>
                <div className="stat-card glow-hover streak-active-card">
                    <div className="stat-icon streak flame-anim">
                        <FaFire />
                    </div>
                    <div className="stat-info">
                        <h3>{t('dashboard.stats.streakDays', { count: stats.streak || 0 })}</h3>
                        <p>{t('dashboard.stats.currentStreak')}</p>
                    </div>
                </div>
                <div className="stat-card glow-hover">
                    <div className="stat-icon rank">
                        <FaTrophy />
                    </div>
                    <div className="stat-info">
                        <h3>{t('dashboard.stats.topPercent', { percent: stats.topPercent || 100 })}</h3>
                        <p>{t('dashboard.stats.globalRank')}</p>
                    </div>
                </div>
            </div>

            {/* Daily Challenge & Progress Grid */}
            <div className="dashboard-content-grid top-gap">
                <div className="content-card glow-hover potd-card">
                    <div className="potd-badge"><FaCalendarCheck /> {t('dashboard.challenge.badge')}</div>
                    <h2>{t('dashboard.challenge.title')}</h2>
                    <p>{t('dashboard.challenge.description')}</p>
                    <div className="potd-meta" style={{ marginTop: '30px' }}>
                        <span className="diff-tag medium" style={{ marginBottom: '10px' }}>{t('dashboard.challenge.pill')}</span>
                    </div>
                    <button className="primary-action-btn ripple-btn" onClick={() => navigate('/problems')}>
                        <span>{t('dashboard.challenge.button')}</span> <FaExternalLinkAlt size={12} />
                    </button>
                </div>

                <div className="content-card glow-hover">
                    <h2>{t('dashboard.progress.title')}</h2>
                    {['easy', 'medium', 'hard'].map((diff) => {
                        const prog = dsaProgress?.[diff] || { solved: 0, total: 0 };
                        const percent = prog.total > 0 ? (prog.solved / prog.total) * 100 : 0;
                        return (
                            <div className="progress-item" key={diff}>
                                <div className="progress-label">
                                    <span style={{ textTransform: 'capitalize' }}>{diff}</span> 
                                    <span>{prog.solved} / {prog.total}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className={`progress-fill ${diff} animate-fill`} style={{ width: `${percent}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Language Usage & Additional Metrics Grid */}
            <div className="dashboard-content-grid top-gap">
                <div className="content-card glow-hover">
                    <h2><FaCode /> {t('dashboard.languageUsage.title')}</h2>
                    <p>{t('dashboard.languageUsage.description')}</p>
                    
                    <div className="progress-item">
                        <div className="progress-label">
                            <span>JavaScript</span>
                            <span>{getLangPercentage(jsCount)}% ({jsCount} {t('dashboard.languageUsage.solved', { count: jsCount })})</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill language-js" style={{ width: `${getLangPercentage(jsCount)}%` }}></div>
                        </div>
                    </div>

                    <div className="progress-item">
                        <div className="progress-label">
                            <span>Python</span>
                            <span>{getLangPercentage(pythonCount)}% ({pythonCount} {t('dashboard.languageUsage.solved', { count: pythonCount })})</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill language-python" style={{ width: `${getLangPercentage(pythonCount)}%` }}></div>
                        </div>
                    </div>

                    <div className="progress-item">
                        <div className="progress-label">
                            <span>C++</span>
                            <span>{getLangPercentage(cppCount)}% ({cppCount} {t('dashboard.languageUsage.solved', { count: cppCount })})</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill language-cpp" style={{ width: `${getLangPercentage(cppCount)}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="progress-item">
                        <div className="progress-label">
                            <span>Java</span>
                            <span>{getLangPercentage(javaCount)}% ({javaCount} {t('dashboard.languageUsage.solved', { count: javaCount })})</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill language-java" style={{ width: `${getLangPercentage(javaCount)}%`, backgroundColor: '#f89820' }}></div>
                        </div>
                    </div>
                </div>

                <div className="content-card glow-hover">
                    <h2>{t('dashboard.summary.title')}</h2>
                    <p>{t('dashboard.summary.description')}</p>
                    <div className="stat-info" style={{ marginTop: '20px' }}>
                        <h3 style={{ color: stats.streak > 0 ? '#10b981' : '#f59e0b', fontSize: '1.4rem' }}>
                            {stats.streak > 0 ? t('dashboard.summary.active') : t('dashboard.summary.warmUp')}
                        </h3>
                        <p style={{ marginTop: '6px' }}>
                            {stats.streak > 0 
                                ? t('dashboard.summary.activeText') 
                                : t('dashboard.summary.warmUpText')}
                        </p>
                    </div>
                </div>
            </div>

            {/* GitHub Style Submission Heatmap Section */}
            <div className="content-card full-width-card top-gap">
                <div className="section-header">
                    <h2><FaCode /> {t('dashboard.heatmap.title')}</h2>
                    <span className="heatmap-subtitle">{t('dashboard.heatmap.subtitle')}</span>
                </div>
                <div className="heatmap-container">
                    <div className="heatmap-months-view">
                        {monthsData.map((month, mIdx) => (
                            <div className="heatmap-month-column" key={mIdx}>
                                <div className="heatmap-grid-mini">
                                    {month.days.map((day, dIdx) => {
                                        let level = 0;
                                        if (day.count === 1) level = 1;
                                        else if (day.count === 2) level = 2;
                                        else if (day.count >= 3 && day.count <= 4) level = 3;
                                        else if (day.count > 4) level = 4;
                                        return (
                                            <div 
                                                key={dIdx} 
                                                className={`heatmap-cell level-${level}`}
                                                title={`${day.count} submissions on ${day.date}`}
                                            ></div>
                                        );
                                    })}
                                </div>
                                <span className="heatmap-month-label">{month.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="heatmap-legend">
                        <span>{t('dashboard.heatmap.legendLess')}</span>
                        <div className="legend-cells">
                            <div className="heatmap-cell level-0"></div>
                            <div className="heatmap-cell level-1"></div>
                            <div className="heatmap-cell level-2"></div>
                            <div className="heatmap-cell level-3"></div>
                            <div className="heatmap-cell level-4"></div>
                        </div>
                        <span>{t('dashboard.heatmap.legendMore')}</span>
                    </div>
                </div>
            </div>

            {/* Recent Submissions Activity Feed */}
            <div className="content-card full-width-card">
                <div className="section-header">
                    <h2>{t('dashboard.recentSubmissions.title')}</h2>
                    <button className="text-btn" onClick={() => navigate('/problems')}>{t('dashboard.recentSubmissions.button')}</button>
                </div>
                <div className="activity-feed">
                    {recentSubmissions && recentSubmissions.length > 0 ? (
                        recentSubmissions.map((sub) => (
                            <div className="activity-item" key={sub.id}>
                                <div className={`activity-status ${sub.status === 'ACCEPTED' ? 'success' : 'failed'}`}>
                                    {sub.status === 'ACCEPTED' ? <FaCheckCircle /> : <FaLightbulb />}
                                </div>
                                <div className="activity-details">
                                    <h4>{sub.title}</h4>
                                    <span>
                                        {sub.status === 'ACCEPTED' ? t('dashboard.recentSubmissions.accepted') : t('dashboard.recentSubmissions.failed')} • {sub.language.charAt(0).toUpperCase() + sub.language.slice(1)} • {new Date(sub.submittedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className={`activity-diff ${sub.difficulty?.toLowerCase() || 'easy'}`}>
                                    {sub.difficulty || t('common.easy')}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>{t('dashboard.recentSubmissions.empty')}</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
