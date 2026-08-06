import "./Footer.css";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="top">
                <div className="brand">
                     <Link to="/">
                        <h2>{t('common.brand')}</h2>
                    </Link>
                </div>
                <div className="links">
                    <Link to="/">{t('common.home')}</Link>
                    <Link to="/problems">{t('common.problems')}</Link>
                    <Link to="/leaderboard">{t('common.leaderboard')}</Link>
                    <Link to="/discussion">{t('common.discussion')}</Link>
                </div>
            </div>
            <div className="bottom">
                <p>© 2026 {t('common.brand')}. {t('common.brand')} {t('common.brand')}</p>
            </div>
        </footer>
    )
}

export default Footer;