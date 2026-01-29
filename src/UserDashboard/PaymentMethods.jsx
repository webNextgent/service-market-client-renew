

import { useForm } from "react-hook-form";
import { FaCreditCard } from "react-icons/fa";


export default function PaymentMethods() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);
  };

  return (
    <div className="border border-[#E5E7EB] bg-white rounded-md p-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <h2 className="flex items-center gap-3 text-xl font-semibold text-[#5D4F52] border-b border-[#E5E7EB] pb-3">
        <FaCreditCard className="text-[#01788E]" /> Payment Methods
      </h2>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-10 mt-6">

        {/* LEFT SIDE — Credit Card Preview */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md bg-gray-400 rounded-lg p-6 shadow-inner relative h-56">
            <div className="absolute top-4 left-4 text-yellow-300 text-4xl">
              💳
            </div>

            <div className="absolute top-20 left-6 text-white tracking-widest text-lg">
              •••• •••• •••• ••••
            </div>

            <div className="absolute bottom-10 left-6 text-white tracking-widest text-sm">
              YOUR NAME HERE
            </div>

            <div className="absolute bottom-10 right-6 text-white tracking-widest text-sm">
              valid thru <br /> 00/00
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/MasterCard_logo.png" className="h-6" />
            <img src="https://www.trustwave.com/globalassets/images/logos/logo-trustwave.png" className="h-6" />
          </div>

          <p className="text-sm text-[#5D4F52] mt-4">
            Đ1 will be reserved then released to confirm your card.
          </p>
        </div>

        {/* RIGHT SIDE — React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Card Number */}
          <div>
            <input
              type="text"
              placeholder="Enter your credit card number"
              className="w-full border border-[#01788E] rounded-md px-4 py-2 focus:ring-0 outline-none"
              {...register("cardNumber", { required: true })}
            />
            {errors.cardNumber && (
              <p className="text-sm bg-red-100 text-red-700 rounded px-3 py-2 mt-1">
                This field is required
              </p>
            )}
          </div>

          {/* Name on Card */}
          <div>
            <input
              type="text"
              placeholder="Name on Card"
              className="w-full border border-[#01788E] rounded-md px-4 py-2 focus:ring-0 outline-none"
              {...register("nameOnCard", { required: true })}
            />
            {errors.nameOnCard && (
              <p className="text-sm bg-red-100 text-red-700 rounded px-3 py-2 mt-1">
                This field is required
              </p>
            )}
          </div>

          {/* Expiry + CVV */}
          <div>
            <input
              type="text"
              placeholder="Expiry date (MM/YY)"
              className="w-full border border-[#01788E] rounded-md px-4 py-2 focus:ring-0 outline-none"
              {...register("expiry", { required: true })}
            />
            {errors.expiry && (
              <p className="text-sm bg-red-100 text-red-700 rounded px-3 py-2 mt-1">
                This field is required
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="CCV Code"
              className="w-full border border-[#01788E] rounded-md px-4 py-2 focus:ring-0 outline-none"
              {...register("ccv", { required: true })}
            />
            {errors.ccv && (
              <p className="text-sm bg-red-100 text-red-700 rounded px-3 py-2 mt-1">
                This field is required
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-fit cursor-pointer mx-auto bg-[#F26A2E] text-white font-medium px-8 py-2 rounded-md mt-4 hover:bg-[#e05d22] transition"
          >
            ADD CARD
          </button>

        </form>
      </div>
    </div>
  );
}


// import { useForm } from "react-hook-form";
// import { FaCreditCard } from "react-icons/fa";

// export default function PaymentMethods() {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   // LIVE CARD PREVIEW
//   const cardNumber = watch("cardNumber") || "•••• •••• •••• ••••";
//   const cardName = watch("cardName") || "YOUR NAME HERE";
//   const expiry = watch("expiry") || "••/••";

//   const onSubmit = (data) => {
//     console.log("CARD SUBMITTED:", data);
//   };

//   return (
//     <div className="border border-gray-300 rounded-md p-5 bg-white max-w-4xl mx-auto">
//       {/* Header */}
//       <h2 className="flex items-center gap-2 text-2xl font-semibold text-[#5D4F52] border-b pb-3 mb-6">
//         <FaCreditCard className="text-[#01788E]" /> Payment Methods
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* CARD PREVIEW */}
//         <div className="bg-gray-300 rounded-xl p-6 relative select-none">
//           <div className="w-10 h-7 bg-yellow-400 rounded-sm mb-6"></div>

//           <p className="tracking-widest text-lg mb-10">{cardNumber}</p>

//           <div className="flex justify-between text-sm">
//             <p className="uppercase">{cardName}</p>
//             <p>{expiry}</p>
//           </div>

//           <div className="absolute bottom-4 left-4 flex gap-4 opacity-80">
//             <img src="/visa.png" className="h-6" />
//             <img src="/mastercard.png" className="h-6" />
//           </div>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//           {/* Card Number */}
//           <div>
//             <input
//               type="text"
//               placeholder="Enter your credit card number"
//               {...register("cardNumber", { required: true })}
//               className={`w-full px-3 py-2 rounded-md border ${
//                 errors.cardNumber ? "border-red-500" : "border-[#01788E]"
//               } outline-none`}
//             />
//             {errors.cardNumber && (
//               <p className="text-red-500 text-sm mt-1">This field is required</p>
//             )}
//           </div>

//           {/* Name on Card */}
//           <div>
//             <input
//               type="text"
//               placeholder="Name on Card"
//               {...register("cardName", { required: true })}
//               className={`w-full px-3 py-2 rounded-md border ${
//                 errors.cardName ? "border-red-500" : "border-[#01788E]"
//               } outline-none`}
//             />
//             {errors.cardName && (
//               <p className="text-red-500 text-sm mt-1">This field is required</p>
//             )}
//           </div>

//           {/* Expiry Date */}
//           <div>
//             <input
//               type="text"
//               placeholder="Expiry date (MM/YY)"
//               {...register("expiry", { required: true })}
//               className={`w-full px-3 py-2 rounded-md border ${
//                 errors.expiry ? "border-red-500" : "border-[#01788E]"
//               } outline-none`}
//             />
//             {errors.expiry && (
//               <p className="text-red-500 text-sm mt-1">This field is required</p>
//             )}
//           </div>

//           {/* CCV */}
//           <div>
//             <input
//               type="number"
//               placeholder="CCV Code"
//               {...register("ccv", { required: true })}
//               className={`w-full px-3 py-2 rounded-md border ${
//                 errors.ccv ? "border-red-500" : "border-[#01788E]"
//               } outline-none`}
//             />
//             {errors.ccv && (
//               <p className="text-red-500 text-sm mt-1">This field is required</p>
//             )}
//           </div>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             className="bg-[#F05A28] hover:bg-[#e04f20] text-white w-full py-3 rounded-md font-medium"
//           >
//             ADD CARD
//           </button>
//         </form>
//       </div>

//       <p className="text-xs text-gray-500 mt-4 ml-1">
//         ฿1 will be reserved then released to confirm your card.
//       </p>
//     </div>
//   );
// }