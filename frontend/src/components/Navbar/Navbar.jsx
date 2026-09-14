import "./Navbar.css";
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaFire, FaUserCircle, FaSignOutAlt, FaThLarge, FaChevronDown } from 'react-icons/fa';
import { fetchApi } from "../../services/api";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

function Navbar() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('user');
    const [userEmail, setUserEmail] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
    
    const [userStats, setUserStats] = useState({
        streak: 0
    });

    useEffect(() => {
        const stored = localStorage.getItem('codearena-lang');
        if (stored) {
            setCurrentLanguage(stored);
            i18n.changeLanguage(stored);
        }

        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const email = localStorage.getItem('userEmail');
        
        if (token) {
            setIsLoggedIn(true);
            setUserRole(role || 'user');
            setUserEmail(email || role || 'Coder');
            
            // Fetch dynamic streak from summary
            fetchApi('/api/submissions/summary')
                .then(res => {
                    if (res.ok) return res.json();
                })
                .then(data => {
                    if (data) setUserStats({ streak: data.streak || 0 });
                })
                .catch(err => console.error("Could not fetch user stats:", err));

        } else {
            setIsLoggedIn(false);
            setUserEmail('');
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserEmail('');
        setShowDropdown(false);
        alert(t('auth.login.success', { username: t('common.brand') }));
        navigate('/');
    };

    const changeLanguage = (lng) => {
        setCurrentLanguage(lng);
        i18n.changeLanguage(lng);
        localStorage.setItem('codearena-lang', lng);
    };

    return (
        <nav className="navbar">
            <div className="left">
                {/* 💡 Keeps your exact branding structure */}
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2>
                        <span>Code</span><span className="arena">Arena</span>
                    </h2>
                    {/* <h2>{t('common.brand').split('Code')[0]}<span className="arena">{t('common.brand').split('Arena')[1] || 'Arena'}</span></h2> */}
                </Link>
            </div>
            
            <div className="middle">
                {isLoggedIn && userRole === 'admin' ? (
                    /* 🛠️ ADMIN NAVIGATION LINKS */
                    <>
                        <NavLink to="/admin">{t('navbar.problemWorkspace')}</NavLink>
                        <NavLink to="/admin/analytics">{t('navbar.engineStatus')}</NavLink>
                        <NavLink to="/admin/users">{t('navbar.manageUsers')}</NavLink>
                        <NavLink to="/admin/submissions">{t('navbar.submissions')}</NavLink>
                    </>
                ) : (
                    /* 💻 STANDARD USER / PUBLIC NAVIGATION LINKS */
                    <>
                        <NavLink to="/problems">{t('navbar.problems')}</NavLink>
                        <NavLink to="/leaderboard">{t('navbar.leaderboard')}</NavLink>
                        <NavLink to="/discussion">{t('navbar.discussion')}</NavLink>
                    </>
                )}
            </div>
            
            <div className="right">
                {!isLoggedIn ? (
                    /* 🚪 PUBLIC STATE: Your exact Login Button wrapper */
                    <div className="authenticated-actions-wrapper">
                        <select className="language-selector" value={currentLanguage} onChange={(e) => changeLanguage(e.target.value)}>
                            <option value="en">English</option>
                            <option value="ta">தமிழ்</option>
                            <option value="hi">हिन्दी</option>
                            <option value="te">తెలుగు</option>
                        </select>
                        <Link to="/login">
                            <button>{t('navbar.loginOrSignup')}</button>
                        </Link>
                    </div>
                ) : (
                    /* ⚡ AUTHENTICATED STATE: Dynamic Streak + Profile Hub */
                    <div className="authenticated-actions-wrapper">
                        
                        <select className="language-selector" value={currentLanguage} onChange={(e) => changeLanguage(e.target.value)}>
                            <option value="en">English</option>
                            <option value="ta">தமிழ்</option>
                            <option value="hi">हिन्दी</option>
                            <option value="te">తెలుగు</option>
                        </select>

                        {userRole === 'user' && (
                            <div className="streak-badge" title={t('navbar.streakTooltip')}>
                                <FaFire className="streak-icon" />
                                <span>{userStats.streak}</span>
                            </div>
                        )}

                    
                        <div className="profile-dropdown-container">
                            {/* 👤 Added the unique 'profile-trigger-btn' class here */}
                            <button 
                                className="profile-menu-trigger profile-trigger-btn" 
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <FaUserCircle size={18} className="avatar-placeholder" />
                                <span className="user-role-label">{userRole === 'admin' ? t('navbar.admin') : t('navbar.coder')}</span>
                                <FaChevronDown size={10} className={`chevron-icon ${showDropdown ? 'rotate' : ''}`} />
                            </button>

                            {showDropdown && (
                                <div className="navbar-dropdown-menu">
                                    <div className="dropdown-user-header">
                                        <span>{t('navbar.signedInAs')}</span>
                                        <strong>{userEmail}</strong>
                                    </div>
                                    <hr className="dropdown-divider" />
                                    
                                    <Link 
                                        to={userRole === 'admin' ? "/admin" : "/dashboard"} 
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <FaThLarge size={14} /> {t('navbar.dashboard')}
                                    </Link>
                                    
                                    {/* 🚪 Added a unique 'dropdown-logout-action' class here */}
                                    <button 
                                        onClick={handleSignOut} 
                                        className="dropdown-item logout-btn dropdown-logout-action"
                                    >
                                        <FaSignOutAlt size={14} /> {t('navbar.signOut')}
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;