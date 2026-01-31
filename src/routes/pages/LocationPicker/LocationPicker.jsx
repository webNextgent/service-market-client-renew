/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect, useRef } from "react";
import { FaLocationCrosshairs, FaPlus, FaMinus } from "react-icons/fa6";
import { FaSatellite } from "react-icons/fa";
import { GoogleMap, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import NextBtn from "../../../components/NextBtn/NextBtn";
import Summery from "../../../components/Summery/Summery";
import { useSummary } from "../../../provider/SummaryProvider";
import ServiceDetails from "../../../components/ServiceDetails/ServiceDetails";
import { useNavigate } from "react-router-dom";
import dirhum from '../../../assets/icon/dirhum.png';

const containerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 25.2048, lng: 55.2708 };

export default function LocationPicker() {
    const navigate = useNavigate();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const { itemSummary, totalAfterDiscount, showInput, setShowInput, address, serviceTitle, setMapLongitude, setMapLatitude, setAddressLocation, liveAddress, saveAddress, setLiveAddress, totalVatRate, mapLongitude, mapLatitude } = useSummary();

    const [selectedAddressId, setSelectedAddressId] = useState(
        liveAddress?.id || null
    );

    // Current address state
    const [currentAddress, setCurrentAddress] = useState(null);
    const [isGettingCurrentAddress, setIsGettingCurrentAddress] = useState(false);
    const [showCurrentAddressOption, setShowCurrentAddressOption] = useState(false);

    // Autocomplete input ref
    const autocompleteInputRef = useRef(null);

    const handleAddressSelect = (addr) => {
        setSelectedAddressId(addr.id);
        setLiveAddress(addr);

        // Latitude, longitude সেট করুন
        if (addr.latitude && addr.longitude) {
            setMapLatitude(addr.latitude);
            setMapLongitude(addr.longitude);
            setAddressLocation(addr.displayAddress);
        }

        setIsNextDisabled(false);
        setFromListSelection(true);
        setShowMapForNew(false);
    };

    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [, setMapAddressSelected] = useState(false);
    const [fromListSelection, setFromListSelection] = useState(false);
    const [selectedPos, setSelectedPos] = useState(defaultCenter);
    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [mapType, setMapType] = useState("roadmap");
    const [open, setOpen] = useState(false);
    const [showMapForNew, setShowMapForNew] = useState(false);

    const getAddressFromLatLng = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    resolve(results[0].formatted_address);
                } else {
                    reject("Address not found");
                }
            });
        });
    };

    const handleLocation = async (pos) => {
        setSelectedPos(pos);
        map?.panTo(pos);
        const addressText = await getAddressFromLatLng(pos.lat, pos.lng);
        setAddressLocation(addressText);
        setMapLatitude(pos.lat);
        setMapLongitude(pos.lng);
        return addressText;
    };

    const onLoadAutocomplete = (auto) => {
        setAutocomplete(auto);

        // Attach click event listener to the input
        const inputElement = auto.inputField;
        if (inputElement) {
            inputElement.addEventListener('click', handleInputClick);
        }
    };

    const handleInputClick = () => {
        setShowCurrentAddressOption(true);
    };

    const onPlaceChanged = async () => {
        if (!autocomplete) return;
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        const pos = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };
        await handleLocation(pos);
        setIsNextDisabled(false);
        setMapAddressSelected(true);
        setFromListSelection(false);
        setShowCurrentAddressOption(false);
    };

    const handleMapClick = useCallback(
        async (event) => {
            const pos = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            await handleLocation(pos);
            setIsNextDisabled(false);
            setMapAddressSelected(true);
            setFromListSelection(false);
            setShowCurrentAddressOption(false);
        },
        [map]
    );

    // Get current address function
    const getCurrentAddress = async () => {
        setIsGettingCurrentAddress(true);
        try {
            if (!navigator.geolocation) {
                throw new Error("Geolocation is not supported by your browser");
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // Get address from coordinates
            const geocoder = new window.google.maps.Geocoder();
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ location: pos }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject("Could not get address");
                    }
                });
            });

            // Create current address object
            const currentAddr = {
                id: "current-location",
                displayAddress: result,
                latitude: pos.lat,
                longitude: pos.lng,
                type: "Current Location",
                area: "Current Location",
                city: "",
                isCurrentLocation: true
            };

            setCurrentAddress(currentAddr);

            // Update map position
            setSelectedPos(pos);
            map?.panTo(pos);
            setMapLatitude(pos.lat);
            setMapLongitude(pos.lng);
            setAddressLocation(result);

            setIsNextDisabled(false);
            setMapAddressSelected(true);
            setFromListSelection(false);
            setShowCurrentAddressOption(false);

            // Clear the input field
            if (autocomplete && autocomplete.inputField) {
                autocomplete.inputField.value = result;
            }

            return currentAddr;
        } catch (error) {
            console.error("Error getting current address:", error);
            alert("Could not get your current location. Please check your location permissions.");
            return null;
        } finally {
            setIsGettingCurrentAddress(false);
        }
    };

    // Handle current address selection from autocomplete dropdown
    const handleCurrentAddressClick = async () => {
        const addr = await getCurrentAddress();
        if (addr) {
            setSelectedAddressId(addr.id);
            setLiveAddress(addr);
        }
    };

    // GPS Button - for map view
    const gotoMyLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            handleLocation(pos);
            setIsNextDisabled(false);
            setMapAddressSelected(true);
            setFromListSelection(false);
            setShowCurrentAddressOption(false);
        });
    };

    const handleNextClick = async () => {
        if (showMapForNew) {
            navigate("/address");
            return false;
        }

        if (fromListSelection) {
            navigate("/date-time");
            return false;
        }
        return true;
    };

    // Cleanup event listener
    useEffect(() => {
        return () => {
            if (autocomplete && autocomplete.inputField) {
                autocomplete.inputField.removeEventListener('click', handleInputClick);
            }
        };
    }, [autocomplete]);

    if (!isLoaded) return <div>Loading map…</div>;
    return (
        <div>
            <div className="mt-10 md:mt-0">
                <ServiceDetails title="Address" currentStep={2} />
            </div>
            <div className="flex justify-center gap-8 md:mt-5">
                <div className="md:w-[60%] mb-4 space-y-1 relative shadow-md w-full py-6 px-3">
                    <h2 className="text-[24px] text-center md:text-start font-semibold">Where do you need the service?</h2>
                    <p>Please select your current address or add a new address</p>

                    {
                        saveAddress.length > 0 && !showMapForNew ?
                            <div className="">
                                <h3 className="text-xl font-semibold mb-4">
                                    Select your address
                                </h3>

                                {/* Current Location Option in saved addresses */}
                                {/* <div
                                    onClick={() => handleCurrentAddressClick()}
                                    className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors mb-3
                                        ${selectedAddressId === 'current-location'
                                            ? "border-[#01788E] bg-white"
                                            : ""
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <div className={`w-4 h-4 rounded-full border-2
                                                ${selectedAddressId === 'current-location'
                                                    ? "border-[#01788E] bg-white"
                                                    : "border-[#01788E]"
                                                }`}
                                            ></div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <FaLocationCrosshairs className="text-[#01788E]" />
                                                <span className="font-medium">
                                                    Current Location
                                                </span>
                                            </div>
                                            
                                            {isGettingCurrentAddress ? (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Getting your location...
                                                </div>
                                            ) : currentAddress ? (
                                                <>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {currentAddress.displayAddress}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 italic">
                                                        Based on your device's GPS
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Click to use your current location
                                                </div>
                                            )}
                                        </div>

                                        {selectedAddressId === 'current-location' && (
                                            <div className="text-[#01788E] font-medium">
                                                ✓ Selected
                                            </div>
                                        )}
                                    </div>
                                </div> */}

                                <div className="mb-4">
                                    {saveAddress.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => handleAddressSelect(addr)}
                                            className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors mb-2
                                                ${selectedAddressId === addr.id
                                                    ? "border-[#01788E] bg-white"
                                                    : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border-2
                                                            ${selectedAddressId === addr.id
                                                                ? "border-[#01788E] bg-white"
                                                                : "border-[#01788E]"
                                                            }`}
                                                    ></div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        {addr.displayAddress}
                                                    </div>

                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {addr.type} • {addr.area}, {addr.city}
                                                    </div>

                                                    {addr.buildingName && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            Building: {addr.buildingName}
                                                        </div>
                                                    )}
                                                </div>

                                                {selectedAddressId === addr.id ? (
                                                    <div className="text-[#01788E] font-medium">
                                                        ✓ Selected
                                                    </div>
                                                ) : (null)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            setShowMapForNew(true);
                                            setSelectedAddressId(null);
                                            setFromListSelection(false);
                                            setIsNextDisabled(true);
                                            // নতুন address এর জন্য current location সেট করুন
                                            if (mapLatitude && mapLongitude) {
                                                setSelectedPos({ lat: mapLatitude, lng: mapLongitude });
                                            }
                                        }}
                                        className="text-[#01788E] font-medium flex items-center gap-2"
                                    >
                                        <FaPlus /> Add New Address
                                    </button>
                                </div>
                            </div> :
                            <div className="">
                                {/* Search Input */}
                                <div className="absolute md:top-26 left-1/2 -translate-x-1/2 z-20 w-11/12">
                                    <div className="shadow-lg bg-white rounded-md relative">
                                        <Autocomplete
                                            onLoad={onLoadAutocomplete}
                                            onPlaceChanged={onPlaceChanged}
                                        >
                                            <input
                                                ref={autocompleteInputRef}
                                                type="text"
                                                placeholder="Search for your address…"
                                                className="w-full p-3 border rounded-md focus:outline-none"
                                                onClick={() => setShowCurrentAddressOption(true)}
                                            />
                                        </Autocomplete>

                                        {/* Custom Current Location Option in Autocomplete Dropdown */}
                                        {showCurrentAddressOption && (
                                            <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-gray-300 rounded-b-md shadow-lg z-30">
                                                <div
                                                    onClick={handleCurrentAddressClick}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                                                >
                                                    <div className="text-[#01788E]">
                                                        <FaLocationCrosshairs />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium">
                                                            Use Current Location
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {isGettingCurrentAddress
                                                                ? "Getting your location..."
                                                                : "Get your current address using GPS"}
                                                        </div>
                                                    </div>
                                                    {isGettingCurrentAddress && (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#01788E]"></div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="absolute top-80 right-3 z-20 flex flex-col space-y-2">
                                    <button onClick={() => map?.setZoom(map.getZoom() + 1)} className="bg-white shadow p-2 rounded-lg">
                                        <FaPlus />
                                    </button>
                                    <button onClick={() => map?.setZoom(map.getZoom() - 1)} className="bg-white shadow p-2 rounded-lg">
                                        <FaMinus className="font-bold" />
                                    </button>
                                    <button onClick={gotoMyLocation} className="bg-white shadow p-2 rounded-lg flex items-center justify-center">
                                        <FaLocationCrosshairs />
                                    </button>
                                    <button onClick={() => setMapType(mapType === "roadmap" ? "hybrid" : "roadmap")} className="bg-white shadow p-2 rounded-lg">
                                        <FaSatellite />
                                    </button>
                                </div>

                                {/* Google Map */}
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={selectedPos}
                                    zoom={15}
                                    onLoad={setMap}
                                    onClick={handleMapClick}
                                    mapTypeId={mapType}
                                    options={{
                                        disableDefaultUI: true,
                                        zoomControl: false,
                                        mapTypeControl: false,
                                        fullscreenControl: false,
                                        streetViewControl: false,
                                        keyboardShortcuts: false,
                                        gestureHandling: "greedy",
                                        scrollwheel: false,
                                    }}
                                >
                                    <img
                                        src="https://servicemarket.com/dist/images/map-marker.svg"
                                        alt="center marker"
                                        className="pointer-events-none"
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -100%)",
                                            width: "80px",
                                            height: "80px",
                                            zIndex: 20,
                                        }}
                                    />
                                </GoogleMap>
                            </div>
                    }
                </div>

                <Summery
                    serviceTitle={serviceTitle}
                    address={address}
                    itemSummary={itemSummary}
                    totalVatRate={totalVatRate}
                    showInput={showInput}
                    setShowInput={setShowInput}
                    liveAddress={liveAddress}
                    isValid={!isNextDisabled}
                    open={open}
                    setOpen={setOpen}
                />
            </div>


            {/* for mobile & tablet view  */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border-t border-gray-200 z-50">
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
                                disabled={isNextDisabled}
                                onClick={handleNextClick}
                            />
                        </div>

                    </div>
                </div>
            </div>


            <div className="hidden lg:block">
                <NextBtn
                    disabled={isNextDisabled}
                    onClick={handleNextClick}
                />
            </div>
        </div>
    );
};

















// import { useState, useCallback } from "react";
// import { FaLocationCrosshairs, FaPlus, FaMinus } from "react-icons/fa6";
// import { FaSatellite } from "react-icons/fa";
// import { GoogleMap, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
// import NextBtn from "../../../components/NextBtn/NextBtn";
// import Summery from "../../../components/Summery/Summery";
// import { useSummary } from "../../../provider/SummaryProvider";
// import ServiceDetails from "../../../components/ServiceDetails/ServiceDetails";
// import { useNavigate } from "react-router-dom";
// import dirhum from '../../../assets/icon/dirhum.png';

// const containerStyle = { width: "100%", height: "500px" };
// const defaultCenter = { lat: 25.2048, lng: 55.2708 };

// export default function LocationPicker() {
//     const navigate = useNavigate();
//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//         libraries: ["places"],
//     });

//     const { itemSummary, totalAfterDiscount, showInput, setShowInput, address, serviceTitle, setMapLongitude, setMapLatitude, setAddressLocation, liveAddress, saveAddress, setLiveAddress, totalVatRate, mapLongitude, mapLatitude } = useSummary();

//     const [selectedAddressId, setSelectedAddressId] = useState(
//         liveAddress?.id || null
//     );


//     const handleAddressSelect = (addr) => {
//         setSelectedAddressId(addr.id);
//         setLiveAddress(addr);

//         // Latitude, longitude সেট করুন
//         if (addr.latitude && addr.longitude) {
//             setMapLatitude(addr.latitude);
//             setMapLongitude(addr.longitude);
//             setAddressLocation(addr.displayAddress);
//         }

//         setIsNextDisabled(false);
//         setFromListSelection(true);
//         setShowMapForNew(false);
//     };

//     const [isNextDisabled, setIsNextDisabled] = useState(true);
//     const [, setMapAddressSelected] = useState(false);
//     const [fromListSelection, setFromListSelection] = useState(false);
//     const [selectedPos, setSelectedPos] = useState(defaultCenter);
//     const [map, setMap] = useState(null);
//     const [autocomplete, setAutocomplete] = useState(null);
//     const [mapType, setMapType] = useState("roadmap");
//     const [open, setOpen] = useState(false);
//     const [showMapForNew, setShowMapForNew] = useState(false);

//     const getAddressFromLatLng = (lat, lng) => {
//         const geocoder = new window.google.maps.Geocoder();
//         return new Promise((resolve, reject) => {
//             geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//                 if (status === "OK" && results[0]) {
//                     resolve(results[0].formatted_address);
//                 } else {
//                     reject("Address not found");
//                 }
//             });
//         });
//     };

//     const handleLocation = async (pos) => {
//         setSelectedPos(pos);
//         map?.panTo(pos);
//         await getAddressFromLatLng(pos.lat, pos.lng);
//         setMapLatitude(pos.lat);
//         setMapLongitude(pos.lng);
//     };

//     const onLoadAutocomplete = (auto) => setAutocomplete(auto);

//     const onPlaceChanged = async () => {
//         if (!autocomplete) return;
//         const place = autocomplete.getPlace();
//         if (!place.geometry) return;
//         const pos = {
//             lat: place.geometry.location.lat(),
//             lng: place.geometry.location.lng(),
//         };
//         handleLocation(pos);

//         const addressLocation = await getAddressFromLatLng(pos.lat, pos.lng);
//         setAddressLocation(addressLocation);
//         setIsNextDisabled(false);
//         setMapAddressSelected(true);
//         setFromListSelection(false);
//     };

//     const handleMapClick = useCallback(
//         async (event) => {
//             const pos = {
//                 lat: event.latLng.lat(),
//                 lng: event.latLng.lng(),
//             };
//             handleLocation(pos);

//             const addressLocation = await getAddressFromLatLng(pos.lat, pos.lng);
//             setAddressLocation(addressLocation);
//             setIsNextDisabled(false);
//             setMapAddressSelected(true);
//             setFromListSelection(false);
//         },
//         [map]
//     );

//     // GPS Button
//     const gotoMyLocation = () => {
//         navigator.geolocation.getCurrentPosition((position) => {
//             const pos = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude,
//             };
//             handleLocation(pos);
//             setIsNextDisabled(false);
//             setMapAddressSelected(true);
//             setFromListSelection(false);
//         });
//     };

//     const handleNextClick = async () => {
//         if (showMapForNew) {
//             navigate("/address");
//             return false;
//         }

//         if (fromListSelection) {
//             navigate("/date-time");
//             return false;
//         }
//         return true;
//     };


//     if (!isLoaded) return <div>Loading map…</div>;
//     return (
//         <div>
//             <div className="mt-10 md:mt-0">
//                 <ServiceDetails title="Address" currentStep={2} />
//             </div>
//             <div className="flex justify-center gap-8 md:mt-5">
//                 <div className="md:w-[60%] mb-4 space-y-1 relative shadow-md w-full px-6 py-6 md:p-10" confir>
//                     <h2 className="text-[24px] text-center md:text-start font-semibold">Where do you need the service?</h2>
//                     <p className="text-center md:text-start">Please select your current address or add a new address</p>

//                     {
//                         saveAddress.length > 0 && !showMapForNew ?
//                             <div className="">
//                                 <h3 className="text-xl font-semibold mb-4">
//                                     Select your address
//                                 </h3>

//                                 {saveAddress.map((addr) => (
//                                     <div
//                                         key={addr.id}
//                                         onClick={() => handleAddressSelect(addr)}
//                                         className={`border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors mb-2
//                                             ${selectedAddressId === addr.id
//                                                 ? "border-[#01788E] bg-white"
//                                                 : ""
//                                             }`}
//                                     >
//                                         <div className="flex items-start gap-3">
//                                             <div className="mt-1">
//                                                 <div
//                                                     className={`w-4 h-4 rounded-full border-2
//                                 ${selectedAddressId === addr.id
//                                                             ? "border-[#01788E] bg-white"
//                                                             : "border-[#01788E]"
//                                                         }`}
//                                                 ></div>
//                                             </div>

//                                             <div className="flex-1">
//                                                 <div className="font-medium">
//                                                     {addr.displayAddress}
//                                                 </div>

//                                                 <div className="text-sm text-gray-600 mt-1">
//                                                     {addr.type} • {addr.area}, {addr.city}
//                                                 </div>

//                                                 {addr.buildingName && (
//                                                     <div className="text-sm text-gray-500 mt-1">
//                                                         Building: {addr.buildingName}
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {selectedAddressId === addr.id ? (
//                                                 <div className="text-[#01788E] font-medium">
//                                                     ✓ Selected
//                                                 </div>
//                                             ) : (null)}
//                                         </div>
//                                     </div>
//                                 ))}

//                                 <div className="mt-6">
//                                     <button
//                                         onClick={() => {
//                                             setShowMapForNew(true);
//                                             setSelectedAddressId(null);
//                                             setFromListSelection(false);
//                                             setIsNextDisabled(true);
//                                             // নতুন address এর জন্য current location সেট করুন
//                                             if (mapLatitude && mapLongitude) {
//                                                 setSelectedPos({ lat: mapLatitude, lng: mapLongitude });
//                                             }
//                                         }}
//                                         className="text-[#01788E] font-medium flex items-center gap-2"
//                                     >
//                                         <FaPlus /> Add New Address
//                                     </button>
//                                 </div>
//                             </div> :
//                             <div>
//                                 {/* Search Input */}
//                                 <div className="absolute md:top-18 left-1/2 -translate-x-1/2 z-20 w-11/12">
//                                     <div className="shadow-lg bg-white rounded-md">
//                                         <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
//                                             <input
//                                                 type="text"
//                                                 placeholder="Search for your address…"
//                                                 className="w-full p-3 border rounded-md focus:outline-none"
//                                             />
//                                         </Autocomplete>
//                                     </div>
//                                 </div>

//                                 {/* Buttons */}
//                                 <div className="absolute top-80 right-3 z-20 flex flex-col space-y-2">
//                                     <button onClick={() => map?.setZoom(map.getZoom() + 1)} className="bg-white shadow p-2 rounded-lg">
//                                         <FaPlus />
//                                     </button>
//                                     <button onClick={() => map?.setZoom(map.getZoom() - 1)} className="bg-white shadow p-2 rounded-lg">
//                                         <FaMinus className="font-bold" />
//                                     </button>
//                                     <button onClick={gotoMyLocation} className="bg-white shadow p-2 rounded-lg flex items-center justify-center">
//                                         <FaLocationCrosshairs />
//                                     </button>
//                                     <button onClick={() => setMapType(mapType === "roadmap" ? "hybrid" : "roadmap")} className="bg-white shadow p-2 rounded-lg">
//                                         <FaSatellite />
//                                     </button>
//                                 </div>

//                                 {/* Google Map */}
//                                 <GoogleMap
//                                     mapContainerStyle={containerStyle}
//                                     center={selectedPos}
//                                     zoom={15}
//                                     onLoad={setMap}
//                                     onClick={handleMapClick}
//                                     mapTypeId={mapType}
//                                     options={{
//                                         disableDefaultUI: true,
//                                         zoomControl: false,
//                                         mapTypeControl: false,
//                                         fullscreenControl: false,
//                                         streetViewControl: false,
//                                         keyboardShortcuts: false,
//                                         gestureHandling: "greedy",
//                                         scrollwheel: false,
//                                     }}
//                                 >
//                                     <img
//                                         src="https://servicemarket.com/dist/images/map-marker.svg"
//                                         alt="center marker"
//                                         className="pointer-events-none"
//                                         style={{
//                                             position: "absolute",
//                                             top: "50%",
//                                             left: "50%",
//                                             transform: "translate(-50%, -100%)",
//                                             width: "80px",
//                                             height: "80px",
//                                             zIndex: 20,
//                                         }}
//                                     />
//                                 </GoogleMap>
//                             </div>
//                     }
//                 </div>

//                 <Summery
//                     serviceTitle={serviceTitle}
//                     address={address}
//                     itemSummary={itemSummary}
//                     totalVatRate={totalVatRate}
//                     showInput={showInput}
//                     setShowInput={setShowInput}
//                     liveAddress={liveAddress}
//                     isValid={!isNextDisabled}
//                     open={open}
//                     setOpen={setOpen}
//                 />
//             </div>


//             {/* for mobile & tablet view  */}
//             <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border-t border-gray-200 z-50">
//                 <div className="flex justify-center px-3 py-2">
//                     <div className="flex items-center gap-4">

//                         {/* View Summary */}
//                         <button
//                             onClick={() => setOpen(true)}
//                             className="cursor-pointer select-none
//                    active:scale-[0.98] transition-transform
//                    focus:outline-none focus:ring-2
//                    focus:ring-blue-500 focus:ring-offset-2
//                    rounded-lg px-1"
//                         >
//                             <p className="text-[10px] text-gray-500 font-medium uppercase">
//                                 View Summary
//                             </p>
//                             <div className="flex items-center gap-1.5 justify-center">
//                                 <img src={dirhum} className="w-3.5 h-3.5" alt="" />
//                                 <span className="text-base font-bold text-gray-900">
//                                     {totalAfterDiscount.toFixed(2)}
//                                 </span>
//                                 <span className="text-gray-400 text-sm">›</span>
//                             </div>
//                         </button>

//                         {/* Next Button (Fixed Width) */}
//                         <div className="w-[140px]">
//                             <NextBtn
//                                 disabled={isNextDisabled}
//                                 onClick={handleNextClick}
//                             />
//                         </div>

//                     </div>
//                 </div>
//             </div>


//             <div className="hidden lg:block">
//                 <NextBtn
//                     disabled={isNextDisabled}
//                     onClick={handleNextClick}
//                 />
//             </div>
//         </div>
//     );
// };