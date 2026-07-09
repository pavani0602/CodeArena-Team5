import './Leaderboard.css';
import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';

function Leaderboard() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setEntries(data))
            .catch(() => {
                // Fallback sample data when backend not connected
                setEntries([
                    { id: 1, user: { username: 'codemaster' }, problemsSolved: 42, accuracy: 95.5, rank: 1 },
                    { id: 2, user: { username: 'algo_ninja' }, problemsSolved: 38, accuracy: 88.2, rank: 2 },
                    { id: 3, user: { username: 'dev_hero' }, problemsSolved: 31, accuracy: 79.0, rank: 3 },
                    { id: 4, user: { username: 'byte_wizard' }, problemsSolved: 27, accuracy: 83.1, rank: 4 },
                    { id: 5, user: { username: 'loop_breaker' }, problemsSolved: 20, accuracy: 70.5, rank: 5 },
                ]);
            })
            .finally(() => setLoading(false));
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
                    <h1>🏆 Leaderboard</h1>
                    <p>Top performers ranked by problems solved on CodeArena.</p>
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
                                    <th>Username</th>
                                    <th>Problems Solved</th>
                                    <th>Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry, i) => (
                                    <tr key={entry.id} className={i < 3 ? `top-${i + 1}` : ''}>
                                        <td className="rank-cell">
                                            {getRankIcon(entry.rank || i + 1)}
                                        </td>
                                        <td className="username-cell">
                                            <span className="avatar">{entry.user?.username?.charAt(0).toUpperCase()}</span>
                                            {entry.user?.username}
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