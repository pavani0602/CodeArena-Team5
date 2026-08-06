import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import '../../pages/Admin/Authstyles.css';

function ForgotPassword() {
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRecover = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role: role.toUpperCase() })
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Failed to generate reset link.');
            }

            const resetToken = data.token;
            if (!resetToken) {
                // If the user doesn't exist, we don't leak it. Just show success.
                setLoading(false);
                setSubmitted(true);
                return;
            }

            const resetLinkUrl = `${window.location.origin}/reset-password?token=${resetToken}`;

            const templateParams = {
                to_email: email,
                link: resetLinkUrl,
            };

            const SERVICE_ID = 'service_jmtuzus';
            const TEMPLATE_ID = 'template_feei7gi';
            const PUBLIC_KEY = 'aroQ7qSy3luWdBGGN';

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            setLoading(false);
            setSubmitted(true);
        } catch (err) {
            console.error('FAILED...', err);
            setLoading(false);
            setErrorMessage('Failed to send reset instructions. Please try again.');
        }
    };

    const handleTabChange = (selectedRole) => {
        setRole(selectedRole);
        setSubmitted(false);
        setEmail('');
        setErrorMessage('');
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

                {errorMessage && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}

                {!submitted ? (
                    <>
                        <h2 className="auth-title">Reset Password</h2>
                        <p className="auth-subtitle">
                            {role === 'admin' 
                                ? 'Enter your admin email to receive secure workspace recovery instructions.' 
                                : 'Enter your registered email to receive a password reset link.'}
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
                                {loading ? 'Sending Instructions...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="auth-success-view" style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ color: '#10b981', fontSize: '2.5rem', marginBottom: '12px' }}>📩</div>
                        <h2 className="auth-title">Check Your Inbox</h2>
                        <p className="auth-subtitle" style={{ marginBottom: '20px' }}>
                            We have successfully sent password reset instructions to <strong>{email}</strong>.
                        </p>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="auth-submit-btn" 
                            style={{ width: '100%', border: 'none', cursor: 'pointer' }}
                        >
                            Back to Sign In
                        </button>
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