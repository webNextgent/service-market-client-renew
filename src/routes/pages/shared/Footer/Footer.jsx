import { FaPhoneAlt, FaFacebookF, FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-red-700 to-red-800 text-white">
      
      {/* Large/Medium Device View */}
      <div className="hidden md:block">
        <div className="py-10 px-20">
          <div className="grid grid-cols-4 gap-10">

            {/* Company Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">Al Mandhar Pest Control</h2>
              <p className="text-base">
                Established in 2002, trusted pest control in Sharjah & Dubai.
              </p>
              
              <div className="flex gap-3 mt-4">
                <a href="https://facebook.com" className="hover:text-yellow-300">
                  <FaFacebookF className="text-lg" />
                </a>
                <a href="https://instagram.com" className="hover:text-yellow-300">
                  <FaInstagram className="text-lg" />
                </a>
                <a href="https://youtube.com" className="hover:text-yellow-300">
                  <FaYoutube className="text-lg" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-xl font-bold mb-4">Quick Links</h2>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:underline">Home</Link></li>
                <li><Link to="/about" className="hover:underline">About Us</Link></li>
                <li><Link to="/blog" className="hover:underline">Blog</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h2 className="text-xl font-bold mb-4">Services</h2>
              <ul className="space-y-2">
                <li>Cockroach Control</li>
                <li>Termites Control</li>
                <li>Bed Bugs Control</li>
                <li>Rodent Control</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-bold mb-4">Contact</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <FaPhoneAlt />
                  <a href="tel:0563339199">056 333 9199</a>
                </li>
                <li className="flex items-center gap-2">
                  <FaPhoneAlt />
                  <a href="tel:+97142234567">+971 4 223 4567</a>
                </li>
                <li className="flex items-center gap-2">
                  <FaEnvelope />
                  <a href="mailto:info@mpcpest.ae">info@mpcpest.ae</a>
                </li>
                <li className="flex items-start gap-2">
                  <FaLocationDot className="mt-1" />
                  <span>Office 101, Al Zarouni Building, Dubai</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 text-center">
            <p>
              Copyright © 2024 <span className="font-bold">Al Mandhar Pest Control</span> All rights reserved.
            </p>
            <p className="mt-2">
              Development &amp; SEO By{" "}
              <span className="font-bold hover:text-yellow-300 cursor-pointer">NextGent.Org</span>
            </p>
          </div>
        </div>
      </div>

      {/* Small Device View */}
      <div className="block md:hidden py-4 px-6">
        <div className="space-y-6">
          
          {/* Company & Social */}
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">Al Mandhar Pest Control</h2>
            <div className="flex justify-center gap-4 mb-3">
              <a href="https://facebook.com" className="hover:text-yellow-300">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" className="hover:text-yellow-300">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" className="hover:text-yellow-300">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Contact Info - Simple */}
          <div className="text-center space-y-2">
            <div className="flex justify-center items-center gap-2">
              <FaPhoneAlt />
              <a href="tel:0563339199" className="font-medium">056 333 9199</a>
            </div>
            <div className="flex justify-center items-center gap-2">
              <FaEnvelope />
              <a href="mailto:info@mpcpest.ae" className="text-sm">info@mpcpest.ae</a>
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/blog" className="hover:underline">Blog</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>

          {/* Copyright - Small */}
          <div className="border-t pt-3 text-center text-sm">
            <p>© 2024 Al Mandhar Pest Control</p>
            <p className="text-xs mt-1">By NextGent.Org</p>
          </div>
        </div>
      </div>

    </footer>
  );
}