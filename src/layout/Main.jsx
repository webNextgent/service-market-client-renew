import { Outlet } from "react-router-dom";
import Navbar from "../routes/pages/shared/Navbar/Navbar";
import Footer from "../routes/pages/shared/Footer/Footer";
import LoginModal from "../components/LoginModal/LoginModal";
import CassieModal from "../components/CassieModal/CassieModal";
import { useSummary } from "../provider/SummaryProvider";

const Main = () => {
    const { loginModalOpen, setLoginModalOpen, cassieModalOpen, setCassieModalOpen } = useSummary();

    return (
        <div className="mx-auto bg-white text-gray-600">
            <Navbar></Navbar>
            <div className="max-w-[1000px] mx-auto">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>

            <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />

            <CassieModal
                open={cassieModalOpen}
                onClose={() => setCassieModalOpen(false)}
            />
        </div>
    );
};

export default Main;