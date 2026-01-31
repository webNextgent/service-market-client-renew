import { useState, useEffect } from "react";
import { IoAddSharp } from "react-icons/io5";
import { MdOutlineArrowBack } from "react-icons/md";
import dirhum from '../../assets/icon/dirhum.png'
import { useItem } from "../../provider/ItemProvider";

const ContentModal = ({ setShowModal, property }) => {
    const [quantities, setQuantities] = useState({});
    const { addItem, removeItem } = useItem();
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const savedItems = JSON.parse(localStorage.getItem("item")) || [];
        const initialQuantities = {};
        savedItems.forEach((id) => {
            initialQuantities[id] = 1;
        });
        setQuantities(initialQuantities);
    }, []);

    const handleAdd = (id) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
        addItem(id);
    };

    const handleRemove = (id) => {
        setQuantities((prev) => {
            const currentQty = prev[id] || 0;

            if (currentQty > 1) {
                return {
                    ...prev,
                    [id]: currentQty - 1,
                };
            }
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });

        removeItem(id);
    };


    if (!property) {
        return (
            <div className="fixed inset-0 text-[#5D4F52] bg-black/70 flex items-center justify-center z- p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                    <p className="text-gray-600 mb-4">No property data found.</p>
                    <button
                        onClick={() => setShowModal(false)}
                        className="w-full px-4 py-3 bg-[#01788E] text-white rounded-lg font-medium hover:bg-[#016379] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const handelDetails = item => {
        setSelectedItem(item);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedItem(null);
    };

    const items = Array.isArray(property.propertyItems) ? property.propertyItems : [];

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 bg-black/70 z-50 flex md:items-center md:justify-center">
                <div
                    className="absolute inset-0"
                    onClick={() => setShowModal(false)}
                />
                <div
                    className="bg-white w-full md:max-w-2xl md:rounded-xl rounded-t-2xl shadow-2xl fixed bottom-0 md:static flex flex-col h-[70vh] md:h-[90vh]
                 transform transition-transform duration-300 translate-y-0 z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white z-20 border-b border-gray-300 md:rounded-t-xl px-4 sm:px-6 py-4 mb-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl p-1 transition-colors"
                            >
                                <MdOutlineArrowBack className="w-6 h-6" />
                            </button>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1 text-center">
                                {property.title}
                            </h2>
                            <div className="w-8"></div>
                        </div>
                    </div>

                    {/* Items List - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                        {items.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {items.map((item) => {
                                    const qty = quantities[item.id] || 0;
                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white mb-8 border-b border-gray-300 pb-3"
                                        >
                                            <div className="flex gap-4">
                                                {/* Image */}
                                                <div className="shrink-0">
                                                    <div
                                                        onClick={() => handelDetails(item)}
                                                        className="cursor-pointer"
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-28 h-26 object-cover rounded"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <div
                                                        onClick={() => handelDetails(item)}
                                                        className="cursor-pointer sm:mb-3"
                                                    >
                                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm sm:text-base mt-1">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex justify-between mt-2">
                                                        <div className="flex items-center">
                                                            <img
                                                                className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5"
                                                                src={dirhum}
                                                                alt="AED"
                                                            />
                                                            <span className="sm:text-xl font-semibold text-gray-900">
                                                                {item.price.toLocaleString()}
                                                            </span>
                                                        </div>

                                                        {/* Add / Quantity Controller */}
                                                        {qty === 0 ? (
                                                            <button
                                                                onClick={() => handleAdd(item.id)}
                                                                className="border border-[#01788E] text-[#01788E] px-3 py-1.5 rounded flex items-center justify-center gap-1 font-medium text-sm sm:text-base cursor-pointer"
                                                            >
                                                                <span>Add</span>
                                                                <IoAddSharp className="text-xl" />
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center justify-between">
                                                                <button
                                                                    onClick={() => handleRemove(item.id)}
                                                                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors text-lg cursor-pointer"
                                                                >
                                                                    −
                                                                </button>
                                                                <span className="font-semibold text-gray-800 text-base sm:text-lg min-w-8 text-center">
                                                                    {qty}
                                                                </span>

                                                                <button
                                                                    onClick={() => handleAdd(item.id)}
                                                                    disabled={qty >= 5}
                                                                    className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border rounded-full text-lg
                                                                             ${qty >= 5
                                                                            ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                                                            : "border-[#01788E] text-[#01788E] hover:bg-gray-50 cursor-pointer"
                                                                        }`}
                                                                    title={qty >= 5 ? "Maximum 5 services allowed" : ""}
                                                                >
                                                                    +
                                                                </button>

                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-5xl mb-4">📭</div>
                                <p className="text-gray-500 text-lg">No options available</p>
                                <p className="text-gray-400 text-sm mt-2">Check back later for new options</p>
                            </div>
                        )}
                    </div>

                    {/* Footer - Sticky Bottom */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-100 md:rounded-b-xl px-4 sm:px-6 py-4">
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-[#ED6329] hover:bg-[#e0551f] text-white font-semibold py-3.5 sm:py-4 rounded text-base sm:text-lg uppercase tracking-wide transition-all duration-200 active:scale-[0.98]"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>

            {showDetailModal && selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={closeDetailModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-[600px] max-h-[70vh] md:max-h-[90vh] flex flex-col relative"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Close Button */}
                        <button
                            onClick={closeDetailModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl z-10 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                            ✕
                        </button>

                        <div
                            className="h-48 bg-cover bg-center shrink-0"
                            style={{
                                backgroundImage: `url(${selectedItem.image})`
                            }}
                        >
                        </div>

                        {/* Content Section - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 md:p-6">
                                {/* Title and Price */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                                        {selectedItem.title}
                                    </h2>
                                    <span className="text-lg md:text-xl font-bold text-gray-800 mt-2 sm:mt-0 flex items-center gap-1">
                                        {selectedItem.price} <img src={dirhum} alt="" className="w-4 h-4 md:w-5 md:h-5" />
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 md:mb-6">
                                    {selectedItem.description}
                                </p>

                                <hr className="my-4" />

                                {/* What's Included Section */}
                                <div>
                                    <h3 className="text-base md:text-lg font-bold mb-3">
                                        What's included
                                    </h3>
                                    <div className="space-y-3">
                                        {/* Feature 1 */}
                                        {selectedItem.feature1 && (
                                            <div className="flex items-start">
                                                <div className="mt-1 w-3 h-3 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700">{selectedItem.feature1}</p>
                                            </div>
                                        )}
                                        {/* Feature 2 */}
                                        {selectedItem.feature2 && (
                                            <div className="flex items-start">
                                                <div className="mt-1 w-3 h-3 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700">{selectedItem.feature2}</p>
                                            </div>
                                        )}
                                        {/* Feature 3 */}
                                        {selectedItem.feature3 && (
                                            <div className="flex items-start">
                                                <div className="mt-1 w-3 h-3 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700">{selectedItem.feature3}</p>
                                            </div>
                                        )}
                                        {/* Feature 4 */}
                                        {selectedItem.feature4 && (
                                            <div className="flex items-start">
                                                <div className="mt-1 w-3 h-3 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                                                <p className="text-sm text-gray-700">{selectedItem.feature4}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section - Fixed at bottom */}
                        <div className="p-4 md:p-6 border-t shrink-0">
                            {/* Quantity Selector */}
                            <div className="flex items-center justify-center mb-4 md:mb-6">
                                <button
                                    onClick={() => handleRemove(selectedItem.id)}
                                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 text-xl md:text-2xl text-gray-600 rounded-full hover:bg-gray-50"
                                >
                                    &minus;
                                </button>
                                <span className="text-lg md:text-xl font-semibold mx-4 md:mx-6 w-8 text-center">
                                    {quantities[selectedItem.id] || 0}
                                </span>
                                
                                <button
                                    onClick={() => handleAdd(selectedItem.id)}
                                    disabled={(quantities[selectedItem.id] || 0) >= 5}
                                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border rounded-full text-xl md:text-2xl
                                             ${(quantities[selectedItem.id] || 0) >= 5
                                            ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                            : "border-[#01788E] text-[#01788E] hover:bg-gray-50 cursor-pointer"
                                        }`}
                                    title={(quantities[selectedItem.id] || 0) >= 5 ? "Maximum 5 allowed" : ""}
                                >
                                    +
                                </button>

                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => {
                                    if (!quantities[selectedItem.id]) {
                                        handleAdd(selectedItem.id);
                                    }
                                    setShowDetailModal(false);
                                }}
                                className={`w-full md:w-[305px] mx-auto py-3 md:py-3.5 flex items-center justify-center border ${quantities[selectedItem.id] ? 'border-gray-400 text-gray-400' : 'border-[#01788E] text-[#01788E]'} font-semibold rounded`}
                            >
                                <span className="text-xl mr-2 font-medium">+</span>
                                {quantities[selectedItem.id] ? 'Already Added' : 'Add To Basket'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ContentModal;











// fixed quantity
// import { useState, useEffect } from "react";
// import { IoAddSharp } from "react-icons/io5";
// import { MdOutlineArrowBack } from "react-icons/md";
// import dirhum from '../../assets/icon/dirhum.png'
// import { useItem } from "../../provider/ItemProvider";

// const ContentModal = ({ setShowModal, property }) => {
//     const [quantities, setQuantities] = useState({});
//     const { addItem, removeItem } = useItem();
//     const [showDetailModal, setShowDetailModal] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null);

//     useEffect(() => {
//         const savedItems = JSON.parse(localStorage.getItem("item")) || [];
//         const initialQuantities = {};
//         savedItems.forEach((id) => {
//             initialQuantities[id] = 1;
//         });
//         setQuantities(initialQuantities);
//     }, []);

//     const handleAdd = (id) => {
//         setQuantities((prev) => ({
//             ...prev,
//             [id]: 1,
//         }));
//         addItem(id);
//     };

//     const handleRemove = (id) => {
//         setQuantities((prev) => {
//             const updated = { ...prev };
//             delete updated[id];
//             return updated;
//         });
//         removeItem(id);
//     };

//     if (!property) {
//         return (
//             <div className="fixed inset-0 text-[#5D4F52] bg-black/70 flex items-center justify-center z- p-4">
//                 <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
//                     <p className="text-gray-600 mb-4">No property data found.</p>
//                     <button
//                         onClick={() => setShowModal(false)}
//                         className="w-full px-4 py-3 bg-[#01788E] text-white rounded-lg font-medium hover:bg-[#016379] transition-colors"
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const handelDetails = item => {
//         setSelectedItem(item);
//         setShowDetailModal(true);
//     };

//     const closeDetailModal = () => {
//         setShowDetailModal(false);
//         setSelectedItem(null);
//     };

//     const items = Array.isArray(property.propertyItems) ? property.propertyItems : [];

//     return (
//         <>
//             {/* Main Modal */}
//             <div className="fixed inset-0 bg-black/70 z-50 flex md:items-center md:justify-center">
//                 <div
//                     className="absolute inset-0"
//                     onClick={() => setShowModal(false)}
//                 />
//                 <div
//                     className="bg-white w-full md:max-w-2xl md:rounded-xl rounded-t-2xl shadow-2xl fixed bottom-0 md:static flex flex-col h-[70vh] md:h-[90vh]
//                  transform transition-transform duration-300 translate-y-0 z-10"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     {/* Header */}
//                     <div className="sticky top-0 bg-white z-20 border-b border-gray-300 md:rounded-t-xl px-4 sm:px-6 py-4 mb-4">
//                         <div className="flex items-center justify-between">
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="text-gray-400 hover:text-gray-600 text-2xl p-1 transition-colors"
//                             >
//                                 <MdOutlineArrowBack className="w-6 h-6" />
//                             </button>
//                             <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1 text-center">
//                                 {property.title}
//                             </h2>
//                             <div className="w-8"></div>
//                         </div>
//                     </div>

//                     {/* Items List - Scrollable */}
//                     <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
//                         {items.length > 0 ? (
//                             <div className="space-y-3 sm:space-y-4">
//                                 {items.map((item) => {
//                                     const qty = quantities[item.id] || 0;
//                                     return (
//                                         <div
//                                             key={item.id}
//                                             className="bg-white mb-8 border-b border-gray-300 pb-3"
//                                         >
//                                             <div className="flex gap-4">
//                                                 {/* Image */}
//                                                 <div className="shrink-0">
//                                                     <div
//                                                         onClick={() => handelDetails(item)}
//                                                         className="cursor-pointer"
//                                                     >
//                                                         <img
//                                                             src={item.image}
//                                                             alt={item.title}
//                                                             className="w-28 h-26 object-cover rounded"
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 {/* Content */}
//                                                 <div className="flex-1">
//                                                     <div
//                                                         onClick={() => handelDetails(item)}
//                                                         className="cursor-pointer sm:mb-3"
//                                                     >
//                                                         <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
//                                                             {item.title}
//                                                         </h3>
//                                                         <p className="text-gray-600 text-sm sm:text-base mt-1">
//                                                             {item.description}
//                                                         </p>
//                                                     </div>

//                                                     <div className="flex justify-between mt-2">
//                                                         <div className="flex items-center">
//                                                             <img
//                                                                 className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5"
//                                                                 src={dirhum}
//                                                                 alt="AED"
//                                                             />
//                                                             <span className="sm:text-xl font-semibold text-gray-900">
//                                                                 {item.price.toLocaleString()}
//                                                             </span>
//                                                         </div>

//                                                         {/* Add / Quantity Controller */}
//                                                         {qty === 0 ? (
//                                                             <button
//                                                                 onClick={() => handleAdd(item.id)}
//                                                                 className="border border-[#01788E] text-[#01788E] px-3 py-1.5 rounded flex items-center justify-center gap-1 font-medium text-sm sm:text-base cursor-pointer"
//                                                             >
//                                                                 <span>Add</span>
//                                                                 <IoAddSharp className="text-xl" />
//                                                             </button>
//                                                         ) : (
//                                                             <div className="flex items-center justify-between">
//                                                                 <button
//                                                                     onClick={() => handleRemove(item.id)}
//                                                                     className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition-colors text-lg cursor-pointer"
//                                                                 >
//                                                                     −
//                                                                 </button>
//                                                                 <span className="font-semibold text-gray-800 text-base sm:text-lg min-w-8 text-center">
//                                                                     {qty}
//                                                                 </span>
//                                                                 <button
//                                                                     disabled
//                                                                     className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-400 text-gray-400 rounded-full cursor-not-allowed text-lg"
//                                                                     title="Maximum quantity reached"
//                                                                 >
//                                                                     +
//                                                                 </button>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         ) : (
//                             <div className="text-center py-12">
//                                 <div className="text-gray-400 text-5xl mb-4">📭</div>
//                                 <p className="text-gray-500 text-lg">No options available</p>
//                                 <p className="text-gray-400 text-sm mt-2">Check back later for new options</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Footer - Sticky Bottom */}
//                     <div className="sticky bottom-0 bg-white border-t border-gray-100 md:rounded-b-xl px-4 sm:px-6 py-4">
//                         <button
//                             onClick={() => setShowModal(false)}
//                             className="w-full bg-[#ED6329] hover:bg-[#e0551f] text-white font-semibold py-3.5 sm:py-4 rounded text-base sm:text-lg uppercase tracking-wide transition-all duration-200 active:scale-[0.98]"
//                         >
//                             Continue
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {showDetailModal && selectedItem && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//                     onClick={closeDetailModal}
//                 >
//                     <div
//                         className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-[600px] max-h-[70vh] md:max-h-[90vh] flex flex-col relative"
//                         onClick={(e) => e.stopPropagation()}
//                     >

//                         {/* Close Button */}
//                         <button
//                             onClick={closeDetailModal}
//                             className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl z-10 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center"
//                         >
//                             ✕
//                         </button>

//                         <div
//                             className="h-48 bg-cover bg-center shrink-0"
//                             style={{
//                                 backgroundImage: `url(${selectedItem.image})`
//                             }}
//                         >
//                         </div>

//                         {/* Content Section - Scrollable */}
//                         <div className="flex-1 overflow-y-auto">
//                             <div className="p-4 md:p-6">
//                                 {/* Title and Price */}
//                                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
//                                     <h2 className="text-lg md:text-xl font-semibold text-gray-800">
//                                         {selectedItem.title}
//                                     </h2>
//                                     <span className="text-lg md:text-xl font-bold text-gray-800 mt-2 sm:mt-0 flex items-center gap-1">
//                                         {selectedItem.price} <img src={dirhum} alt="" className="w-4 h-4 md:w-5 md:h-5" />
//                                     </span>
//                                 </div>

//                                 {/* Description */}
//                                 <p className="text-sm text-gray-600 mb-4 md:mb-6">
//                                     {selectedItem.description}
//                                 </p>

//                                 <hr className="my-4" />

//                                 {/* What's Included Section */}
//                                 <div>
//                                     <h3 className="text-base md:text-lg font-bold mb-3">
//                                         What's included
//                                     </h3>
//                                     <div className="space-y-3">
//                                         {/* Feature 1 */}
//                                         {selectedItem.feature1 && (
//                                             <div className="flex items-start">
//                                                 <div className="mt-1 w-3 h-3 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
//                                                 <p className="text-sm text-gray-700">{selectedItem.feature1}</p>
//                                             </div>
//                                         )}
//                                         {/* Feature 2 */}
//                                         {selectedItem.feature2 && (
//                                             <div className="flex items-start">
//                                                 <div className="mt-1 w-3 h-3 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
//                                                 <p className="text-sm text-gray-700">{selectedItem.feature2}</p>
//                                             </div>
//                                         )}
//                                         {/* Feature 3 */}
//                                         {selectedItem.feature3 && (
//                                             <div className="flex items-start">
//                                                 <div className="mt-1 w-3 h-3 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
//                                                 <p className="text-sm text-gray-700">{selectedItem.feature3}</p>
//                                             </div>
//                                         )}
//                                         {/* Feature 4 */}
//                                         {selectedItem.feature4 && (
//                                             <div className="flex items-start">
//                                                 <div className="mt-1 w-3 h-3 border border-gray-400 rounded-full mr-3 flex-shrink-0"></div>
//                                                 <p className="text-sm text-gray-700">{selectedItem.feature4}</p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Footer Section - Fixed at bottom */}
//                         <div className="p-4 md:p-6 border-t shrink-0">
//                             {/* Quantity Selector */}
//                             <div className="flex items-center justify-center mb-4 md:mb-6">
//                                 <button
//                                     onClick={() => handleRemove(selectedItem.id)}
//                                     className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 text-xl md:text-2xl text-gray-600 rounded-full hover:bg-gray-50"
//                                 >
//                                     &minus;
//                                 </button>
//                                 <span className="text-lg md:text-xl font-semibold mx-4 md:mx-6 w-8 text-center">
//                                     {quantities[selectedItem.id] || 0}
//                                 </span>
//                                 <button
//                                     disabled
//                                     className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 text-gray-400 text-xl md:text-2xl rounded-full cursor-not-allowed"
//                                     title="Maximum quantity reached"
//                                 >
//                                     +
//                                 </button>
//                             </div>

//                             {/* Action Button */}
//                             <button
//                                 onClick={() => {
//                                     if (!quantities[selectedItem.id]) {
//                                         handleAdd(selectedItem.id);
//                                     }
//                                     setShowDetailModal(false);
//                                 }}
//                                 className={`w-full md:w-[305px] mx-auto py-3 md:py-3.5 flex items-center justify-center border ${quantities[selectedItem.id] ? 'border-gray-400 text-gray-400' : 'border-[#01788E] text-[#01788E]'} font-semibold rounded`}
//                             >
//                                 <span className="text-xl mr-2 font-medium">+</span>
//                                 {quantities[selectedItem.id] ? 'Already Added' : 'Add To Basket'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ContentModal;