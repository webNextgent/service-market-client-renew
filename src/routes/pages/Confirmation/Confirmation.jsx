/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-unused-vars */
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
import dirhum from "../../../assets/icon/dirhum.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function Confirmation() {
  const [openModal, setOpenModal] = useState(false);
  const {
    serviceCharge,
    subTotal,
    services,
    vat,
    date,
    time,
    mapLongitude,
    mapLatitude,
    liveAddress,
    itemSummary,
    useDiscount,
    servicePrice,
    promoStatus,
    showInput,
    setShowInput,
    handleApply,
    totalAfterDiscount,
  } = useSummary();
  const axiosSecure = useAxiosSecure();
  const promoInputRef = useRef < HTMLInputElement > null;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();


  const getDisplayAddress = () => {
    if (!liveAddress) return null;

    if (liveAddress.displayAddress) return liveAddress.displayAddress;

    switch (liveAddress.type) {
      case "Apartment":
      case "Office":
        return `${liveAddress.apartmentNo || ""} - ${liveAddress.buildingName || ""} - ${liveAddress.area || ""} - ${liveAddress.city || ""}`;
      case "Villa":
        return `${liveAddress.villaNo || ""} - ${liveAddress.community || ""} - ${liveAddress.area || ""} - ${liveAddress.city || ""}`;
      case "Other":
        return `${liveAddress.otherNo || ""} - ${liveAddress.streetName || ""} - ${liveAddress.area || ""} - ${liveAddress.city || ""}`;
      default:
        return `${liveAddress.area || ""} - ${liveAddress.city || ""}`;
    }
  };

  // ===============================
  // CASH ON DELIVERY FUNCTION
  // ===============================
  const handleCashOnDelivery = async () => {
    try {
      setLoading(true);

      const displayAddress = getDisplayAddress() || "";

      const bookingData = {
        serviceName: services[0]?.title || "Cleaning Service",
        date,
        time,
        address: displayAddress,
        offer: promoStatus ? `${useDiscount}% discount` : "No offer",
        userName: `${user?.firstName} ${user?.lastName}`,
        userEmail: user?.email,
        propertyItems: itemSummary, // This should match your backend structure
        paymentMethod: "Cash",
        serviceFee: servicePrice,
        serviceCharge: serviceCharge,
        cashOnDelivery: 5, // COD extra charge
        discount: useDiscount || 0,
        subTotal: paymentMethod === "Cash" ? subTotal + 5 : subTotal,
        vat: vat,
        totalPay:
          paymentMethod === "Cash"
            ? totalAfterDiscount + 5
            : totalAfterDiscount,
        longitude: mapLongitude,
        latitude: mapLatitude,
        status: "Upcoming",
        userId: user?.id,
        paymentStatus: "pending",
      };

      console.log("Booking data for COD:", bookingData);

      const response = await axiosSecure.post("/booking/create", bookingData);

      if (response.data.success) {
        toast.success("Booking confirmed! Pay with Cash on Delivery.");
        navigate("/booking-success", {
          state: {
            bookingId: response.data.bookingId,
            paymentMethod: "Cash",
          },
        });
      } else {
        throw new Error("Booking creation failed");
      }
    } catch (err) {
      console.error("COD Error:", err);
      toast.error(err?.response?.data?.message || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ONLINE PAYMENT FUNCTION
  // ===============================
  const handleOnlinePayment = async () => {
    try {
      setLoading(true);

      const displayAddress = getDisplayAddress() || "";

      const bookingData = {
        serviceName: services[0]?.title || "Cleaning Service",
        date,
        time,
        address: displayAddress,
        offer: promoStatus ? `${useDiscount}% discount` : "No offer",

        userName: `${user?.firstName} ${user?.lastName}`,
        userEmail: user?.email,
        propertyItemIds: itemSummary.map((item) => item.id),

        paymentMethod: "Online",
        serviceFee: servicePrice,
        serviceCharge,
        cashOnDelivery: 0,
        discount: useDiscount || 0,
        subTotal,
        vat,
        totalPay: totalAfterDiscount,

        longitude: mapLongitude,
        latitude: mapLatitude,

        status: "Upcoming",
        userId: user?.id,
        paymentStatus: "pending",
      };

      const bookingResponse = await axiosSecure.post(
        "/booking/create",
        bookingData,
      );

      if (!bookingResponse.data.success) {
        throw new Error("Booking creation failed");
      }

      const bookingId = bookingResponse.data.Data.id
      console.log(bookingId)

      // Prepare payment payload
      const payload = {
        amount: totalAfterDiscount,
        currency: "AED",
        order_id: `booking_${bookingId}_${Date.now()}`,
        booking_id: bookingId,
        return_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancel`,
        customer_email: user?.email,
        customer_name: `${user?.firstName} ${user?.lastName}` || "Customer",
        customer_phone: user?.phone,
      };

      // Create payment session
      const paymentResponse = await axiosSecure.post(
        "/payments/ziina/create",
        payload,
      );

      if (paymentResponse.data?.payment_url) {
        // Redirect to payment gateway
        window.location.href = paymentResponse.data.payment_url;
      } else {
        toast.error("Payment initiation failed.");
      }
    } catch (err) {
      console.error("Online Payment Error:", err);
      toast.error(err?.response?.data?.message || "Payment failed!");
      setLoading(false);
    }
  };

  // ===============================
  // MAIN BOOKING CONFIRMATION HANDLER
  // ===============================
  const handleBookingConfirmation = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }

    if (!user) {
      toast.error("Please login to continue!");
      navigate("/login");
      return;
    }

    // Check if required data is available
    if (!date || !time) {
      toast.error("Please select date and time!");
      return;
    }

    if (!liveAddress) {
      toast.error("Please select an address!");
      return;
    }

    if (paymentMethod === "Cash") {
      await handleCashOnDelivery();
    } else if (paymentMethod === "Card") {
      await handleOnlinePayment();
    }
  };

  const handleApplyPromo = async () => {
    const promoCode = promoInputRef.current?.value;

    if (!promoCode) {
      toast.error("No promo code entered");
      return;
    }
    await handleApply(promoCode.trim());
  };

  // Calculate totals
  const cashOnDeliveryCharge = 5;
  const subTotalWithCOD =
    paymentMethod === "Cash"
      ? Number(subTotal) + cashOnDeliveryCharge
      : Number(subTotal);
  const vatAmount = (subTotalWithCOD * 0.05).toFixed(2);
  const discountAmount =
    useDiscount > 0 ? (subTotalWithCOD * useDiscount) / 100 : 0;
  const finalTotal =
    paymentMethod === "Cash"
      ? (totalAfterDiscount + cashOnDeliveryCharge).toFixed(2)
      : totalAfterDiscount.toFixed(2);

  return (
    <div className="md:pb-14">
      <div className="hidden md:block">
        <ServiceDetails title="Review & Confirm" currentStep={4} />
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl mt-6 md:mt-0 shadow-lg p-5 md:p-7 text-[#4E4E4E]">
        {/* User Info (for debugging) */}
        {user && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
            <p className="text-sm text-gray-600">User ID: {user.id}</p>
          </div>
        )}

        {/* Booking Details */}
        <h2 className="text-lg text-center md:text-start font-semibold mb-4">
          Booking Details
        </h2>

        <div className="flex items-start gap-3 mb-3">
          <IoBagRemoveSharp className="text-2xl" />
          <p className="font-medium">{services[0]?.title || "Service"}</p>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <FaCalendar className="text-2xl" />
          <p className="font-medium">
            {date || "Not selected"}, between {time || "Not selected"}
          </p>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <IoLocation className="text-2xl" />
          <p className="font-medium">
            {getDisplayAddress() || "No address provided"}
          </p>
        </div>

        <div className="w-full h-64 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            src={`https://www.google.com/maps?q=${mapLatitude || 0},${mapLongitude || 0}&z=16&output=embed`}
            style={{ pointerEvents: "none" }}
            title="Location Map"
          ></iframe>
        </div>

        {/* Promo Code */}
        {promoStatus ? (
          <div>
            <h2 className="text-lg font-semibold mb-3">Offers</h2>
            <div className="flex items-center justify-between p-3 bg-[#FDFDFD]">
              <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
                Discount
              </div>
              <div className="flex items-center gap-2.5 text-[#ff7a00]">
                <div className="text-[15px] bg-[#FCDFD5] text-[#ED6329] px-3 py-1 rounded-lg font-semibold flex items-center gap-1">
                  <img
                    className="h-4 w-4 filter invert sepia saturate-200 hue-rotate-20 text-red-700"
                    src={dirhum}
                    alt="currency"
                  />
                  {useDiscount}% off
                </div>
              </div>
              <SiTicktick className="text-xl" />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-lg uppercase tracking-wider">
              Promo Code
            </h3>
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
        )}

        {/* Payment Method */}
        <h2 className="text-lg font-semibold mt-6 mb-3">Pay with</h2>

        <div className="space-y-3">
          {/* Card (Online Payment) */}
          <div
            onClick={() => {
              setOpenModal(true);
              setPaymentMethod("Card");
            }}
            className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer
                        ${paymentMethod === "Card" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-3">
              <GoCreditCard className="text-xl text-[#1f8bf0]" />
              <span className="font-medium">Online Payment</span>
            </div>
            <div className="flex items-center gap-3">
              <MdKeyboardArrowRight className="text-xl text-gray-400" />
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "Card"}
                onChange={() => {
                  setPaymentMethod("Card");
                  setOpenModal(true);
                }}
                className="h-4 w-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Cash */}
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
              <span className="bg-orange-200 text-orange-600 text-xs px-2 py-1 rounded-md">
                +5%
              </span>
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

        {/* Payment Summary */}
        <h2 className="text-lg font-semibold mt-6 mb-3">Payment Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Service Charges</span>
            <span className="font-medium flex items-center gap-1">
              <img className="h-3 w-3" src={dirhum} alt="currency" />{" "}
              {servicePrice}
            </span>
          </div>

          {paymentMethod === "Cash" && (
            <div className="flex justify-between">
              <span className="font-medium">Cash On Delivery Charge</span>
              <span className="font-medium flex items-center gap-1">
                <img className="h-3 w-3" src={dirhum} alt="currency" /> 5.00
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="font-medium">Service Fee</span>
            <span className="font-medium flex items-center gap-1">
              <img className="h-3 w-3" src={dirhum} alt="currency" />{" "}
              {serviceCharge}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Sub Total</span>
            <span className="font-medium flex items-center gap-1">
              <img className="h-3 w-3" src={dirhum} alt="currency" />{" "}
              {subTotalWithCOD.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">VAT (5%)</span>
            <span className="font-medium flex items-center gap-1">
              <img className="h-3 w-3" src={dirhum} alt="currency" />{" "}
              {vatAmount}
            </span>
          </div>

          {useDiscount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="text-sm">Discount</span>
              <span className="flex items-center gap-1 font-medium text-sm">
                <img src={dirhum} className="w-3.5 h-3.5" alt="currency" />-
                {discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <hr className="my-3" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total to pay</span>
            <span className="flex items-center gap-1">
              <img className="h-4 w-4 mt-[3px]" src={dirhum} alt="currency" />{" "}
              {finalTotal}
            </span>
          </div>
        </div>
      </div>

      <div className="my-4 md:my-0 mx-auto w-60">
        <NextBtn
          onClick={handleBookingConfirmation}
          name={loading ? "Processing..." : "Book Now"}
          disabled={loading}
        />
      </div>

      {/* Modal for card payment details */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute cursor-pointer right-4 top-4 text-gray-500 text-2xl"
            >
              ×
            </button>
            <h2 className="text-center text-xl font-semibold mb-6">
              Online Payment
            </h2>

            <p className="text-gray-600 mb-6 text-center">
              You will be redirected to Ziina payment gateway to complete your
              payment securely.
            </p>

            <div className="flex items-center bg-gray-100 text-gray-600 text-sm p-3 rounded-xl mt-5">
              <span className="mr-2">ℹ️</span>
              Your payment will be processed securely by Ziina
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPaymentMethod("Card");
                  setOpenModal(false);
                }}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
