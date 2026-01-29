import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAllServices from "../hooks/useAllServices";
import { RiEditBoxLine } from "react-icons/ri";
import { RiDeleteBin5Line } from "react-icons/ri";
import EditModal from "../components/EditModal/EditModal";
import { GoBrowser } from "react-icons/go";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";


const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddServices = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [services, isLoading, refetch] = useAllServices();
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const axiosSecure = useAxiosSecure();

    const handleFormSubmit = async (data) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", data.image[0]);
        try {
            const res = await fetch(image_hosting_api, {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            if (result.success) {
                const imageUrl = result.data.url;

                const finalData = {
                    ...data,
                    image: imageUrl,
                };
                const postData = await axiosSecure.post('/service/create', finalData);
                if ((postData?.data?.success)) {
                    toast.success("Service added successfully");
                    setIsModalOpenAdd(false);
                    refetch();
                }
            } else {
                toast.error("Image upload failed");
            }
        } catch (error) {
            toast.error(`Something wrong: ${error?.message || error}`);
            // console.log(error);

        } finally {
            setLoading(false);
            reset();
        }
    };

    const handelDelete = async (service) => {
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
                    const res = await axiosSecure.delete(`/service/delete/${service.id}`);
                    if (res?.data?.success) {
                        refetch();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Service deleted successfully",
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


    if (isLoading) return <p className="text-center mt-10">Loading...</p>;
    return (
        <div className="border border-[#E5E7EB] px-2 md:px-6 py-4 rounded-lg bg-white w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#5D4F52]">
                    <GoBrowser className="text-[#01788E]" />Services: {services.length}
                </h2>
                <button
                    onClick={() => setIsModalOpenAdd(true)}
                    className="btn btn-outline mt-3 md:mt-0"
                >
                    Add services
                </button>
            </div>

            <div className="mt-2 md:mt-10 flex flex-col items-center">
                <div className="w-full">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="text-gray-600">
                                    <th>No</th>
                                    <th>Service Name</th>
                                    <th>Description</th>
                                    <th>Total Booking</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service, idx) => (
                                    <tr key={idx}>
                                        <th>{idx + 1}</th>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12">
                                                        <img
                                                            src={service.image}
                                                            alt="Avatar Tailwind CSS Component" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{service.title}</div>
                                                    <div className="text-sm opacity-50">Rated: {service.rated}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {service.des1}
                                            <br />
                                        </td>
                                        <td>Total Booking: {service.totalBooking}</td>
                                        <th>
                                            <button
                                                title="Edit"
                                                className="btn btn-ghost btn-xs"
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setIsModalOpenEdit(true);
                                                }}
                                            >
                                                <RiEditBoxLine className="text-xl text-green-500" />
                                            </button>
                                        </th>
                                        <th>
                                            <button onClick={() => handelDelete(service)} title="Delete" className="btn btn-ghost btn-xs"><RiDeleteBin5Line className="text-xl text-red-400" /></button>
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Add service  */}
            {isModalOpenAdd && (
                <div
                    className="
                                fixed inset-0 
                                bg-black/50 
                                flex justify-center items-center 
                                z-50 
                                p-2 sm:p-4 md:p-6
                            "
                    onClick={() => setIsModalOpenAdd(false)}
                >
                    <div
                        className="
                                    relative bg-white 
                                    w-full 
                                    max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl
                                    p-3 sm:p-5 md:p-8 
                                    rounded-lg
                                    shadow-xl 
                                    max-h-[90vh] overflow-y-auto
                                "
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpenAdd(false)}
                            className="cursor-pointer absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
                        >
                            ×
                        </button>

                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
                            Add New Service
                        </h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="md:col-span-2">
                                    <label className="font-medium">Service Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register("image", { required: true })}
                                        className="border p-3 w-full rounded-md"
                                    />
                                    {errors.image && (
                                        <p className="text-red-500 text-sm">Image is required</p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium">Title</label>
                                    <input
                                        type="text"
                                        {...register("title", { required: true })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Enter title"
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm">Title is required</p>
                                    )}
                                </div>

                                <div>
                                    <label className="font-medium">Description 1</label>
                                    <input
                                        type="text"
                                        {...register("des1", { required: true })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Short description..."
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Description 2</label>
                                    <input
                                        type="text"
                                        {...register("des2", { required: true })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Short description..."
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Description 3</label>
                                    <input
                                        type="text"
                                        {...register("des3", { required: true })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="Short description..."
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Rated</label>
                                    <input
                                        type="text"
                                        {...register("rated", { required: true })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="e.g. 4.5"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Total Booking</label>
                                    <input
                                        type="text"
                                        {...register("totalBooking", { required: true })}
                                        className="border p-3 w-full rounded-md"
                                        placeholder="e.g. 350"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#01788E] text-white py-3 rounded-lg font-semibold text-lg"
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>

            )}
            {isModalOpenEdit && (
                <EditModal
                    service={selectedService}
                    onClose={() => setIsModalOpenEdit(false)}
                />
            )}
        </div>
    );
};

export default AddServices;