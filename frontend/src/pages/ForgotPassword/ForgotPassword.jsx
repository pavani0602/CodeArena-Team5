import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import '../../pages/Admin/Authstyles.css';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

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
            setErrorMessage(t('auth.forgotPasswordPage.error'));
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
                        <FaUser size={12} /> {t('auth.user')}
                    </button>
                    <button 
                        type="button"
                        className={`role-tab ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => handleTabChange('admin')}
                    >
                        <FaUserShield size={13} /> {t('auth.admin')}
                    </button>
                </div>

                {errorMessage && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}

                {!submitted ? (
                    <>
                        <h2 className="auth-title">{t('auth.forgotPasswordPage.title')}</h2>
                        <p className="auth-subtitle">
                            {role === 'admin' 
                                ? t('auth.forgotPasswordPage.subtitleAdmin') 
                                : t('auth.forgotPasswordPage.subtitleUser')}
                        </p>

                        <form onSubmit={handleRecover} className="auth-form">
                            <div className="input-group">
                                <label>{role === 'admin' ? t('auth.adminEmail') : t('auth.emailAddress')}</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder={role === 'admin' ? t('auth.login.placeholderAdminEmail') : t('auth.login.placeholderEmail')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? t('auth.forgotPasswordPage.sending') : t('auth.forgotPasswordPage.send')}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="auth-success-view" style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ color: '#10b981', fontSize: '2.5rem', marginBottom: '12px' }}>📩</div>
                        <h2 className="auth-title">{t('auth.forgotPasswordPage.successTitle')}</h2>
                        <p className="auth-subtitle" style={{ marginBottom: '20px' }}>
                            {t('auth.forgotPasswordPage.successMessage', { email })}
                        </p>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="auth-submit-btn" 
                            style={{ width: '100%', border: 'none', cursor: 'pointer' }}
                        >
                            {t('auth.forgotPasswordPage.backToLogin')}
                        </button>
                    </div>
                )}

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/login" className="back-to-login-link" style={{ color: '#64748b', fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <FaArrowLeft size={10} /> {t('auth.forgotPasswordPage.backToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;