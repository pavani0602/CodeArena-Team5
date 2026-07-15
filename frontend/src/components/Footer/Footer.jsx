import "./Footer.css";
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Footer() {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

    useEffect(() => {
        const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
        syncAuth();
        window.addEventListener("codearena:auth-updated", syncAuth);
        window.addEventListener("storage", syncAuth);
        return () => {
            window.removeEventListener("codearena:auth-updated", syncAuth);
            window.removeEventListener("storage", syncAuth);
        };
    }, [location.pathname]);

    return (
        <footer className="footer">
            <div className="top">
                <div className="brand">
                     <Link to="/">
                        <h2>Code
                            <span className="arena">Arena</span></h2>
                    </Link>
                </div>
                <div className="links">
                    <Link to="/">Home</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/problems">Problems</Link>
                            <Link to="/leaderboard">Leaderboard</Link>
                            <Link to="/discussion">Discussion</Link>
                        </>
                    ) : (
                        <Link to="/login">Login or Signup</Link>
                    )}
                </div>
            </div>
            <div className="bottom">
                <p>© 2026 CodeArena. All rights reserved</p>
            </div>
        </footer>
    )
}

export default Footer;
