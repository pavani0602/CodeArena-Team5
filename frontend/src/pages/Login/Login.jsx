import "./Login.css";
import { Link } from "react-router-dom";

import {
    FaLaptopCode,
    FaCheckCircle,
    FaEnvelope,
    FaLock
} from "react-icons/fa";

function Login() {
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

                        <form>

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
                                    />
                                </div>

                            </div>

                            <div className="forgot-password">
                                <Link to="#">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                            >
                                Login
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