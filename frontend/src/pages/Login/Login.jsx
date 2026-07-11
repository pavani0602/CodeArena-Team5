import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaUserShield } from 'react-icons/fa';
import '../../pages/Admin/AuthStyles.css';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // const handleLogin = (e) => {
    //     e.preventDefault();
    //     setError('');

    //     if (role === 'admin') {
    //         // --- ADMIN LOGIN LOGIC ---
    //         if (credentials.email === 'admin@codearena.com' && credentials.password === 'admin123') {
    //             localStorage.setItem('userRole', 'admin');
    //             localStorage.setItem('token', 'mock-admin-token');
    //             alert('Welcome to the Admin Workspace!');
    //             navigate('/admin');
    //         } else {
    //             setError('Invalid Admin credentials.');
    //         }
    //     } else {
    //         // --- USER LOGIN LOGIC ---
    //         // Placeholder user validation for local testing
    //         if (credentials.email && credentials.password) {
    //             localStorage.setItem('userRole', 'user');
    //             localStorage.setItem('token', 'mock-user-token');
    //             alert('Login successful!');
    //             navigate('/dashboard');
    //         } else {
    //             setError('Please fill in all fields.');
    //         }
    //     }
    // };

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (role === 'admin') {
            // --- ADMIN LOGIN LOGIC ---
            if (credentials.email === 'admin@codearena.com' && credentials.password === 'admin123') {
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('token', 'mock-admin-token');
                alert('Welcome to the Admin Workspace!');
                navigate('/admin');
            } else {
                setError('Invalid Admin credentials.');
            }
        } else {
            // --- USER LOGIN LOGIC ---
            // 💡 Hardcoded placeholder check for local testing
            if (credentials.email === 'user@codearena.com' && credentials.password === 'user123') {
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('token', 'mock-user-token');
                alert('Login successful! Welcome back.');
                navigate('/problems');
            } else if (credentials.email && credentials.password) {
                // Fallback: Still allow any random input to pass for easy development
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('token', 'mock-user-token');
                alert('Login successful with custom testing account!');
                navigate('/problems');
            } else {
                setError('Please fill in all fields.');
            }
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                </div>

                {/* 🎛️ Dynamic Role Selection Tabs */}
                <div className="role-selector-tabs">
                    <button 
                        type="button"
                        className={`role-tab ${role === 'user' ? 'active' : ''}`}
                        onClick={() => { setRole('user'); setError(''); }}
                    >
                        <FaUser size={12} /> User
                    </button>
                    <button 
                        type="button"
                        className={`role-tab ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => { setRole('admin'); setError(''); }}
                    >
                        <FaUserShield size={13} /> Admin
                    </button>
                </div>

                <h2 className="auth-title">
                    {role === 'admin' ? 'Admin Workspace Sign In' : 'Welcome Back'}
                </h2>
                <p className="auth-subtitle">
                    {role === 'admin' 
                        ? 'Access the central engine to manage problems and test suites.' 
                        : 'Log in to your account to resume training and track standings.'}
                </p>

                {error && <div className="auth-error-banner">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="input-group">
                        <label>{role === 'admin' ? 'Admin Email' : 'Email Address'}</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder={role === 'admin' ? 'admin@codearena.com' : 'you@example.com'}
                            value={credentials.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>Password</label>
                            {/* 💡 Routes instantly to matching dynamic recovery layout */}
                            <Link to="/forgotpassword" id="forgot-link">
                                Forgot Password?
                            </Link>
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
                        {role === 'admin' ? 'Enter Panel' : 'Sign In'}
                    </button>
                </form>

                {role === 'user' && (
                    <div className="auth-footer-prompt">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;