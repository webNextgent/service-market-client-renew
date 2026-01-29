/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Tag, Calendar, X, ArrowRight, Sparkles, CheckCircle, Clock, Plus, Trash2, Edit2, Copy, Percent } from 'lucide-react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

const AddPromoCode = () => {
    const [expiryDate, setExpiryDate] = useState('');
    const [discount, setDiscount] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ code: '', expiryDate: '', discount: '' });
    const axiosSecure = useAxiosSecure();


    const { data: promoCodes = [], isLoading, refetch } = useQuery({
        queryKey: ["promo-codes"],
        queryFn: async () => {
            const response = await axiosSecure.get("/promo-code");

            if (!response?.data?.Data) return [];

            return response.data.Data.map(promo => ({
                ...promo,
                expiryDate: promo.expiryDate
                    ? new Date(promo.expiryDate).toISOString().split("T")[0]
                    : null,
                createdAt: promo.createdAt
                    ? new Date(promo.createdAt).toISOString()
                    : new Date().toISOString()
            }));
        }
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!promoCode.trim()) {
            setError('Please enter a promo code');
            return;
        }

        if (!discount || isNaN(discount) || parseFloat(discount) <= 0) {
            setError('Please enter a valid discount amount');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const promoData = {
            code: promoCode.trim().toUpperCase(),
            expiryDate: expiryDate || null,
            discount: parseFloat(discount)
        };

        try {
            const resPromo = await axiosSecure.post(`/promo-code/create`, promoData);

            console.log(resPromo);

            if (resPromo?.data?.success) {
                setSuccess("Promo code added successfully!");
                setPromoCode("");
                setExpiryDate("");
                setDiscount("");
                refetch();
            }

            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (promo) => {
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
                    try {
                        const resPromo = await axiosSecure.delete(`/promo-code/delete/${promo.id}`);
                        if (resPromo?.data?.success) {
                            if (resPromo?.data?.success) {
                                toast.success("Promo code deleted");
                                refetch();
                            }
                            setSuccess('Promo code deleted successfully');
                            setTimeout(() => setSuccess(''), 3000);
                        }
                    } catch (err) {
                        console.log(err);
                        toast.error('Something was wrong');
                    }
                }
            });
        } catch (err) {
            setError('Failed to delete promo code');
        }
    };

    const handleEdit = (promo) => {
        setEditingId(promo._id);
        setEditData({
            code: promo.code,
            expiryDate: promo.expiryDate || '',
            discount: promo.discount.toString()
        });
    };

    // const handleUpdate = async () => {
    //     if (!editData.code.trim()) {
    //         setError('Please enter a promo code');
    //         return;
    //     }

    //     if (!editData.discount || isNaN(editData.discount) || parseFloat(editData.discount) <= 0) {
    //         setError('Please enter a valid discount amount');
    //         return;
    //     }

    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/promo-code/${editingId}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 code: editData.code.toUpperCase(),
    //                 expiryDate: editData.expiryDate || null,
    //                 discount: parseFloat(editData.discount)
    //             }),
    //         });

    //         const data = await response.json();
    //         if (data.success) {
    //             setSuccess("Promo code updated successfully!");
    //             setEditingId(null);
    //             refetch();
    //         }

    //         // eslint-disable-next-line no-unused-vars
    //     } catch (err) {
    //         setError('Network error. Please try again.');
    //     }
    // };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setSuccess('Copied to clipboard!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No expiry';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (err) {
            console.error('Date formatting error:', err);
            return 'Date error';
        }
    };

    const isExpired = (expiryDate) => {
        if (!expiryDate) return false;
        try {
            const expiry = new Date(expiryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return expiry < today;
        } catch (err) {
            console.error('Date comparison error:', err);
            return false;
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({ code: '', expiryDate: '', discount: '' });
    };

    const getStatusColor = (expiryDate) => {
        if (!expiryDate) return 'bg-green-100 text-green-800 border-green-200';

        if (isExpired(expiryDate)) {
            return 'bg-red-100 text-red-800 border-red-200';
        }

        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry <= 7) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }

        return 'bg-green-100 text-green-800 border-green-200';
    };

    const getStatusText = (expiryDate) => {
        if (!expiryDate) return 'ACTIVE';

        if (isExpired(expiryDate)) {
            return 'EXPIRED';
        }

        const expiry = new Date(expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry <= 7) {
            return 'EXPIRING SOON';
        }

        return 'ACTIVE';
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg mb-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Promotion Management</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                    Promo Code Dashboard
                </h1>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Create, manage, and track all your promotional codes
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Add/Edit Promo Form */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            {editingId ? (
                                <Edit2 className="w-5 h-5 text-white" />
                            ) : (
                                <Plus className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingId ? 'Edit Promo Code' : 'Create New Promo'}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {editingId ? 'Update your existing promo code' : 'Add a new promotional code'}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={editingId ? (e) => {
                            e.preventDefault();
                            //  handleUpdate();
                        } : handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            {/* Promo Code Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <span className="flex items-center gap-1">
                                        <Tag className="w-4 h-4" />
                                        Promo Code *
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={editingId ? editData.code : promoCode}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                                            if (editingId) {
                                                setEditData({ ...editData, code: value });
                                            } else {
                                                setPromoCode(value);
                                            }
                                            setError('');
                                        }}
                                        placeholder="SUMMER25, WINTER30, etc."
                                        className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base font-medium"
                                        maxLength={20}
                                        required
                                    />
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>

                            {/* Discount Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <span className="flex items-center gap-1">
                                        <Percent className="w-4 h-4" />
                                        Discount Amount ($) *
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"

                                        value={editingId ? editData.discount : discount}
                                        onChange={(e) => {
                                            const value = Math.max(0.01, Math.min(1000, parseFloat(e.target.value) || 0));
                                            if (editingId) {
                                                setEditData({ ...editData, discount: value });
                                            } else {
                                                setDiscount(value);
                                            }
                                            setError('');
                                        }}
                                        placeholder="10.50"
                                        className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base font-medium"
                                        required
                                    />
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">
                                        USD
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter discount amount in dollars (e.g., 10.50 for $10.50 off)
                                </p>
                            </div>

                            {/* Expiry Date Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Expiry Date (Optional)
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={editingId ? editData.expiryDate : expiryDate}
                                        onChange={(e) => {
                                            const today = new Date().toISOString().split('T')[0];
                                            if (e.target.value < today) {
                                                setError('Expiry date cannot be in the past');
                                                return;
                                            }
                                            if (editingId) {
                                                setEditData({ ...editData, expiryDate: e.target.value });
                                            } else {
                                                setExpiryDate(e.target.value);
                                            }
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty for codes that never expire
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <X className="w-4 h-4 text-red-500" />
                                    <p className="text-red-700 text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <p className="text-green-700 text-sm font-medium">{success}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-3">
                            <button
                                type="submit"
                                disabled={isSubmitting || (editingId ? !editData.code.trim() || !editData.discount : !promoCode.trim() || !discount)}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </div>
                                ) : editingId ? (
                                    <>
                                        <Edit2 className="w-4 h-4" />
                                        Update Promo Code
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Add Promo Code
                                    </>
                                )}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right: Promo Codes List */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Tag className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">All Promo Codes</h2>
                                <p className="text-gray-500 text-sm">Manage your existing promotional codes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                {promoCodes.length} total
                            </span>
                            <button
                                onClick={refetch}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Refresh"
                            >
                                <ArrowRight className="w-4 h-4 text-gray-500 rotate-90" />
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent mx-auto mb-3"></div>
                            <p className="text-gray-700 font-medium">Loading promo codes...</p>
                        </div>
                    ) : promoCodes.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="inline-flex p-3 bg-gray-200 rounded-full mb-3">
                                <Tag className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">No promo codes yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-4">
                                Create your first promotional code to get started
                            </p>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create First Code
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {promoCodes.map((promo, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-lg border transition-all ${isExpired(promo.expiryDate)
                                            ? 'bg-gray-50 border-gray-300'
                                            : 'bg-blue-50 border-blue-200'
                                            } ${editingId === promo._id ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`p-2 rounded ${isExpired(promo.expiryDate)
                                                    ? 'bg-gray-200'
                                                    : 'bg-blue-100'
                                                    }`}>
                                                    <Tag className={`w-4 h-4 ${isExpired(promo.expiryDate)
                                                        ? 'text-gray-600'
                                                        : 'text-blue-600'
                                                        }`} />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className="text-lg font-semibold text-gray-900">
                                                            {promo.code}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(promo.expiryDate)}`}>
                                                                {getStatusText(promo.expiryDate)}
                                                            </span>
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300">
                                                                Used: {promo.usageCount || 0}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Percent className="w-3 h-3 text-blue-500" />
                                                            <span className="font-semibold text-blue-700">
                                                                ${parseFloat(promo.discount).toFixed(2)} off
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3 h-3 text-gray-500" />
                                                            <span className={`text-sm ${isExpired(promo.expiryDate)
                                                                ? 'text-red-600 font-medium'
                                                                : 'text-gray-700'
                                                                }`}>
                                                                {promo.expiryDate ? `Expires: ${formatDate(promo.expiryDate)}` : 'Never expires'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-gray-500" />
                                                        <span className="text-sm text-gray-600">
                                                            Created: {formatDate(promo.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 ml-3">
                                                <button
                                                    onClick={() => handleCopyCode(promo.code)}
                                                    className="p-2 hover:bg-blue-100 rounded transition-colors"
                                                    title="Copy code"
                                                >
                                                    <Copy className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(promo)}
                                                    className="p-2 hover:bg-green-100 rounded transition-colors"
                                                    title="Edit code"
                                                >
                                                    <Edit2 className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(promo)}
                                                    className="p-2 hover:bg-red-100 rounded transition-colors"
                                                    title="Delete code"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <p className="text-sm font-medium text-blue-800">Total Codes</p>
                                        <p className="text-2xl font-semibold text-blue-900">{promoCodes.length}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                        <p className="text-sm font-medium text-green-800">Active</p>
                                        <p className="text-2xl font-semibold text-green-900">
                                            {promoCodes.filter(p => !isExpired(p.expiryDate)).length}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                        <p className="text-sm font-medium text-purple-800">Total Discount</p>
                                        <p className="text-2xl font-semibold text-purple-900">
                                            ${promoCodes.reduce((sum, promo) => sum + parseFloat(promo.discount), 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddPromoCode;