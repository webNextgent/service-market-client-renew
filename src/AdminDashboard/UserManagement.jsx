import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FaUsers } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const UserManagement = () => {
    const axiosSecure = useAxiosSecure();

    const { data: allUsers = [], isLoading, refetch } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const resReserv = await axiosSecure.get(`/auth/users`);
            return resReserv.data?.Data;
        }
    });
    console.log(allUsers);

    const handelMakeAdmin = (user) => {
        const isAdmin = user.role === 'ADMIN';

        const config = {
            title: isAdmin ? "Remove Admin Role?" : "Make Admin?",
            text: isAdmin
                ? `${user.firstName || 'User'} will lose admin privileges.`
                : `${user.firstName || 'User'} will get admin privileges.`,
            confirmButtonColor: isAdmin ? "#dc2626" : "#2563eb",
            confirmButtonText: isAdmin ? "Remove Admin" : "Make Admin",
            successTitle: isAdmin ? "Admin Removed!" : "Admin Added!",
            successText: isAdmin
                ? `${user.firstName || 'User'} is no longer an admin.`
                : `${user.firstName || 'User'} is now an admin.`,
            toastMessage: isAdmin
                ? `${user.firstName || 'User'} removed from admin role`
                : `${user.firstName || 'User'} promoted to admin`
        };

        Swal.fire({
            title: config.title,
            text: config.text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: config.confirmButtonColor,
            cancelButtonColor: "#6b7280",
            confirmButtonText: config.confirmButtonText,
            cancelButtonText: "Cancel",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const resPatch = await axiosSecure.patch(`/auth/change-role/${user.id}`, {
                        role: isAdmin ? 'USER' : 'ADMIN'
                    });

                    if (resPatch.data.success) {
                        refetch();
                        Swal.fire({
                            title: config.successTitle,
                            text: config.successText,
                            icon: "success",
                            confirmButtonColor: config.confirmButtonColor
                        });

                        toast.success(config.toastMessage);
                    } else {
                        throw new Error(resPatch.data.message || 'Failed to update role');
                    }
                } catch (err) {
                    Swal.fire({
                        title: "Error!",
                        text: err.message || 'Failed to update user role',
                        icon: "error",
                        confirmButtonColor: config.confirmButtonColor
                    });
                    console.error(err);
                }
            }
        });
    };

    const handleDeleteUser = (user) => {
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
                    const resDelete = await axiosSecure.delete(`/auth/delete-account/${user.id}`);
                    if (resDelete?.data?.success) {
                        refetch();
                        Swal.fire({
                            title: "Deleted!",
                            text: `${user.firstName || 'User'} has been deleted.`,
                            icon: "success"
                        });
                    }
                } catch (err) {
                    console.log(err);
                    toast.error('Something was wrong');
                }
            }
        });
    };


    if (isLoading) return <div className="text-center my-10"><span className="loading loading-spinner text-warning"></span></div>;
    return (
        <div className="border border-[#E5E7EB] px-2 md:px-6 py-4 rounded-lg bg-white w-full max-w-4xl mx-auto">
            <div className="border-b border-[#E5E7EB] pb-3">
                <h2 className="flex items-center gap-2.5 text-xl font-semibold text-[#5D4F52]">
                    <FaUsers className="text-[#01788E]" /> Total Users: {allUsers?.length}
                </h2>
            </div>

            <div className="mt-2 md:mt-10 flex flex-col items-center">
                <div className="w-full">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="font-semibold text-gray-700">No</th>
                                    <th className="font-semibold text-gray-700">User Name</th>
                                    <th className="font-semibold text-gray-700">Contact</th>
                                    <th className="font-semibold text-gray-700">Role</th>
                                    <th className="font-semibold text-gray-700">Status</th>
                                    <th className="font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((user, idx) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <th className="text-gray-600 text-xs">{idx + 1}</th>
                                        <td>
                                            <div className="font-bold">
                                                {user.firstName || user.lastName
                                                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                                    : 'Unnamed User'
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div className="space-y-1">
                                                <div className="font-medium">{user.phone || 'No phone'}</div>
                                                <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isVerified
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {user.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                                {/* {user.registeredViaOtp && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        OTP Registered
                                                    </span>
                                                )} */}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    title={user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                                                    onClick={() => handelMakeAdmin(user)}
                                                    className={`btn btn-xs ${user.role === 'ADMIN'
                                                        ? 'btn-warning btn-outline'
                                                        : 'btn-primary'
                                                        }`}
                                                >
                                                    {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="btn btn-ghost btn-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <RiDeleteBin5Line className="text-xl" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {allUsers.length === 0 && !isLoading && (
                            <div className="text-center py-10">
                                <div className="text-gray-400 mb-4">
                                    <FaUsers className="text-5xl mx-auto opacity-50" />
                                </div>
                                <p className="text-gray-500 text-lg">No users found</p>
                                <p className="text-gray-400 mt-2">Users will appear here once they register</p>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
};

export default UserManagement;