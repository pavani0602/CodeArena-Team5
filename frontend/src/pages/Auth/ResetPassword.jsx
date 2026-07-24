import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import '../Admin/AuthStyles.css';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (newPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        // Here you would normally send the token and new password to your backend
        console.log('Password reset successfully with token:', token);
        setSubmitted(true);
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">CodeArena</span>
                </div>

                {errorMessage && (
                    <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}

                {!submitted ? (
                    <>
                        <h2 className="auth-title">Create New Password</h2>
                        <p className="auth-subtitle">
                            Enter a secure new password for your CodeArena account.
                        </p>

                        <form onSubmit={handlePasswordReset} className="auth-form">
                            <div className="input-group">
                                <label>New Password</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '0 12px' }}>
                                    <FaLock color="#94a3b8" size={14} style={{ marginRight: '8px' }} />
                                    <input 
                                        type="password" 
                                        required 
                                        placeholder="At least 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ background: 'transparent', border: 'none', color: '#fff', padding: '10px 0', width: '100%', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Confirm New Password</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '0 12px' }}>
                                    <FaLock color="#94a3b8" size={14} style={{ marginRight: '8px' }} />
                                    <input 
                                        type="password" 
                                        required 
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ background: 'transparent', border: 'none', color: '#fff', padding: '10px 0', width: '100%', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-submit-btn">
                                Reset Password
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="auth-success-view" style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ color: '#10b981', fontSize: '2.5rem', marginBottom: '12px' }}>
                            <FaCheckCircle />
                        </div>
                        <h2 className="auth-title">Password Reset!</h2>
                        <p className="auth-subtitle" style={{ marginBottom: '20px' }}>
                            Your password has been changed successfully. You can now log in with your new credentials.
                        </p>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="auth-submit-btn" 
                            style={{ width: '100%', border: 'none', cursor: 'pointer' }}
                        >
                            Sign In Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;