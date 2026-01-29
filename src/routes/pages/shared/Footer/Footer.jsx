import { FaDownload } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-red-700 text-white py-10 px-6 md:px-20 font-sans mb-12 md:mb-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* About Us */}
        <div>
          <h2 className="text-xl font-semibold mb-4">About Us</h2>
          <p className="text-base leading-relaxed">
            Al Mandhar Pest Control, established in 2002, is a trusted and reliable pest
            control company serving the areas of Sharjah and Dubai.
          </p>

          <div className="flex items-center gap-2 mt-6 text-lg cursor-pointer hover:text-black">
            <FaDownload />
            <p className="tracking-wide">Company Profile</p>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Usefull Links</h2>
          <ul className="space-y-2 text-base">
            <a className="cursor-pointer hover:text-black">Home</a>
            <li className="cursor-pointer hover:text-black">Pest Control Dubai</li>
            <li className="cursor-pointer hover:text-black">Blog</li>
            <li className="cursor-pointer hover:text-black">About Us</li>
            <li className="cursor-pointer hover:text-black">Contact Us</li>
            <li className="cursor-pointer hover:text-black">Privacy Policy</li>
          </ul>
        </div>

        {/* Top Services */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Services</h2>
          <ul className="space-y-2 text-base">
            <li className="cursor-pointer hover:text-black">Cockroach Control</li>
            <li className="cursor-pointer hover:text-black">Termites Control</li>
            <li className="cursor-pointer hover:text-black">Bed Bugs Control</li>
            <li className="cursor-pointer hover:text-black">Rodent Control</li>
            <li className="cursor-pointer hover:text-black">Mosquitoes Control</li>
            <li className="cursor-pointer hover:text-black">Ants Control</li>
            <li className="cursor-pointer hover:text-black">Spider Control</li>
            <li className="cursor-pointer hover:text-black">Bird Control</li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <ul className="space-y-3 text-base">
            <li className="flex items-center gap-3 cursor-pointer hover:text-black">
              <IoLocation className="text-xl" />
              <p>office 101 al zarouni building frej al murar deira dubai uae</p>
            </li>

            <li className="flex items-center gap-3 cursor-pointer hover:text-black">
              <CiMail className="text-xl" />
              <p>info@mpcpest.ae</p>
            </li>

            <li className="flex items-center gap-3 cursor-pointer hover:text-black">
              <FaPhoneAlt className="text-xl" />
              <p>0563339199</p>
            </li>

            <li className="flex items-center gap-3 cursor-pointer hover:text-black">
              <IoLogoWhatsapp className="text-xl" />
              <p>0563339199</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/30 mt-10 pt-6 text-center text-base">
        <p>
          Copyright © 2024{" "}
          <span className="font-semibold">Al Mandhar Pest Control</span> All rights reserved.
        </p>
        <p className="mt-2">
          Development &amp; SEO By{" "}
          <span className="font-semibold hover:text-black cursor-pointer">NextGent.Org</span>
        </p>
      </div>
    </footer>
  );
}
