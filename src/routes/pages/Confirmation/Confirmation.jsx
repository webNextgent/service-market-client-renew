import { useRef, useState } from "react";
import NextBtn from "../../../components/NextBtn/NextBtn";
import ServiceDetails from "../../../components/ServiceDetails/ServiceDetails";
import { GoCreditCard } from "react-icons/go";
import { MdKeyboardArrowRight } from "react-icons/md";
import { PiMoneyWavy } from "react-icons/pi";
import { IoBagRemoveSharp, IoLocation } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { useSummary } from "../../../provider/SummaryProvider";
import dirhum from '../../../assets/icon/dirhum.png';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


export default function Confirmation() {
    const [openModal, setOpenModal] = useState(false);
    const { serviceCharge, subTotal, services, vat, date, time, mapLongitude, mapLatitude, liveAddress, itemSummary, useDiscount, servicePrice, promoStatus, showInput, setShowInput, handleApply, totalAfterDiscount } = useSummary();
    const axiosSecure = useAxiosSecure();

    const promoInputRef = useRef();
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const ides = itemSummary.map(p => p.id);
    const { user } = useAuth();

    const getDisplayAddress = () => {
        if (!liveAddress) return null;

        if (liveAddress.displayAddress) {
            return liveAddress.displayAddress;
        }

        switch (liveAddress.type) {
            case "Apartment":
            case "Office":
                return `${liveAddress.apartmentNo || ''} - ${liveAddress.buildingName || ''} - ${liveAddress.area || ''} - ${liveAddress.city || ''}`;

            case "Villa":
                return `${liveAddress.villaNo || ''} - ${liveAddress.community || ''} - ${liveAddress.area || ''} - ${liveAddress.city || ''}`;

            case "Other":
                return `${liveAddress.otherNo || ''} - ${liveAddress.streetName || ''} - ${liveAddress.area || ''} - ${liveAddress.city || ''}`;

            default:
                return `${liveAddress.area || ''} - ${liveAddress.city || ''}`;
        }
    };

    const handelBookingConfirmation = async () => {
        setLoading(true);

        const parsedLongitude =
            mapLongitude === "" || mapLongitude === undefined
                ? null
                : parseFloat(mapLongitude);

        const parsedLatitude =
            mapLatitude === "" || mapLatitude === undefined
                ? null
                : parseFloat(mapLatitude);

        const displayAddress = getDisplayAddress();

        if (!displayAddress || displayAddress.trim() === "") {
            toast.error("Please add an address first");
            return false;
        }
        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return false;
        }

        // Map to backend enum values
        const mappedPaymentMethod = paymentMethod === "Cash" ? "CashOnDelivery" : "Card";

        const payload = {
            propertyItemIds: ides,
            serviceName: services[0]?.title || "",
            address: displayAddress,
            serviceCharge: servicePrice,
            cashOnDelivery: 5,
            offer: useDiscount.toString(),
            serviceFee: Number(serviceCharge) || 0,
            discount: Number(useDiscount),
            subTotal: Number(subTotal) || 0,
            vat: Number(vat) || 0,
            totalPay: mappedPaymentMethod === "CashOnDelivery" ? Number(totalAfterDiscount) + 5 : Number(totalAfterDiscount),
            date: date || "",
            time: time || "",
            paymentMethod: mappedPaymentMethod,
            longitude: parsedLongitude,
            latitude: parsedLatitude,
            userId: user?.id
        };
        console.log(payload);

        try {
            const res = await axiosSecure.post("/booking/create", payload);

            if (!res?.data?.success) {
                if (res.message) {
                    toast.error(`Booking failed: ${res.message}`);
                } else {
                    toast.error("Booking failed. Please try again.");
                }
                return false;
            }

            toast.success("Booking successfully!");
            navigate("/booking-success");
            return true;

        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Something went wrong. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPromo = async () => {
        const promoCode =
            promoInputRef.current?.value;

        if (!promoCode) {
            toast.error("No promo code entered");
            return;
        }
        await handleApply(promoCode.trim());
    };

    return (
        <div className="md:pb-14">
            <div className="hidden md:block">
                <ServiceDetails title="Review & Confirm" currentStep={4} />
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl mt-6 md:mt-0 shadow-lg p-5 md:p-7 text-[#4E4E4E]">
                <h2 className="text-lg text-center md:text-start font-semibold mb-4">Booking Details</h2>

                <div className="flex items-start gap-3 mb-3">
                    <IoBagRemoveSharp className="text-2xl" />
                    <p className="font-medium">{services[0]?.title}</p>
                </div>

                <div className="flex items-start gap-3 mb-3">
                    <FaCalendar className="text-2xl" />
                    <p className="font-medium">{date}, between {time}</p>
                </div>

                {/* address  */}
                <div className="flex items-start gap-3 mb-3">
                    <IoLocation className="text-2xl" />
                    <p className="font-medium">{getDisplayAddress() || "No address provided"}</p>
                </div>

                {/* map hare  */}
                <div className="w-full h-64 rounded-lg overflow-hidden">
                    <iframe
                        width="100%"
                        height="100%"
                        loading="lazy"
                        src={`https://www.google.com/maps?q=${mapLatitude},${mapLongitude}&z=16&output=embed`}
                        style={{ pointerEvents: "none" }}
                    ></iframe>
                </div>

                <div className="h-4 w-full my-8 bg-[#F5F5F5]"></div>
                {
                    promoStatus ?
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Offers</h2>
                            <div className="flex items-center justify-between p-3 bg-[#FDFDFD]">
                                <div className="text-sm font-medium text-gray-600 flex items-center gap-2">Discount</div>

                                <div className="flex items-center gap-2.5 text-[#ff7a00]">
                                    <div className="text-[15px] bg-[#FCDFD5] text-[#ED6329] px-3 py-1 rounded-lg font-semibold flex items-center gap-1">
                                        <img className="h-4 w-4 filter invert sepia saturate-200 hue-rotate-20 text-red-700" src={dirhum} />
                                        {useDiscount}% off
                                    </div>
                                    {/* <SiTicktick className="text-xl" /> */}
                                </div>
                                <SiTicktick className="text-xl" />
                                {/* <RxCrossCircled className="text-xl text-[#007C92] cursor-pointer" /> */}
                            </div>
                        </div> :
                        <div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2 text-lg uppercase tracking-wider">Promo Code</h3>
                                {!showInput ? (
                                    <button
                                        onClick={() => setShowInput(true)}
                                        className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#01788E] hover:text-[#01788E] transition-colors text-sm"
                                    >
                                        + Add Promo Code
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            ref={promoInputRef}
                                            placeholder="Enter promo code"
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-1 focus:ring-[#01788E] focus:border-transparent outline-none"
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
                        </div>
                }

                <h2 className="text-lg font-semibold mt-6 mb-3">Pay with</h2>

                <div className="space-y-3">
                    {/* ADD NEW CARD */}
                    <div
                        onClick={() => {
                            setOpenModal(true);
                            setPaymentMethod("Card");
                        }}
                        className="border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <GoCreditCard className="text-xl text-[#1f8bf0]" />
                            <span className="font-medium">Add New Card</span>
                        </div>
                        <MdKeyboardArrowRight className="text-xl text-gray-400" />
                    </div>

                    {/* CASH ON DELIVERY */}
                    <div
                        onClick={() => setPaymentMethod("Cash")}
                        className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer
                        ${paymentMethod === "Cash" ? "border-orange-500 bg-orange-50" : "hover:bg-gray-50"}`}
                    >
                        <div className="flex items-center gap-3">
                            <PiMoneyWavy className="text-xl text-green-600" />
                            <span className="font-medium">Cash On Delivery</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="bg-orange-200 text-orange-600 text-xs px-2 py-1 rounded-md">+5%</span>

                            {/* RADIO */}
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === "Cash"}
                                onChange={() => setPaymentMethod("Cash")}
                                className="h-4 w-4 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* PAYMENT SUMMARY */}
                <h2 className="text-lg font-semibold mt-6 mb-3">Payment Summary</h2>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="font-medium">Service Charges</span>
                        <span className="font-medium flex items-center gap-1">
                            <img className="h-3 w-3" src={dirhum} />{servicePrice}
                        </span>
                    </div>

                    {paymentMethod === "Cash" && (
                        <div className="flex justify-between">
                            <span className="font-medium">Cash On Delivery Charge</span>
                            <span className="font-medium flex items-center gap-1">
                                <img className="h-3 w-3" src={dirhum} />5.00
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span className="font-medium">Service Fee</span><span className="font-medium flex items-center gap-1"><img className="h-3 w-3" src={dirhum} />{serviceCharge}</span>
                    </div>

                    {/* <div className="flex justify-between font-semibold">
                        <span>Discount</span>
                        <span className="flex items-center gap-1">
                            <img className="h-3 w-3" src={dirhum} />30.00
                        </span>
                    </div> */}

                    <div className="flex justify-between items-center">
                        <span className="font-medium">Sub Total</span>
                        <span className="font-medium flex items-center gap-1">
                            <img className="h-3 w-3" src={dirhum} /> {paymentMethod === "Cash" ? Number(subTotal) + 5 : subTotal}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="font-medium">VAT (5%)</span>
                        <span className="font-medium flex items-center gap-1">
                            <img className="h-3 w-3" src={dirhum} /> {vat.toFixed(2)}
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

                    <hr className="my-3" />

                    {/* FINAL TOTAL (COD adds +5) */}
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total to pay</span>
                        <span className="flex items-center gap-1">
                            <img className="h-4 w-4 mt-[3px]" src={dirhum} /> {paymentMethod === "Cash" ? Number(totalAfterDiscount.toFixed(2)) + 5 : totalAfterDiscount.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="my-4 md:my-0 mx-auto w-60">
                <NextBtn loading={loading} onClick={handelBookingConfirmation} name="Book Now" />
            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 relative">
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute cursor-pointer right-4 top-4 text-gray-500 text-2xl"
                        >
                            ×
                        </button>

                        <h2 className="text-center text-xl font-semibold mb-6">Add New Card</h2>

                        <label className="block text-sm font-medium mb-1">Card Holder Name</label>
                        <input type="text" placeholder="Enter Name" className="w-full border rounded-xl px-4 py-3 mb-4" />

                        <label className="block text-sm font-medium mb-1">Card Number</label>
                        <input type="text" placeholder="Enter Number" className="w-full border rounded-xl px-4 py-3 mb-4" />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Expiry</label>
                                <input type="text" placeholder="MM/YY" className="w-full border rounded-xl px-4 py-3" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">CVV</label>
                                <input type="text" placeholder="CVV" className="w-full border rounded-xl px-4 py-3" />
                            </div>
                        </div>

                        <div className="flex items-center bg-gray-100 text-gray-600 text-sm p-3 rounded-xl mt-5">
                            <span className="mr-2">⚠️</span>
                            We will reserve and release ₱1 to confirm your Card.
                        </div>

                        <button
                            onClick={() => {
                                setPaymentMethod("Card");
                                setOpenModal(false);
                            }}
                            className="w-full cursor-pointer bg-orange-500 text-white py-3 rounded-xl font-semibold mt-6"
                        >
                            SELECT CARD PAYMENT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};