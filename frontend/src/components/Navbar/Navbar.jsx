import "./Navbar.css";
import { useEffect, useState } from "react";
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
    const isAdmin = userRole === "ADMIN";

    const [userStats, setUserStats] = useState({ streak: 0 });

    useEffect(() => {
        if (!isLoggedIn || isAdmin) return undefined;

        let mounted = true;
        const loadStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await fetch("/api/submissions/summary", { headers, cache: "no-store" });
                if (!res.ok) throw new Error("Failed to load stats");
                const data = await res.json();
                if (mounted) setUserStats({ streak: data.streak || 0 });
            } catch {
                if (mounted) setUserStats({ streak: 0 });
            }
        };

        loadStats();
        const intervalId = window.setInterval(loadStats, 5000);
        const refreshHandler = () => loadStats();
        window.addEventListener("codearena:leaderboard-updated", refreshHandler);
        window.addEventListener("codearena:submission-updated", refreshHandler);

        return () => {
            mounted = false;
            window.clearInterval(intervalId);
            window.removeEventListener("codearena:leaderboard-updated", refreshHandler);
            window.removeEventListener("codearena:submission-updated", refreshHandler);
        };
    }, [isAdmin, isLoggedIn]);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setShowDropdown(false);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="left">
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <h2>Code<span className="arena">Arena</span></h2>
                </Link>
            </div>

            <div className="middle">
                {!isLoggedIn ? null : isAdmin ? (
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
