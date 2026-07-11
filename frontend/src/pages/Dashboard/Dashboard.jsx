import './Dashboard.css';
import { Link } from 'react-router-dom';
import { FaCode, FaTrophy, FaBolt, FaChartBar } from 'react-icons/fa';

function Dashboard() {
    const username = localStorage.getItem('username') || 'Coder';

    const stats = [
        { icon: <FaCode />, label: 'Problems Solved', value: '0', color: '#10b981' },
        { icon: <FaTrophy />, label: 'Rank', value: '--', color: '#f59e0b' },
        { icon: <FaBolt />, label: 'Submissions', value: '0', color: '#6366f1' },
        { icon: <FaChartBar />, label: 'Accuracy', value: '0%', color: '#ec4899' },
    ];

    return (
        <section className="dashboard-page">
            <div className="container">
                <div className="dashboard-welcome">
                    <div className="welcome-avatar">{username.charAt(0).toUpperCase()}</div>
                    <div>
                        <h1>Welcome back, <span className="username-highlight">{username}</span>! 👋</h1>
                        <p>Keep pushing — every problem you solve makes you stronger.</p>
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
                        🚀 Start Solving Problems
                    </Link>
                    <Link to="/leaderboard" className="dash-action-btn secondary">
                        🏆 View Leaderboard
                    </Link>
                </div>

                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-empty">
                        <p>No activity yet. Solve your first problem to get started!</p>
                        <Link to="/problems">Browse Problems →</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
