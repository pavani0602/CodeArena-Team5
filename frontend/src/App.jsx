import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";
import Standalone from "./layouts/Standalone";
import ProtectedRoute from "./routes/ProtectedRoute"; // 🛡️ Import your new protection layout

// Pages
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Problems from "./pages/Problems/Problems";
import ProblemDetails from "./pages/ProblemDetails/ProblemDetails";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Discussion from "./pages/Discussion/Discussion";

// Auth Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Admin Workspace Dashboard
import Admin from "./pages/Admin/Admin";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Main Protected Layout (Guarded for logged-in users) --- */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* 🛡️ Strictly Guard Admin Route for Admins Only */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/analytics" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminAnalytics />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* --- Public Brand Layout --- */}
        <Route element={<PublicLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/discussion" element={<Discussion />} />
        </Route>

        {/* --- Standalone Layout (Auth & Focused Views) --- */}
        <Route element={<Standalone />} >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/problems/:id" element={<ProblemDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;