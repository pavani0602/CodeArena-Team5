import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaUserShield } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

import '../../pages/Admin/AuthStyles.css';
import './Login.css';

function Login() {
    const navigate = useNavigate();

    const [role, setRole] = useState('user');
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    /* ================================
       INPUT CHANGE
    ================================ */

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    /* ================================
       NORMAL LOGIN
    ================================ */

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        /* ADMIN LOGIN */

        if (role === 'admin') {
            if (
                credentials.email === 'admin@codearena.com' &&
                credentials.password === 'admin123'
            ) {
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('token', 'mock-admin-token');
                localStorage.setItem('userEmail', credentials.email);

                alert('Welcome to the Admin Workspace!');
                navigate('/admin');
            } else {
                setError('Invalid Admin credentials.');
            }
        }

        /* USER LOGIN */

        else {
            if (
                credentials.email === 'user@codearena.com' &&
                credentials.password === 'user123'
            ) {
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('token', 'mock-user-token');
                localStorage.setItem('userEmail', credentials.email);

                alert('Login successful! Welcome back.');
                navigate('/problems');
            }

            /* CUSTOM TEST ACCOUNT */

            else if (credentials.email && credentials.password) {
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('token', 'mock-user-token');
                localStorage.setItem('userEmail', credentials.email);

                alert('Login successful with custom testing account!');
                navigate('/problems');
            } else {
                setError('Please fill in all fields.');
            }
        }
    };

    /* ================================
       GOOGLE LOGIN
    ================================ */

    const handleGoogleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            const jsonPayload = decodeURIComponent(
                window
                    .atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const googleUser = JSON.parse(jsonPayload);

            localStorage.setItem('userRole', 'user');
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', googleUser.email);
            localStorage.setItem(
                'user',
                JSON.stringify({
                    username: googleUser.name,
                    email: googleUser.email,
                    picture: googleUser.picture
                })
            );

            alert(`Welcome back, ${googleUser.name}!`);
            navigate('/problems');
        } catch (error) {
            console.error('Error parsing Google credentials:', error);
            setError('Google Authentication succeeded, but profile parsing failed.');
        }
    };

    /* ================================
       GOOGLE LOGIN FAILURE
    ================================ */

    const handleGoogleFailure = () => {
        setError('Google Login failed. Please try again.');
    };

    /* ================================
       UI
    ================================ */

    return (
        <div className="auth-page-container">
            {/* =================================
                LEFT SIDE - STANDING AVATAR & SPEECH BUBBLE
            ================================= */}

            <div className="avatar-section">

                {/* Standing Avatar */}
                <img
                    src="/avatar.png"
                    alt="CodeArena avatar"
                    className="standing-avatar"
                />
            </div>

            {/* =================================
                RIGHT SIDE - LOGIN CARD
            ================================= */}

            <div className="auth-card">
                {/* Logo */}
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                </div>

                {/* =================================
                    USER / ADMIN TABS
                ================================= */}

                <div className="role-selector-tabs">
                    <button
                        type="button"
                        className={`role-tab ${role === 'user' ? 'active' : ''}`}
                        onClick={() => {
                            setRole('user');
                            setError('');
                        }}
                    >
                        <FaUser size={12} />
                        User
                    </button>

                    <button
                        type="button"
                        className={`role-tab ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => {
                            setRole('admin');
                            setError('');
                        }}
                    >
                        <FaUserShield size={13} />
                        Admin
                    </button>
                </div>

                {/* =================================
                    TITLE
                ================================= */}

                <h2 className="auth-title">
                    {role === 'admin' ? 'Admin Workspace Sign In' : 'Welcome Back'}
                </h2>

                {/* =================================
                    SUBTITLE
                ================================= */}

                <p className="auth-subtitle">
                    {role === 'admin'
                        ? 'Access the central engine to manage problems and test suites.'
                        : 'Log in to your account to resume training and track standings.'}
                </p>

                {/* =================================
                    ERROR
                ================================= */}

                {error && <div className="auth-error-banner">{error}</div>}

                {/* =================================
                    LOGIN FORM
                ================================= */}

                <form onSubmit={handleLogin} className="auth-form">
                    {/* EMAIL */}
                    <div className="input-group">
                        <label>
                            {role === 'admin' ? 'Admin Email' : 'Email Address'}
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder={
                                role === 'admin'
                                    ? 'admin@codearena.com'
                                    : 'you@example.com'
                            }
                            value={credentials.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-group">
                        <div className="label-row">
                            <label>Password</label>
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

                    {/* LOGIN BUTTON */}
                    <button type="submit" className="auth-submit-btn">
                        {role === 'admin' ? 'Enter Panel' : 'Sign In'}
                    </button>
                </form>

                {/* =================================
                    GOOGLE LOGIN
                ================================= */}

                {role === 'user' && (
                    <>
                        <div className="divider-line">
                            <span>or continue with</span>
                        </div>

                        <div className="google-auth-box">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                                theme="dark"
                                shape="pill"
                                text="signin_with"
                                width="100%"
                            />
                        </div>

                        {/* REGISTER PROMPT */}
                        <div className="auth-footer-prompt">
                            Don't have an account?{' '}
                            <Link to="/register">Create one</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;