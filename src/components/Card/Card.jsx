import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
// import { useItem } from "../../provider/ItemProvider";

const Card = ({ service }) => {
    const { image, title, rated, totalBooking, des1, des2, des3 } = service;
    const [showModal, setShowModal] = useState(false);
    // const { data } = useItem();


    return (
        <div className="overflow-hidden bg-white relative">
            {/* Image Section */}
            <img
                className="object-cover w-full h-80 md:h-64"
                src={image}
                alt={title}
            />

            {/* Content Section */}
            <div className="p-6 md:p-8  absolute top-[210px] rounded-t-4xl w-full bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    {/* Left Side Info */}
                    <div>
                        <h2 className="block mt-2 text-xl font-bold">
                            {title}
                        </h2>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <FaStar />
                            <p>{rated}/5</p>
                            <p>({totalBooking})</p>
                        </div>
                    </div>

                    {/* Info Icon */}
                    <div
                        onClick={() => setShowModal(true)}
                        className="text-black cursor-pointer"
                    >
                        <IoInformationCircleOutline className="text-3xl font-extralight" />
                    </div>
                </div>

                {/* Warning Message */}
                {/* {data.length < 1 && <div className="bg-[#F8D7DA] rounded-md py-2 mt-5">
                    <p className="text-red-500 text-center text-sm">
                        Please select any service to continue
                    </p>
                </div>} */}
            </div>

            {/* Modal */}
            {showModal && (
                <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-[90%] max-w-xl relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-3 right-4 text-gray-600 hover:text-black text-2xl font-extrabold"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>

                        {/* Modal Content */}
                        <h2 className="text-xl font-semibold border-b border-dashed pb-4">
                            Our {title} service includes::
                        </h2>
                        <div className="space-y-2 text-gray-700 p-4">
                            <li>{des1}</li>
                            <li>{des2}</li>
                            <li>{des3}</li>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;