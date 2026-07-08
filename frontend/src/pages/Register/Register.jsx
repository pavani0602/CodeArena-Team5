import "../Login/Login.css";
import { Link } from "react-router-dom";

import {
    FaLaptopCode,
    FaCheckCircle,
    FaUser,
    FaEnvelope,
    FaLock
} from "react-icons/fa";

function Register() {
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
                            Join CodeArena and start solving coding challenges today.
                        </p>

                        <form>

                            <div className="form-group">
                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <div className="input-box">
                                    <FaUser className="input-icon" />

                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Enter your full name"
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
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password">
                                    Confirm Password
                                </label>

                                <div className="input-box">
                                    <FaLock className="input-icon" />

                                    <input
                                        type="password"
                                        id="confirm-password"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                            >
                                Create Account
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