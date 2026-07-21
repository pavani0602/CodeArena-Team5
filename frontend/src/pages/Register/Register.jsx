import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import { GoogleLogin } from '@react-oauth/google'; 
import { registerUser } from "/src/services/authService.js";
import '../../pages/Admin/AuthStyles.css';

function RocketAnimation({ animationData }) {
    const options = {
        animationData: animationData,
        loop: true,
        autoplay: true,
    };
    const { View } = useLottie(options);
    
    return (
        <div style={{ width: '70px', height: '70px', margin: '0 auto 10px auto' }}>
            {View}
        </div>
    );
}

function Register() {
    const navigate = useNavigate();
    const [animationData, setAnimationData] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch('/rocket.json')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load rocket.json');
                return res.json();
            })
            .then((data) => setAnimationData(data))
            .catch((err) => console.error('Error loading Lottie animation:', err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the service layer
            await registerUser({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            alert('Account created successfully! Check your inbox for a welcome email.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to create account.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window.atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            
            const googleUser = JSON.parse(jsonPayload);
            
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                username: googleUser.name,
                email: googleUser.email,
                picture: googleUser.picture
            }));

            alert(`Welcome to CodeArena, ${googleUser.name}! 🚀`);
            navigate('/problems');

        } catch (error) {
            console.error("Error parsing Google credentials:", error);
            setError("Google registration succeeded, but profile parsing failed.");
        }
    };

    const handleGoogleFailure = () => {
        setError("Google Sign-Up failed. Please try again.");
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header" style={{ marginBottom: '12px', textAlign: 'center' }}>
                    <span className="auth-logo">CodeArena</span>
                </div>

                {animationData && <RocketAnimation animationData={animationData} />}

                <h2 className="auth-title">Create Your Account</h2>
                <p className="auth-subtitle">Join CodeArena and start solving coding challenges today.</p>

                {error && <div className="auth-error-banner">{error}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            required 
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            required 
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            required 
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="divider-line">
                    <span>or continue with</span>
                </div>

                <div className="google-auth-box">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        theme="outline"
                        shape="pill"
                        type="standard"
                        size="large"
                        width="350"
                        useOneTap={false}
                    />
                </div>

                <div className="auth-footer-prompt" style={{ marginTop: '16px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: '#10b981' }}>Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;