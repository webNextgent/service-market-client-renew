    /* eslint-disable react-hooks/exhaustive-deps */
    import { useEffect, useRef, useState } from "react";
    import NextBtn from "../../../components/NextBtn/NextBtn";
    import ServiceDetails from "../../../components/ServiceDetails/ServiceDetails";
    import Summery from "../../../components/Summery/Summery";
    import { useSummary } from "../../../provider/SummaryProvider";
    import { IoIosArrowBack } from "react-icons/io";
    import { IoIosArrowForward } from "react-icons/io";
    import { useQuery } from "@tanstack/react-query";
    import dirhum from '../../../assets/icon/dirhum.png';

    const DateTime = () => {
        const [selectedDay, setSelectedDay] = useState(null);
        const [selectedTime, setSelectedTime] = useState(null);
        const scrollerRef = useRef(null);
        const [open, setOpen] = useState(false);
        const { itemSummary, totalAfterDiscount, serviceTitle, showInput, setShowInput, setDate, setTime, liveAddress, totalVatRate, setCassieModalOpen } = useSummary();


        const { data: dateTime, isLoading } = useQuery({
            queryKey: ['date-time-user'],
            queryFn: async () => {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/date-time`);
                if (!res.ok) {
                    throw new Error("Failed to fetch date-time");
                }
                return res.json();
            }
        });

        // Format date to display
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

        // Get full date label
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

        // Prepare days data from API - Merge duplicate dates
        const getAvailableDays = () => {
            if (!dateTime?.Data || !Array.isArray(dateTime.Data)) {
                return [];
            }

            // Create a map to group by date
            const dateMap = new Map();

            dateTime.Data.forEach(item => {
                const date = item.date;
                const timeSlots = item.time || [];

                if (dateMap.has(date)) {
                    // If date already exists, merge time slots
                    const existing = dateMap.get(date);
                    // Add unique time slots
                    timeSlots.forEach(slot => {
                        if (!existing.timeSlots.includes(slot)) {
                            existing.timeSlots.push(slot);
                        }
                    });
                } else {
                    // If date doesn't exist, add new entry
                    dateMap.set(date, {
                        id: item.id,
                        date: date,
                        short: formatDateForDisplay(date),
                        label: getFullDateLabel(date),
                        timeSlots: [...timeSlots] // Create a new array
                    });
                }
            });

            // Convert map to array and sort by date
            const daysArray = Array.from(dateMap.values()).sort((a, b) =>
                new Date(a.date) - new Date(b.date)
            );

            return daysArray;
        };

        // Get available time slots for selected day
        const getAvailableTimes = () => {
            if (!selectedDay) return [];

            const selectedDayData = getAvailableDays().find(day => day.date === selectedDay);
            if (!selectedDayData || !selectedDayData.timeSlots) return [];

            // Sort time slots if needed
            return selectedDayData.timeSlots.sort((a, b) => {
                // Simple time comparison - you might want to improve this
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

        useEffect(() => {
            // Auto-select the first date when data loads
            if (dateTime?.Data && dateTime.Data.length > 0 && !selectedDay) {
                const days = getAvailableDays();
                if (days.length > 0) {
                    const firstDay = days[0].date;
                    setSelectedDay(firstDay);
                }
            }
        }, [dateTime, selectedDay]);

        useEffect(() => {
            setDate(selectedDay);
            setTime(selectedTime);
        }, [selectedDay, selectedTime]);

        const availableDays = getAvailableDays();
        const availableTimes = getAvailableTimes();

        // Debug log to check merged data
        console.log("Merged days data:", availableDays);

        if (isLoading) {
            return (
                <div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading available dates...</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-10 md:mt-0">
                <div className="hidden md:block mt-6 md:mt-0">
                    <ServiceDetails title="Date & Time" currentStep={3} />
                </div>

                <div className="flex gap-8 mt-5">
                    <div className="md:w-[60%] mb-4 space-y-4">
                        <div className="p-6 bg-white rounded-lg shadow-sm">

                            {/* Day Selector */}
                            <h3 className="text-lg font-semibold mb-4">
                                Which day would you like us to come?
                            </h3>

                            {availableDays.length === 0 ? (
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

                                    {/* Time Selector */}
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
                                </>
                            )}

                            {/* Note */}
                            <div className="mt-8 p-4 bg-gray-50 border rounded-md flex gap-4 text-sm text-gray-700">
                                <svg className="w-5 h-5 text-gray-500 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 9v2m0 4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z" strokeWidth="1.5" />
                                </svg>

                                <div>
                                    Free cancellation up to 6 hours before your booking start time.{" "}
                                    <a href="#" className="text-teal-600 underline">View cancellation policy</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Summery
                        serviceTitle={serviceTitle}
                        itemSummary={itemSummary}
                        totalVatRate={totalVatRate}
                        showInput={showInput}
                        setShowInput={setShowInput}
                        date={selectedDay ? getFullDateLabel(selectedDay) : null}
                        time={selectedTime}
                        address={liveAddress?.displayAddress}
                        isValid={!!selectedDay && !!selectedTime}
                        open={open}
                        setOpen={setOpen}
                    />
                </div>

                {/* for mobile & tablet view  */}
                <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border-t border-gray-200 z-50">
                    <div className="flex justify-center px-3 py-2">
                        <div className="flex items-center gap-4">

                            {/* View Summary */}
                            <button
                                onClick={() => setOpen(true)}
                                className="cursor-pointer select-none
                    active:scale-[0.98] transition-transform
                    focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:ring-offset-2
                    rounded-lg px-1"
                            >
                                <p className="text-[10px] text-gray-500 font-medium uppercase">
                                    View Summary
                                </p>
                                <div className="flex items-center gap-1.5 justify-center">
                                    <img src={dirhum} className="w-3.5 h-3.5" alt="" />
                                    <span className="text-base font-bold text-gray-900">
                                        {totalAfterDiscount.toFixed(2)}
                                    </span>
                                    <span className="text-gray-400 text-sm">›</span>
                                </div>
                            </button>

                            {/* Next Button (Fixed Width) */}
                            <div className="w-[140px]">
                                <NextBtn
                                    disabled={!selectedDay || !selectedTime}
                                    onClick={() => {
                                        setCassieModalOpen(true);
                                        return false;
                                    }}
                                />
                            </div>

                        </div>
                    </div>
                </div>

                <div className="hidden lg:block">
                    <NextBtn
                        // disabled={!selectedDay || !selectedTime}
                        disabled={!selectedDay || !selectedTime}
                        onClick={() => {
                            setCassieModalOpen(true);
                            return false;
                        }}
                    />
                </div>
            </div >
        );
    };

    export default DateTime;