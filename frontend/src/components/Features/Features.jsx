import "./Features.css";
import {
    FaCode,
    FaChartLine,
    FaTrophy,
    FaComments
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function Features() {
    const { t } = useTranslation();

    const features = [
        {
            icon : <FaCode />,
            title : t('home.features.cards.practice.title'),
            description : t('home.features.cards.practice.description')
        },
        {
            icon : <FaChartLine />,
            title : t('home.features.cards.track.title'),
            description : t('home.features.cards.track.description')
        },
        {
            icon : <FaTrophy />,
            title : t('home.features.cards.leaderboard.title'),
            description : t('home.features.cards.leaderboard.description')
        },
        {
            icon :  <FaComments />,
            title : t('home.features.cards.community.title'),
            description : t('home.features.cards.community.description')
        }
    ];

    return (
        <section className="features">
            <div className="container">
                <div className="section-header">
                    <h2>{t('home.features.heading')}</h2>
                    <p>
                        {t('home.features.subheading')}
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