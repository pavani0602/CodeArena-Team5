import './Leaderboard.css';
import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';

function Leaderboard() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        let mounted = true;

        const loadLeaderboard = async (showLoader = false) => {
            if (showLoader) setLoading(true);

            try {
                const res = await fetch('/api/leaderboard', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to load leaderboard');
                const data = await res.json();
                if (!mounted) return;
                setEntries(data);
                setLastUpdated(new Date());
            } catch {
                if (mounted) setEntries([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadLeaderboard(true);
        const intervalId = window.setInterval(() => loadLeaderboard(false), 5000);
        const refreshHandler = () => loadLeaderboard(false);
        window.addEventListener('codearena:leaderboard-updated', refreshHandler);

        return () => {
            mounted = false;
            window.clearInterval(intervalId);
            window.removeEventListener('codearena:leaderboard-updated', refreshHandler);
        };
    }, []);

    const getRankIcon = (rank) => {
        if (rank === 1) return <FaTrophy className="rank-icon gold" />;
        if (rank === 2) return <FaMedal className="rank-icon silver" />;
        if (rank === 3) return <FaMedal className="rank-icon bronze" />;
        return <span className="rank-number">#{rank}</span>;
    };

    return (
        <section className="leaderboard-page">
            <div className="container">
                <div className="leaderboard-header">
                    <h1>Leaderboard</h1>
                    <p>Top performers ranked by problems solved on CodeArena.</p>
                    {lastUpdated && (
                        <span className="live-indicator">
                            Live - updated {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="lb-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading leaderboard...</p>
                    </div>
                ) : (
                    <div className="leaderboard-table-wrap">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>User ID</th>
                                    <th>Username</th>
                                    <th>Problems Solved</th>
                                    <th>Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-leaderboard">
                                            No submissions yet. Solve a problem to appear here.
                                        </td>
                                    </tr>
                                ) : entries.map((entry, i) => (
                                    <tr key={entry.id || entry.user?.username || i} className={i < 3 ? `top-${i + 1}` : ''}>
                                        <td className="rank-cell">
                                            {getRankIcon(entry.rank || i + 1)}
                                        </td>
                                        <td className="user-id-cell">#{entry.user?.id || '-'}</td>
                                        <td className="username-cell">
                                            <span className="avatar">{entry.user?.username?.charAt(0).toUpperCase() || '?'}</span>
                                            {entry.user?.username || 'Unknown'}
                                        </td>
                                        <td className="solved-cell">
                                            <span className="solved-badge">{entry.problemsSolved}</span>
                                        </td>
                                        <td className="accuracy-cell">
                                            <div className="accuracy-bar">
                                                <div
                                                    className="accuracy-fill"
                                                    style={{ width: `${entry.accuracy || 0}%` }}
                                                ></div>
                                            </div>
                                            <span>{(entry.accuracy || 0).toFixed(1)}%</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Leaderboard;
