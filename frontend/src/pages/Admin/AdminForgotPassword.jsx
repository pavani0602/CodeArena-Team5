import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';
import { FaArrowLeft } from 'react-icons/fa';

function AdminForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRecover = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate backend API recovery sequence dispatch
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                    <span className="auth-badge admin">Admin Recovery</span>
                </div>

                {!submitted ? (
                    <>
                        <h2 className="auth-title">Reset Password</h2>
                        <p className="auth-subtitle">Enter your registered admin account email to receive a secure password recovery reset link.</p>

                        <form onSubmit={handleRecover} className="auth-form">
                            <div className="input-group">
                                <label>Account Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="admin@codearena.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? 'Processing...' : 'Send Recovery Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="auth-success-view">
                        <div className="success-icon-circle">✓</div>
                        <h2 className="auth-title">Check Your Email</h2>
                        <p className="auth-subtitle">We have dispatched a secure authorization link to <strong>{email}</strong> if it exists in our core admin pool.</p>
                    </div>
                )}

                <div className="auth-footer">
                    <Link to="/admin/login" className="back-to-login-link">
                        <FaArrowLeft size={10} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminForgotPassword;