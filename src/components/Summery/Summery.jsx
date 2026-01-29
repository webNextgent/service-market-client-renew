import { useRef } from "react";
import dirhum from "../../assets/icon/dirhum.png";
import { useItem } from "../../provider/ItemProvider";
import { useSummary } from "../../provider/SummaryProvider";
import toast from "react-hot-toast";

export default function Summary({ itemSummary, showInput, setShowInput, address, date, time, serviceTitle, liveAddress, open, setOpen }) {
    const { servicePrice, subTotal, vat, totalAfterDiscount, useDiscount, handleApply } = useSummary();
    const promoInputRefDesktop = useRef(null);
    const promoInputRefMobile = useRef(null);
    const scrollContainerRef = useRef(null);
    const { removeItem } = useItem();

    const displayAddress =
        liveAddress?.displayAddress ||
        address ||
        "";

    const handleApplyPromo = async () => {
        const promoCode =
            promoInputRefDesktop.current?.value ||
            promoInputRefMobile.current?.value;

        console.log(promoCode);

        if (!promoCode) {
            toast.error("No promo code entered");
            return;
        }
        await handleApply(promoCode.trim());
    };


    return (
        <>
            {/* DESKTOP SUMMARY - DYNAMIC HEIGHT WITH STICKY */}
            <div className="hidden lg:block lg:w-[380px] xl:w-[420px] md:mb-2">
                <div className="sticky top-14">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Header - Always Visible */}
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{itemSummary.length} item{itemSummary.length !== 1 ? 's' : ''}</p>
                        </div>

                        {/* Scrollable Content - Dynamic Height */}
                        <div
                            ref={scrollContainerRef}
                            className="overflow-y-auto"
                            style={{
                                maxHeight: 'calc(100vh - 180px)',
                                minHeight: '200px',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#CBD5E0 #F7FAFC'
                            }}
                        >
                            <style jsx>{`
                                div::-webkit-scrollbar {
                                    width: 6px;
                                }
                                div::-webkit-scrollbar-track {
                                    background: #F7FAFC;
                                    border-radius: 3px;
                                }
                                div::-webkit-scrollbar-thumb {
                                    background: #CBD5E0;
                                    border-radius: 3px;
                                }
                                div::-webkit-scrollbar-thumb:hover {
                                    background: #A0AEC0;
                                }
                            `}</style>

                            <div className="p-4 space-y-4">
                                {/* Service Details */}
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Services</h3>
                                    <div className="space-y-2">
                                        {itemSummary.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-2 flex-1">
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-[10px] mt-0.5 shrink-0"
                                                        >
                                                            ✕
                                                        </button>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-800 text-sm truncate">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{serviceTitle[index]}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 font-semibold text-gray-800 shrink-0 ml-2">
                                                        <img src={dirhum} alt="" className="w-3.5 h-3.5" />
                                                        <span className="text-sm">{item.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Date & Time */}
                                {(date || time) && (
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Schedule</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {date && (
                                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                    <p className="text-[10px] text-gray-500 mb-0.5">Date</p>
                                                    <p className="font-medium text-gray-800 text-sm truncate">{date}</p>
                                                </div>
                                            )}
                                            {time && (
                                                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                                    <p className="text-[10px] text-gray-500 mb-0.5">Time</p>
                                                    <p className="font-medium text-gray-800 text-sm truncate">{time}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Address */}
                                {displayAddress && (
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">
                                            Address
                                        </h3>

                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <p className="text-sm text-gray-800 leading-relaxed">
                                                {displayAddress}
                                            </p>
                                        </div>
                                    </div>
                                )}


                                {/* Discount Section */}
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Promo Code</h3>
                                    {!showInput ? (
                                        <button
                                            onClick={() => setShowInput(true)}
                                            className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#01788E] hover:text-[#01788E] transition-colors text-sm"
                                        >
                                            + Add Promo Code
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                ref={promoInputRefDesktop}
                                                placeholder="Enter promo code"
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#01788E] focus:border-transparent outline-none"
                                            />
                                            <button
                                                onClick={handleApplyPromo}
                                                className="bg-[#01788E] text-white px-4 py-2 rounded-lg hover:bg-[#016a7a] transition-colors text-sm"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wider">Price Details</h3>

                                    <div className="space-y-2 mb-3">

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Service Charge</span>
                                            <span className="flex items-center gap-1 font-medium text-sm">
                                                <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                                {servicePrice}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Subtotal</span>
                                            <span className="flex items-center gap-1 font-medium text-sm">
                                                <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                                {subTotal}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">VAT (5%)</span>
                                            <span className="flex items-center gap-1 font-medium text-sm">
                                                <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                                {vat.toFixed(2)}
                                            </span>
                                        </div>

                                        {/*  DISCOUNT ROW */}
                                        {useDiscount > 0 && (
                                            <div className="flex justify-between items-center text-green-600">
                                                <span className="text-sm">Discount</span>
                                                <span className="flex items-center gap-1 font-medium text-sm">
                                                    <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                                    -{useDiscount.toFixed(2)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-300 my-3"></div>

                                    {/* Total Amount */}
                                    <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">Total Amount</p>
                                            <p className="text-xs text-gray-500">Including all charges</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <img src={dirhum} className="w-5 h-5" alt="currency" />
                                            <span className="text-xl font-bold text-gray-800">
                                                {totalAfterDiscount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BACKDROP FOR MOBILE */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* MOBILE EXPANDED VIEW */}
            <div
                className={`lg:hidden fixed left-0 w-full bg-white z-60 transition-all duration-300 ease-in-out flex flex-col
                    ${open ? "bottom-0" : "-bottom-full"}`}
                style={{
                    maxHeight: '85vh',
                    height: '60vh',
                    top: 'auto'
                }}
            >
                {/* Header Drag Handle */}
                <div className="flex justify-center pt-2 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{itemSummary.length} item{itemSummary.length !== 1 ? 's' : ''}</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-xl text-gray-500">×</span>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div
                    className="flex-1 overflow-y-auto p-4"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#CBD5E0 #F7FAFC'
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            width: 4px;
                        }
                        div::-webkit-scrollbar-track {
                            background: #F7FAFC;
                            border-radius: 2px;
                        }
                        div::-webkit-scrollbar-thumb {
                            background: #CBD5E0;
                            border-radius: 2px;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                            background: #A0AEC0;
                        }
                    `}</style>

                    <div className="space-y-4">
                        {/* Service Items */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Services</h3>
                            <div className="space-y-2">
                                {itemSummary.map((item, index) => (
                                    <div key={item.id} className="flex items-start justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-5 h-5 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-[10px] shrink-0"
                                                >
                                                    ✕
                                                </button>
                                                <span className="font-medium text-gray-800 text-sm truncate">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 ml-7 truncate">{serviceTitle[index]}</p>
                                        </div>
                                        <div className="flex items-center gap-1 font-semibold text-gray-800 shrink-0 ml-2">
                                            <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                            <span className="text-sm">{item.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date & Time */}
                        {(date || time) && (
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Schedule</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {date && (
                                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Date</p>
                                            <p className="font-medium text-gray-800 text-sm truncate">{date}</p>
                                        </div>
                                    )}
                                    {time && (
                                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                            <p className="text-[10px] text-gray-500 mb-0.5">Time</p>
                                            <p className="font-medium text-gray-800 text-sm truncate">{time}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Address */}
                        {displayAddress && (
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">
                                    Address
                                </h3>

                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        {displayAddress}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ✅ MOBILE PROMO CODE SECTION */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Promo Code</h3>
                            {!showInput ? (
                                <button
                                    onClick={() => setShowInput(true)}
                                    className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#01788E] hover:text-[#01788E] transition-colors text-sm"
                                >
                                    + Add Promo Code
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        ref={promoInputRefMobile}
                                        placeholder="Enter promo code"
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#01788E] focus:border-transparent outline-none"
                                    />
                                    <button
                                        onClick={handleApplyPromo}
                                        className="bg-[#01788E] text-white px-4 py-2 rounded-lg hover:bg-[#016a7a] transition-colors text-sm"
                                    >
                                        Apply
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Charges Breakdown */}
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Price Details</h3>
                            <div className="space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-200">

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Service Charge</span>
                                    <span className="flex items-center gap-1 font-medium text-sm">
                                        <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                        {servicePrice}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="flex items-center gap-1 font-medium text-sm">
                                        <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                        {subTotal}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">VAT (5%)</span>
                                    <span className="flex items-center gap-1 font-medium text-sm">
                                        <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                        {vat.toFixed(2)}
                                    </span>
                                </div>

                                {/* MOBILE DISCOUNT ROW */}
                                {useDiscount > 0 && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span className="text-sm">Discount</span>
                                        <span className="flex items-center gap-1 font-medium text-sm">
                                            <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />
                                            -{useDiscount.toFixed(2)}%
                                        </span>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-2"></div>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-semibold text-gray-800">Total Amount</span>
                                    <span className="flex items-center gap-1 font-bold text-lg text-gray-800">
                                        <img src={dirhum} className="w-4.5 h-4.5" alt="currency" />
                                        {totalAfterDiscount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};