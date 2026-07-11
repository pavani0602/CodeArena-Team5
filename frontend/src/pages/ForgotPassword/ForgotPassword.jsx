import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import '../../pages/Admin/AuthStyles.css';

function ForgotPassword() {
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRecover = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate backend recovery API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1200);
    };

    const handleTabChange = (selectedRole) => {
        setRole(selectedRole);
        setSubmitted(false);
        setEmail('');
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                </div>

                {/* 🎛️ Shared Role Switcher */}
                <div className="role-selector-tabs">
                    <button 
                        type="button"
                        className={`role-tab ${role === 'user' ? 'active' : ''}`}
                        onClick={() => handleTabChange('user')}
                    >
                        <FaUser size={12} /> User
                    </button>
                    <button 
                        type="button"
                        className={`role-tab ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => handleTabChange('admin')}
                    >
                        <FaUserShield size={13} /> Admin
                    </button>
                </div>

                {!submitted ? (
                    <>
                        <h2 className="auth-title">Reset Password</h2>
                        <p className="auth-subtitle">
                            {role === 'admin' 
                                ? 'Enter your admin credentials to reset your workspace access token.' 
                                : 'Enter your registered email to receive a secure account recovery link.'}
                        </p>

                        <form onSubmit={handleRecover} className="auth-form">
                            <div className="input-group">
                                <label>{role === 'admin' ? 'Admin Email' : 'Email Address'}</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder={role === 'admin' ? 'admin@codearena.com' : 'you@example.com'}
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
                        <div style={{ color: '#10b981', fontSize: '2rem', textAlign: 'center', marginBottom: '12px' }}>📩</div>
                        <h2 className="auth-title">Check Your Inbox</h2>
                        <p className="auth-subtitle">
                            We have sent a secure confirmation recovery path to <strong>{email}</strong>.
                        </p>
                    </div>
                )}

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/login" className="back-to-login-link" style={{ color: '#64748b', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <FaArrowLeft size={10} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;