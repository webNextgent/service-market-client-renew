import { Outlet } from "react-router-dom";
import Navbar from "../routes/pages/shared/Navbar/Navbar";
import Footer from "../routes/pages/shared/Footer/Footer";

const Main = () => {
    return (
        <div className="mx-auto bg-white text-gray-600">
            <Navbar></Navbar>
            <div className="max-w-[1000px] mx-auto">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;