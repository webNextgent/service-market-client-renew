import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoBrowser } from "react-icons/go";
import { IoAddOutline, IoTrashOutline, IoCloseOutline, IoTimeOutline } from "react-icons/io5";
import { MdDateRange, MdAccessTime } from "react-icons/md";
import { FiCalendar, FiClock, FiTrash2 } from "react-icons/fi";
import { BsClock } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

// Helper functions outside component
const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    const [time, period] = time12h.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);

    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

const AdminDateTime = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [appliedRecords, setAppliedRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState({ index: null, type: null });
    const axiosSecure = useAxiosSecure();

    const addSlot = () => {
        setTimeSlots([...timeSlots, { start: "", end: "" }]);
    };

    const updateSlot = (index, field, value) => {
        const updated = [...timeSlots];
        updated[index][field] = value;
        setTimeSlots(updated);
    };

    const removeSlot = (index) => {
        setTimeSlots(timeSlots.filter((_, i) => i !== index));
    };

    // Generate time options for 12-hour format
    const generateTimeOptions = () => {
        const times = [];

        // Generate times with 15 minute intervals
        for (let hour = 1; hour <= 12; hour++) {
            for (let minute of ["00", "15", "30", "45"]) {
                times.push(`${hour}:${minute} AM`);
                times.push(`${hour}:${minute} PM`);
            }
        }

        // Add 12:00 AM and 12:00 PM
        times.push("12:00 AM");
        times.push("12:00 PM");

        // Sort by converting to 24h format first
        return [...new Set(times)].sort((a, b) => {
            const timeA = convertTo24Hour(a);
            const timeB = convertTo24Hour(b);
            return timeA.localeCompare(timeB);
        });
    };

    const timeOptions = generateTimeOptions();

    const handleApply = async () => {
        if (!fromDate || !toDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        if (timeSlots.length === 0) {
            toast.error("Please add at least one time slot");
            return;
        }

        // Validate all time slots
        const invalidSlots = timeSlots.filter(slot => !slot.start || !slot.end);
        if (invalidSlots.length > 0) {
            toast.error("Please fill in all time slots");
            return;
        }

        // Validate start time is before end time
        for (const slot of timeSlots) {
            const start24h = convertTo24Hour(slot.start);
            const end24h = convertTo24Hour(slot.end);

            if (start24h >= end24h) {
                toast.error("Start time must be before end time");
                return;
            }
        }

        // Format dates for backend (YYYY-MM-DD)
        const formatDateForBackend = (date) => {
            if (!date) return "";
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        };

        const startDate = formatDateForBackend(fromDate);
        const endDate = formatDateForBackend(toDate);

        // **এখন থেকে 12-hour format এ পাঠাবো (AM/PM)**
        const formattedSlots = timeSlots.map(
            (slot) => `${slot.start} - ${slot.end}`
        );

        const payload = {
            startDate: startDate,
            endDate: endDate,
            timeSlots: formattedSlots,
        };

        console.log("Sending payload (12-hour format):", payload);

        setIsLoading(true);
        try {
            const res = await axiosSecure.post('/date-time/create', payload);

            if (res?.data?.success) {
                toast.success('Time slots added successfully');
                // Reset form
                setFromDate(null);
                setToDate(null);
                setTimeSlots([]);
                // Refresh data
                fetchDateTimeData();
            } else {
                toast.error(res?.message || "Failed to add time slots");
            }
        } catch (error) {
            console.error("Error sending data:", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDateTimeData = async () => {
        try {
            const res = await axiosSecure.get(`/date-time`);

            if (res?.data?.success) {
                setAppliedRecords(res?.data?.Data || []);
            }
        } catch (error) {
            console.error("GET Error:", error);
        }
    };

    const deleteTimeSlot = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await axiosSecure.delete(`/date-time/delete/${id}`);
                        if (res?.data?.success) {
                            toast.success("Configuration deleted");
                            fetchDateTimeData();
                        } else {
                            toast.error(res?.message || "Failed to delete");
                        }
                    } catch (err) {
                        console.log(err);
                        toast.error('Something was wrong');
                    }
                }
            })
        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Failed to delete");
        }
    };

    useEffect(() => {
        fetchDateTimeData();
    }, []);

    // Close time picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showTimePicker.index !== null && !event.target.closest('.time-picker-dropdown')) {
                setShowTimePicker({ index: null, type: null });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showTimePicker]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            console.log(error);
            return dateString;
        }
    };

    // Custom input component for DatePicker with manual input capability
    const CustomDateInput = React.forwardRef(({ value, onClick, onChange, placeholder }, ref) => (
        <div className="relative">
            <input
                type="text"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 font-medium"
                value={value}
                onClick={onClick}
                onChange={onChange}
                placeholder={placeholder}
                ref={ref}
            />
            <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={onClick}
            >
                <FiCalendar className="text-xl" />
            </div>
        </div>
    ));

    // Function to group time slots by date for table display
    const getGroupedData = () => {
        console.log("Grouping data from appliedRecords:", appliedRecords);

        const grouped = {};

        appliedRecords.forEach((record, recordIndex) => {
            console.log(`Processing record ${recordIndex}:`, record);

            // Handle different data structures
            if (record.timeSlots && Array.isArray(record.timeSlots)) {
                record.timeSlots.forEach((slot, slotIndex) => {
                    console.log(`Slot ${slotIndex}:`, slot);

                    // Check if slot has date property
                    const dateKey = slot.date || record.startDate || record.date;

                    if (!grouped[dateKey]) {
                        grouped[dateKey] = {
                            date: dateKey,
                            slots: [],
                            fullDate: formatDate(dateKey),
                            recordId: record.id || record._id,
                            dayName: new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long' })
                        };
                    }

                    // Extract time slot info
                    let startTime, endTime;

                    if (typeof slot === 'string') {
                        // Format: "10:00 AM - 12:00 PM"
                        const [start, end] = slot.split(' - ');
                        // যেহেতু এখন 12-hour format এ আসবে, তাই convertTo12Hour দরকার নেই
                        startTime = start;
                        endTime = end;
                    } else if (slot.startTime && slot.endTime) {
                        // Object format: {startTime: "10:00 AM", endTime: "12:00 PM"}
                        startTime = slot.startTime;
                        endTime = slot.endTime;
                    } else if (slot.start && slot.end) {
                        // Object format: {start: "10:00 AM", end: "12:00 PM"}
                        startTime = slot.start;
                        endTime = slot.end;
                    }

                    if (startTime && endTime) {
                        grouped[dateKey].slots.push({
                            startTime,
                            endTime,
                            display: `${startTime} - ${endTime}`
                        });
                    }
                });
            } else if (record.time && Array.isArray(record.time)) {
                // Alternative structure: record.time array
                record.time.forEach((slot, slotIndex) => {
                    console.log(`Time slot ${slotIndex}:`, slot);

                    const dateKey = record.date || record.startDate;

                    if (!grouped[dateKey]) {
                        grouped[dateKey] = {
                            date: dateKey,
                            slots: [],
                            fullDate: formatDate(dateKey),
                            recordId: record.id || record._id,
                            dayName: new Date(dateKey).toLocaleDateString('en-US', { weekday: 'long' })
                        };
                    }

                    if (typeof slot === 'string') {
                        // এখন 12-hour format আসবে: "10:00 AM - 1:00 PM"
                        const [start, end] = slot.split(' - ');
                        grouped[dateKey].slots.push({
                            startTime: start,
                            endTime: end,
                            display: `${start} - ${end}`
                        });
                    }
                });
            }
        });

        console.log("Grouped result:", grouped);

        // Convert to array and sort by date
        return Object.values(grouped).sort((a, b) => {
            try {
                return new Date(a.date) - new Date(b.date);
            } catch (error) {
                console.log(error);
                return 0;
            }
        });
    };

    const groupedDates = getGroupedData();
    console.log("Final grouped dates for display:", groupedDates);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                                <GoBrowser className="text-xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-font-semibold text-gray-900">Date & Time Management</h1>
                                <p className="text-gray-600 mt-1">Configure available time slots for appointments</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <BsClock className="text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">
                                        {groupedDates.length} {groupedDates.length === 1 ? 'Date' : 'Dates'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Configuration */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Configuration Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <MdDateRange className="text-lg text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semifont-semibold text-gray-900">Configure Time Slots</h2>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Date Range */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                        <FiCalendar className="text-gray-500" />
                                        Date Range
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2.5">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Start Date
                                            </label>
                                            <DatePicker
                                                selected={fromDate}
                                                onChange={(date) => setFromDate(date)}
                                                selectsStart
                                                startDate={fromDate}
                                                endDate={toDate}
                                                minDate={new Date()}
                                                dateFormat="MM/dd/yyyy"
                                                placeholderText="MM/DD/YYYY"
                                                customInput={
                                                    <CustomDateInput
                                                        placeholder="MM/DD/YYYY"
                                                    />
                                                }
                                                popperClassName="z-50"
                                                popperPlacement="bottom-start"
                                                isClearable
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="block text-sm font-medium text-gray-700">
                                                End Date
                                            </label>
                                            <DatePicker
                                                selected={toDate}
                                                onChange={(date) => setToDate(date)}
                                                selectsEnd
                                                startDate={fromDate}
                                                endDate={toDate}
                                                minDate={fromDate || new Date()}
                                                dateFormat="MM/dd/yyyy"
                                                placeholderText="MM/DD/YYYY"
                                                customInput={
                                                    <CustomDateInput
                                                        placeholder="MM/DD/YYYY"
                                                    />
                                                }
                                                popperClassName="z-50"
                                                popperPlacement="bottom-start"
                                                isClearable
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Time Slots */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <FiClock className="text-gray-500" />
                                            Time Slots (12-hour format)
                                        </h3>
                                        <button
                                            onClick={addSlot}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow"
                                        >
                                            <IoAddOutline className="text-lg" />
                                            Add Slot
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {timeSlots.map((slot, index) => (
                                            <div key={index} className="relative flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Start Time */}
                                                    <div className="space-y-1.5">
                                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                            Start Time
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer"
                                                                value={slot.start}
                                                                onClick={() => setShowTimePicker({
                                                                    index,
                                                                    type: 'start',
                                                                    open: true
                                                                })}
                                                                placeholder="Click to select time"
                                                                readOnly
                                                            />
                                                            <div
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                                                onClick={() => setShowTimePicker({
                                                                    index,
                                                                    type: 'start',
                                                                    open: true
                                                                })}
                                                            >
                                                                <FiClock className="text-lg" />
                                                            </div>

                                                            {/* Time Picker Dropdown for Start Time */}
                                                            {showTimePicker.index === index && showTimePicker.type === 'start' && (
                                                                <div className="absolute left-0 right-0 top-full mt-1 z-10 time-picker-dropdown">
                                                                    <div className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                                        <div className="p-2 border-b border-gray-200 bg-gray-50">
                                                                            <p className="text-xs text-gray-600 font-medium">Select Start Time</p>
                                                                        </div>
                                                                        <div className="max-h-48 overflow-y-auto">
                                                                            {timeOptions.map((timeOption, idx) => (
                                                                                <div
                                                                                    key={idx}
                                                                                    className={`px-3 py-2 hover:bg-blue-50 cursor-pointer ${slot.start === timeOption ? 'bg-blue-100' : ''}`}
                                                                                    onClick={() => {
                                                                                        updateSlot(index, 'start', timeOption);
                                                                                        setShowTimePicker({ index: null, type: null });
                                                                                    }}
                                                                                >
                                                                                    <span className="text-gray-800">{timeOption}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* End Time */}
                                                    <div className="space-y-1.5">
                                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                            End Time
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer"
                                                                value={slot.end}
                                                                onClick={() => setShowTimePicker({
                                                                    index,
                                                                    type: 'end',
                                                                    open: true
                                                                })}
                                                                placeholder="Click to select time"
                                                                readOnly
                                                            />
                                                            <div
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                                                onClick={() => setShowTimePicker({
                                                                    index,
                                                                    type: 'end',
                                                                    open: true
                                                                })}
                                                            >
                                                                <FiClock className="text-lg" />
                                                            </div>

                                                            {/* Time Picker Dropdown for End Time */}
                                                            {showTimePicker.index === index && showTimePicker.type === 'end' && (
                                                                <div className="absolute left-0 right-0 top-full mt-1 z-10 time-picker-dropdown">
                                                                    <div className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                                        <div className="p-2 border-b border-gray-200 bg-gray-50">
                                                                            <p className="text-xs text-gray-600 font-medium">Select End Time</p>
                                                                        </div>
                                                                        <div className="max-h-48 overflow-y-auto">
                                                                            {timeOptions.map((timeOption, idx) => (
                                                                                <div
                                                                                    key={idx}
                                                                                    className={`px-3 py-2 hover:bg-blue-50 cursor-pointer ${slot.end === timeOption ? 'bg-blue-100' : ''}`}
                                                                                    onClick={() => {
                                                                                        updateSlot(index, 'end', timeOption);
                                                                                        setShowTimePicker({ index: null, type: null });
                                                                                    }}
                                                                                >
                                                                                    <span className="text-gray-800">{timeOption}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {timeSlots.length > 1 && (
                                                    <button
                                                        onClick={() => removeSlot(index)}
                                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Remove slot"
                                                    >
                                                        <IoCloseOutline className="text-xl" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {timeSlots.length === 0 && (
                                            <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                                                    <MdAccessTime className="text-3xl text-blue-400" />
                                                </div>
                                                <p className="text-gray-600 font-medium">No time slots added</p>
                                                <p className="text-sm text-gray-400 mt-1">Add your first time slot to get started</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <div className="pt-6 border-t border-gray-100">
                                    <button
                                        onClick={handleApply}
                                        disabled={isLoading || timeSlots.length === 0 || !fromDate || !toDate}
                                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semifont-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Applying Slots...
                                            </>
                                        ) : (
                                            <>
                                                <span>Apply Time Slots</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Preview */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                            <h3 className="text-lg font-semifont-semibold text-gray-900 mb-4">Quick Overview</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FiCalendar className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Selected Range</p>
                                            <p className="font-semifont-semibold text-gray-900">
                                                {fromDate && toDate ? (
                                                    <>
                                                        {fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </>
                                                ) : (
                                                    "Not set"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <BsClock className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Time Slots</p>
                                            <p className="font-semifont-semibold text-gray-900">{timeSlots.length} slots</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <IoTimeOutline className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Days</p>
                                            <p className="font-semifont-semibold text-gray-900">
                                                {fromDate && toDate ? (
                                                    Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1
                                                ) : 0} days
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview Slots */}
                        {timeSlots.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semifont-semibold text-gray-900 mb-4">Preview (12-hour format)</h3>
                                <div className="space-y-3">
                                    {timeSlots.map((slot, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="font-medium text-gray-900">
                                                    {slot.start} - {slot.end}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">Slot {index + 1}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs text-blue-700">
                                        <span className="font-medium">Note:</span> Time slots will be sent to server in 12-hour format (AM/PM).
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Applied Records Table */}
                {groupedDates.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semifont-semibold text-gray-900">Configured Time Slots (12-hour format)</h2>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Showing {groupedDates.length} dates
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-4 px-6 text-left text-xs font-semifont-semibold text-gray-600 uppercase tracking-wider border-b">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="text-gray-500" />
                                                Date
                                            </div>
                                        </th>
                                        <th className="py-4 px-6 text-left text-xs font-semifont-semibold text-gray-600 uppercase tracking-wider border-b">
                                            <div className="flex items-center gap-2">
                                                <BsClock className="text-gray-500" />
                                                Time Slots
                                            </div>
                                        </th>
                                        <th className="py-4 px-6 text-left text-xs font-semifont-semibold text-gray-600 uppercase tracking-wider border-b">
                                            Total
                                        </th>
                                        <th className="py-4 px-6 text-left text-xs font-semifont-semibold text-gray-600 uppercase tracking-wider border-b">
                                            Status
                                        </th>
                                        <th className="py-4 px-6 text-left text-xs font-semifont-semibold text-gray-600 uppercase tracking-wider border-b">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {groupedDates.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-semifont-semibold text-gray-900">
                                                        {item.fullDate}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.dayName}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-2 max-w-md">
                                                    {item.slots.map((slot, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                                                        >
                                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                                            {slot.display || `${slot.startTime} - ${slot.endTime}`}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.slots.length} slots
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                    Active
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => deleteTimeSlot(item.recordId)}
                                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-300 hover:border-red-200"
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">{groupedDates.length}</span> date configurations loaded
                                </div>
                                <div className="text-xs text-gray-500">
                                    All times in 12-hour format (AM/PM)
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {groupedDates.length === 0 && appliedRecords.length === 0 && (
                    <div className="mt-8 text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
                        <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
                            <MdAccessTime className="text-4xl text-blue-400" />
                        </div>
                        <h4 className="text-xl font-semifont-semibold text-gray-700 mb-2">No Time Slots Configured</h4>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Configure your first date range and time slots to get started
                        </p>
                        <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
                            <IoAddOutline className="text-lg" />
                            <span>Add your first configuration</span>
                        </div>
                    </div>
                )}

                {groupedDates.length === 0 && appliedRecords.length > 0 && (
                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semifont-semibold text-yellow-800">Data Format Issue</h3>
                        </div>
                        <p className="text-yellow-700 mb-3">
                            Data is available from API but couldn't be displayed properly. Check the console for details.
                        </p>
                        <button
                            onClick={() => console.log("Applied Records:", appliedRecords)}
                            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                        >
                            Check Console for Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDateTime;