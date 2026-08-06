import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AuthStyles.css';

function AdminLogin() {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
                    username: credentials.email,
                    password: credentials.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || t('auth.login.error'));
            }

            const data = await response.json();
            
            if (data.role?.toUpperCase() !== 'ADMIN') {
                throw new Error(t('auth.adminLogin.accessDenied'));
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userEmail', credentials.email);
            
            alert(t('auth.adminLogin.success', { username: data.username }));
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                    <span className="auth-badge admin">{t('auth.adminPortal')}</span>
                </div>
                
                <h2 className="auth-title">{t('auth.adminLogin.title')}</h2>
                <p className="auth-subtitle">{t('auth.adminLogin.subtitle')}</p>

                {error && <div className="auth-error-banner">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <label>Admin Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder="admin@codearena.com"
                            value={credentials.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>{t('auth.password')}</label>
                            {/* 💡 Points exactly to your defined standalone path */}
                            <Link to="/admin/forgot-password" id="forgot-link">{t('auth.adminLogin.forgotPassword')}</Link>
                        </div>
                        <input 
                            type="password" 
                            name="password" 
                            required 
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        {t('auth.adminLogin.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;