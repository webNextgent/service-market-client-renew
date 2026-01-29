import CassieModal from "../components/CassieModal/CassieModal";
import LoginModal from "../components/LoginModal/LoginModal";
import { useSummary } from "../provider/SummaryProvider";

const AppLayout = ({ children }) => {
    const { loginModalOpen, setLoginModalOpen, cassieModalOpen, setCassieModalOpen } = useSummary();

    return (
        <>
            {children}

            <LoginModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
            />

            <CassieModal
                open={cassieModalOpen}
                onClose={() => setCassieModalOpen(false)}
            />
        </>
    );
};

export default AppLayout;