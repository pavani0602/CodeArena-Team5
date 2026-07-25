import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthStyles.css';

function AdminLogin() {
    const navigate = useNavigate();
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
                throw new Error(errorData?.message || 'Login failed. Please check your credentials.');
            }

            const data = await response.json();
            
            if (data.role?.toUpperCase() !== 'ADMIN') {
                throw new Error("Access Denied: You do not have administrator privileges.");
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('userEmail', credentials.email);
            
            alert(`Welcome back to the Admin Workspace, ${data.username}!`);
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
                    <span className="auth-badge admin">Admin Portal</span>
                </div>
                
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to manage problems and test engines</p>

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
                            <label>Password</label>
                            {/* 💡 Points exactly to your defined standalone path */}
                            <Link to="/admin/forgot-password" id="forgot-link">Forgot Password?</Link>
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
                        Enter Workspace
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;