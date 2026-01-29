/* eslint-disable react-hooks/exhaustive-deps */
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { PiBookThin } from "react-icons/pi";
import { SlHandbag } from "react-icons/sl";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import BookingCard from "../components/BookingCard/BookingCard";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function UserBooking() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [filteredData, setFilteredData] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const axiosSecure = useAxiosSecure();


  const tabs = [
    { id: "Upcoming", label: "Upcoming", icon: <MdOutlineWatchLater /> },
    { id: "Delivered", label: "Delivered", icon: <MdOutlineWatchLater /> },
    { id: "Cancelled", label: "Cancelled", icon: <MdOutlineWatchLater /> },
    { id: "Unpaid", label: "Unpaid", icon: <PiBookThin /> },
    { id: "Pending", label: "Pending", icon: <MdOutlineWatchLater /> },
    { id: "OnHold", label: "On Hold", icon: <MdOutlineWatchLater /> },
    { id: "Completed", label: "Completed", icon: <MdOutlineWatchLater /> },
  ];

  const { data: booking = {}, isLoading } = useQuery({
    queryKey: ["bookingUser"],
    queryFn: async () => {
      const res = await axiosSecure.get("/booking/my-booking");
      return res.data;
    },
  });
  const bookingData = booking?.Data || [];

  // Filter when tab changes
  useEffect(() => {
    setTabLoading(true);

    const timeout = setTimeout(() => {
      const result = bookingData.filter(
        (b) => b.status.toLowerCase() === activeTab.toLowerCase()
      );

      setFilteredData(result);
      setTabLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeTab, bookingData]);

  return (
    <div className="border border-[#E5E7EB] px-2 md:px-6 py-4 rounded-lg bg-white w-full max-w-4xl mx-auto">
      <h2 className="flex items-center gap-2.5 text-xl font-semibold border-b border-[#E5E7EB] pb-3 text-[#5D4F52]">
        <FaCalendarAlt className="text-[#01788E]" /> My Bookings
      </h2>

      <div className="mt-10 flex flex-col items-center">
        <nav
          className="hide-scroll-shadow no-scrollbar  flex flex-nowrap  items-center  gap-3  w-full  overflow-x-auto  px-2 justify-start  md:justify-center overflow-scroll
          "
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 cursor-pointer text-[14px] rounded-3xl px-4 py-1 whitespace-nowrap transition
                ${activeTab === tab.id
                  ? "bg-[#01788E] text-white"
                  : "border border-[#01788E] text-[#5D4F52] bg-white"
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        {(isLoading || tabLoading) && (
          <p className="mt-10 text-gray-500">Loading...</p>
        )}

        {!isLoading && !tabLoading && filteredData.length === 0 && (
          <div className="border border-[#E5E7EB] rounded-md mt-10 w-full max-w-xl py-16 flex flex-col items-center text-center">
            <SlHandbag className="text-4xl text-[#5D4F52] mb-4" />
            <p className="font-semibold text-[#5D4F52] text-lg">
              No {activeTab} jobs!
            </p>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              Check again later.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4 w-full items-center">
          {!isLoading &&
            !tabLoading &&
            filteredData.map((item) => (
              <BookingCard key={item.id} item={item} />
            ))}
        </div>
      </div>

    </div>
  );
};