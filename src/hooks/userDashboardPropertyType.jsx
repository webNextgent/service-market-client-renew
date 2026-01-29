import { useQuery } from "@tanstack/react-query";

const useDashboardPropertyType = () => {

    const { data: propertyType = [], refetch, isLoading } = useQuery({
        queryKey: ['propertyType'],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/property-type`);
            const data = await res.json();
            return data.Data;
        }
    });

    return [propertyType, refetch, isLoading];
};

export default useDashboardPropertyType;
