import "./Stats.css";
import { useState, useEffect } from 'react';
import { fetchApi } from "../../services/api";

function Stats() {
    const [stats, setStats] = useState([
        { number: "—", title: "Coding Problems" },
        { number: "—", title: "Active Users" },
        { number: "15+", title: "Programming Languages" },
        { number: "24/7", title: "Practise Access" }
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
                    { number: `${problems.length}+`, title: "Coding Problems" },
                    { number: `${users.length}+`, title: "Active Users" },
                    { number: "15+", title: "Programming Languages" },
                    { number: "24/7", title: "Practise Access" }
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
                    <h3>Our Platform in Numbers</h3>
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