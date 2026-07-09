import "./Navbar.css";
import { NavLink, Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole") || "USER";
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="left">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2>Code<span className="arena">Arena</span></h2>
                </Link>
            </div>
            <div className="middle">
                <NavLink to="/problems">Problems</NavLink>
                <NavLink to="/leaderboard">Leaderboard</NavLink>
                <NavLink to="/discussion">Discussion</NavLink>
            </div>
            <div className="right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isLoggedIn ? (
                    <>
                        <span className="nav-username" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: userRole === 'ADMIN' ? 'rgba(255, 85, 85, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                            border: userRole === 'ADMIN' ? '1px solid #ff5555' : '1px solid #6366f1',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}>
                            {userRole === 'ADMIN' ? '🛡️ Host:' : '💻 Solver:'} {username}
                        </span>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/register?role=ADMIN" style={{ textDecoration: 'none' }}>
                            <button style={{
                                background: 'transparent',
                                border: '1px solid #ff5555',
                                color: '#ff8888',
                                padding: '8px 14px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}>
                                🛡️ Host Admin
                            </button>
                        </Link>
                        <Link to="/register?role=USER" style={{ textDecoration: 'none' }}>
                            <button style={{
                                background: 'var(--primary, #6366f1)',
                                border: 'none',
                                color: '#ffffff',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}>
                                💻 Solver Portal
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
