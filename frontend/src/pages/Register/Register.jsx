import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Imported Google OAuth component
import '../../pages/Admin/AuthStyles.css'; // Reusing your beautiful central auth styles

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

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

        // Simulate successful registration
        console.log("Registering user:", formData);
        alert('Account created successfully!');
        navigate('/login');
    };

    // --- GOOGLE SIGN-UP SUCCESS HANDLER ---
    const handleGoogleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential; // Secure JWT from Google
        
        try {
            // Decode the JWT payload locally to extract user profile info
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                window.atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            
            const googleUser = JSON.parse(jsonPayload);
            
            // Simulating successful registration/login storage
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                username: googleUser.name,
                email: googleUser.email,
                picture: googleUser.picture
            }));

            /* 
              ============================================================
              FUTURE BACKEND INTEGRATION (When your teammate connects Spring Boot):
              ============================================================
              You'll send this token to their endpoint instead of handling it locally:

              const response = await fetch('http://localhost:8080/api/auth/google-signup', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ idToken: token })
              });

              if (response.ok) {
                  const data = await response.json();
                  localStorage.setItem('token', data.jwtToken);
                  localStorage.setItem('user', JSON.stringify(data.user));
                  navigate('/problems');
              }
              ============================================================
            */

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

                <h2 className="auth-title">Create Your Account 🚀</h2>
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

                    <button type="submit" className="auth-submit-btn">
                        Create Account
                    </button>
                </form>

                {/* --- GOOGLE OAUTH SIGN-UP SECTION --- */}
                <div className="divider-line">
                    <span>or sign up with</span>
                </div>

                <div className="google-auth-box">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        theme="dark"
                        shape="pill"
                        text="signup_with" // Displays: "Sign up with Google"
                        width="100%"
                    />
                </div>

                <div className="auth-footer-prompt">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;