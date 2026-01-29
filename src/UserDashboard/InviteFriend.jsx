import { FaFacebookF, FaWhatsapp, FaTwitter, FaEnvelope } from "react-icons/fa";
import invite from '../../src/assets/icon/invite.png'

export default function InviteFriend() {
  return (
    <div className="border-[#CED4DA] border rounded-md bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-[#CED4DA] border-b px-6 py-4">
        <span className="text-2xl text-teal-700">💠</span>
        <h2 className="text-xl font-semibold text-gray-800">Invite a friend</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row">

        {/* Left Content */}
        <div className="w-full md:w-1/2 px-6 py-6 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-gray-900">
            INVITE A FRIEND, GET ฿30
          </h3>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Give a friend ฿30 when they sign up using your personal link and get
            ฿30 when their job is completed!
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Share your personal link with your friends
          </p>

          {/* Social Buttons */}
          <div className="flex gap-5 mt-6">
            <button className="w-12 h-12 rounded-full bg-[#01788E] text-white flex items-center justify-center shadow">
              <FaFacebookF size={20} />
            </button>

            <button className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow">
              <FaWhatsapp size={22} />
            </button>

            <button className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow">
              <FaTwitter size={22} />
            </button>

            <button className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center shadow">
              <FaEnvelope size={22} />
            </button>
          </div>

          {/* Referral Link */}
          <p className="mt-6 text-teal-700 font-medium text-lg">
            https://smkt.app/yckk6wyx
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2">
          <img
            src={invite}
            alt="Invite friend"
            className="w-full h-full object-cover rounded-r-md"
          />
        </div>
      </div>
    </div>
  );
}