import { useState } from "react";
import dirhum from '../../assets/icon/dirhum.png';
import { MdOutlineArrowRightAlt } from "react-icons/md";
import ContentModal from "../ContentModal/ContentModal";

const CoverContent = ({ content }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const properties = Array.isArray(content?.propertyType)
        ? content.propertyType
        : [];

    const handleOpenModal = (property) => {
        setSelectedProperty(property);
        setShowModal(true);
    };

    return (
        <div className="mt-3 md:mt-6">
            {properties?.map((property, idx) => (
                <div
                    key={idx}
                    onClick={() => handleOpenModal(property)}
                    className="group cursor-pointer transition-all duration-200 mb-4 md:mb-5 bg-white"
                >
                    <div className="flex items-start gap-4 lg:gap-5 border-b border-gray-300 pb-3 md:pb-0">
                        {/* Image - Professional Compact */}
                        <div className="relative mb-3 md:mb-0 md:shrink-0">
                            <div className="relative overflow-hidden rounded bg-gray-100">
                                <img
                                    src={property.image}
                                    alt={property.title}
                                    className="w-20 h-20 object-cover"
                                />
                                {/*  Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>

                        {/* Content - Compact */}
                        <div className="flex-1">
                            <div className="mb-2">
                                <h2 className="text-base md:text-md font-medium mb-1.5 line-clamp-1">
                                    {property.title}
                                </h2>
                                <p className="text-xs md:w-[80%] w-[85%] md:font-medium product-item-description">
                                    {property.description}
                                </p>
                            </div>

                            {/* Price & Button - Professional Layout */}
                            <div className="flex items-center justify-between">
                                {/* Price - Compact Professional */}
                                <div className="md:flex items-start md:items-center md:gap-2">
                                    <div className="text-xs font-medium">Starting from</div>

                                    <div className="flex items-center">
                                        <img
                                            className="h-3.5 w-3.5"
                                            src={dirhum}
                                            alt="AED"
                                        />
                                        <span className="font-medium text-[15px] text-gray-900">
                                            {property.startFrom.toLocaleString()}
                                        </span>
                                    </div>
                                </div>


                                {/* Button - Professional Compact */}
                                <div className="">
                                    <button className="border border-[#01788E] text-[#01788E] rounded-sm add-to-card px-3 text-xs py-1.5 flex justify-center items-center">
                                        <span>{property.propertyItems?.length || 0} Options</span>
                                        <MdOutlineArrowRightAlt className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Optional: Professional Meta Info */}
                            <div className="mt-3 hidden md:flex items-center gap-4">
                                {property.features && property.features.length > 0 && (
                                    <>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <BsCheckCircle className="w-3 h-3 text-green-500" />
                                            {property.features[0]}
                                        </span>
                                        {property.features.length > 1 && (
                                            <span className="text-xs text-gray-500">+{property.features.length - 1} more</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* 🔹 Modal */}
            {showModal && (
                <ContentModal
                    setShowModal={setShowModal}
                    property={selectedProperty}
                />
            )}
        </div>
    );
};

export default CoverContent;