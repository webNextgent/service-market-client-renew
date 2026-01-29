import { useState } from "react";
import { FaWallet } from "react-icons/fa";

export default function MyWallet() {
    const [activeTab, setActiveTab] = useState("active");

    return (
        <div className="w-full max-w-5xl mx-auto bg-white border border-[#E5E7EB] rounded-md p-5 md:p-8">

            {/* Header */}
            <h2 className="text-xl font-semibold text-[#5D4F52] flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
                <FaWallet className="text-[#01788E]" /> My Wallet
            </h2>

            {/* Wallet Balance */}
            <div className="mt-6 flex flex-col items-center text-center">
                <p className="text-[22px] font-semibold text-[#5D4F52]">Total Wallet Balance</p>

                <span className="bg-[#F46A2A] text-white text-sm px-3 py-1 rounded-md font-semibold mt-3">
                    Ð0
                </span>

                <p className="mt-5 text-gray-600 max-w-xl">
                    Your wallet amount is automatically deducted from your next booking charges.
                </p>

                <p className="mt-4 text-gray-600">
                    Have a gift card? Redeem it{" "}
                    <button className="text-[#01788E] font-medium underline-offset-2 hover:underline">
                        here
                    </button>.
                </p>

                {/* Toggle Tabs */}
                <div className="mt-8 flex items-center justify-center">
                    <div className="bg-[#E7EAEE] rounded-full flex p-1 w-64 justify-between">
                        <button
                            className={`w-1/2 py-2 rounded-full font-medium transition text-sm ${activeTab === "active"
                                    ? "bg-white shadow-sm text-[#5D4F52]"
                                    : "text-[#5D4F52]"
                                }`}
                            onClick={() => setActiveTab("active")}
                        >
                            Active
                        </button>

                        <button
                            className={`w-1/2 py-2 rounded-full font-medium transition text-sm ${activeTab === "used"
                                    ? "bg-white shadow-sm text-[#5D4F52]"
                                    : "text-[#5D4F52]"
                                }`}
                            onClick={() => setActiveTab("used")}
                        >
                            Used
                        </button>
                    </div>
                </div>

                {/* Value Display */}
                <div className="mt-6 text-[#01788E] font-semibold text-lg">
                    Ð0
                </div>

                {/* Content Box */}
                <div className="w-full max-w-3xl mx-auto mt-6">

                    {/* ACTIVE TAB CONTENT */}
                    {activeTab === "active" && (
                        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm">
                            <p className="text-[15px] text-[#5D4F52] mb-1">Your Vouchers</p>

                            <div className="border border-[#E5E7EB] rounded-lg p-4 mt-2 flex justify-between items-center">
                                <div>
                                    <p className="text-gray-600 text-sm">November 18, 2025</p>
                                    <p className="text-gray-500 text-xs mt-1">20251118001581MPDXB</p>
                                </div>

                                <p className="text-[#01788E] font-semibold">- Ð 30</p>
                            </div>
                        </div>
                    )}

                    {/* USED TAB CONTENT */}
                    {activeTab === "used" && (
                        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm text-center">
                            <p className="text-gray-500">No used vouchers.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}