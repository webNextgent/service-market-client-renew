import { useState } from "react";
import { X } from "lucide-react";
import logo from "../../../assets/logo/logo.png";
import { Link } from "react-router-dom";

const BookingSuccess = () => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    return (
        <div className=" bg-white flex flex-col items-center md:my-12 px-4 my-12">

            {/* TOP LOGO */}
            <div className="flex justify-center mb-4 w-30 h-10">
                <img src={logo} alt="Logo" className="h-10" />
            </div>

            {/* TITLE */}
            <h1 className="text-2xl font-semibold mb-8 text-gray-700">
                You're all set!
            </h1>

            {/* CONFIRMATION CARD */}
            <div
                className="w-full max-w-xl bg-white shadow-md rounded-xl p-5 mb-6 flex items-center justify-between cursor-pointer"
                onClick={() => setOpen(true)}
            >
                <div>
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                        Booking confirmed
                        <span className="text-green-600 text-lg">✔</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Your booking is confirmed and will be delivered as per the booked date and time
                    </p>
                </div>

                <div className="text-gray-400 text-2xl">›</div>
            </div>

            {/* DIVIDER */}
            <div className="w-full max-w-xl border-t border-gray-300 my-4"></div>

            {/* WHAT HAPPENS NEXT */}
            <div className="w-full max-w-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    What happens next?
                </h3>

                <ul className="text-gray-600 text-sm space-y-3">
                    <li className="list-disc ml-5">
                        Final amount will be charged on your preferred payment method once service is completed.
                    </li>

                    <li className="list-disc ml-5">
                        You can cancel for free up to 6 hours before the service start time.
                        Cancellation charges apply for cancellations within 6 hours of the service start time
                        (<a href="#" className="text-[#007C92] underline">Cancellation policy</a>).
                    </li>
                </ul>

                <div className="text-center border-red-600 mt-8">
                    <Link to='/dashboard/booking' className="text-[#007C92] underline font-semibold text-sm cursor-pointer">
                        MANAGE BOOKING
                    </Link>
                </div>
            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-6 relative animate-fadeIn">

                        {/* CLOSE BUTTON */}
                        <button
                            className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-200"
                            onClick={handleClose}
                        >
                            <X size={20} />
                        </button>

                        {/* MODAL TITLE */}
                        <h2 className="text-center text-xl font-semibold mt-2 mb-6">
                            Booking Status
                        </h2>

                        <div className="relative pl-12">

                            {/* VERTICAL LINE */}
                            <div className="absolute top-2 left-5 w-0.5 h-[88%] bg-gray-200"></div>

                            {/* STEP 1 */}
                            <div className="relative mb-8">
                                <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#007C92] flex items-center justify-center text-white border-4 border-white">
                                    ✓
                                </div>

                                <h3 className="font-semibold text-gray-800">Booking requested</h3>
                                <p className="text-gray-500 text-sm">
                                    Your booking has been received. Please wait for confirmation from a service provider.
                                </p>
                            </div>

                            {/* STEP 2 */}
                            <div className="relative mb-8">
                                <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#007C92] flex items-center justify-center text-white border-4 border-white">
                                    ✓
                                </div>

                                <h3 className="font-semibold text-gray-800">Booking confirmed</h3>
                                <p className="text-gray-500 text-sm">
                                    Your booking is confirmed and will be delivered as per the booked date and time
                                </p>
                            </div>

                            {/* STEP 3 */}
                            <div className="relative mb-4">
                                <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-white border-2 border-[#007C92]"></div>

                                <h3 className="font-semibold text-gray-800">Booking delivered</h3>
                                <p className="text-gray-500 text-sm">
                                    Your booking has been completed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingSuccess;