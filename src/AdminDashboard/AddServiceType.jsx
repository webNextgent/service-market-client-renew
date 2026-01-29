import { useState } from "react";
import { RiDeleteBin5Line, RiEditBoxLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import useDashboardServiceType from "../hooks/useDashboardServiceType";
import { GoBrowser } from "react-icons/go";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAllServices from "../hooks/useAllServices";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function AddServiceType() {
  const [serviceType, refetch] = useDashboardServiceType();
  const [services] = useAllServices();
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // ------------------ Add Service Type ------------------
  const handleFormSubmitAdd = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      const res = await fetch(image_hosting_api, { method: "POST", body: formData });
      const result = await res.json();

      if (!result.success) {
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }

      const finalData = { ...data, image: result.data.url };

      const postData = await axiosSecure.post('/service-type/create', finalData);

      if (postData?.data?.success) {
        toast.success("Service added successfully");
        setIsModalOpenAdd(false);
        reset();
        refetch();
      }
    } catch (error) {
      toast.error(`Something wrong: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Edit Service Type ------------------
  const handleFormSubmitEdit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = selectedValue.image;

      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("image", data.image[0]);

        const res = await fetch(image_hosting_api, { method: "POST", body: formData });
        const imgResult = await res.json();

        if (!imgResult.success) {
          toast.error("Image upload failed");
          setLoading(false);
          return;
        }

        imageUrl = imgResult.data.url;
      }

      const updatedData = { ...data, image: imageUrl };

      const updateRes = await axiosSecure.patch(`/service-type/update/${selectedValue.id}`, updatedData);
      if (updateRes?.data?.success) {
        toast.success("Service updated successfully");
        setIsModalOpenEdit(false);
        refetch();
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error(`Error: ${error?.message} `);
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
          const res = await axiosSecure.delete(`/service-type/delete/${service.id}`);
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

  return (
    <>
      {/* ------------------- Table ------------------- */}
      <div className="border border-[#E5E7EB] px-2 md:px-6 py-4 rounded-lg bg-white w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#5D4F52]">
            <GoBrowser className="text-[#01788E]" /> Service Type: {serviceType.length}
          </h2>
          <button
            onClick={() => {
              setIsModalOpenAdd(true);
              reset({ title: "", serviceId: "" });
              setSelectedValue(null);
            }}
            className="btn btn-outline mt-3 md:mt-0"
          >
            Add Service Type
          </button>
        </div>

        <div className="mt-2 md:mt-10 flex flex-col items-center">
          <div className="w-full overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-gray-600">
                  <th>No</th>
                  <th>Service Type</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {serviceType.map((service, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img src={service.image} alt="" />
                          </div>
                        </div>
                        <div className="font-semibold">
                          {service.title} - {service?.service?.title ?? "No Service"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-xs">
                        <RiEditBoxLine
                          onClick={() => {
                            setSelectedValue(service);
                            setIsModalOpenEdit(true);
                            reset({
                              title: service.title,
                              serviceId: service.serviceId,
                            });
                          }}
                          className="text-xl text-green-500"
                        />
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handelDeleteServiceType(service)} className="btn btn-ghost btn-xs">
                        <RiDeleteBin5Line className="text-xl text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ------------------- Add Modal ------------------- */}
      {isModalOpenAdd && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setIsModalOpenAdd(false)}
        >
          <div
            className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpenAdd(false)}
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-500"
            >
              <IoClose />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Add New Service Type
            </h2>

            <form onSubmit={handleSubmit(handleFormSubmitAdd)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium">Title</label>
                  <input
                    type="text"
                    {...register("title", { required: true })}
                    className="border p-2 w-full rounded-md"
                    placeholder="Enter title"
                  />
                  {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
                </div>

                <div>
                  <label className="block font-medium mb-1">Service Type</label>
                  <select {...register("serviceId", { required: true })} className="border p-2 w-full rounded-md">
                    <option value="">Select Service</option>
                    {services?.map((ser) => (
                      <option key={ser.id} value={ser.id}>
                        {ser.title}
                      </option>
                    ))}
                  </select>
                  {errors.services && <p className="text-red-500 text-sm">Required</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="font-medium">Service Type Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: true })}
                    className="border w-full p-2 rounded-md"
                  />
                  {errors.image && <p className="text-red-500 text-sm">Image is required</p>}
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

      {/* ------------------- Edit Modal ------------------- */}
      {isModalOpenEdit && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setIsModalOpenEdit(false)}
        >
          <div
            className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpenEdit(false)}
              className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-500"
            >
              <IoClose />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Edit Service Type
            </h2>

            <form onSubmit={handleSubmit(handleFormSubmitEdit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-medium">Title</label>
                  <input
                    type="text"
                    defaultValue={selectedValue?.title || ""}
                    {...register("title", { required: true })}
                    className="border p-2 w-full rounded-md"
                  />
                  {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
                </div>

                <div>
                  <label className="block font-medium mb-1">Service Type</label>
                  <select
                    defaultValue={selectedValue?.serviceId || ""}
                    {...register("serviceId", { required: true })}
                    className="border p-2 w-full rounded-md"
                  >
                    <option value="">Select Service</option>
                    {services?.map((ser) => (
                      <option key={ser.id} value={ser.id}>
                        {ser.title}
                      </option>
                    ))}
                  </select>
                  {errors.services && <p className="text-red-500 text-sm">Required</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="font-medium">Service Type Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")} // optional
                    className="border w-full p-2 rounded-md"
                  />
                  {selectedValue?.image && (
                    <img className="h-14 w-28 mt-3.5" src={selectedValue.image} alt="" />
                  )}
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
    </>
  );
}