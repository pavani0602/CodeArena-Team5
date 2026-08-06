import "./Stats.css";
import { useState, useEffect } from 'react';
import { fetchApi } from "../../services/api";
import { useTranslation } from 'react-i18next';

function Stats() {
    const { t } = useTranslation();
    const [stats, setStats] = useState([
        { number: "—", title: t('home.stats.items.problems') },
        { number: "—", title: t('home.stats.items.users') },
        { number: "15+", title: t('home.stats.items.languages') },
        { number: "24/7", title: t('home.stats.items.access') }
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch real problem count
                const probRes = await fetchApi('/api/problems');
                const problems = probRes.ok ? await probRes.json() : [];
                
                // Fetch real user count
                const userRes = await fetchApi('/api/admin/users');
                const users = userRes.ok ? await userRes.json() : [];

                setStats([
                    { number: `${problems.length}+`, title: t('home.stats.items.problems') },
                    { number: `${users.length}+`, title: t('home.stats.items.users') },
                    { number: "15+", title: t('home.stats.items.languages') },
                    { number: "24/7", title: t('home.stats.items.access') }
                ]);
            } catch (err) {
                console.error("Could not fetch platform stats:", err);
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="stats">
            <div className="container">
                <div className="section-header">
                    <h3>{t('home.stats.heading')}</h3>
                </div>
                <div className="stats-grid">
                    {
                        stats.map((stat,index) => (
                            <div className="stat-card" key={index}>
                                <h3>{stat.number}</h3>
                                <p>{stat.title}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Stats;