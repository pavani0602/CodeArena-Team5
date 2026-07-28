import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCheckCircle, 
    FaFire, 
    FaTrophy, 
    FaCode,
    FaArrowRight
} from 'react-icons/fa';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('user');

    useEffect(() => {
        const email = localStorage.getItem('userEmail') || 'pavanisajjana18@gmail.com';
        const role = localStorage.getItem('userRole') || 'user';
        setUserEmail(email);
        setUserRole(role);
    }, []);

    // Generate a full year (365 days) of heatmap data starting from August of last year
    const generateHeatmapData = () => {
        const days = [];
        const today = new Date();
        for (let i = 365; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            // Randomly assign submission levels (0 to 4), keeping some sparsity
            const count = Math.random() > 0.5 ? Math.floor(Math.random() * 5) : 0;
            days.push({ date: d.toDateString(), count });
        }
        return days;
    };

    const [heatmapDays] = useState(generateHeatmapData());

    // Slice the 365 days into 12 month groups (approx 30-31 days each)
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

    return (
        <div className="dashboard-main-content">
            {/* Top Welcome Banner */}
            <div className="dashboard-header glow-card">
                <div className="welcome-text">
                    <h1>Welcome back, <span className="gradient-username">{userEmail.split('@')[0]}</span>! 🚀</h1>
                    <p>Your consistency is key. Here is your DSA pulse and activity overview.</p>
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
                <div className="stat-card glow-hover">
                    <div className="stat-icon streak">
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

            {/* GitHub Style Submission Heatmap Section */}
            <div className="content-card full-width-card">
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

            {/* Recent Activity / Quick Actions Section */}
            <div className="dashboard-content-grid">
                <div className="content-card glow-hover">
                    <h2>Continue Practice</h2>
                    <p>Pick up right where you left off in your data structures and algorithms mastery path.</p>
                    <button className="primary-action-btn" onClick={() => navigate('/problems')}>
                        <span>Go to Problem Set</span> <FaArrowRight />
                    </button>
                </div>
                <div className="content-card glow-hover">
                    <h2>DSA Progress Breakdown</h2>
                    <div className="progress-item">
                        <div className="progress-label"><span>Easy</span> <span>18 / 50</span></div>
                        <div className="progress-bar"><div className="progress-fill easy" style={{ width: '36%' }}></div></div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-label"><span>Medium</span> <span>20 / 80</span></div>
                        <div className="progress-bar"><div className="progress-fill medium" style={{ width: '25%' }}></div></div>
                    </div>
                    <div className="progress-item">
                        <div className="progress-label"><span>Hard</span> <span>4 / 30</span></div>
                        <div className="progress-bar"><div className="progress-fill hard" style={{ width: '13%' }}></div></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;