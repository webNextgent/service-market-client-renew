import axios from "axios";
import { handleLogout } from "./authService";


const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
});

axiosSecure.interceptors.request.use(
    config => {
        const token = localStorage.getItem("access-token");
        if (token) {
            config.headers.authorization = `${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosSecure.interceptors.response.use(
    res => res,
    async error => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            await handleLogout();
        }
        return Promise.reject(error);
    }
);

export default axiosSecure;