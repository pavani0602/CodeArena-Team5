import { useState, useEffect } from 'react';
import './Leaderboard.css';
import { FaTrophy, FaMedal, FaSearch, FaGlobe, FaCalendarAlt, FaLaptopCode, FaCheckCircle, FaRunning } from 'react-icons/fa';

function Leaderboard() {
    const [timeframe, setTimeframe] = useState('global'); // 'global' or 'weekly'
    const [languageFilter, setLanguageFilter] = useState('All'); // 'All', 'Java', 'Python', 'C++'
    const [searchQuery, setSearchQuery] = useState('');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Dynamic API Fetch (Fully Production Ready) ---
    const fetchLeaderboard = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ 
                timeframe, 
                language: languageFilter 
            });
            
            // Adjust port/endpoint path as defined by your teammate
            const response = await fetch(`http://localhost:8080/api/leaderboard?${params.toString()}`);
            
            if (response.ok) {
                const data = await response.json();
                setLeaderboardData(data);
            } else {
                throw new Error(`Server returned status: ${response.status}`);
            }
        } catch (err) {
            console.error("Leaderboard retrieval failed:", err);
            setError("Could not retrieve active rankings. Please try again later.");
            setLeaderboardData([]); // Clear any old data on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [timeframe, languageFilter]);

    // Map original rank first, THEN filter by search query
    const rankedData = leaderboardData
    .map((user, idx) => ({ ...user, overallRank: idx + 1 }))
    .filter(user => user.username?.toLowerCase().includes(searchQuery.toLowerCase()));

    // Split filtered database items into Podium (1-3) and Table Queue (4+)
    const podiumUsers = rankedData.slice(0, 3);
    const tableUsers = rankedData.slice(3);

    // Position podium spots: 2nd Place | 1st Place | 3rd Place
    const orderedPodium = [];
    if (podiumUsers[1]) orderedPodium.push({ ...podiumUsers[1], place: 2, class: 'silver' });
    if (podiumUsers[0]) orderedPodium.push({ ...podiumUsers[0], place: 1, class: 'gold' });
    if (podiumUsers[2]) orderedPodium.push({ ...podiumUsers[2], place: 3, class: 'bronze' });

    return (
        <div className="leaderboard-container animate-fade-in">
            {/* Header Section */}
            <div className="leaderboard-header">
                <div className="header-title-box">
                    <FaTrophy className="main-trophy-icon" />
                    <div>
                        <h2>Global Arena Leaderboards</h2>
                        <p>Track your programming velocity, overall submission accuracy, and global standing.</p>
                    </div>
                </div>
            </div>

            {/* Filter Panel Matrix */}
            <div className="leaderboard-control-panel">
                <div className="filter-group">
                    <button 
                        className={`filter-tab-btn ${timeframe === 'global' ? 'active' : ''}`}
                        onClick={() => setTimeframe('global')}
                    >
                        <FaGlobe /> Global View
                    </button>
                    <button 
                        className={`filter-tab-btn ${timeframe === 'weekly' ? 'active' : ''}`}
                        onClick={() => setTimeframe('weekly')}
                    >
                        <FaCalendarAlt /> Weekly Sprint
                    </button>
                </div>

                <div className="right-controls">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Find coder..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="lang-select-wrapper">
                        <FaLaptopCode className="dropdown-prefix-icon" />
                        <select 
                            value={languageFilter} 
                            onChange={(e) => setLanguageFilter(e.target.value)}
                            className="lang-dropdown"
                        >
                            <option value="All">All Languages</option>
                            <option value="Java">Java Only</option>
                            <option value="Python">Python Only</option>
                            <option value="C++">C++ Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* State Handling Blocks */}
            {isLoading ? (
                <div className="leaderboard-status-box">
                    <div className="spinner"></div>
                    <p>Recalculating algorithmic weights...</p>
                </div>
            ) : error ? (
                <div className="leaderboard-status-box error-box">
                    <p className="error-message">{error}</p>
                    <button className="retry-btn" onClick={fetchLeaderboard}>Retry Connection</button>
                </div>
            ) : leaderboardData.length === 0 ? (
                <div className="leaderboard-status-box empty-box">
                    <p>No programmers have registered submissions for this filter yet.</p>
                </div>
            ) : (
                <>
                    {/* --- PODIUM STAND BOARD (TOP 3) --- */}
                    {podiumUsers.length > 0 && (
                        <div className="podium-stage-container">
                            {orderedPodium.map((user) => (
                                <div key={user.id || user.username} className={`podium-card podium-${user.class}`}>
                                    <div className="podium-avatar-wrapper">
                                        <div className="podium-avatar">
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`podium-icon-badge ${user.class}`}>
                                            {user.place === 1 ? <FaTrophy /> : <FaMedal />}
                                        </div>
                                    </div>

                                    <div className="podium-user-info">
                                        <span className="podium-username">{user.username}</span>
                                        <span className={`lang-pill ${(user.lang || 'Java').toLowerCase().replace('+', 'p')}`}>
                                            {user.lang || 'Java'}
                                        </span>
                                    </div>

                                    <div className="podium-stats">
                                        <div className="podium-stat">
                                            <span className="stat-label">Solved</span>
                                            <span className="stat-val">{user.solved || 0}</span>
                                        </div>
                                        <div className="podium-stat">
                                            <span className="stat-label">Accuracy</span>
                                            <span className="stat-val text-success">{user.accuracy || 0}%</span>
                                        </div>
                                    </div>

                                    <div className={`pedestal-block pedestal-${user.class}`}>
                                        <span className="pedestal-number">{user.place}</span>
                                        <span className="pedestal-rank-label">
                                            {user.place === 1 ? 'ST' : user.place === 2 ? 'ND' : 'RD'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- RANKINGS TABLE (RANK 4+) --- */}
                    {tableUsers.length > 0 && (
                        <div className="leaderboard-table-wrapper">
                            <table className="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>Rank</th>
                                        <th>Programmer</th>
                                        <th style={{ textAlign: 'center' }}>Problems Solved</th>
                                        <th style={{ textAlign: 'center' }}>Accuracy Rate</th>
                                        <th style={{ textAlign: 'center' }}>Avg Speed (Execution)</th>
                                        <th style={{ textAlign: 'center' }}>Favored Lang</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableUsers.map((user) => (
                                        <tr key={user.id || user.username} className="leaderboard-row">
                                            <td>
                                                <span className="rank-number">#{user.overallRank}</span>
                                            </td>
                                            <td>
                                                <div className="user-profile-cell">
                                                    <div className="avatar-placeholder">
                                                        {user.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="username-text">{user.username}</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }} className="solved-cell">
                                                {user.solved || 0}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div className="accuracy-cell-data">
                                                    <FaCheckCircle className="accuracy-check" />
                                                    <span>{user.accuracy || 0}%</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div className="speed-cell-data">
                                                    <FaRunning className="speed-runner" />
                                                    <span>{user.avgSpeedMs || 0} ms</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`lang-pill ${(user.lang || 'Java').toLowerCase().replace('+', 'p')}`}>
                                                    {user.lang || 'Java'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Leaderboard;