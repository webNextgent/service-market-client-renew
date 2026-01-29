import ServiceDetails from "../../../components/ServiceDetails/ServiceDetails";
import Summery from "../../../components/Summery/Summery";
import { useSummary } from "../../../provider/SummaryProvider";
import NextBtn from "../../../components/NextBtn/NextBtn";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { generateId } from "./Map/generateId";
import dirhum from "../../../assets/icon/dirhum.png";
import { useNavigate } from "react-router-dom";

const Address = () => {
    const { mapLatitude, mapLongitude, addressLocation, itemSummary, totalAfterDiscount, showInput, setShowInput, serviceTitle, setLiveAddress, setSaveAddress, totalVatRate } = useSummary();
    const [selectedType, setSelectedType] = useState("Apartment");
    const buttons = ["Apartment", "Villa", "Office", "Other"];
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        mode: "onChange",
        shouldUnregister: true
    });


const onSubmit = (data) => {
        const finalData = {
            id: generateId(),
            type: selectedType,
            ...data,
            displayAddress: formatDisplayAddress(selectedType, data),
            // Location data সংরক্ষণ
            latitude: mapLatitude,
            longitude: mapLongitude,
            fullAddress: addressLocation,
            timestamp: new Date().toISOString()
        };

        // Context-এ সেট করুন
        setLiveAddress(finalData);

        // Save address-এ যোগ করুন
        setSaveAddress(prev => {
            // ডুপ্লিকেট চেক
            const isDuplicate = prev.some(addr =>
                addr.latitude === finalData.latitude &&
                addr.longitude === finalData.longitude
            );

            return isDuplicate ? prev : [...prev, finalData];
        });

        return true;
    };

    const handleNextClick = async () => {
        const result = await handleSubmit(onSubmit)();
        if (result !== false) {
            navigate("/date-time"); // Add navigation here
        }
        return result;
    };



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

    const handleTypeChange = (type) => {
        setSelectedType(type);
    };

    return (
        <div>
            <div className="hidden md:block mt-10 md:mt-0">
                <ServiceDetails title="Address" currentStep={2} />
            </div>

            <div className="flex gap-8 mt-8 md:mt-0">
                <div className="lg:w-[60%] mb-4 space-y-4 w-full">
                    <div className="bg-white rounded-xl shadow-lg w-full p-5">
                        {/* TYPE BUTTONS */}
                        <div className="flex space-x-3 mb-6 overflow-x-auto">
                            {buttons.map(btn => (
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

                        {/* FORM */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                            {/* Dynamic Fields */}
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
                                    {/* <div>
                                        <label className="block text-gray-700 font-medium mb-1">Nickname</label>
                                        <input
                                            {...register("nickname", { required: "Nickname is required" })}
                                            type="text"
                                            placeholder="Enter Nickname"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>}
                                    </div> */}
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
                        </form>
                    </div>
                </div>

                <Summery
                    serviceTitle={serviceTitle}
                    itemSummary={itemSummary}
                    totalVatRate={totalVatRate}
                    showInput={showInput}
                    setShowInput={setShowInput}
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
                                onClick={handleNextClick}
                                disabled={!isValid}
                            />
                        </div>

                    </div>
                </div>
            </div>



            {/* for dextop  lg:view */}
            <div className="hidden lg:block">
                <NextBtn
                    onClick={handleNextClick}
                    disabled={!isValid}
                />
            </div>
        </div>
    );
};

export default Address;