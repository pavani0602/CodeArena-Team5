import './Leaderboard.css';
import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';

function Leaderboard() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [activeView, setActiveView] = useState('global');
    const [selectedLanguage, setSelectedLanguage] = useState('PYTHON');

    useEffect(() => {
        let mounted = true;

        const loadLeaderboard = async (showLoader = false) => {
            if (showLoader) setLoading(true);

            try {
                let url = '/api/leaderboard';
                if (activeView === 'weekly') {
                    url = '/api/leaderboard/weekly';
                } else if (activeView === 'language') {
                    url = `/api/leaderboard/language/${selectedLanguage}`;
                }

                const res = await fetch(url, { cache: 'no-store' });
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
    }, [activeView, selectedLanguage]);

    const getRankIcon = (rank) => {
        if (rank === 1) return <FaTrophy className="rank-icon gold" />;
        if (rank === 2) return <FaMedal className="rank-icon silver" />;
        if (rank === 3) return <FaMedal className="rank-icon bronze" />;
        return <span className="rank-number">#{rank}</span>;
    };

    const getUsername = (entry) => {
        if (activeView === 'global') return entry.user?.username || 'Unknown';
        return entry.username || 'Unknown';
    };

    const getUserId = (entry) => {
        if (activeView === 'global') return entry.user?.id || '-';
        return entry.userId || '-';
    };

    const getUserInitial = (entry) => {
        const name = getUsername(entry);
        return name.charAt(0).toUpperCase();
    };

    const getRank = (entry, index) => {
        return entry.rank || index + 1;
    };

    const getViewTitle = () => {
        if (activeView === 'weekly') return 'Weekly Leaderboard';
        if (activeView === 'language') return `${selectedLanguage} Leaderboard`;
        return 'Leaderboard';
    };

    const getViewSubtitle = () => {
        if (activeView === 'weekly') return 'Top performers this week ranked by problems solved.';
        if (activeView === 'language') return `Top ${selectedLanguage} coders ranked by problems solved in this language.`;
        return 'Top performers ranked by problems solved on CodeArena.';
    };

    return (
        <section className="leaderboard-page">
            <div className="container">
                <div className="leaderboard-header">
                    <h1>{getViewTitle()}</h1>
                    <p>{getViewSubtitle()}</p>
                    {lastUpdated && (
                        <span className="live-indicator">
                            Live - updated {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                </div>

                {/* Leaderboard View Tabs */}
                <div className="lb-view-tabs">
                    <button
                        type="button"
                        className={`lb-view-tab ${activeView === 'global' ? 'active' : ''}`}
                        onClick={() => setActiveView('global')}
                    >
                        🌍 Global
                    </button>
                    <button
                        type="button"
                        className={`lb-view-tab ${activeView === 'weekly' ? 'active' : ''}`}
                        onClick={() => setActiveView('weekly')}
                    >
                        📅 Weekly
                    </button>
                    <button
                        type="button"
                        className={`lb-view-tab ${activeView === 'language' ? 'active' : ''}`}
                        onClick={() => setActiveView('language')}
                    >
                        💻 By Language
                    </button>
                    {activeView === 'language' && (
                        <select
                            className="lb-language-select"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            <option value="PYTHON">Python</option>
                            <option value="JAVA">Java</option>
                            <option value="CPP">C++</option>
                        </select>
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
                                            {activeView === 'weekly'
                                                ? 'No submissions this week yet. Solve a problem to appear here.'
                                                : activeView === 'language'
                                                    ? `No ${selectedLanguage} submissions yet. Solve a problem in ${selectedLanguage} to appear here.`
                                                    : 'No submissions yet. Solve a problem to appear here.'}
                                        </td>
                                    </tr>
                                ) : entries.map((entry, i) => (
                                    <tr key={getUserId(entry) + '-' + i} className={i < 3 ? `top-${i + 1}` : ''}>
                                        <td className="rank-cell">
                                            {getRankIcon(getRank(entry, i))}
                                        </td>
                                        <td className="user-id-cell">#{getUserId(entry)}</td>
                                        <td className="username-cell">
                                            <span className="avatar">{getUserInitial(entry)}</span>
                                            {getUsername(entry)}
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
