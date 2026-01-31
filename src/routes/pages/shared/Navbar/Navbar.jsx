/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import logo from "../../../../assets/logo/logo.png";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { useSummary } from "../../../../provider/SummaryProvider";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { loginModalOpen, setLoginModalOpen } = useSummary();
    const { user, logOut } = useAuth();
    const isMobile = window.innerWidth < 768;
    console.log(user);
    // 🔹 Click outside / backdrop handler
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <div className="">
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md md:px-12 navbar md:flex md:justify-center md:items-center">
                {/* Left */}
                <div className="navbar-start flex items-center flex-1">
                    <Link to="/">
                        <img
                            className="w-[133px] h-[33px]"
                            src={logo}
                            alt="Logo"
                        />
                    </Link>
                </div>

                {/* Right */}
                <div className="navbar-end mr-4 md:w-[100px]">
                    {user ? (
                        <div
                            ref={dropdownRef}
                            className="relative"
                            onMouseEnter={() =>
                                !isMobile && setDropdownOpen(true)
                            }
                            onMouseLeave={() =>
                                !isMobile && setDropdownOpen(false)
                            }
                        >
                            <button
                                className="btn bg-white text-gray-500 border shadow-xs"
                                onClick={() =>
                                    isMobile &&
                                    setDropdownOpen(!dropdownOpen)
                                }
                            >
                                {user?.firstName + user?.lastName || user?.role}
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute top-9 right-0 mt-1 w-60 bg-white shadow-lg rounded-xl p-2 z-50">
                                    {user?.role === "USER" ? (
                                        <>
                                            <Link
                                                to="/dashboard/booking"
                                                className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
                                                onClick={() =>
                                                    setDropdownOpen(false)
                                                }
                                            >
                                                My Booking
                                            </Link>

                                            <Link
                                                to="/dashboard/profile"
                                                className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
                                                onClick={() =>
                                                    setDropdownOpen(false)
                                                }
                                            >
                                                My Profile
                                            </Link>

                                            <button
                                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
                                                onClick={async () => {
                                                    await logOut();
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/dashboard/admin-booking"
                                                className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
                                                onClick={() =>
                                                    setDropdownOpen(false)
                                                }
                                            >
                                                Dashboard
                                            </Link>

                                            <button
                                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
                                                onClick={async () => {
                                                    await logOut();
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setLoginModalOpen(true)}
                            className="btn bg-white text-[#5D4F52] border shadow-xs font-bold"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>

            {/* Spacer */}
            <div className="h-10 md:h-[70px]"></div>
        </div>
    );
};

export default Navbar;



// main nav
// /* eslint-disable no-unused-vars */
// import { Link } from "react-router-dom";
// import logo from "../../../../assets/logo/logo.png";
// import { useState } from "react";
// import useAuth from "../../../../hooks/useAuth";
// import { useSummary } from "../../../../provider/SummaryProvider";
// import { useTheme } from "../../../../provider/ThemeProvider";

// const Navbar = () => {
//     // const [openModal, setOpenModal] = useState(false);
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const { loginModalOpen, setLoginModalOpen } = useSummary();

//     const { user, logOut } = useAuth();

//     return (
//         <>
//             <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md md:px-12 navbar md:flex md:justify-center md:items-center">
//                 {/* Left */}
//                 <div className="navbar-start flex items-center">
//                     <Link to="/">
//                         <img
//                             className="w-[133px] h-[33px]"
//                             src={logo}
//                             alt="Logo"
//                         />
//                     </Link>
//                 </div>

//                 {/* Middle */}
//                 <div className="navbar-end hidden lg:flex">
//                     <ul className="menu menu-horizontal px-1"></ul>
//                 </div>

//                 {/* Right */}
//                 <div className="navbar-end mr-4 md:w-[100px]">
//                     {user ? (
//                         <div
//                             className="relative"
//                             onMouseEnter={() => setDropdownOpen(true)}
//                             onMouseLeave={() => setDropdownOpen(false)}
//                         >
//                             <button className="btn bg-white text-gray-500 border shadow-xs">
//                                 {user?.name || user?.role}
//                             </button>

//                             {/* Dropdown */}
//                             {dropdownOpen && (
//                                 <div className="absolute top-9 right-0 mt-1 w-60 bg-white shadow-lg rounded-xl p-2 z-50">
//                                     {user?.role === "USER" ? (
//                                         <>
//                                             <Link
//                                                 to="/dashboard/booking"
//                                                 className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
//                                             >
//                                                 My Booking
//                                             </Link>

//                                             <Link
//                                                 to="/dashboard/profile"
//                                                 className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
//                                             >
//                                                 My Profile
//                                             </Link>

//                                             <button
//                                                 className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
//                                                 onClick={async () => {
//                                                     await logOut();
//                                                 }}
//                                             >
//                                                 Logout
//                                             </button>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Link
//                                                 to="/dashboard/admin-booking"
//                                                 className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
//                                             >
//                                                 Dashboard
//                                             </Link>

//                                             <button
//                                                 className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-[#01788E]"
//                                                 onClick={async () => {
//                                                     await logOut();
//                                                 }}
//                                             >
//                                                 Logout
//                                             </button>
//                                         </>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="flex items-center gap-2.5">
//                             <button
//                                 onClick={() => setLoginModalOpen(true)}
//                                 className="btn bg-white text-[#5D4F52] border shadow-xs font-bold"
//                             >
//                                 Login
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Spacer */}
//             <div className="h-10 md:h-[70px]"></div>
//         </>
//     );
// };

// export default Navbar;