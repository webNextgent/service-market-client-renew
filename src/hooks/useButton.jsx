import { useQuery } from "@tanstack/react-query";

const useButton = () => {
    const { data: button = [], isLoading: loadingButton, error, refetch } = useQuery({
        queryKey: ["all-button"],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/service-type`);
            const data = await res.json();
            return data.Data;
        }
    });

    return [button, loadingButton, error, refetch];
};

export default useButton;