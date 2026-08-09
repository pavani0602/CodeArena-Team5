import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import { registerUser } from "/src/services/authService.js";
import "../../pages/Admin/Authstyles.css";
import './Register.css';
import { useTranslation } from 'react-i18next';

function Register() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.passwordMismatch'));
            return;
        }

        setIsSubmitting(true);

        try {
            await registerUser({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            alert(t('auth.register.success'));
            navigate('/login');
        } catch (err) {
            setError(err.message || t('auth.register.failed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const googleToken = credentialResponse.credential;
        
        try {
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: googleToken })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Google registration failed on backend");
            }

            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role.toLowerCase());
            localStorage.setItem('userEmail', data.username);

            alert(t('auth.register.welcomeGoogle', { name: data.username }));
            navigate('/problems');

        } catch (error) {
            console.error("Error connecting with Google:", error);
            setError(t('auth.register.googleProfileError'));
        }
    };

    const handleGoogleFailure = () => {
        setError(t('auth.register.googleError'));
    };

    return (
        <div className="auth-page-container">
            <div className="avatar-section">
                <img
                    src="/regavatar.png"
                    alt="CodeArena avatar"
                    className="standing-avatar"
                />
            </div>
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                </div>

                <h2 className="auth-title">{t('auth.register.title')}</h2>
                <p className="auth-subtitle">{t('auth.register.subtitle')}</p>

                {error && <div className="auth-error-banner">{error}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="input-group">
                        <label>{t('auth.register.fullName')}</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            required 
                            placeholder={t('auth.register.fullNamePlaceholder')}
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>{t('auth.emailAddress')}</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder={t('auth.register.emailPlaceholder')}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>{t('auth.password')}</label>
                        <input 
                            type="password" 
                            name="password" 
                            required 
                            placeholder={t('auth.login.placeholderPassword')}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>{t('auth.register.confirmPassword')}</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            required 
                            placeholder={t('auth.register.confirmPasswordPlaceholder')}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? t('auth.register.creating') : t('auth.createAccount')}
                    </button>
                </form>

                <div className="divider-line">
                    <span>{t('auth.orContinueWith')}</span>
                </div>

                <div className="google-auth-box">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        theme="outline"
                        shape="pill"
                        type="standard"
                        size="large"
                        width="280"
                        useOneTap={false}
                    />
                </div>

                <div className="auth-footer-prompt">
                    {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;