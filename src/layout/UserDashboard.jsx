import { FaCalendarAlt, FaUsers } from "react-icons/fa";
import { MdDeleteSweep, MdMenu } from "react-icons/md";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from '../assets/logo/logo.png';
import { FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { FaWallet } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RiMacbookFill } from "react-icons/ri";
import { SiServerless } from "react-icons/si";
import { LuProportions } from "react-icons/lu";
import { IoMdTime } from "react-icons/io";
import { SiProton } from "react-icons/si";
import useAuth from "../hooks/useAuth";

const UserDashboard = () => {
    const { user, logOut } = useAuth();
    const router = useNavigate();
    const role = user?.role;


    const handleLogout = () => {
        logOut();
        router("/");
    }

    const links = (
        <>
            {/* just user  */}
            {role === 'USER' && (
                <ul>
                    {/* My Bookings */}
                    <li className="list-none border-y border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/booking"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <FaCalendarAlt /> My Bookings
                        </NavLink>
                    </li>

                    {/* My Quotes */}
                    {/* <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/quotes"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <LuMenu className="text-[17px]" /> My Quotes
                        </NavLink>
                    </li> */}

                    {/* My Profile */}
                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/profile"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <FaUser /> My Profile
                        </NavLink>
                    </li>

                    {/* Outstanding Payments */}
                    {/* <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/outstanding-payments"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <MdPayments /> Outstanding Payments
                        </NavLink>
                    </li> */}

                    {/* Saved Locations */}
                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/saved-locations"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <FaLocationDot /> Saved Locations
                        </NavLink>
                    </li>

                    {/* Payment Methods */}
                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/payment-methods"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <MdOutlinePayments /> Payment Methods
                        </NavLink>
                    </li>

                    {/* My Wallet */}
                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/wallet"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <FaWallet /> My Wallet
                        </NavLink>
                    </li>

                    {/* Delete Account */}
                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/delete-account"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <MdDeleteSweep className="text-xl" /> Delete Account
                        </NavLink>
                    </li>

                    {/* Invite a Friend */}
                    <li className="list-none border-b border-dashed hover:bg-gray-50 flex justify-between items-center px-3 py-2">
                        <NavLink
                            to="/dashboard/invite-friend"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] py-1 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <IoMdShare className="text-[18px]" /> Invite a friend
                        </NavLink>

                        <span className="bg-[#ED6329] text-white text-[11px] px-2 py-0.5 rounded">
                            Get 30 ৳ credit
                        </span>
                    </li>

                    {/* Logout */}
                    <li onClick={() => handleLogout()} className="list-none flex items-center gap-1.5 py-3 px-3 hover:underline cursor-pointer text-[#157D91]">
                        <RiLogoutCircleLine />  Logout
                    </li>
                </ul>
            )}

            {/* just admin  */}
            {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                <ul>
                    <li className="list-none border-y border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/admin-booking"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <RiMacbookFill /> Booking
                        </NavLink>
                    </li>

                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/add-services"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <FaCalendarAlt /> Services
                        </NavLink>
                    </li>

                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/add-service-type"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <SiServerless /> Services Type
                        </NavLink>
                    </li>

                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/add-property-type"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <LuProportions className="text-[16px]" /> Property Type
                        </NavLink>
                    </li>

                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/add-property-item"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <FaCalendarAlt /> Property Item
                        </NavLink>
                    </li>

                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/user-management"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <FaUsers /> User Management
                        </NavLink>
                    </li>

                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/add-promo-code"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <SiProton /> Add promo Code
                        </NavLink>
                    </li>

                    <li className="list-none border-b border-dashed hover:bg-gray-50">
                        <NavLink
                            to="/dashboard/admin-date-time"
                            className={({ isActive }) =>
                                `text-[14px] font-medium flex items-center gap-2 text-[#157D91] px-3 py-2 transition 
                        ${isActive ? "font-extrabold" : ""}`
                            }>
                            <IoMdTime className="text-[18px]" /> Date & Time Slot
                        </NavLink>
                    </li>
                </ul>
            )}
        </>
    );


    return (
        <div className="w-full min-h-screen bg-white text-gray-500">
            <div className="drawer lg:drawer-open max-w-7xl mx-auto">
                <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

                {/* Drawer Content */}
                <div className="drawer-content flex flex-col">
                    {/* Top Navbar for Mobile - WITH IMAGE */}
                    <div className="w-full navbar flex justify-between items-center lg:hidden px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                            <label htmlFor="dashboard-drawer" className="btn btn-ghost lg:hidden p-2">
                                <MdMenu size={24} />
                            </label>
                            {/* <Link to='/' className="flex items-center">
                            <img className="w-32" src={logo} alt="logo" />
                        </Link> */}
                        </div>

                        {/* User Image on Mobile Navbar */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {/* <img
                                    src={userProfile}
                                    alt="User"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#01788E]"
                                /> */}
                                <p className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center"><FaUser /></p>
                            </div>
                        </div>
                    </div>

                    <div className="md:px-10">
                        <Outlet />
                    </div>
                </div>

                {/* Drawer Side */}
                <div className="drawer-side ">
                    <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

                    <div className="md:w-72 bg-[#FFFFFF] p-2 relative min-h-screen">

                        {/* Mobile Close Button */}
                        <label
                            htmlFor="dashboard-drawer"
                            className="btn btn-sm btn-circle absolute right-2 top-2 lg:hidden"
                        >
                            ✕
                        </label>

                        <div className="flex flex-col items-center justify-center mb-4">
                            <Link to='/' className="mb-4">
                                <img className="w-52 md:mt-4" src={logo} alt="logo" />
                            </Link>

                            {/* User Info with Image - Professional Layout */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl w-full max-w-xs mb-4">

                                {/* User Image */}
                                {/* <div className="relative">
                                <img 
                                    src={userProfile} 
                                    alt="User" 
                                    className="w-14 h-14 rounded-full object-cover border-3 border-[#01788E] shadow-sm"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div> */}

                                {/* User Details */}
                                <div className="flex-1 text-center">
                                    {/* <h2 className="text-lg font-bold text-gray-800">Rakib</h2> */}
                                    <p className="text-sm font-medium text-[#01788E] mt-1">{user?.role}</p>
                                    {/* <p className="text-xs text-gray-500 mt-0.5">Al Bada'a, Dubai</p> */}

                                    {/* Optional: Wallet Balance */}
                                    {/* <div className="flex items-center gap-1 mt-2">
                                    <img className="h-3 w-3" src={dirhum} alt="dirhum" />
                                    <p className="text-xs font-medium text-gray-700">80 Credits</p>
                                </div> */}
                                </div>
                            </div>
                        </div>
                        {links}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;