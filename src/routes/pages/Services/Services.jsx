/* eslint-disable react-hooks/exhaustive-deps */
import ServiceDetails from "../../../components/ServiceDetails/ServiceDetails";
import Summery from "../../../components/Summery/Summery";
import Cover from "../../../components/Cover/Cover";
import CoverContent from "../../../components/CoverContent/CoverContent";
import Card from "../../../components/Card/Card";
import NextBtn from "../../../components/NextBtn/NextBtn";
import useDashboardPropertyItem from "../../../hooks/useDashboardPropertyItem";
import dirhum from '../../../assets/icon/dirhum.png';
import { useEffect, useRef, useState, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowRoundBack } from "react-icons/io";
import { IoAddSharp } from "react-icons/io5";
import { useItem } from "../../../provider/ItemProvider";
import { useSummary } from "../../../provider/SummaryProvider";
import useAllServices from "../../../hooks/useAllServices";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";



const Services = () => {
    const { button, setActiveId, activeId, content, itemSummary, totalAfterDiscount, showInput, setShowInput, serviceTitle, totalVatRate } = useSummary();
    const [services] = useAllServices();
    const { addItem, removeItem } = useItem();
    const sectionRefs = useRef({});
    const buttonSliderRefs = useRef({});
    const [propertyItem] = useDashboardPropertyItem();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [open, setOpen] = useState(false);
    const HEADER_OFFSET = 180;
    const isManualClick = useRef(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Scroll active button into view
    useEffect(() => {
        if (activeId && buttonSliderRefs.current[activeId]) {
            const buttonElement = buttonSliderRefs.current[activeId];
            const sliderContainer = buttonElement?.closest('.overflow-x-auto');

            if (sliderContainer && buttonElement) {
                const containerRect = sliderContainer.getBoundingClientRect();
                const buttonRect = buttonElement.getBoundingClientRect();

                // Scroll if button is not fully visible
                if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
                    buttonElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }
        }
    }, [activeId]);

    // Intersection Observer for detecting visible sections
    useEffect(() => {
        if (!content?.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("data-id");
                        if (id) setActiveId(id);
                    }
                });
            },
            {
                root: null,
                rootMargin: `-${HEADER_OFFSET}px 0px -50% 0px`,
                threshold: 0,
            }
        );

        content.forEach((c) => {
            const el = sectionRefs.current[c.id];
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [content]);


    const handleAdd = (id) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: 1,
        }));
        addItem(id);
    };

    const handleRemove = (id) => {
        setQuantities((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
        removeItem(id);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setSuggestions([]);
            setShowBackdrop(false);
            return;
        }
        const filtered = propertyItem.filter((item) =>
            item?.title?.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowBackdrop(filtered.length > 0);

        // Mobile এ suggestion থাকলে backdrop দেখাও
        if (filtered.length > 0) {
            setSearchOpen(true);
        }
    };

    const closeSuggestions = () => {
        setSuggestions([]);
        setShowBackdrop(false);
        setQuery("");
        setSearchOpen(false);
    };

    const scrollToSection = useCallback((contentId) => {
        const section = sectionRefs.current[contentId];
        if (!section) return;

        const y =
            section.getBoundingClientRect().top +
            window.scrollY -
            HEADER_OFFSET;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });

        setActiveId(contentId);
    }, []);


    useEffect(() => {
        if (isManualClick.current) return;
        if (activeId && buttonSliderRefs.current[activeId]) {
            const buttonElement = buttonSliderRefs.current[activeId];
            const sliderContainer = buttonElement?.closest('.overflow-x-auto');

            if (sliderContainer && buttonElement) {
                const containerRect = sliderContainer.getBoundingClientRect();
                const buttonRect = buttonElement.getBoundingClientRect();

                if (
                    buttonRect.left < containerRect.left ||
                    buttonRect.right > containerRect.right
                ) {
                    buttonElement.scrollIntoView({
                        behavior: 'auto',
                        block: 'nearest',
                        inline: 'center',
                    });
                }
            }
        }
    }, [activeId]);



    return (
        <div>
            <div className="hidden md:block mt-10 md:mt-0">
                <ServiceDetails title="Service Details" currentStep={1} />
            </div>

            <div className="md:flex justify-center gap-8 mt-5">
                {/* Left */}
                <div className="md:w-[60%] md:mb-4 md:space-y-4">

                    <div className="md:hidden absolute to-20% z-40 w-full p-4">
                        {/* Mobile View - Image-like Header */}
                        <div className="flex items-center justify-between mt-5">
                            {/* Left: Back Button */}
                            <div className="p-1.5 bg-white rounded-full border">
                                <IoIosArrowBack className="text-2xl font-bold" />
                            </div>

                            {/* Right: Search Icon */}
                            <div>
                                <button
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    className="p-1.5 bg-white rounded-full border"
                                >
                                    {searchOpen ? (
                                        // Close Icon (when search is open)
                                        <RxCross2 className="text-2xl font-bold" />
                                    ) : (
                                        <CiSearch className="text-2xl font-bold" />
                                        // Search Icon (when search is closed)
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Search Input - Conditional */}
                        {searchOpen && (
                            <>
                                {/* BACKDROP */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setSearchOpen(false)}
                                ></div>

                                {/* SEARCH INPUT */}
                                <div className="absolute top-full left-0 w-full z-50 px-2.5">
                                    <input
                                        className="py-3 px-4 border border-[#01788E] w-full rounded-md focus:outline-none shadow-lg"
                                        type="text"
                                        placeholder="Search services..."
                                        value={query}
                                        onChange={handleChange}
                                        autoFocus
                                    />

                                    {/* SUGGESTION BOX */}
                                    {suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded-md mt-1 max-h-[80vh] overflow-y-auto">
                                            {suggestions.map((item) => {
                                                const qty = quantities[item.id] || 0;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="flex gap-3 border-b border-gray-200 p-3 hover:bg-gray-50"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="text-sm font-semibold">{item.title}</h3>
                                                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <p className="text-[#382F31] font-bold text-sm flex items-center gap-1">
                                                                    <img className="h-3 w-3" src={dirhum} alt="" /> {item.price}
                                                                </p>
                                                                {qty === 0 ? (
                                                                    <button
                                                                        onClick={() => {
                                                                            handleAdd(item.id);
                                                                            setSearchOpen(false);
                                                                            setQuery("");
                                                                        }}
                                                                        className="text-xs border border-[#01788E] text-[#01788E] px-3 py-1 rounded hover:bg-blue-50"
                                                                    >
                                                                        Add
                                                                    </button>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-semibold text-gray-700">Added ✓</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Desktop View - No Changes */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <input
                                className="py-3 px-7 border border-[#01788E] w-full rounded-md focus:outline-none"
                                type="text"
                                placeholder="Search services..."
                                value={query}
                                onChange={handleChange}
                            />

                            {showBackdrop && (
                                <div
                                    className="fixed inset-0 bg-black/20 z-40"
                                    onClick={closeSuggestions}
                                ></div>
                            )}

                            {suggestions.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md rounded-md mt-1 z-40 max-h-[90vh] overflow-y-auto p-8">
                                    {suggestions.map((item) => {
                                        const qty = quantities[item.id] || 0;
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex gap-4 border-b pb-2.5 border-gray-300 space-y-2 mb-4"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-28 h-26 mx-auto object-cover rounded-sm"
                                                />
                                                <div className="space-y-2 flex-1">
                                                    <div>
                                                        <h3 className="text-[16px] font-semibold">{item.title}</h3>
                                                        <p className="text-gray-600 text-[13px]">{item.description}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[#382F31] font-bold text-[14px] flex items-center gap-1">
                                                            <img className="h-[15px] w-[15px]" src={dirhum} alt="" /> {item.price}
                                                        </p>
                                                        {qty === 0 ? (
                                                            <button
                                                                onClick={() => handleAdd(item.id)}
                                                                className="cursor-pointer border px-2 py-1 flex items-center gap-2 text-[#01788E] rounded-xs hover:bg-gray-100 transition text-[13px]"
                                                            >
                                                                Add <IoAddSharp />
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => handleRemove(item.id)}
                                                                    className="text-[#01788E] border rounded-full font-bold text-lg px-[7px] cursor-pointer"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="font-semibold text-gray-700">
                                                                    {qty}
                                                                </span>
                                                                <button
                                                                    disabled
                                                                    className="text-gray-400 font-bold text-lg px-2 cursor-not-allowed border rounded-full border-[#014855]"
                                                                    title="Maximum quantity reached"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SERVICE LIST + BUTTONS + CONTENT */}
                    <div className="shadow-md rounded-xl">
                        <div>
                            {services?.map((service) => (
                                <div key={service.id}>
                                    <Card service={service} />

                                    {/* BUTTON SLIDER */}
                                    <div className="px-2 md:px-9 bg-white md:py-4 sticky top-16 z-1">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const scroller = document.getElementById(`btn-slider-${service.id}`);
                                                    scroller?.scrollBy({ left: -300, behavior: "smooth" });
                                                }}
                                                className="text-3xl font-bold text-[#01788E]"
                                            >
                                                <IoIosArrowBack />
                                            </button>

                                            <div
                                                id={`btn-slider-${service.id}`}
                                                className="flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 py-2 w-full"
                                                style={{
                                                    scrollbarWidth: 'none',
                                                    msOverflowStyle: 'none',
                                                }}
                                            >
                                                {button
                                                    ?.filter((b) => b.serviceId === service.id)
                                                    .map((b) => (
                                                        <button
                                                            key={b.id}
                                                            ref={(el) => (buttonSliderRefs.current[b.id] = el)}
                                                            onClick={() => {
                                                                isManualClick.current = true;
                                                                setActiveId(b.id);
                                                                scrollToSection(b.id);

                                                                setTimeout(() => {
                                                                    isManualClick.current = false;
                                                                }, 500);
                                                            }}
                                                            className={`snap-start shrink-0 min-w-[140px] px-4 py-1 rounded-full border flex items-center gap-2 transition
                                                                ${activeId === b.id
                                                                    ? "text-[#ED6329] border-[#ED6329] border-2 bg-[#FFF2EE]"
                                                                    : "text-[#01788E] border-[#01788E] bg-white"}`}
                                                        >
                                                            <img className="w-7 h-7 rounded-full" src={b.image} alt={b.title} />
                                                            {b.title}
                                                        </button>
                                                    ))}
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const scroller = document.getElementById(`btn-slider-${service.id}`);
                                                    scroller?.scrollBy({ left: 300, behavior: "smooth" });
                                                }}
                                                className="text-3xl font-bold text-[#01788E]"
                                            >
                                                <IoIosArrowForward />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hide scrollbar with custom CSS */}
                                    <style jsx>{`
                                        .no-scrollbar::-webkit-scrollbar {
                                            display: none;
                                        }
                                    `}</style>

                                    {/* CONTENT */}
                                    <div className="px-5 md:px-9 mt-3 space-y-6">
                                        {content
                                            ?.filter((c) => c.serviceId === service.id)
                                            .map((c) => (
                                                <div
                                                    key={c.id}
                                                    ref={(el) => (sectionRefs.current[c.id] = el)}
                                                    data-id={c.id}
                                                >
                                                    <Cover content={c} />
                                                    <CoverContent content={c} />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Instructions */}
                        <div className="space-y-2 px-3 pb-4 md:px-9 md:pb-6">
                            <h3 className="font-medium">Do you have any special instructions? (Optional)</h3>
                            <textarea
                                className="textarea text-sm bg-white w-full focus:outline-none border border-black"
                                placeholder="Example: Please mention any sensitivities, allergies or any particular requirements you may have."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <Summery
                    isValid={itemSummary.length !== 0}
                    totalVatRate={totalVatRate}
                    serviceTitle={serviceTitle}
                    itemSummary={itemSummary}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    open={open}
                    setOpen={setOpen} />
            </div>

            {/* for mobile & tablet view  */}
            {itemSummary === undefined ? null : itemSummary.length === 0 ? (
                <div className="lg:hidden fixed bottom-0 left-0 w-full shadow-[0_-2px_10px_rgba(0,0,0,0.08) z-40 bg-[#90dae7] text-center">
                    <p className="text-[#056677] py-1.5 npm rfont-medium">Add an item to continue</p>
                </div>
            ) : (
                <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border-t border-gray-200 z-40">
                    <div className="flex justify-center px-3 py-2">
                        <div className="flex items-center gap-4">

                            {/* View Summary */}
                            <button
                                onClick={() => setOpen(true)}
                                className="cursor-pointer select-none
                   active:scale-[0.98] transition-transform
                   focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:ring-offset-2
                   rounded-lg px-1"
                            >
                                <p className="text-[10px] text-gray-500 font-medium uppercase">
                                    View Summary
                                </p>
                                <div className="flex items-center gap-1.5 justify-center">
                                    <img src={dirhum} className="w-3.5 h-3.5" alt="" />
                                    <span className="text-base font-bold text-gray-900">
                                        {totalAfterDiscount.toFixed(2)}
                                    </span>
                                    <span className="text-gray-400 text-sm">›</span>
                                </div>
                            </button>

                            {/* Next Button (Fixed Width) */}
                            <div className="w-[140px]">
                                <NextBtn
                                    disabled={itemSummary.length === 0}
                                />
                            </div>

                        </div>
                    </div>
                </div>)}

            <div className="hidden lg:block">
                <NextBtn disabled={itemSummary.length === 0} />
            </div>
        </div>
    );
};

export default Services;