import { FaArrowRight } from "react-icons/fa";
import dirhum from "../../assets/icon/dirhum.png";
import { useNavigate } from "react-router-dom";

const statusColors = {
    Pending: "bg-yellow-500",
    Upcoming: "bg-blue-500",
    Delivered: "bg-green-600",
    Cancelled: "bg-red-500",
    Unpaid: "bg-orange-500",
    OnHold: "bg-purple-500",
};

const BookingCard = ({ item }) => {
    const { serviceName, status, date, time, totalPay, propertyItems = [] } = item;
    const navigate = useNavigate();

    const handelManagebooking = item => {
        console.log(item.id);
        navigate(`/booking-details/${item.id}`);
    }

    return (
        <div className="w-full max-w-xl border-[#01788E] rounded-2xl p-5 shadow-md hover:shadow-lg transition cursor-pointer">

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-[20px] font-semibold text-gray-900">
                        {serviceName}
                    </h2>

                    {propertyItems.length > 0 && (
                        <p className="text-[14px] text-gray-600 mt-1">
                            {propertyItems.map((p, index) => (
                                <span key={index}>
                                    {p.title}
                                    {index !== propertyItems.length - 1 && ", "}
                                </span>
                            ))}
                        </p>
                    )}

                    <p className="text-[14px] text-gray-500 mt-1">
                        {date} • {time}
                    </p>
                </div>

                {/* Status Badge */}
                <span
                    className={`text-[12px] px-3 py-1 rounded-full text-white font-medium ${statusColors[status] || "bg-gray-500"}`}
                >
                    {status}
                </span>
            </div>

            {/* Line */}
            <div className="w-full border-b my-4"></div>

            {/* Bottom */}
            <div className="flex justify-between items-center">

                {/* Total Price */}
                <div className="flex items-center gap-1">
                    <img src={dirhum} className="h-5 w-5" alt="currency" />
                    <p className="text-[20px] font-bold text-gray-700">{totalPay}</p>
                </div>

                {/* Manage Button */}
                <button
                    onClick={() => handelManagebooking(item)}
                    className="flex items-center gap-2 text-[14px] font-semibold text-[#01788E] border border-[#01788E] px-4 py-2 rounded-lg hover:bg-[#F3FAFB] transition"
                >
                    Manage
                    <FaArrowRight className="text-[12px]" />
                </button>
            </div>
        </div>
    );
};

export default BookingCard;