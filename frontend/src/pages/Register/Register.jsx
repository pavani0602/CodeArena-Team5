import "../Login/Login.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import {
    FaLaptopCode,
    FaCheckCircle,
    FaUser,
    FaEnvelope,
    FaLock,
    FaSpinner,
    FaShieldAlt,
    FaCode
} from "react-icons/fa";

function Register() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [role, setRole] = useState("USER");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlRole = searchParams.get("role");
        if (urlRole && (urlRole.toUpperCase() === "ADMIN" || urlRole.toUpperCase() === "HOST")) {
            setRole("ADMIN");
        } else if (urlRole && urlRole.toUpperCase() === "USER") {
            setRole("USER");
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    role: role
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Registration failed. Try a different username or email.");
            } else {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", form.username);
                localStorage.setItem("userRole", data.role || role);
                navigate("/problems");
            }
        } catch (err) {
            setError("Network error. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-page">
            <div className="auth-container">

                {/* Left Section */}
                <div className="auth-left">

                    <div className="brand-logo">
                        <FaLaptopCode />
                    </div>

                    <h1>CodeArena</h1>

                    <h2>Master Coding.<br />One Problem at a Time.</h2>

                    <p>
                        Practice coding challenges, improve your problem-solving
                        skills, and compete with developers around the world.
                    </p>

                    <div className="auth-features">

                        <div className="feature">
                            <FaCheckCircle />
                            <span>500+ Coding Problems</span>
                        </div>

                        <div className="feature">
                            <FaCheckCircle />
                            <span>Track Your Progress</span>
                        </div>

                        <div className="feature">
                            <FaCheckCircle />
                            <span>Community Discussions</span>
                        </div>

                        <div className="feature">
                            <FaCheckCircle />
                            <span>Global Leaderboard</span>
                        </div>

                    </div>

                </div>

                {/* Right Section */}
                <div className="auth-right">

                    <div className="auth-card">

                        <h2>Create Your Account 🚀</h2>

                        <p>
                            Join CodeArena and select your account type below.
                        </p>

                        <div className="role-selector" style={{ display: 'flex', gap: '10px', margin: '16px 0 20px 0' }}>
                            <button
                                type="button"
                                onClick={() => setRole('USER')}
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: role === 'USER' ? '2px solid var(--primary, #6366f1)' : '1px solid rgba(255,255,255,0.15)',
                                    background: role === 'USER' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.2)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontWeight: role === 'USER' ? '600' : '400',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FaCode /> Solver Portal
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('ADMIN')}
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: role === 'ADMIN' ? '2px solid #ff5555' : '1px solid rgba(255,255,255,0.15)',
                                    background: role === 'ADMIN' ? 'rgba(255, 85, 85, 0.2)' : 'rgba(0,0,0,0.2)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontWeight: role === 'ADMIN' ? '600' : '400',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FaShieldAlt /> Host Admin Portal
                            </button>
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="username">
                                    Username
                                </label>
                                <div className="input-box">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="Choose a username"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    Email
                                </label>
                                <div className="input-box">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    Password
                                </label>
                                <div className="input-box">
                                    <FaLock className="input-icon" />
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Create a password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <div className="input-box">
                                    <FaLock className="input-icon" />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? <FaSpinner className="spin" /> : "Create Account"}
                            </button>

                        </form>

                        <p className="auth-switch">
                            Already have an account?{" "}
                            <Link to="/login">
                                Login
                            </Link>
                        </p>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Register;