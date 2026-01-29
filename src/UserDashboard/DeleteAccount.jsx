import React from "react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";

const DeleteAccount = () => {
  const { user, logOut } = useAuth();

  const axiosSecure = useAxiosSecure();

  const handleDeleteAccount = () => {
    if (!user) {
      toast.error("User information not available");
      return;
    }

    Swal.fire({
      title: "Are you sure you want to delete your account?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // You can replace with config.confirmButtonColor
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(
            `/auth/delete-account/${user.id}`,
          );

          if (res.data.success) {
            // If you want to refetch user data or redirect
            // refetch();

            Swal.fire({
              title: "Account Deleted",
              text: "Your account has been successfully deleted.",
              icon: "success",
              confirmButtonColor: "#10b981", // Success color
            });

            toast.success("Account deleted successfully");

            logOut();
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          } else {
            throw new Error(res.data.message || "Failed to delete account");
          }
        } catch (err) {
          Swal.fire({
            title: "Error!",
            text: err.message || "Failed to delete account",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  return (
    <div className="w-full px-4 md:px-10 py-6">
      {/* Header */}
      <div className="border border-gray-200 rounded-md p-4 md:p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
          <span className="text-teal-600 text-2xl">🛡️</span>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Delete Account
          </h1>
        </div>

        {/* Card */}
        <div className="mt-6 border border-gray-200 rounded-lg p-6 md:p-8 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Important
          </h2>

          <p className="text-gray-600 mb-4">We are sorry to see you go.</p>

          <p className="text-gray-600 mb-4">
            Once you submit a request to delete your account:
          </p>

          <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-2">
            <li>All your data will be permanently removed</li>
            <li>Your profile, listings, and reviews will be deleted</li>
            <li>
              Certain information that we're legally required to retain will be
              kept
            </li>
            <li>You will lose access to all services immediately</li>
          </ul>

          <p className="text-gray-600 mb-4">
            Read our{" "}
            <a href="/privacy-policy" className="text-teal-600 underline">
              Privacy Policy
            </a>
          </p>

          <p className="text-gray-600 mb-6">
            Once your account is deleted, you cannot reactivate it or regain
            access. You will need to create a new account if you wish to use
            ServiceMarket in the future.
          </p>

          {/* Delete Button */}
          <div className="flex justify-center">
            <button
              onClick={handleDeleteAccount}
              disabled={!user}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md shadow-sm transition-colors duration-200"
            >
              DELETE MY ACCOUNT
            </button>
          </div>

          {!user && (
            <p className="text-center text-gray-500 mt-4">
              Loading user information...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
