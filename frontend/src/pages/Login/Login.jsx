import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
    FaLaptopCode,
    FaCheckCircle,
    FaEnvelope,
    FaLock,
    FaSpinner
} from "react-icons/fa";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: form.username, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Invalid username or password");
            } else {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", form.username);
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
                <div className="auth-right">

                    <div className="auth-card">

                        <h2>Welcome Back 👋</h2>

                        <p>
                            Continue your coding journey with CodeArena.
                        </p>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="username">
                                    Username
                                </label>
                                <div className="input-box">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="Enter your username"
                                        value={form.username}
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
                                        placeholder="Enter your password"
                                        value={form.password}
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
                                {loading ? <FaSpinner className="spin" /> : "Login"}
                            </button>

                        </form>

                        <p className="auth-switch">
                            Don't have an account?{" "}
                            <Link to="/register">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;