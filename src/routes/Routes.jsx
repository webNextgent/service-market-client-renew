import Main from "../layout/Main";
import Home from "./pages/Home/Home/Home";
import Address from "./pages/Address/Address";
import DateTime from "./pages/DateTime/DateTime";
import Confirmation from "./pages/Confirmation/Confirmation";
import UserDashboard from "../layout/UserDashboard";
import UserBooking from "../UserDashboard/UserBooking";
import UserProfile from "../UserDashboard/UserProfile";
import BookingSuccess from "./pages/BookingSuccess/BookingSuccess";
import SavedLocations from "../UserDashboard/SaveLocations";
import PaymentMethods from "../UserDashboard/PaymentMethods";
import MyWallet from "../UserDashboard/MyWallet";
import DeleteAccount from "../UserDashboard/DeleteAccount";
import InviteFriend from "../UserDashboard/InviteFriend";
import BookingDetails from "./pages/BookingDetails/BookingDetails";
import AddServices from "../AdminDashboard/AddServices";
import AdminBooking from "../AdminDashboard/AdminBooking";
import AddServiceType from "../AdminDashboard/AddServiceType";
import AddPropertyType from "../AdminDashboard/AddPropertyType";
import AddPropertyItem from "../AdminDashboard/AddPropertyItem";
import AdminDateTime from "../AdminDashboard/AdminDateTime";
import LocationPicker from "./pages/LocationPicker/LocationPicker";
import { createBrowserRouter } from "react-router-dom";
import AddPromoCode from "../AdminDashboard/AddPromoCode";
import axiosSecure from "../utils/axiosSecure";
import ProtectedRouteUser from "./ProtectedRouteUser";
import UserManagement from "../AdminDashboard/UserManagement";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <ScrollToTop />
                <Main />
            </>
        ),
        children: [
            { path: '/', element: <Home /> },
            { path: 'location', element: <ProtectedRouteUser><LocationPicker /></ProtectedRouteUser> },
            { path: 'address', element: <ProtectedRouteUser><Address /> </ProtectedRouteUser> },
            { path: 'date-time', element: <ProtectedRouteUser><DateTime /></ProtectedRouteUser> },
            { path: 'confirmation', element: <ProtectedRouteUser> <Confirmation /> </ProtectedRouteUser> },
            { path: 'booking-success', element: <ProtectedRouteUser> <BookingSuccess /></ProtectedRouteUser> },
            {
                path: "/booking-details/:id",
                element: <ProtectedRouteUser> <BookingDetails /></ProtectedRouteUser>,
                loader: async ({ params }) => {
                    const res = await axiosSecure.get(`/booking/${params.id}`);
                    return res.data;
                }
            },
        ]
    },
    {
        path: 'dashboard',
        element: <ProtectedRouteUser><UserDashboard /></ProtectedRouteUser>,
        children: [
            { path: 'booking', element: <ProtectedRouteUser> <UserBooking /></ProtectedRouteUser> },
            { path: 'profile', element: <ProtectedRouteUser> <UserProfile /></ProtectedRouteUser> },
            { path: 'saved-locations', element: <ProtectedRouteUser> <SavedLocations /></ProtectedRouteUser> },
            { path: 'payment-methods', element: <ProtectedRouteUser> <PaymentMethods /></ProtectedRouteUser> },
            { path: 'wallet', element: <ProtectedRouteUser><MyWallet /> </ProtectedRouteUser> },
            { path: 'delete-account', element: <ProtectedRouteUser> <DeleteAccount /></ProtectedRouteUser> },
            { path: 'invite-friend', element: <ProtectedRouteUser><InviteFriend /></ProtectedRouteUser> },

            // admin routes 
            { path: 'add-services', element: <ProtectedRouteAdmin> <AddServices /></ProtectedRouteAdmin> },
            { path: 'admin-booking', element: <ProtectedRouteAdmin><AdminBooking /></ProtectedRouteAdmin> },
            { path: 'add-service-type', element: <ProtectedRouteAdmin><AddServiceType /> </ProtectedRouteAdmin> },
            { path: 'add-property-type', element: <ProtectedRouteAdmin><AddPropertyType /></ProtectedRouteAdmin> },
            { path: 'add-property-item', element: <ProtectedRouteAdmin><AddPropertyItem /></ProtectedRouteAdmin> },
            { path: 'add-promo-code', element: <ProtectedRouteAdmin><AddPromoCode /></ProtectedRouteAdmin> },
            { path: 'admin-date-time', element: <ProtectedRouteAdmin><AdminDateTime /></ProtectedRouteAdmin> },
            { path: 'user-management', element: <ProtectedRouteAdmin><UserManagement /></ProtectedRouteAdmin> },
        ]
    }
]);