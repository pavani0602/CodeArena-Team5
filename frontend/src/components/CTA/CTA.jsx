import "./CTA.css";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function CTA() {
    const { t } = useTranslation();

    return (
        <section className="cta">
            <div className="container">
                <div className="cta-content">
                    <h2>{t('home.cta.heading')}</h2>
                    <p>
                        {t('home.cta.description')}
                    </p>
                    <Link className="cta-button" to="/register">
                        {t('home.cta.button')}
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CTA;