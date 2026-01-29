/* eslint-disable no-unused-vars */
import { FiEdit3, FiTrash2, FiPlus, FiMapPin, FiHome, FiBriefcase, FiMap, FiX } from "react-icons/fi";
import { useSummary } from "../provider/SummaryProvider";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function SavedLocations() {
    const { getAddresses, removeAddress, setSaveAddress } = useSummary();
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedType, setSelectedType] = useState("Apartment");
    const buttons = ["Apartment", "Villa", "Office", "Other"];

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid }
    } = useForm({
        mode: "onChange"
    });

    useEffect(() => {
        const addresses = getAddresses();
        setSavedAddresses(addresses);
    }, [getAddresses]);

    // Generate ID ফাংশন
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    // Type পরিবর্তনের হ্যান্ডলার
    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    // Display address ফরম্যাট করুন
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

    // Form সাবমিশন হ্যান্ডলার
    const onSubmit = (data) => {
        const finalData = {
            ...data,
            type: selectedType,
            displayAddress: formatDisplayAddress(selectedType, data),
            timestamp: new Date().toISOString()
        };

        if (modalMode === "edit" && selectedAddress?.id) {
            // Update existing address
            setSaveAddress(prev => {
                const updated = prev.map(addr =>
                    addr.id === selectedAddress.id
                        ? { ...addr, ...finalData, updatedAt: new Date().toISOString() }
                        : addr
                );
                localStorage.setItem("saveAddress", JSON.stringify(updated));
                return updated;
            });
        } else {
            // Add new address
            const newAddress = {
                id: generateId(),
                ...finalData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            setSaveAddress(prev => {
                const updated = [...prev, newAddress];
                localStorage.setItem("saveAddress", JSON.stringify(updated));
                return updated;
            });
        }

        // মডেল বন্ধ করুন এবং লিস্ট রিফ্রেশ করুন
        handleCloseModal();
        const addresses = getAddresses();
        setSavedAddresses(addresses);
    };

    // Delete হ্যান্ডলার
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            removeAddress(id);
            setSavedAddresses(prev => prev.filter(address => address.id !== id));
        }
    };

    // Edit বাটনে ক্লিক করলে
    const handleEdit = (address) => {
        setSelectedAddress(address);
        setSelectedType(address.type || "Apartment");
        setModalMode("edit");

        // ফর্ম ফিল করুন
        reset({
            city: address.city || "",
            area: address.area || "",
            buildingName: address.buildingName || "",
            apartmentNo: address.apartmentNo || "",
            community: address.community || "",
            villaNo: address.villaNo || "",
            streetName: address.streetName || "",
            otherNo: address.otherNo || "",
            nickname: address.nickname || "",
            additionalInfo: address.additionalInfo || ""
        });

        setIsModalOpen(true);
    };

    // Add New বাটনে ক্লিক করলে
    const handleAddNew = () => {
        setSelectedAddress(null);
        setSelectedType("Apartment");
        setModalMode("add");

        // ফর্ম রিসেট করুন
        reset({
            city: "",
            area: "",
            buildingName: "",
            apartmentNo: "",
            community: "",
            villaNo: "",
            streetName: "",
            otherNo: "",
            nickname: "",
            additionalInfo: ""
        });

        setIsModalOpen(true);
    };

    // মডেল বন্ধ করার হ্যান্ডলার
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAddress(null);
        setSelectedType("Apartment");
    };

    // Type আইকন পান
    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'home':
            case 'apartment':
            case 'villa':
                return <FiHome className="text-teal-600" />;
            case 'office':
                return <FiBriefcase className="text-blue-600" />;
            default:
                return <FiMapPin className="text-gray-600" />;
        }
    };

    // Type badge color পান
    const getTypeBadgeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'home':
            case 'apartment':
                return "bg-teal-100 text-teal-800";
            case 'villa':
                return "bg-purple-100 text-purple-800";
            case 'office':
                return "bg-blue-100 text-blue-800";
            case 'other':
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Address ফরম্যাট করুন
    const formatAddress = (item) => {
        if (item.displayAddress) return item.displayAddress;

        const parts = [];
        if (item.apartmentNo || item.villaNo || item.otherNo)
            parts.push(item.apartmentNo || item.villaNo || item.otherNo);
        if (item.buildingName || item.community || item.streetName)
            parts.push(item.buildingName || item.community || item.streetName);
        if (item.area) parts.push(item.area);
        if (item.city) parts.push(item.city);

        return parts.join(", ");
    };

    return (
        <>
            {/* Main Saved Locations Component */}
            <div className="border border-[#E5E7EB] rounded-md bg-white p-5 w-full max-w-7xl mx-auto">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[#5D4F52] border-b pb-3">
                    <FiMapPin className="text-[#01788E]" size={20} />
                    Saved Locations
                </h2>

                {savedAddresses.length === 0 ? (
                    <div className="mt-6 text-center py-8">
                        <div className="mb-4">
                            <FiMapPin size={48} className="text-gray-300 mx-auto" />
                        </div>
                        <p className="text-gray-500 mb-2">No saved addresses yet</p>
                        <p className="text-gray-400 text-sm mb-6">
                            Save your frequently used addresses for faster booking
                        </p>
                        <button
                            onClick={handleAddNew}
                            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-2 mx-auto"
                        >
                            <FiPlus size={18} />
                            Add Your First Address
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col gap-4">
                        {savedAddresses.map((item) => (
                            <div
                                key={item.id}
                                className="border border-[#D1E5EA] rounded-md p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-[15px] font-medium text-[#5D4F52]">
                                                        {item.nickname || "Untitled Address"}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-1 rounded ${getTypeBadgeColor(item.type)}`}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    {item.updatedAt ? "Updated" : "Added"} on {new Date(item.updatedAt || item.createdAt || item.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-[13px] text-gray-600 mt-1 ml-11">
                                            {formatAddress(item)}
                                        </p>

                                        {item.additionalInfo && (
                                            <p className="text-xs text-gray-500 mt-2 ml-11">
                                                📝 {item.additionalInfo}
                                            </p>
                                        )}

                                        {item.mapLatitude && item.mapLongitude && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 ml-11">
                                                <FiMap size={12} />
                                                <span>
                                                    {item.mapLatitude.toFixed(4)}, {item.mapLongitude.toFixed(4)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-[#01788E] hover:bg-teal-50 rounded-full transition"
                                            title="Edit address"
                                        >
                                            <FiEdit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                                            title="Delete address"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add new address card */}
                        <button
                            onClick={handleAddNew}
                            className="border-2 border-dashed border-[#D1E5EA] rounded-md p-6 flex flex-col items-center justify-center w-full hover:bg-gray-50 transition hover:border-teal-300 group"
                        >
                            <div className="p-3 bg-teal-50 rounded-full mb-3 group-hover:bg-teal-100 transition-colors">
                                <FiPlus size={24} className="text-teal-600" />
                            </div>
                            <span className="text-[14px] text-[#5D4F52] font-medium">
                                Add New Address
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                                Save another location for faster checkout
                            </span>
                        </button>
                    </div>
                )}

                {/* Quick Stats */}
                {savedAddresses.length > 0 && (
                    <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                        <p>
                            You have <span className="font-medium text-teal-600">{savedAddresses.length}</span> saved
                            address{savedAddresses.length !== 1 ? 'es' : ''}
                        </p>
                    </div>
                )}
            </div>

            {/* Address Modal - Edit/Add */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {modalMode === "edit" ? "Edit Address" : "Add New Address"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                            {/* Type Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {buttons.map(btn => (
                                    <button
                                        key={btn}
                                        type="button"
                                        onClick={() => handleTypeChange(btn)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                            ${selectedType === btn
                                                ? "bg-teal-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>

                            {/* Nickname (Optional) */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Nickname (Optional)
                                </label>
                                <input
                                    {...register("nickname")}
                                    type="text"
                                    placeholder="Give this address a nickname"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* City - Required */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("city", { required: "City is required" })}
                                    type="text"
                                    placeholder="Enter City"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                )}
                            </div>

                            {/* Area - Required */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Area <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register("area", { required: "Area is required" })}
                                    type="text"
                                    placeholder="Enter Area"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                {errors.area && (
                                    <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
                                )}
                            </div>

                            {/* Dynamic Fields based on selected type */}
                            {selectedType === "Villa" && (
                                <>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Community / Street Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("community", { required: "Community is required" })}
                                            type="text"
                                            placeholder="Enter Community / Street Name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {errors.community && (
                                            <p className="text-red-500 text-sm mt-1">{errors.community.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Villa No <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("villaNo", { required: "Villa number is required" })}
                                            type="text"
                                            placeholder="Enter Villa Number"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {errors.villaNo && (
                                            <p className="text-red-500 text-sm mt-1">{errors.villaNo.message}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {selectedType === "Other" && (
                                <>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Street / Building Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("streetName", { required: "Street/Building name is required" })}
                                            type="text"
                                            placeholder="Enter Street / Building Name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {errors.streetName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.streetName.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Apartment / Villa No <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("otherNo", { required: "Apartment/Villa number is required" })}
                                            type="text"
                                            placeholder="Enter Apartment / Villa No"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {errors.otherNo && (
                                            <p className="text-red-500 text-sm mt-1">{errors.otherNo.message}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {selectedType !== "Villa" && selectedType !== "Other" && (
                                <>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Building Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("buildingName", { required: "Building name is required" })}
                                            type="text"
                                            placeholder="Enter Building Name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {errors.buildingName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.buildingName.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Apartment No <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            {...register("apartmentNo", { required: "Apartment number is required" })}
                                            type="text"
                                            placeholder="Enter Apartment No"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {errors.apartmentNo && (
                                            <p className="text-red-500 text-sm mt-1">{errors.apartmentNo.message}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Additional Info (Optional) */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Additional Information (Optional)
                                </label>
                                <textarea
                                    {...register("additionalInfo")}
                                    rows="3"
                                    placeholder="Floor, landmark, special instructions, etc."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-white pt-4 border-t flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!isValid}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors
                                        ${isValid
                                            ? "bg-teal-600 text-white hover:bg-teal-700"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {modalMode === "edit" ? "Update Address" : "Save Address"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}


// import { FiEdit3, FiTrash2, FiPlus, FiMapPin } from "react-icons/fi";
// import { useSummary } from "../provider/SummaryProvider";
// import { useEffect, useState } from "react";

// export default function SavedLocations() {
//     const { getAddresses, removeAddress, updateAddress } = useSummary();
//     const [savedAddresses, setSavedAddresses] = useState([]);

//     useEffect(() => {
//         const addresses = getAddresses();
//         setSavedAddresses(addresses);
//     }, [getAddresses]);

//     const handleDelete = (id) => {
//         removeAddress(id);
//         setSavedAddresses(prev => prev.filter(address => address.id !== id));
//     };

//     const handleEdit = (address) => {
//         console.log("Editing address:", address);
//     };

//     const handleAddNew = () => {
//         console.log("Add new address clicked");
//     };

//     return (
//         <div className="border border-[#E5E7EB] rounded-md bg-white p-5 w-full max-w-7xl mx-auto">
//             <h2 className="flex items-center gap-2 text-xl font-semibold text-[#5D4F52] border-b pb-3">
//                 <FiMapPin className="text-[#01788E]" size={20} />
//                 Saved Locations
//             </h2>

//             {savedAddresses.length === 0 ? (
//                 <div className="mt-6 text-center py-8">
//                     <p className="text-gray-500">No saved addresses found</p>
//                     <button
//                         onClick={handleAddNew}
//                         className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
//                     >
//                         Add First Address
//                     </button>
//                 </div>
//             ) : (
//                 <div className="mt-6 flex flex-col gap-4">
//                     {savedAddresses.map((item) => (
//                         <div
//                             key={item.id}
//                             className="border border-[#D1E5EA] rounded-md p-4 flex justify-between items-start"
//                         >
//                             <div>
//                                 <h3 className="text-[15px] font-medium text-[#5D4F52]">
//                                     {item.type || "Address"}
//                                 </h3>
//                                 <p className="text-[13px] text-gray-600 mt-1">
//                                     {/* displayAddress ব্যবহার করুন যদি থাকে, নাহলে format করুন */}
//                                     {item.displayAddress ||
//                                         `${item.apartmentNo || item.villaNo || item.otherNo || ''} - ${item.buildingName || item.community || item.streetName || ''} - ${item.area || ''} - ${item.city || ''}`
//                                     }
//                                 </p>
//                             </div>

//                             {/* Actions */}
//                             <div className="flex items-center gap-4">
//                                 <FiEdit3
//                                     onClick={() => handleEdit(item)}
//                                     size={18}
//                                     className="text-[#01788E] cursor-pointer hover:opacity-70"
//                                 />
//                                 <FiTrash2
//                                     onClick={() => handleDelete(item.id)}
//                                     size={18}
//                                     className="text-red-500 cursor-pointer hover:opacity-70"
//                                 />
//                             </div>
//                         </div>
//                     ))}

//                     {/* Add new address */}
//                     <button
//                         onClick={handleAddNew}
//                         className="border border-[#D1E5EA] rounded-md p-4 flex items-center justify-between w-full hover:bg-gray-50 transition"
//                     >
//                         <span className="flex items-center gap-2 text-[14px] text-[#5D4F52]">
//                             <FiPlus size={18} className="text-[#01788E]" />
//                             Add New Address
//                         </span>
//                         <span className="text-[#01788E] text-lg">{">"}</span>
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }