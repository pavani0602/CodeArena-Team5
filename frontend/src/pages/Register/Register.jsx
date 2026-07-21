import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import LottieComponent from 'lottie-react';
import '../../pages/Admin/AuthStyles.css';

// Safety check for Vite/ESM default import resolution
const Lottie = LottieComponent.default || LottieComponent;

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

    // Fetch local json file from public/rocket.json
    useEffect(() => {
        fetch('/rocket.json')
            .then((res) => {
                if (!res.ok) throw new Error("Local rocket.json not found in public/");
                return res.json();
            })
            .then((data) => setAnimationData(data))
            .catch((err) => console.error("Error loading Lottie animation:", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        console.log("Registering user:", formData);
        alert('Account created successfully!');
        navigate('/login');
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
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                </div>

                {/* --- LOTTIE ANIMATION --- */}
                {animationData && (
                    <div style={{ width: '100px', height: '100px', margin: '0 auto 12px auto' }}>
                        <Lottie 
                            animationData={animationData} 
                            loop={true} 
                            autoplay={true} 
                        />
                    </div>
                )}

                <h2 className="auth-title">Create Your Account</h2>
                <p className="auth-subtitle">Join CodeArena and start solving coding challenges today.</p>

                {error && <div className="auth-error-banner">{error}</div>}

                {/* --- REGISTRATION FORM --- */}
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

                    <button type="submit" className="auth-submit-btn">
                        Create Account
                    </button>
                </form>

                {/* --- DIVIDER --- */}
                <div className="divider-line">
                    <span>or sign up with</span>
                </div>

                {/* --- GOOGLE LOGIN BUTTON --- */}
                <div 
                    className="google-auth-box" 
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        width: '100%', 
                        marginTop: '12px' 
                    }}
                >
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        theme="outline"
                        shape="pill"
                        type="standard"
                        size="large"
                        width="300"
                        useOneTap={false}
                    />
                </div>

                {/* --- FOOTER --- */}
                <div className="auth-footer-prompt" style={{ marginTop: '16px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: '#10b981' }}>Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;