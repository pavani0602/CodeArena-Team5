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

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Reset error banner

        // 💡 Hardcoded placeholder check for local testing before backend integration
        if (credentials.email === 'admin@codearena.com' && credentials.password === 'admin123') {
            // Set an admin flag in localStorage so MainLayout can verify role later
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('token', 'mock-admin-jwt-token');
            
            alert('Welcome back, Admin!');
            navigate('/admin'); // 🚀 Redirects to your clean workspace grid table
        } else {
            setError('Invalid Admin credentials. Please check your email or password.');
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