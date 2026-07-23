import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');

    // 1. If not logged in, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. If a specific role is required (like 'admin'), check if it matches
    if (allowedRole && userRole !== allowedRole) {
        return <Navigate to="/problems" replace />;
    }

    return children;
}

export default ProtectedRoute;