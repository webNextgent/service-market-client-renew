import { useQuery } from "@tanstack/react-query";

const useDashboardServiceType = () => {

    const { data: serviceType = [], isLoading, refetch } = useQuery({
        queryKey: ['serviceType'],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/service-type/serviceType/dashboard`);
            const data = await res.json();
            return data.Data;
        }
    })

    return [serviceType, refetch, isLoading];
};

export default useDashboardServiceType;