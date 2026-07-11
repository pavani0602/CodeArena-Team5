import './Dashboard.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaTrophy, FaBolt, FaChartBar } from 'react-icons/fa';

function Dashboard() {
    const username = localStorage.getItem('username') || 'Coder';
    const [summary, setSummary] = useState({
        problemsSolved: 0,
        submissions: 0,
        accuracy: 0,
        rank: '--',
        recentSubmissions: []
    });

    useEffect(() => {
        let mounted = true;

        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const [summaryRes, leaderboardRes] = await Promise.all([
                    fetch('/api/submissions/summary', { headers, cache: 'no-store' }),
                    fetch('/api/leaderboard', { cache: 'no-store' })
                ]);

                if (!summaryRes.ok) throw new Error('Failed to load summary');
                const summaryData = await summaryRes.json();
                const leaderboardData = leaderboardRes.ok ? await leaderboardRes.json() : [];
                const currentEntry = leaderboardData.find((entry) => entry.user?.username === username);

                if (mounted) {
                    setSummary({
                        ...summaryData,
                        rank: currentEntry?.rank || '--',
                        recentSubmissions: summaryData.recentSubmissions || []
                    });
                }
            } catch {
                if (mounted) {
                    setSummary({
                        problemsSolved: 0,
                        submissions: 0,
                        accuracy: 0,
                        rank: '--',
                        recentSubmissions: []
                    });
                }
            }
        };

        loadDashboard();
        const intervalId = window.setInterval(loadDashboard, 5000);
        const refreshHandler = () => loadDashboard();
        window.addEventListener('codearena:leaderboard-updated', refreshHandler);
        window.addEventListener('codearena:submission-updated', refreshHandler);

        return () => {
            mounted = false;
            window.clearInterval(intervalId);
            window.removeEventListener('codearena:leaderboard-updated', refreshHandler);
            window.removeEventListener('codearena:submission-updated', refreshHandler);
        };
    }, [username]);

    const stats = [
        { icon: <FaCode />, label: 'Problems Solved', value: summary.problemsSolved || 0, color: '#10b981' },
        { icon: <FaTrophy />, label: 'Rank', value: summary.rank === '--' ? '--' : `#${summary.rank}`, color: '#f59e0b' },
        { icon: <FaBolt />, label: 'Submissions', value: summary.submissions || 0, color: '#6366f1' },
        { icon: <FaChartBar />, label: 'Accuracy', value: `${Number(summary.accuracy || 0).toFixed(1)}%`, color: '#ec4899' },
    ];

    return (
        <section className="dashboard-page">
            <div className="container">
                <div className="dashboard-welcome">
                    <div className="welcome-avatar">{username.charAt(0).toUpperCase()}</div>
                    <div>
                        <h1>Welcome back, <span className="username-highlight">{username}</span></h1>
                        <p>Keep pushing. Every problem you solve makes you stronger.</p>
                    </div>
                </div>

                <div className="stats-grid">
                    {stats.map((s, i) => (
                        <div className="stat-card" key={i}>
                            <div className="stat-icon" style={{ color: s.color }}>
                                {s.icon}
                            </div>
                            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-actions">
                    <Link to="/problems" className="dash-action-btn primary">
                        Start Solving Problems
                    </Link>
                    <Link to="/leaderboard" className="dash-action-btn secondary">
                        View Leaderboard
                    </Link>
                </div>

                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    {summary.recentSubmissions.length === 0 ? (
                        <div className="activity-empty">
                            <p>No activity yet. Solve your first problem to get started.</p>
                            <Link to="/problems">Browse Problems</Link>
                        </div>
                    ) : (
                        <div className="activity-list">
                            {summary.recentSubmissions.map((submission) => (
                                <Link
                                    to={`/problems/${submission.problem?.id}`}
                                    className="activity-row"
                                    key={submission.id}
                                >
                                    <span>{submission.problem?.title || `Problem #${submission.problem?.id}`}</span>
                                    <strong>{submission.status}</strong>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
