import { createContext, useContext, useEffect, useRef, useState } from "react";
import useAllServices from "../hooks/useAllServices";
import useCoverContent from "../hooks/useCoverContent";
import useButton from "../hooks/useButton";
import { useItem } from "./ItemProvider";
import { useQueries } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";

const SummaryContext = createContext();

export const SummaryProvider = ({ children }) => {
    const observer = useRef(null);
    const { data } = useItem();
    const [services] = useAllServices();
    const [content] = useCoverContent();
    const [button] = useButton();
    const [showInput, setShowInput] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [addressLocation, setAddressLocation] = useState(null);
    const [mapLatitude, setMapLatitude] = useState("");
    const [mapLongitude, setMapLongitude] = useState("");
    const [liveAddress, setLiveAddress] = useState("");
    const [useDiscount, setUseDiscount] = useState(0);
    const [promo, setPromo] = useState("");
    const [promoStatus, setPromoStatus] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [cassieModalOpen, setCassieModalOpen] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // Saved addresses management
    const [saveAddress, setSaveAddress] = useState(() => {
        const stored = localStorage.getItem("saveAddress");
        if (!stored) return [];

        try {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            console.error("Invalid saveAddress in localStorage:", stored);
            localStorage.removeItem("saveAddress");
            return [];
        }
    });

    // for promo code
    const handleApply = async (promoCode) => {
        try {
            const res = await axiosSecure.post(`/promo-code/use-promo-code/${user?.id}`, { code: promoCode });
            // console.log(res);
            if (!res?.data?.success) {
                toast.error(res?.date?.message || "Invalid promo code");
                return;
            }
            setPromo(promoCode);
            setPromoStatus(true);
            setUseDiscount(Number(res?.data?.Data?.discount || 0));
            toast.success("Promo applied successfully");
        } catch {
            toast.error("Something went wrong");
        }
    };

    // Saved addresses functions
    const addAddress = (newAddress) => {
        const addressWithId = {
            ...newAddress,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setSaveAddress(prev => {
            const updated = [...prev, addressWithId];
            localStorage.setItem("saveAddress", JSON.stringify(updated));
            return updated;
        });

        return addressWithId;
    };

    const updateAddress = (updatedAddress) => {
        setSaveAddress(prev => {
            const updated = prev.map(addr =>
                addr.id === updatedAddress.id
                    ? { ...updatedAddress, updatedAt: new Date().toISOString() }
                    : addr
            );
            localStorage.setItem("saveAddress", JSON.stringify(updated));
            return updated;
        });
    };

    const removeAddress = (id) => {
        setSaveAddress(prev => {
            const updated = prev.filter(addr => addr.id !== id);
            localStorage.setItem("saveAddress", JSON.stringify(updated));
            return updated;
        });
    };

    const getAddresses = () => {
        return [...saveAddress];
    };

    const getAddressById = (id) => {
        return saveAddress.find(addr => addr.id === id) || null;
    };

    const clearAllAddresses = () => {
        setSaveAddress([]);
        localStorage.removeItem("saveAddress");
    };

    useEffect(() => {
        localStorage.setItem("saveAddress", JSON.stringify(saveAddress));
    }, [saveAddress]);

    useEffect(() => {
        const sections = document.querySelectorAll("[id^='content-']");
        observer.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const visibleId = entry.target.getAttribute("id").replace("content-", "");
                        setActiveId(visibleId);
                    }
                });
            },
            { threshold: 0.5 }
        );
        sections.forEach((section) => observer.current.observe(section));
        return () => {
            if (observer.current) {
                sections.forEach((section) => observer.current.unobserve(section));
            }
        };
    }, [content]);

    const itemQueries = useQueries({
        queries: data.map((id) => ({
            queryKey: ["item-summary", id],
            queryFn: async () => {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_API_URL}/property-items/${id}`
                );
                const json = await res.json();
                return json?.Data;
            },
            enabled: !!id,
        })),
    });

    const itemSummary = itemQueries.map((q) => q.data).filter(Boolean);
    const serviceTitle = itemSummary.map(item =>
        item?.propertyType?.serviceType?.title || null
    );

    // Price calculation with separate VAT for each item
    const itemSummaryWithTotal = itemSummary.map(item => {
        const price = Number(item.price || 0);
        const serviceCharge = Number(item.serviceCharge || 0);

        const subTotal = price + serviceCharge;
        const vat = subTotal * 0.05;
        const totalToPay = subTotal + vat;

        return {
            ...item,
            servicePrice: price,
            subTotal,
            vat,
            serviceCharge,
            totalToPay,
        };
    });

    // service price without vat
    const servicePrice = itemSummaryWithTotal.reduce(
        (acc, item) => acc + item.price,
        0
    );

    // subtotal calculations 
    const subTotal = itemSummaryWithTotal.reduce(
        (acc, item) => acc + item.subTotal,
        0
    );

    // vat calculation_ static
    const vat = itemSummaryWithTotal.reduce(
        (acc, item) => acc + item.vat,
        0
    );

    // serviceCharge calculation
    const serviceCharge = itemSummaryWithTotal.reduce(
        (acc, item) => acc + item.serviceCharge,
        0
    );

    const totalToPay = itemSummaryWithTotal.reduce(
        (acc, item) => acc + item.totalToPay,
        0
    );

    // Calculate total after discount
    const discountAmount =
        useDiscount > 0 ? (totalToPay * useDiscount) / 100 : 0;
    const totalAfterDiscount = totalToPay - discountAmount;

    const summaryInfo = {
        // service related functionality 
        servicePrice,
        subTotal,
        vat,
        serviceCharge,
        totalToPay,
        totalAfterDiscount,

        // promo related 
        useDiscount,
        setUseDiscount,
        promo,
        promoStatus,
        setPromo,
        setPromoStatus,
        handleApply,

        // item date 
        itemSummary: itemSummaryWithTotal,
        serviceTitle,

        // UI state
        services,
        button,
        setActiveId,
        activeId,
        content,
        showInput,
        setShowInput,
        date,
        setDate,
        time,
        setTime,
        loginModalOpen,
        setLoginModalOpen,

        // cassie modal
        cassieModalOpen,
        setCassieModalOpen,

        // location data
        mapLatitude,
        setMapLatitude,
        mapLongitude,
        setMapLongitude,
        addressLocation,
        setAddressLocation,
        liveAddress,
        setLiveAddress,

        // save address
        saveAddress,
        setSaveAddress,
        addAddress,
        updateAddress,
        removeAddress,
        getAddresses,
        getAddressById,
        clearAllAddresses,

        updateAddressLocation: (id, lat, lng) => {
            setSaveAddress(prev => prev.map(addr =>
                addr.id === id
                    ? { ...addr, latitude: lat, longitude: lng }
                    : addr
            ));
        }
    };

    return (
        <SummaryContext.Provider value={summaryInfo}>
            {children}
        </SummaryContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSummary = () => useContext(SummaryContext);