import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem("token");

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
