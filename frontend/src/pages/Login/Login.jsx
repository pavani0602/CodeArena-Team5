import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaUserShield } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import '../../pages/Admin/Authstyles.css';
import './Login.css';
import { useTranslation } from 'react-i18next';

function Login() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: credentials.email, // backend maps email to username for now
                    password: credentials.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || t('auth.login.error'));
            }

            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role.toLowerCase());
            localStorage.setItem('userEmail', credentials.email);
            
            alert(t('auth.login.success', { username: data.username }));
            
            if (data.role.toUpperCase() === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/problems');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // const handleGoogleSuccess = async (credentialResponse) => {
    //     const token = credentialResponse.credential;
    //     try {
    //         const base64Url = token.split('.')[1];
    //         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    //         const jsonPayload = decodeURIComponent(
    //             window.atob(base64)
    //                 .split('')
    //                 .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    //                 .join('')
    //         );
            
    //         const googleUser = JSON.parse(jsonPayload);
            
    //         localStorage.setItem('userRole', 'user');
    //         localStorage.setItem('token', token);
    //         localStorage.setItem('user', JSON.stringify({
    //             username: googleUser.name,
    //             email: googleUser.email,
    //             picture: googleUser.picture
    //         }));

    //         alert(`Welcome back, ${googleUser.name}!`);
    //         navigate('/problems');
    //     } catch (error) {
    //         console.error("Error parsing Google credentials:", error);
    //         setError("Google Authentication succeeded, but profile parsing failed.");
    //     }
    // };

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
                throw new Error(errorData?.message || "Google login failed on backend");
            }

            const data = await response.json();
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role.toLowerCase());
            localStorage.setItem('userEmail', data.username);
            
            alert(t('auth.login.googleWelcome', { name: data.username }));
            
            if (data.role.toUpperCase() === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/problems');
            }
        } catch (error) {
            console.error("Error connecting with Google:", error);
            setError(t('auth.login.googleProfileError'));
        }
    };

    const handleGoogleFailure = () => {
        setError(t('auth.login.googleError'));
    };

    return (
        <div className="auth-page-container">
            <div className="avatar-section">
                <img
                    src="/avatar.png"
                    alt="CodeArena avatar"
                    className="standing-avatar"
                />
            </div>
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                </div>

                {/* Role Selector Tabs */}
                <div className="role-selector-tabs">
                    <button 
                        type="button"
                        className={`role-tab ${role === 'user' ? 'active' : ''}`}
                        onClick={() => { setRole('user'); setError(''); }}
                    >
                        <FaUser size={12} /> {t('auth.user')}
                    </button>
                    <button 
                        type="button"
                        className={`role-tab ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => { setRole('admin'); setError(''); }}
                    >
                        <FaUserShield size={13} /> {t('auth.admin')}
                    </button>
                </div>

                <h2 className="auth-title">
                    {role === 'admin' ? t('auth.login.titleAdmin') : t('auth.login.titleUser')}
                </h2>
                <p className="auth-subtitle">
                    {role === 'admin' 
                        ? t('auth.login.subtitleAdmin') 
                        : t('auth.login.subtitleUser')}
                </p>

                {error && <div className="auth-error-banner">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <label>{role === 'admin' ? t('auth.adminEmail') : t('auth.emailAddress')}</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder={role === 'admin' ? t('auth.login.placeholderAdminEmail') : t('auth.login.placeholderEmail')}
                            value={credentials.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>{t('auth.password')}</label>
                            <Link to="/forgotpassword" id="forgot-link">
                                {t('auth.forgotPassword')}
                            </Link>
                        </div>
                        <input 
                            type="password" 
                            name="password" 
                            required 
                            placeholder={t('auth.login.placeholderPassword')}
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        {role === 'admin' ? t('auth.enterPanel') : t('auth.signIn')}
                    </button>
                </form>

                {role === 'user' && (
                    <>
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
                                text="signin_with"
                                width="280"
                                useOneTap={false}
                            />
                        </div>

                        <div className="auth-footer-prompt">
                            {t('auth.dontHaveAccount')} <Link to="/register">{t('auth.createAccount')}</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;