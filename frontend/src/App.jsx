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

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route element={<MainLayout />} >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/problemDetails" element={<ProblemDetails />} />
    </Route>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;

