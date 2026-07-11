import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import AdminForgotPassword from "./pages/Admin/AdminForgotPassword";
import AdminLogin from "./pages/Admin/AdminLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
import Discussion from "./pages/Discussion/Discussion";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Home from "./pages/Home/Home";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Login from "./pages/Login/Login";
import MainLayout from "./layouts/MainLayout";
import ProblemDetails from "./pages/ProblemDetails/ProblemDetails";
import Problems from "./pages/Problems/Problems";
import PublicLayout from "./layouts/PublicLayout";
import Register from "./pages/Register/Register";
import Standalone from "./layouts/Standalone";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/problemDetails" element={<ProblemDetails />} />
          <Route path="/problemDetails/:id" element={<ProblemDetails />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/discussion" element={<Discussion />} />
        </Route>
        <Route element={<Standalone />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
