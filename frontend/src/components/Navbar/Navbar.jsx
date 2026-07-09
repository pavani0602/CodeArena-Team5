import "./Navbar.css";
import { NavLink, Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
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
            <div className="right">
                {isLoggedIn ? (
                    <>
                        <span className="nav-username">👤 {username}</span>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">
                        <button>Login or Signup</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
