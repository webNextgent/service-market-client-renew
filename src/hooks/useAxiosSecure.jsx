import axios from "axios";
import useAuth from "./useAuth";
import { useEffect } from "react";
// import { useSummary } from "../provider/SummaryProvider";


const axiosSecure = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_API_URL}`
})

const useAxiosSecure = () => {
    const { logOut } = useAuth();
    // const { setLoginModalOpen } = useSummary();

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(
            config => {
                const token = localStorage.getItem("access-token");
                if (token) {
                    config.headers.authorization = `${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            res => res,
            async error => {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    await logOut();
                    // setLoginModalOpen(true);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut]);

    return axiosSecure;
};


export default useAxiosSecure;