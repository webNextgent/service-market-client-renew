import { useLocation, useNavigate } from "react-router-dom";
import { steps } from "./FlowSteps";
import useAuth from "../../hooks/useAuth";
import { useSummary } from "../../provider/SummaryProvider";

const NextBtn = ({ name = "Next", disabled, onClick }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { pathname } = useLocation();
    const currentIndex = steps.indexOf(pathname);
    let nextPath = steps[currentIndex + 1];
    let isDisabled = disabled ?? false;
    const { setLoginModalOpen } = useSummary();


    const handleClick = async () => {
        if (user === null) {
            setLoginModalOpen(true);
            return;
        }

        let shouldNavigate = true;
        if (onClick) {
            try {
                const result = await onClick();
                if (result === false) {
                    shouldNavigate = false;
                }
            } catch (error) {
                console.error("Error in onClick handler:", error);
                shouldNavigate = false;
            }
        }
        if (shouldNavigate && nextPath) {
            navigate(nextPath);
        }
    };

    return (
        <div className="flex justify-center">
            <button
                onClick={handleClick}
                disabled={isDisabled}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-semibold text-white w-[90%] md:w-[60%] lg:w-60
            ${isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#ED6329] hover:bg-[#d4541f] cursor-pointer"}`}
            >
                {name} <span className="text-xl">→</span>
            </button>
        </div>

    );
};

export default NextBtn;