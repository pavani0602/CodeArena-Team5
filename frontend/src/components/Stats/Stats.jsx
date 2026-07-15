import "./Stats.css";

const stats = [
    {
        number : "500+" ,
        title : "Coding Problems"
    },
    {
        number : "1k+",
        title : "Active Users"
    },
    {
        number : "15+",
        title : "Programming Languages"
    },
    {
        number : "24/7",
        title : "Practise Access"
    }
]

function Stats() {
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