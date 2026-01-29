import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const ProtectedRouteAdmin = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user || (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN")) {
        return <Navigate to="/" replace />;
    }

    return children;
};


export default ProtectedRouteAdmin;