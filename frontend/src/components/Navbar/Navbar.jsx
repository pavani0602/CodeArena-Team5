import "./Navbar.css";
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaFire, FaUserCircle, FaSignOutAlt, FaThLarge, FaChevronDown } from 'react-icons/fa';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('user');
    const [showDropdown, setShowDropdown] = useState(false);
    
    const [userStats] = useState({
        streak: 6
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        
        if (token) {
            setIsLoggedIn(true);
            setUserRole(role || 'user');
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setShowDropdown(false);
        alert('Signed out successfully.');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="left">
                {/* 💡 Keeps your exact branding structure */}
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2>Code<span className="arena">Arena</span></h2>
                </Link>
            </div>
            
            <div className="middle">
                {isLoggedIn && userRole === 'admin' ? (
                    /* 🛠️ ADMIN NAVIGATION LINKS */
                    <>
                        <NavLink to="/admin">Problem Workspace</NavLink>
                        <NavLink to="/admin/analytics">Engine Status</NavLink>
                        <NavLink to="/admin/users">Manage Users</NavLink>
                    </>
                ) : (
                    /* 💻 STANDARD USER / PUBLIC NAVIGATION LINKS */
                    <>
                        <NavLink to="/problems">Problems</NavLink>
                        <NavLink to="/leaderboard">Leaderboard</NavLink>
                        <NavLink to="/discussion">Discussion</NavLink>
                    </>
                )}
            </div>
            
            <div className="right">
                {!isLoggedIn ? (
                    /* 🚪 PUBLIC STATE: Your exact Login Button wrapper */
                    <Link to="/login">
                        <button>Login or Signup</button>
                    </Link>
                ) : (
                    /* ⚡ AUTHENTICATED STATE: Dynamic Streak + Profile Hub */
                    <div className="authenticated-actions-wrapper">
                        
                        {userRole === 'user' && (
                            <div className="streak-badge" title="Your Daily Coding Streak!">
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
                                <span className="user-role-label">{userRole === 'admin' ? 'Admin' : 'Coder'}</span>
                                <FaChevronDown size={10} className={`chevron-icon ${showDropdown ? 'rotate' : ''}`} />
                            </button>

                            {showDropdown && (
                                <div className="navbar-dropdown-menu">
                                    <div className="dropdown-user-header">
                                        <span>Signed in as</span>
                                        <strong>{userRole === 'admin' ? 'admin@codearena.com' : 'user@codearena.com'}</strong>
                                    </div>
                                    <hr className="dropdown-divider" />
                                    
                                    <Link 
                                        to={userRole === 'admin' ? "/admin" : "/dashboard"} 
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <FaThLarge size={14} /> Dashboard
                                    </Link>
                                    
                                    {/* 🚪 Added a unique 'dropdown-logout-action' class here */}
                                    <button 
                                        onClick={handleSignOut} 
                                        className="dropdown-item logout-btn dropdown-logout-action"
                                    >
                                        <FaSignOutAlt size={14} /> Sign Out
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