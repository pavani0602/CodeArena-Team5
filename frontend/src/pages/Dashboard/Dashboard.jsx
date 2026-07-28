import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCheckCircle, 
    FaFire, 
    FaTrophy, 
    FaCode,
    FaArrowRight,
    FaLightbulb,
    FaCalendarCheck,
    FaExternalLinkAlt
} from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('user');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = localStorage.getItem('userEmail') || 'pavanisajjana18@gmail.com';
        const role = localStorage.getItem('userRole') || 'user';
        setUserEmail(email);
        setUserRole(role);
        
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    const generateHeatmapData = () => {
        const days = [];
        const today = new Date();
        for (let i = 365; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const count = Math.random() > 0.45 ? Math.floor(Math.random() * 5) : 0;
            days.push({ date: d.toDateString(), count });
        }
        return days;
    };

    const [heatmapDays] = useState(generateHeatmapData());

    const monthsData = [
        { name: 'Aug', days: heatmapDays.slice(0, 31) },
        { name: 'Sep', days: heatmapDays.slice(31, 61) },
        { name: 'Oct', days: heatmapDays.slice(61, 92) },
        { name: 'Nov', days: heatmapDays.slice(92, 122) },
        { name: 'Dec', days: heatmapDays.slice(122, 153) },
        { name: 'Jan', days: heatmapDays.slice(153, 184) },
        { name: 'Feb', days: heatmapDays.slice(184, 212) },
        { name: 'Mar', days: heatmapDays.slice(212, 243) },
        { name: 'Apr', days: heatmapDays.slice(243, 273) },
        { name: 'May', days: heatmapDays.slice(273, 304) },
        { name: 'Jun', days: heatmapDays.slice(304, 334) },
        { name: 'Jul', days: heatmapDays.slice(334, 365) }
    ];

    if (loading) {
        return (
            <div className="dashboard-main-content">
                <div className="skeleton-banner animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-main-content animate-fade-in">
            {/* Top Welcome Banner */}
            <div className="dashboard-header glow-card">
                <div className="welcome-text">
                    <h1>Welcome back, <span className="gradient-username">{userEmail.split('@')[0]}</span>! 🚀</h1>
                    <p className="daily-quote">
                        <FaLightbulb className="quote-icon" /> "Consistency is built one problem at a time. Keep your streak alive today!"
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
                        <h3>42</h3>
                        <p>Problems Solved</p>
                    </div>
                </div>
                <div className="stat-card glow-hover streak-active-card">
                    <div className="stat-icon streak flame-anim">
                        <FaFire />
                    </div>
                    <div className="stat-info">
                        <h3>7 Days</h3>
                        <p>Current Streak 🔥</p>
                    </div>
                </div>
                <div className="stat-card glow-hover">
                    <div className="stat-icon rank">
                        <FaTrophy />
                    </div>
                    <div className="stat-info">
                        <h3>Top 15%</h3>
                        <p>Global Rank</p>
                    </div>
                </div>
            </div>

            {/* NEW: Daily Challenge & Continue Practice Grid */}
            <div className="dashboard-content-grid top-gap">
                <div className="content-card glow-hover potd-card">
                    <div className="potd-badge"><FaCalendarCheck /> Problem of the Day</div>
                    <h2>Sliding Window Maximum</h2>
                    <p>Master array manipulation and deque data structures with today's featured challenge.</p>
                    <div className="potd-meta">
                        <span className="diff-tag hard">Hard</span>
                        <span className="acceptance-rate">⚡ 48.2% Acceptance</span>
                    </div>
                    <button className="primary-action-btn ripple-btn" onClick={() => navigate('/problems')}>
                        <span>Solve Challenge</span> <FaExternalLinkAlt size={12} />
                    </button>
                </div>

                <div className="content-card glow-hover">
                    <h2>DSA Progress Breakdown</h2>
                    <div className="progress-item">
                        <div className="progress-label"><span>Easy</span> <span>18 / 50</span></div>
                        <div className="progress-bar"><div className="progress-fill easy animate-fill" style={{ width: '36%' }}></div></div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-label"><span>Medium</span> <span>20 / 80</span></div>
                        <div className="progress-bar"><div className="progress-fill medium animate-fill" style={{ width: '25%' }}></div></div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-label"><span>Hard</span> <span>4 / 30</span></div>
                        <div className="progress-bar"><div className="progress-fill hard animate-fill" style={{ width: '13%' }}></div></div>
                    </div>
                </div>
            </div>

            {/* GitHub Style Submission Heatmap Section */}
            <div className="content-card full-width-card top-gap">
                <div className="section-header">
                    <h2><FaCode /> Code Activity Heatmap</h2>
                    <span className="heatmap-subtitle">Annual contribution overview</span>
                </div>
                <div className="heatmap-container">
                    <div className="heatmap-months-view">
                        {monthsData.map((month, mIdx) => (
                            <div className="heatmap-month-column" key={mIdx}>
                                <div className="heatmap-grid-mini">
                                    {month.days.map((day, dIdx) => (
                                        <div 
                                            key={dIdx} 
                                            className={`heatmap-cell level-${day.count}`}
                                            title={`${day.count} submissions on ${day.date}`}
                                        ></div>
                                    ))}
                                </div>
                                <span className="heatmap-month-label">{month.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="heatmap-legend">
                        <span>Less</span>
                        <div className="legend-cells">
                            <div className="heatmap-cell level-0"></div>
                            <div className="heatmap-cell level-1"></div>
                            <div className="heatmap-cell level-2"></div>
                            <div className="heatmap-cell level-3"></div>
                            <div className="heatmap-cell level-4"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>

            {/* NEW: Recent Submissions Activity Feed */}
            <div className="content-card full-width-card">
                <div className="section-header">
                    <h2>Recent Submissions</h2>
                    <button className="text-btn" onClick={() => navigate('/problems')}>View All</button>
                </div>
                <div className="activity-feed">
                    <div className="activity-item">
                        <div className="activity-status success"><FaCheckCircle /></div>
                        <div className="activity-details">
                            <h4>Valid Parentheses</h4>
                            <span>Accepted • JavaScript • 2 hours ago</span>
                        </div>
                        <span className="activity-diff easy">Easy</span>
                    </div>
                    <div className="activity-item">
                        <div className="activity-status success"><FaCheckCircle /></div>
                        <div className="activity-details">
                            <h4>Longest Substring Without Repeating Characters</h4>
                            <span>Accepted • JavaScript • Yesterday</span>
                        </div>
                        <span className="activity-diff medium">Medium</span>
                    </div>
                    <div className="activity-item">
                        <div className="activity-status success"><FaCheckCircle /></div>
                        <div className="activity-details">
                            <h4>Merge Two Sorted Lists</h4>
                            <span>Accepted • JavaScript • 3 days ago</span>
                        </div>
                        <span className="activity-diff easy">Easy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;