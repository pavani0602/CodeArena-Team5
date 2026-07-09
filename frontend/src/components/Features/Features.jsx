import "./Features.css";
import {
    FaCode,
    FaChartLine,
    FaTrophy,
    FaComments
} from 'react-icons/fa';

const features = [
    {
        icon : <FaCode />,
        title : "Practice Problems",
        description : "Solve coding challenges across multiple topics and difficulty levels."
    },
    {
        icon : <FaChartLine />,
        title : "Track Progress",
        description : " Monitor your solved problems and stay consistent with your learning."
    },
    {
        icon : <FaTrophy />,
        title : "Leaderboard",
        description : "Compete with other programmers and improve your ranking."
    },
    {
        icon :  <FaComments />,
        title : "Community Discussions",
        description : "Ask questions, share ideas, and learn from fellow developers."
    }
]
function Features() {
    return (
        <section className="features">
            <div className="container">
                <div className="section-header">
                    <h2>Why Choose CodeArena?</h2>
                    <p>
                        Everything you need to improve your programming skills in one platform.
                    </p>
                </div>
                <div className="features-grid">
                    {features.map((feature,index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;