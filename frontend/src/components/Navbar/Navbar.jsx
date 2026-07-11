import "./Navbar.css";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    FaChevronDown,
    FaFire,
    FaSignOutAlt,
    FaThLarge,
    FaUserCircle
} from "react-icons/fa";

const normalizeRole = (role) => (role || "USER").toUpperCase();

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
    const [userRole] = useState(() => normalizeRole(localStorage.getItem("userRole")));
    const [username] = useState(() => localStorage.getItem("username") || "");
    const [showDropdown, setShowDropdown] = useState(false);

    const [userStats] = useState({
        streak: 6
    });

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setShowDropdown(false);
        navigate("/");
    };

    const isAdmin = userRole === "ADMIN";

    return (
        <nav className="navbar">
            <div className="left">
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <h2>Code<span className="arena">Arena</span></h2>
                </Link>
            </div>

            <div className="middle">
                {isLoggedIn && isAdmin ? (
                    <>
                        <NavLink to="/admin">Problem Workspace</NavLink>
                        <NavLink to="/problems">Problems</NavLink>
                        <NavLink to="/leaderboard">Leaderboard</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/problems">Problems</NavLink>
                        <NavLink to="/leaderboard">Leaderboard</NavLink>
                        <NavLink to="/discussion">Discussion</NavLink>
                    </>
                )}
            </div>

            <div className="right">
                {!isLoggedIn ? (
                    <div className="public-nav-actions">
                        <Link to="/login">
                            <button>Login or Signup</button>
                        </Link>
                        <Link to="/register?role=ADMIN">
                            <button className="host-admin-btn">Host Admin</button>
                        </Link>
                        <Link to="/register?role=USER">
                            <button className="solver-portal-btn">Solver Portal</button>
                        </Link>
                    </div>
                ) : (
                    <div className="authenticated-actions-wrapper">
                        {!isAdmin && (
                            <div className="streak-badge" title="Your daily coding streak">
                                <FaFire className="streak-icon" />
                                <span>{userStats.streak}</span>
                            </div>
                        )}

                        <div className="profile-dropdown-container">
                            <button
                                className="profile-menu-trigger profile-trigger-btn"
                                onClick={() => setShowDropdown(!showDropdown)}
                                type="button"
                            >
                                <FaUserCircle size={18} className="avatar-placeholder" />
                                <span className="user-role-label">
                                    {isAdmin ? "Admin" : "Coder"}
                                </span>
                                <FaChevronDown
                                    size={10}
                                    className={`chevron-icon ${showDropdown ? "rotate" : ""}`}
                                />
                            </button>

                            {showDropdown && (
                                <div className="navbar-dropdown-menu">
                                    <div className="dropdown-user-header">
                                        <span>Signed in as</span>
                                        <strong>{username || (isAdmin ? "Admin" : "Coder")}</strong>
                                    </div>
                                    <hr className="dropdown-divider" />

                                    <Link
                                        to={isAdmin ? "/admin" : "/dashboard"}
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <FaThLarge size={14} /> Dashboard
                                    </Link>

                                    <button
                                        onClick={handleSignOut}
                                        className="dropdown-item logout-btn dropdown-logout-action"
                                        type="button"
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
