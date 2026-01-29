/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiMessageCircle, FiPhone } from "react-icons/fi";
import { useLoaderData } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import dirhum from '../../../assets/icon/dirhum.png';
import { useQuery } from "@tanstack/react-query";
import { LuArrowLeft } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { MdLocationOn, MdCalendarToday, MdPayment, MdInfo } from "react-icons/md";
import { HiBuildingOffice, HiHome } from "react-icons/hi2";
import { BsClock, BsTag } from "react-icons/bs";
import { TbReceipt } from "react-icons/tb";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function BookingDetails() {
    const item = useLoaderData();
    const scrollerRef = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalAddress, setModalAddress] = useState(false);
    const [modalPrice, setModalPrice] = useState(false);
    const [modalRescudle, setModalRescudle] = useState(false);
    const [modalPaymentMethod, setModalPaymentMethod] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [modalAddressUpdate, setModalAddressUpdate] = useState(false);
    const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(item?.Data?.paymentMethod || "Cash");
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
    const axiosSecure = useAxiosSecure();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        mode: "onChange"
    });
    const [selectedType, setSelectedType] = useState("Apartment");
    const propertyTypes = ["Apartment", "Villa", "Office", "Other"];

    const handelReschudeleFun = () => {
        setModalRescudle(true);
    }

    console.log(item.Data);

    // const handleAddInstructions = () => {
    //     console.log("Instructions saved:", instructions);
    //     setOpenInstructionsModal(false);
    //     setInstructions("");
    // }

    const handelAddressDetails = item => {
        setModalAddress(true);
        console.log(item);
    }

    const handelTotalPay = item => {
        setModalPrice(true);
        console.log(item);
    }

    const handleChangePaymentMethod = () => {
        setModalPaymentMethod(true);
    };

    // Extract address parts from the string
    const extractAddressParts = (addressString) => {
        if (!addressString) {
            return {
                apartmentNo: "",
                buildingName: "",
                area: "",
                city: "",
                type: "Apartment"
            };
        }

        const parts = addressString.split(" - ").map(part => part.trim());
        return {
            apartmentNo: parts[0] || "",
            buildingName: parts[1] || "",
            area: parts[2] || "",
            city: parts[3] || "",
            type: "Apartment"
        };
    };

    // Get address parts from the item data
    const addressParts = extractAddressParts(item?.Data?.address);

    const { data: dateTime, isLoading } = useQuery({
        queryKey: ['date-time-user'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/date-time`);
            console.log(res?.data?.success);

            if (!res?.data?.success) {
                throw new Error("Failed to fetch date-time");
            }
            return res?.data;
        }
    });

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error("Date formatting error:", error);
            return dateString;
        }
    };

    // Prepare days data from API - Merge duplicate dates
    const getAvailableDays = () => {
        if (!dateTime?.Data || !Array.isArray(dateTime.Data)) {
            return [];
        }

        const dateMap = new Map();
        dateTime.Data.forEach(item => {
            const date = item.date;
            const timeSlots = item.time || [];

            if (dateMap.has(date)) {
                const existing = dateMap.get(date);
                timeSlots.forEach(slot => {
                    if (!existing.timeSlots.includes(slot)) {
                        existing.timeSlots.push(slot);
                    }
                });
            } else {
                dateMap.set(date, {
                    id: item.id,
                    date: date,
                    short: formatDateForDisplay(date),
                    label: getFullDateLabel(date),
                    timeSlots: [...timeSlots]
                });
            }
        });

        const daysArray = Array.from(dateMap.values()).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );
        return daysArray;
    };

    const getFullDateLabel = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            console.error("Date formatting error:", error);
            return dateString;
        }
    };

    // Get available time slots for selected day
    const getAvailableTimes = () => {
        if (!selectedDay) return [];

        const selectedDayData = getAvailableDays().find(day => day.date === selectedDay);
        if (!selectedDayData || !selectedDayData.timeSlots) return [];

        return selectedDayData.timeSlots.sort((a, b) => {
            return a.localeCompare(b);
        });
    };

    const scroll = (dir) => {
        if (!scrollerRef.current) return;
        const amount = 200;

        scrollerRef.current.scrollBy({
            left: dir === "left" ? -amount : amount,
            behavior: "smooth"
        });
    };

    const availableDays = getAvailableDays();
    const availableTimes = getAvailableTimes();

    // Format display address
    const formatDisplayAddress = (type, data) => {
        switch (type) {
            case "Apartment":
            case "Office":
                return `${data.apartmentNo || ''} - ${data.buildingName || ''} - ${data.area || ''} - ${data.city || ''}`;

            case "Villa":
                return `${data.villaNo || ''} - ${data.community || ''} - ${data.area || ''} - ${data.city || ''}`;

            case "Other":
                return `${data.otherNo || ''} - ${data.streetName || ''} - ${data.area || ''} - ${data.city || ''}`;

            default:
                return `${data.area || ''} - ${data.city || ''}`;
        }
    };

    // Handle type change
    const handleTypeChange = (type) => {
        setSelectedType(type);
        if (type === "Villa") {
            setValue("buildingName", "");
            setValue("apartmentNo", "");
        } else if (type === "Other") {
            setValue("buildingName", "");
            setValue("apartmentNo", "");
            setValue("community", "");
            setValue("villaNo", "");
        } else {
            setValue("community", "");
            setValue("villaNo", "");
            setValue("streetName", "");
            setValue("otherNo", "");
            setValue("nickname", "");
        }
    };

    // Handle address update submission
    const handleAddressUpdate = async (data) => {
        const bookingId = item?.Data?.id;

        if (!bookingId) {
            return false;
        }
        const formattedAddress = formatDisplayAddress(selectedType, data);

        const updateData = {
            address: formattedAddress
        };

        console.log("Updating address with data:", updateData);
        setIsUpdatingAddress(true);

        try {
            const res = await axiosSecure.patch(`/booking/update/${bookingId}`, updateData);

            if (res?.data?.success) {
                toast.success('Address update successfully');
                setModalAddressUpdate(false);
            } else {
                toast.error('Something is wrong');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error('Something is wrong');
        } finally {
            setIsUpdatingAddress(false);
        }
        return true;
    };

    // Handle payment method update
    // const handlePaymentMethodUpdate = async () => {
    //     const bookingId = item?.Data?.id;

    //     if (!bookingId) {
    //         alert("Booking ID not found!");
    //         return false;
    //     }

    //     console.log("Updating payment method to:", selectedPaymentMethod);
    //     setIsUpdatingPayment(true);

    //     try {
    //         const endpoints = [
    //             `${import.meta.env.VITE_BACKEND_API_URL}/booking/userBooking/${bookingId}`,
    //             `${import.meta.env.VITE_BACKEND_API_URL}/booking/${bookingId}`,
    //             `${import.meta.env.VITE_BACKEND_API_URL}/userBooking/${bookingId}`,
    //             `${import.meta.env.VITE_BACKEND_API_URL}/booking/updatePayment/${bookingId}`
    //         ];

    //         let response = null;
    //         let success = false;

    //         for (const endpoint of endpoints) {
    //             try {
    //                 console.log("Trying endpoint:", endpoint);
    //                 response = await fetch(endpoint, {
    //                     method: "PATCH",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         paymentMethod: selectedPaymentMethod
    //                     }),
    //                 });

    //                 if (response.ok) {
    //                     success = true;
    //                     break;
    //                 }
    //             } catch (err) {
    //                 console.log("Failed with endpoint:", endpoint, err);
    //             }
    //         }

    //         if (success && response) {
    //             const result = await response.json();
    //             console.log("Payment method updated successfully:", result);
    //             alert(`Payment method changed to ${selectedPaymentMethod} successfully!`);
    //             setModalPaymentMethod(false);
    //         } else {
    //             alert("Failed to update payment method. Please try a different endpoint or contact support.");
    //         }
    //     } catch (error) {
    //         console.error("Error updating payment method:", error);
    //         alert("Network error. Please check your connection and try again.");
    //     } finally {
    //         setIsUpdatingPayment(false);
    //     }
    // };

    // Load current address into form when modal opens
    useEffect(() => {
        if (modalAddressUpdate && item?.Data?.address) {
            const parts = item.Data.address.split(" - ");
            if (parts.length >= 4) {
                const formData = {
                    apartmentNo: parts[0] || "",
                    buildingName: parts[1] || "",
                    area: parts[2] || "",
                    city: parts[3] || ""
                };

                setValue("apartmentNo", formData.apartmentNo);
                setValue("buildingName", formData.buildingName);
                setValue("area", formData.area);
                setValue("city", formData.city);

                setSelectedType("Apartment");
            }
        }
    }, [modalAddressUpdate, item?.Data?.address, setValue]);

    // Reschedule function
    const handleRescheduleSubmit = async (id) => {
        const bookingId = id;
        if (!selectedDay) {
            alert("Please select a day");
            return;
        }
        if (!selectedTime) {
            alert("Please select a time slot");
            return;
        }
        const updatedData = {
            date: selectedDay,
            time: selectedTime,
        };

        try {
            const resReshudle = await axiosSecure.patch(`/booking/userBooking/${bookingId}`, updatedData);
            if (resReshudle?.data?.success) {
                setModalRescudle(false);
                toast.success("Booking rescheduled successfully!");
            } else {
                console.error("Failed:", resReshudle);
                toast.error(`Failed to reschedule: ${resReshudle.message || `Error ${resReshudle.status}`}`);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error. Please check your connection and try again.");
        }
    };

    // Auto-select first date
    useEffect(() => {
        if (dateTime?.Data && dateTime.Data.length > 0 && !selectedDay) {
            const days = getAvailableDays();
            if (days.length > 0) {
                const firstDay = days[0].date;
                setSelectedDay(firstDay);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateTime, selectedDay]);

    const handleUserUpdateBookingStatus = async (id) => {
        const updateData = {
            status: 'Cancelled'
        }

        try {
            const resStatus = await axiosSecure.patch(`/booking/update/${id}`, updateData);
            if (resStatus?.data?.success) {
                toast.success("Booking cancelled successfully!");
            } else {
                toast.error("Failed to cancel booking");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">Booking Details</h1>
                    <p className="text-gray-600">Manage your booking and view all details</p>
                </div>

                {/* Main Content Grid */}
                <div className="  grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen overflow-y-auto lg:h-auto lg:overflow-visible">
                    {/* Left Column - Booking Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Confirmation Card */}
                        <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-sm border border-blue-100 p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-white border border-blue-200 flex items-center justify-center">
                                            <BsClock className="text-blue-600 text-lg" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Booking Confirmed</h2>
                                            <p className="text-sm text-gray-600">Booking ID: {item?.Data?.id || "N/A"}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-3">
                                        Your booking is confirmed and will be delivered as per the booked date and time
                                    </p>
                                    <div className="flex items-center gap-3 mt-4">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                            <FaUser className="text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Supreme P.</p>
                                            <p className="text-sm text-gray-600">Service Provider</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm">
                                        <FiMessageCircle className="text-xl text-gray-700" />
                                    </button>
                                    <button className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm">
                                        <FiPhone className="text-xl text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Rating Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BsTag className="text-blue-600" />
                                Rate Your Experience
                            </h3>
                            <div className="rating rating-lg">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <input
                                        key={star}
                                        type="radio"
                                        name="rating-9"
                                        className="mask mask-star-2 bg-orange-400"
                                        aria-label={`${star} star`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Share your experience to help us improve</p>
                        </div>

                        {/* Job Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <MdInfo className="text-blue-600" />
                                Job Details
                            </h3>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <MdCalendarToday className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Start Time</p>
                                            <p className="text-sm text-gray-500">{item?.Data?.date}, {item?.Data?.time}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                            <MdLocationOn className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Address</p>
                                            <p className="text-sm text-gray-500">{item?.Data?.address}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handelAddressDetails(item)}
                                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        View
                                        <IoIosArrowForward />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Service Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <HiBuildingOffice className="text-blue-600" />
                                Service Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        {/* <p className="font-medium text-gray-900">Studio - General</p> */}
                                        <p className="text-sm text-gray-600">Quantity: 1</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Service Type</p>
                                        <p className="font-sm text-gray-900">{item?.Data?.serviceName}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <BsTag className="text-gray-600" />
                                        <span className="font-medium text-gray-700">Service Fee</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src={dirhum} alt="Currency" className="w-5 h-5" />
                                        <span className="text-lg font-semibold text-gray-900">{item?.Data?.serviceFee}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment & Actions */}
                    <div className="space-y-6">
                        {/* Payment Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <TbReceipt className="text-blue-600" />
                                Payment Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <MdPayment className="text-gray-600" />
                                        <span className="font-medium text-gray-700">Payment Method</span>
                                    </div>
                                    <span className="font-medium text-gray-900">{item?.Data?.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900">Total to Pay</p>
                                        <p className="text-sm text-gray-600">Inclusive of all charges</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1">
                                            <img src={dirhum} alt="Currency" className="w-6 h-6" />
                                            <span className="text-2xl font-bold text-gray-900">{item.Data?.totalPay}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handelTotalPay(item)}
                                    className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    View Detailed Breakdown
                                    <IoIosArrowForward />
                                </button>
                            </div>
                        </div>

                        {/* Manage Booking Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Manage Booking</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setOpenModal(true)}
                                    className="w-full py-3.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg"
                                >
                                    Manage Booking Options
                                </button>
                                <p className="text-sm text-gray-500 text-center mt-2">
                                    Reschedule, add instructions, or make changes to your booking
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handelReschudeleFun}
                                    className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition flex flex-col items-center gap-2"
                                >
                                    <MdCalendarToday className="text-xl" />
                                    <span className="text-sm font-medium">Reschedule</span>
                                </button>
                                {/* <button
                                    onClick={() => setOpenInstructionsModal(true)}
                                    className="p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition flex flex-col items-center gap-2"
                                >
                                    <FiMessageCircle className="text-xl" />
                                    <span className="text-sm font-medium">Instructions</span>
                                </button> */}
                                <button
                                    onClick={() => setModalAddressUpdate(true)}
                                    className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition flex flex-col items-center gap-2"
                                >
                                    <MdLocationOn className="text-xl" />
                                    <span className="text-sm font-medium">Address</span>
                                </button>
                                <button
                                    onClick={handleChangePaymentMethod}
                                    className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition flex flex-col items-center gap-2"
                                >
                                    <MdPayment className="text-xl" />
                                    <span className="text-sm font-medium">Payment</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Manage Booking Modal */}
                {openModal &&
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
                        onClick={() => setOpenModal(false)}
                    >
                        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Manage Booking</h2>
                                    <button
                                        onClick={() => setOpenModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-gray-600 mt-2">Choose an option to manage your booking</p>
                            </div>

                            <div className="divide-y divide-gray-100">
                                <button
                                    onClick={handelReschudeleFun}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <MdCalendarToday className="text-blue-600 text-xl" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Reschedule</p>
                                            <p className="text-sm text-gray-600">Change date or time</p>
                                        </div>
                                    </div>
                                    <IoIosArrowForward className="text-gray-400" />
                                </button>

                                {/* <button
                                    // onClick={() => { setOpenModal(false); setOpenInstructionsModal(true); }}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <FiMessageCircle className="text-green-600 text-xl" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Add Instructions</p>
                                            <p className="text-sm text-gray-600">Special requirements</p>
                                        </div>
                                    </div>
                                    <IoIosArrowForward className="text-gray-400" />
                                </button> */}

                                <button
                                    onClick={() => setModalAddressUpdate(true)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <MdLocationOn className="text-purple-600 text-xl" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Change Address</p>
                                            <p className="text-sm text-gray-600">Update location</p>
                                        </div>
                                    </div>
                                    <IoIosArrowForward className="text-gray-400" />
                                </button>

                                <button
                                    onClick={handleChangePaymentMethod}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                            <MdPayment className="text-amber-600 text-xl" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Payment Method</p>
                                            <p className="text-sm text-gray-600">Update payment details</p>
                                        </div>
                                    </div>
                                    <IoIosArrowForward className="text-gray-400" />
                                </button>

                                <button
                                    onClick={() => handleUserUpdateBookingStatus(item?.Data?.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-50 transition text-red-600"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                            <svg className="text-red-600 text-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium">Cancel Booking</p>
                                            <p className="text-sm text-red-500">This action cannot be undone</p>
                                        </div>
                                    </div>
                                    <IoIosArrowForward className="text-red-400" />
                                </button>
                            </div>

                            <div className="p-6 border-t border-gray-200">
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                }

                {/* Add Instructions Modal */}
                {/* {openInstructionsModal &&
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
                        onClick={() => setOpenInstructionsModal(false)}
                    >
                        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Add Instructions</h2>
                                    <button
                                        onClick={() => setOpenInstructionsModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-gray-600 mt-2">Add special instructions for the service provider</p>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Additional Instructions
                                    </label>
                                    <textarea
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        placeholder="Please provide any additional instructions for the service provider (e.g., specific requirements, access codes, parking information, etc.)..."
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                    />
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        These instructions will be shared with your service provider.
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setOpenInstructionsModal(false)}
                                        className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddInstructions}
                                        disabled={!instructions.trim()}
                                        className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl font-medium transition"
                                    >
                                        Save Instructions
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                } */}

                {/* ADDRESS MODAL - View Current Address */}
                {modalAddress &&
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-10 md:items-center md:pt-0 bg-black/50"
                        onClick={() => setModalAddress(false)}
                    >
                        <div className="relative w-full max-w-[600px] mx-4 bg-white rounded-lg shadow-xl h-[90vh] sm:h-[85vh] md:h-[80vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}>

                            <div className="shrink-0 flex items-center justify-center p-4 sm:p-5 border-b border-gray-200 relative">
                                <button className="absolute right-4 cursor-pointer text-gray-500 hover:text-gray-700 p-1.5"
                                    onClick={() => setModalAddress(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                    </svg>
                                </button>

                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-tight">
                                    Address Details
                                </h2>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                                <div className="space-y-4 mb-6">
                                    {/* Address Info Cards for Mobile */}
                                    <div className="md:hidden space-y-3">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">City</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.city || "Not specified"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Area</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.area || "Not specified"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Building Name</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.buildingName || "Not specified"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Apartment No.</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.apartmentNo || "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Address Info for Desktop */}
                                    <div className="hidden md:grid md:grid-cols-2 md:gap-4">
                                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                            <p className="text-base text-gray-700">City</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.city || "Not specified"}
                                            </p>
                                        </div>
                                        {/* <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                            <p className="text-base text-gray-700">Type</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.type}
                                            </p>
                                        </div> */}
                                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                            <p className="text-base text-gray-700">Area</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.area || "Not specified"}
                                            </p>
                                        </div>
                                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                            <p className="text-base text-gray-700">Building Name</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.buildingName || "Not specified"}
                                            </p>
                                        </div>
                                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                            <p className="text-base text-gray-700">Apartment No.</p>
                                            <p className="text-base font-medium text-gray-900">
                                                {addressParts.apartmentNo || "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }


                {/* PRICE MODAL */}
                {modalPrice &&
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
                        onClick={() => setModalPrice(false)}
                    >
                        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Payment Breakdown</h2>
                                    <button
                                        onClick={() => setModalPrice(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-gray-600 mt-2">Detailed breakdown of all charges</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="font-medium text-gray-700">Service Charges</span>
                                        <div className="flex items-center gap-2">
                                            <img src={dirhum} alt="Currency" className="w-5 h-5" />
                                            <span className="text-lg font-semibold text-gray-900">{item?.Data?.serviceCharge}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="font-medium text-gray-700">Service Fee</span>
                                        <div className="flex items-center gap-2">
                                            <img src={dirhum} alt="Currency" className="w-5 h-5" />
                                            <span className="text-lg font-semibold text-gray-900">{item?.Data?.serviceFee}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="font-medium text-gray-700">Discount</span>
                                        <div className="flex items-center gap-2">
                                            <img src={dirhum} alt="Currency" className="w-5 h-5" />
                                            <span className="text-lg font-semibold text-gray-900">{item?.Data?.discount}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="font-medium text-gray-700">Sub Total</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-semibold text-gray-900">{item?.Data?.serviceCharge} + {item?.Data?.serviceFee} = <p className="flex items-center justify-center"><img src={dirhum} alt="Currency" className="w-5 h-5" /> {item?.Data?.subTotal}</p></span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="font-medium text-gray-700">VAT (5%)</span>
                                        <div className="flex items-center gap-2">
                                            <img src={dirhum} alt="Currency" className="w-5 h-5" />
                                            <span className="text-lg font-semibold text-gray-900">{item?.Data?.vat}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                        <span className="font-medium text-gray-700">Cash on Delivery Charges</span>
                                        <div className="flex items-center gap-2">
                                            <img src={dirhum} alt="Currency" className="w-5 h-5" />
                                            <span className="text-lg font-semibold text-gray-900">{item?.Data?.cashOnDelivery}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 mt-6">
                                        <div>
                                            <span className="font-semibold text-gray-900 text-lg">Total to Pay</span>
                                            <p className="text-sm text-gray-600">Final amount including all taxes</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <img src={dirhum} alt="Currency" className="w-6 h-6" />
                                            <span className="text-2xl font-bold text-gray-900">{item?.Data?.totalPay}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* RESCHEDULE MODAL */}
                {/* RESCHEDULE MODAL - Updated to match DateTime component */}
                {modalRescudle &&
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
                        onClick={() => setModalRescudle(false)}
                    >
                        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setModalRescudle(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <LuArrowLeft className="text-xl" />
                                        </button>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Reschedule Booking</h2>
                                            <p className="text-gray-600">Select a new date and time for your service</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-8">
                                    {/* Day Selector - Updated to match DateTime component */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">
                                            Which day would you like us to come?
                                        </h3>
                                        {isLoading && (
                                            <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                                <p className="mt-4 text-gray-600">Loading available dates...</p>
                                            </div>
                                        )}
                                        {availableDays.length === 0 && !isLoading ? (
                                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-gray-600 font-medium">No available dates</p>
                                                <p className="text-sm text-gray-500 mt-1">Please check back later for available slots</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative max-w-[300px] mx-auto md:max-w-4xl">
                                                    {/* Left Scroll Button */}
                                                    <button
                                                        onClick={() => scroll("left")}
                                                        className="hidden absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:flex items-center justify-center"
                                                    >
                                                        <IoIosArrowBack className="text-3xl font-bold" />
                                                    </button>

                                                    {/* Day List */}
                                                    <div
                                                        ref={scrollerRef}
                                                        className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-10"
                                                    >
                                                        {availableDays.map((day, index) => {
                                                            const isActive = selectedDay === day.date;

                                                            return (
                                                                <div
                                                                    key={`${day.date}-${index}`}
                                                                    onClick={() => setSelectedDay(day.date)}
                                                                    className={`snap-start min-w-[100px] md:min-w-[85px] px-2 py-1 rounded-lg border cursor-pointer flex flex-col items-center gap-1 transition
                                                        ${isActive ? "bg-[#B2D7DE] border-transparent shadow" : "bg-white border-gray-200 hover:bg-gray-50"}
                                                    `}
                                                                >
                                                                    <div className="text-sm text-gray-600">{day.short}</div>
                                                                    <div className="text-sm font-medium">{day.label}</div>
                                                                    {day.timeSlots && day.timeSlots.length > 0 && (
                                                                        <div className="text-xs text-green-600 mt-1">
                                                                            {day.timeSlots.length} slot{day.timeSlots.length !== 1 ? 's' : ''}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Right Scroll Button */}
                                                    <button
                                                        onClick={() => scroll("right")}
                                                        className="hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 md:flex items-center justify-center cursor-pointer"
                                                    >
                                                        <IoIosArrowForward className="text-3xl font-bold" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Time Selector - Updated to match DateTime component */}
                                    {selectedDay && (
                                        <>
                                            <h3 className="text-lg font-semibold mt-8 mb-4">
                                                What time would you like us to arrive?
                                            </h3>

                                            {availableTimes.length === 0 ? (
                                                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                                    <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-gray-600">No time slots available for this date</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {availableTimes.map((timeSlot, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedTime(timeSlot)}
                                                            className={`w-full text-left rounded-lg border px-6 py-4 transition
                                                ${selectedTime === timeSlot ? "bg-[#E6F6F6] border-teal-300 shadow-sm" : "bg-white border-gray-200 hover:bg-gray-50"}
                                            `}
                                                        >
                                                            <span className="text-sm font-medium">{timeSlot}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Note Section - Updated to match DateTime component */}
                                    <div className="mt-8 p-4 bg-gray-50 border rounded-md flex gap-4 text-sm text-gray-700">
                                        <svg className="w-5 h-5 text-gray-500 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 9v2m0 4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z" strokeWidth="1.5" />
                                        </svg>

                                        <div>
                                            Free cancellation up to 6 hours before your booking start time.{" "}
                                            <a href="#" className="text-teal-600 underline">View cancellation policy</a>
                                        </div>
                                    </div>

                                    {/* Confirm Button - Updated styling */}
                                    <div className="sticky bottom-0 bg-white pt-6 border-t">
                                        <button
                                            onClick={() => handleRescheduleSubmit(item.Data.id)}
                                            disabled={!selectedDay || !selectedTime}
                                            className={`w-full py-4 text-white font-semibold rounded-lg transition ${!selectedDay || !selectedTime
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl"
                                                }`}
                                        >
                                            {selectedDay && selectedTime ? (
                                                `Confirm Reschedule`
                                            ) : (
                                                "Select date and time to continue"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* PAYMENT METHOD CHANGE MODAL */}
                {modalPaymentMethod &&
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
                        onClick={() => setModalPaymentMethod(false)}
                    >
                        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setModalPaymentMethod(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <LuArrowLeft className="text-xl" />
                                        </button>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Update Payment Method</h2>
                                            <p className="text-gray-600">Select your preferred payment method</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-6">
                                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                        <p className="text-gray-700">
                                            Current method: <span className="font-semibold text-gray-900">{item?.Data?.paymentMethod || "Not specified"}</span>
                                        </p>
                                    </div>

                                    {/* Payment Method Options */}
                                    <div className="space-y-3">
                                        {["Cash", "Credit Card", "Debit Card", "Online Payment", "Wallet"].map((method) => (
                                            <div
                                                key={method}
                                                onClick={() => setSelectedPaymentMethod(method)}
                                                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedPaymentMethod === method
                                                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-md"
                                                    : "bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method
                                                            ? "border-blue-600 bg-blue-600"
                                                            : "border-gray-300"
                                                            }`}>
                                                            {selectedPaymentMethod === method && (
                                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-gray-900">{method}</span>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {method === "Cash" && "Pay with cash on delivery"}
                                                                {method === "Credit Card" && "Pay with your credit card"}
                                                                {method === "Debit Card" && "Pay with your debit card"}
                                                                {method === "Online Payment" && "Pay online via secure payment gateway"}
                                                                {method === "Wallet" && "Pay using your digital wallet"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-400">
                                                        {method === "Credit Card" && (
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                            </svg>
                                                        )}
                                                        {method === "Cash" && (
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                        )}
                                                        {method === "Online Payment" && (
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                            </svg>
                                                        )}
                                                        {method === "Wallet" && (
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Important Note */}
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-amber-900 mb-2">Important Information</h4>
                                                <ul className="text-sm text-amber-800 space-y-2">
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-amber-600">•</span>
                                                        Changing payment method may affect the total amount due
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-amber-600">•</span>
                                                        Some payment methods may have additional processing fees
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="text-amber-600">•</span>
                                                        Online payments are processed securely
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t p-6">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setModalPaymentMethod(false)}
                                        className="flex-1 px-6 py-3.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition"
                                        disabled={isUpdatingPayment}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        // onClick={handlePaymentMethodUpdate}
                                        className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isUpdatingPayment}
                                    >
                                        {isUpdatingPayment ? (
                                            <span className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                Updating Payment Method...
                                            </span>
                                        ) : "Update Payment Method"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* ADDRESS UPDATE MODAL */}
                {modalAddressUpdate &&
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
                        onClick={() => setModalAddressUpdate(false)}
                    >
                        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setModalAddressUpdate(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            <LuArrowLeft className="text-xl" />
                                        </button>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Update Address</h2>
                                            <p className="text-gray-600">Update your service location details</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <form onSubmit={handleSubmit(handleAddressUpdate)} className="space-y-6">
                                    <div className="flex space-x-3 mb-6 overflow-x-auto">
                                        {propertyTypes.map(btn => (
                                            <button
                                                key={btn}
                                                onClick={() => handleTypeChange(btn)}
                                                type="button"
                                                className={`flex items-center px-4 py-2 rounded-full transition duration-300 border cursor-pointer
                                    ${selectedType === btn ? "bg-teal-600 text-white shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                                            >
                                                {btn}
                                            </button>
                                        ))}
                                    </div>

                                    {/* FORM FIELDS - Updated to match Address component */}
                                    <div className="space-y-6">
                                        {/* City */}
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">City</label>
                                            <input
                                                {...register("city", { required: "City is required" })}
                                                type="text"
                                                placeholder="Enter City"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                                        </div>

                                        {/* Area */}
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Area</label>
                                            <input
                                                {...register("area", { required: "Area is required" })}
                                                type="text"
                                                placeholder="Enter Area"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                            {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
                                        </div>

                                        {/* Dynamic Fields based on Property Type */}
                                        {selectedType === "Villa" && (
                                            <>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Community / Street Name</label>
                                                    <input
                                                        {...register("community", { required: "Community is required" })}
                                                        type="text"
                                                        placeholder="Enter Community / Street Name"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    />
                                                    {errors.community && <p className="text-red-500 text-sm mt-1">{errors.community.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Villa No</label>
                                                    <input
                                                        {...register("villaNo", { required: "Villa number is required" })}
                                                        type="text"
                                                        placeholder="Enter Villa Number"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    />
                                                    {errors.villaNo && <p className="text-red-500 text-sm mt-1">{errors.villaNo.message}</p>}
                                                </div>
                                            </>
                                        )}

                                        {selectedType === "Other" && (
                                            <>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Street / Building Name</label>
                                                    <input
                                                        {...register("streetName", { required: "Street/Building name is required" })}
                                                        type="text"
                                                        placeholder="Enter Street / Building Name"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    />
                                                    {errors.streetName && <p className="text-red-500 text-sm mt-1">{errors.streetName.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Apartment / Villa No</label>
                                                    <input
                                                        {...register("otherNo", { required: "Apartment/Villa number is required" })}
                                                        type="text"
                                                        placeholder="Enter Apartment / Villa No"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    />
                                                    {errors.otherNo && <p className="text-red-500 text-sm mt-1">{errors.otherNo.message}</p>}
                                                </div>
                                            </>
                                        )}

                                        {selectedType !== "Villa" && selectedType !== "Other" && (
                                            <>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Building Name</label>
                                                    <input
                                                        {...register("buildingName", { required: "Building name is required" })}
                                                        type="text"
                                                        placeholder="Enter Building Name"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    />
                                                    {errors.buildingName && <p className="text-red-500 text-sm mt-1">{errors.buildingName.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-1">Apartment No</label>
                                                    <input
                                                        {...register("apartmentNo", { required: "Apartment number is required" })}
                                                        type="text"
                                                        placeholder="Enter Apartment No"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    />
                                                    {errors.apartmentNo && <p className="text-red-500 text-sm mt-1">{errors.apartmentNo.message}</p>}
                                                </div>
                                            </>
                                        )}

                                        {/* Submit Buttons */}
                                        <div className="pt-6 border-t">
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setModalAddressUpdate(false)}
                                                    className="flex-1 px-6 py-3.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                                                    disabled={isUpdatingAddress}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 px-6 py-3.5 text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-medium transition shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    disabled={isUpdatingAddress}
                                                >
                                                    {isUpdatingAddress ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            Updating...
                                                        </span>
                                                    ) : "Update Address"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};