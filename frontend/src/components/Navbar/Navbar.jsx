import "./Navbar.css";
import { Link } from 'react-router-dom';
// import logo from "../../assets/logo.png";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="left">
                {/* <img src={logo} alt="CodeArena Logo" />
                 */}
                <h2>CodeArena</h2>
            </div>
            <div className="middle">
                {/* Use Link instead of empty anchor tags */}
                <Link to="/problems">Problems</Link>
                <Link to="/leaderboard">Leaderboard</Link>
                <Link to="/discussion">Discussion</Link>
                {/* <Link to="/admin">Admin</Link> */}
            </div>
            <div className="right">
                <Link to="/login">
                    <button>Login or Signup</button>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
