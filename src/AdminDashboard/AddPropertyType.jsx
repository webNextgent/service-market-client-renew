import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import useDashboardPropertyType from "../hooks/userDashboardPropertyType";
import useDashboardServiceType from "../hooks/useDashboardServiceType";
import { GoBrowser } from "react-icons/go";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function AddPropertyType() {
    const [serviceType] = useDashboardServiceType();
    const [propertyType, refetch] = useDashboardPropertyType();
    const axiosSecure = useAxiosSecure();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit, setValue } = useForm();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [loading, setLoading] = useState(false);

    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (isModalOpen) setIsModalOpen(false);
                if (isEditModalOpen) setIsEditModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isModalOpen, isEditModalOpen]);

    // Handle backdrop click for Add Modal
    const handleBackdropClick = () => {
        setIsModalOpen(false);
        reset();
    };

    // Handle backdrop click for Edit Modal
    const handleEditBackdropClick = () => {
        setIsEditModalOpen(false);
        resetEdit();
        setSelectedItem(null);
    };

    // -----------------------
    const handleFormSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", data.image[0]);

        try {
            const uploadRes = await fetch(image_hosting_api, {
                method: "POST",
                body: formData,
            });
            const uploadResult = await uploadRes.json();
            if (!uploadResult.success) return toast.error("Image upload failed");

            const imageUrl = uploadResult.data.url;
            const finalData = {
                title: data.title,
                description: data.description,
                startFrom: data.startFrom,
                serviceTypeId: data.serviceTypeId,
                image: imageUrl,
            };

            const postRes = await axiosSecure.post(`/property-type/create`, finalData);

            if (postRes?.data?.success) {
                toast.success("Property Type added successfully");
                reset();
                setIsModalOpen(false);
                refetch();
            } else {
                toast.error(postRes?.message || "Failed to add property type");
            }
        } catch (error) {
            toast.error("Something went wrong: " + error?.message);
        } finally {
            setLoading(false);
        }
    };

    // OPEN EDIT MODAL
    // -----------------------
    const openEditModal = (item) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);

        // Prefill form
        setValue("title", item.title);
        setValue("description", item.description);
        setValue("startFrom", item.startFrom);
        setValue("serviceTypeId", item.serviceTypeId);
    };

    // CLOSE EDIT MODAL
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        resetEdit();
        setSelectedItem(null);
    };

    // EDIT FORM SUBMIT
    // -----------------------
    const handleEditForm = async (data) => {
        setLoading(true);

        let imageUrl = selectedItem.image;

        // If user selected new image
        if (data.image && data.image.length > 0) {
            const formData = new FormData();
            formData.append("image", data.image[0]);

            try {
                const uploadRes = await fetch(image_hosting_api, {
                    method: "POST",
                    body: formData,
                });

                const uploadResult = await uploadRes.json();
                if (!uploadResult.success) {
                    toast.error("Image upload failed");
                    setLoading(false);
                    return;
                }

                imageUrl = uploadResult.data.url;
            } catch (error) {
                toast.error("Image upload error: " + error?.message);
                setLoading(false);
                return;
            }
        }

        const updatedData = {
            title: data.title,
            description: data.description,
            startFrom: data.startFrom,
            serviceTypeId: data.serviceTypeId,
            image: imageUrl,
        };

        try {
            const res = await axiosSecure.patch(`/property-type/update/${selectedItem.id}`, updatedData);

            if (res?.data?.success) {
                toast.success("Updated successfully");
                closeEditModal();
                refetch();
            } else {
                toast.error(res?.message || "Update failed");
            }
        } catch (error) {
            toast.error("Update failed: " + error?.message);
        } finally {
            setLoading(false);
        }
    };

    const handelDeleteServiceType = async (service) => {
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
                    const res = await axiosSecure.delete(`/property-type/delete/${service.id}`);
                    if (res?.data?.success) {
                        refetch();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Property type deleted successfully",
                            icon: "success"
                        });
                    }
                }
            })
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="md:p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
                <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#5D4F52]">
                    <GoBrowser className="text-[#01788E]" /> Property Type: {propertyType.length}
                </h2>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        reset();
                    }}
                    className="btn btn-outline mt-3 md:mt-0"
                >
                    Add Property Type
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="text-gray-600">
                            <th>No</th>
                            <th>Property Type</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {propertyType.map((prop, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>

                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img src={prop.image} alt={prop.title} />
                                            </div>
                                        </div>
                                        <div className="font-semibold">
                                            {/* Format: Property Type - Service Type - Service */}
                                            {prop.title} - {prop.serviceType?.title} - {prop.serviceType?.service?.title}
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => openEditModal(prop)}
                                    >
                                        <RiEditBoxLine className="text-xl text-green-500" />
                                    </button>
                                </td>

                                <td>
                                    <button
                                        onClick={() => handelDeleteServiceType(prop)}
                                        className="btn btn-ghost btn-xs"
                                    >
                                        <RiDeleteBin5Line className="text-xl text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop - এইটাতে ক্লিক করলে মডাল বন্ধ হবে */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={handleBackdropClick}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-50 flex justify-center items-center px-2 sm:px-4 md:px-6">
                        <div
                            className="relative bg-white 
                                        w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl
                                        p-4 sm:p-6 md:p-8 
                                        rounded-md shadow-xl 
                                        max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleBackdropClick}
                                className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold cursor-pointer"
                            >
                                <IoClose className="text-2xl" />
                            </button>

                            {/* Title */}
                            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-800">
                                Add Property Type
                            </h2>

                            {/* Form */}
                            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        {...register("title", { required: "Title is required" })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Title"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block font-medium mb-1">Description</label>
                                    <textarea
                                        {...register("description", { required: "Description is required" })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Description"
                                        rows="3"
                                    />
                                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                                </div>

                                {/* Start From */}
                                <div>
                                    <label className="block font-medium mb-1">Start From</label>
                                    <input
                                        type="number"
                                        {...register("startFrom", {
                                            required: "Start from price is required",
                                            min: { value: 0, message: "Price cannot be negative" }
                                        })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Start From"
                                    />
                                    {errors.startFrom && <p className="text-red-500 text-sm">{errors.startFrom.message}</p>}
                                </div>

                                {/* Service Type Dropdown */}
                                <div>
                                    <label className="block font-medium mb-1">Service Type</label>
                                    <select
                                        {...register("serviceTypeId", { required: "Service type is required" })}
                                        className="border p-3 w-full rounded-md"
                                    >
                                        <option value="">Select Service Type</option>
                                        {serviceType.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {/* Format: Service Type - Service */}
                                                {c.title} - {c.service?.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.serviceTypeId && <p className="text-red-500 text-sm">{errors.serviceTypeId.message}</p>}
                                </div>

                                {/* Image */}
                                <div>
                                    <label className="block font-medium mb-1">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register("image", { required: "Image is required" })}
                                        className="w-full border p-3 rounded-md"
                                    />
                                    {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#01788E] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#016377] transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {isEditModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop - এইটাতে ক্লিক করলে মডাল বন্ধ হবে */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={handleEditBackdropClick}
                    />

                    <div className="fixed inset-0 z-50 flex justify-center items-center px-2 sm:px-4 md:px-6">
                        <div
                            className="relative bg-white 
                                        w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl
                                        p-4 sm:p-6 md:p-8 
                                        rounded-md shadow-xl 
                                        max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeEditModal}
                                className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold cursor-pointer"
                            >
                                <IoClose className="text-2xl" />
                            </button>

                            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-800">
                                Edit Property Type
                            </h2>

                            <form onSubmit={handleEditSubmit(handleEditForm)} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        {...registerEdit("title", { required: "Title is required" })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Title"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block font-medium mb-1">Description</label>
                                    <textarea
                                        {...registerEdit("description", { required: "Description is required" })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Description"
                                        rows="3"
                                    />
                                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                                </div>

                                {/* Start From */}
                                <div>
                                    <label className="block font-medium mb-1">Start From</label>
                                    <input
                                        type="number"
                                        {...registerEdit("startFrom", {
                                            required: "Start from price is required",
                                            min: { value: 0, message: "Price cannot be negative" }
                                        })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Start From"
                                    />
                                    {errors.startFrom && <p className="text-red-500 text-sm">{errors.startFrom.message}</p>}
                                </div>

                                {/* Service Type Dropdown */}
                                <div>
                                    <label className="block font-medium mb-1">Service Type</label>
                                    <select
                                        {...registerEdit("serviceTypeId", { required: "Service type is required" })}
                                        className="border p-3 w-full rounded-md"
                                    >
                                        <option value="">Select Service Type</option>
                                        {serviceType.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {/* Format: Service Type - Service */}
                                                {c.title} - {c.service?.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.serviceTypeId && <p className="text-red-500 text-sm">{errors.serviceTypeId.message}</p>}
                                </div>

                                {/* Image */}
                                <div>
                                    <label className="block font-medium mb-1">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...registerEdit("image")}
                                        className="w-full border p-3 rounded-md"
                                    />
                                    {selectedItem?.image && (
                                        <div className="mt-3">
                                            <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                                            <img
                                                className="h-28 w-28 object-cover rounded-md border"
                                                src={selectedItem.image}
                                                alt={selectedItem.title}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#01788E] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#016377] transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Updating..." : "Update"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};