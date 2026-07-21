import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";
import Standalone from "./layouts/Standalone";

// Pages
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Problems from "./pages/Problems/Problems";
import ProblemDetails from "./pages/ProblemDetails/ProblemDetails";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Discussion from "./pages/Discussion/Discussion";

// Auth Pages (Unified Login handles both Admin & User)
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

// Admin Workspace Dashboard
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Main Protected Layout --- */}
        <Route element={<MainLayout />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* --- Public Brand Layout --- */}
        <Route element={<PublicLayout />} >
          <Route path="/" element={<Home />} />
          <Route path="/discussion" element={<Discussion />} />
        </Route>

        {/* --- Standalone Layout (Auth & Focused Views) --- */}
        <Route element={<Standalone />} >
          {/* Unified Login & Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          
          {/* Problem Workspace details */}
          <Route path="/problems/:id" element={<ProblemDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;