import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function MainLayout() {
    return (
        <>
            {/* <header>Navbar Placeholder</header> */}
            <Navbar />

            <Outlet />

            <Footer />
        </>
    )
}

export default MainLayout;