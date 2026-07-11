import "./ForgotPassword.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
    FaEnvelope,
    FaArrowLeft
} from "react-icons/fa";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 

    // Fixed for Vite: Completely removed 'process.env' to stop the crash
    const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";
    const ENDPOINT_URL = `${API_BASE_URL}/api/auth/forgot-password`;

    // 1. First time sending the link
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const response = await fetch(ENDPOINT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error. Make sure your backend server is running and accessible!");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Clicking the Resend Link button
    const handleResend = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(ENDPOINT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });

            if (response.ok) {
                alert("A new link has been sent!");
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || "Failed to resend. Please try again.");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error. Is the backend server still running?");
        } finally {
            setIsLoading(false);
        }
    };

    // Resets the state variables when returning to a fresh form setup
    const handleBackToForm = () => {
        setIsSubmitted(false);
        setEmail("");
    };

    return (
        <section className="login-page">
            <div className="forgot-container">
                <div className="auth-card">
                    {!isSubmitted ? (
                        <>
                            <h2>Reset Password 🔒</h2>
                            <p>
                                Enter your registered email address below and we'll send you instructions to reset your password.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-box">
                                        <FaEnvelope className="input-icon" />
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="login-button" disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="success-state">
                            <h2>Check Your Email 📩</h2>
                            <p>
                                We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                            </p>
                            <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button 
                                    className="login-button"
                                    onClick={handleResend} 
                                    disabled={isLoading}
                                    style={{ width: '100%' }}
                                >
                                    {isLoading ? "Resending..." : "Resend Link"}
                                </button>
                                <button 
                                    className="login-button" 
                                    onClick={handleBackToForm}
                                    style={{ backgroundColor: 'transparent', color: 'var(--primary-color, #fff)', border: '1px solid currentColor', width: '100%' }}
                                >
                                    Try Another Email
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="back-to-login">
                        <Link to="/login">
                            <FaArrowLeft /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ForgotPassword;
