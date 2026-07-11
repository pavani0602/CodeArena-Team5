import "./App.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from "./pages/Admin/Admin";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Login from "./pages/Login/Login";
import ProblemDetails from "./pages/ProblemDetails/ProblemDetails";
import Problems from "./pages/Problems/Problems";
import Register from "./pages/Register/Register";
import MainLayout from "./layouts/MainLayout";
import Discussion from "./pages/Discussion/Discussion";
import PublicLayout from "./layouts/PublicLayout";
import Standalone from "./layouts/Standalone";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route element={<MainLayout />} >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Admin />} />
    </Route>
    <Route element={<PublicLayout />} >
        <Route path="/" element={<Home />} />
        <Route path="/discussion" element={<Discussion />} />
    </Route>
    <Route element={<Standalone />} >
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/login/forgotpassword" element={<ForgotPassword />} />
      <Route path="/problems/:id" element={<ProblemDetails />} />
    </Route>
  </Routes>
</BrowserRouter>
  );
}

export default App;

