import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

function MainLayout() {
    return (
        <>
            {/* <header>Navbar Placeholder</header> */}
            <Navbar />

            <Outlet />

            <footer>Footer Placeholder</footer>
        </>
    )
}

export default MainLayout;