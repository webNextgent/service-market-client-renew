import { useQuery } from "@tanstack/react-query";

const useDashboardPropertyItem = () => {

    const { data: propertyItem = [], refetch, isLoading } = useQuery({
        queryKey: ['propertyItem'],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/property-items`);
            const data = await res.json();
            return data.Data;
        }
    });

    return [propertyItem, refetch, isLoading];
};

export default useDashboardPropertyItem;