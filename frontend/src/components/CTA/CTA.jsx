import "./CTA.css";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function CTA() {
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
        <section className="cta">
            <div className="container">
                <div className="cta-content">
                    <h2>Ready to Start Your Coding Journey?</h2>
                    <p>
                        Join CodeArena today and sharpen your
                        problem-solving skills one challenge at a time
                    </p>
                    {!isLoggedIn ? (
                        <Link className="cta-button" to="/register">
                            Get Started!
                        </Link>
                    ) : (
                        <Link className="cta-button" to="/problems">
                            Practice Now →
                        </Link>
                    )}
                </div>
            </div>
        </section>
    )
}

export default CTA;