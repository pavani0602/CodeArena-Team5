import "./App.css";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import Dashboard from "./pages/Dashboard/Dashboard";
import Discussion from "./pages/Discussion/Discussion";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Home from "./pages/Home/Home";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Login from "./pages/Login/Login";
import MainLayout from "./layouts/MainLayout";
import ProblemDetails from "./pages/ProblemDetails/ProblemDetails";
import Problems from "./pages/Problems/Problems";
import ProtectedRoute from "./layouts/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import Register from "./pages/Register/Register";
import Standalone from "./layouts/Standalone";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/discussion" element={<Discussion />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/problemDetails" element={<ProblemDetails />} />
            <Route path="/problemDetails/:id" element={<ProblemDetails />} />
          </Route>
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<Standalone />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/admin/forgot-password" element={<Navigate to="/forgotpassword" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
