import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access-token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded)
            } catch {
                localStorage.removeItem("access-token");
            }
        }
        setLoading(false);
    }, []);

    const logOut = () => {
        localStorage.removeItem("access-token");
        setUser(null);
    };

    const authInfo = { user, setUser, loading, logOut };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;